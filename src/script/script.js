if (!globalThis) { globalThis = window || global || this || {}; } try { globalThis.require = require; } catch (err) { globalThis.require = () => undefined; } 
                class Variable {
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    set valueOf(value) {
        if (this.type == 'let' || this.type == '\\') return this.value;
        if (BS.getType(value) != this.type) {
            throw new TypeError(`Assignment of a different type to variable "${this.name}" rather than "${this.type}" is prohibited.`)
        }
        this.value = value;
    }
    get valueOf () {
        return this.value;
    }
}
globalThis.BS = {
    var(name, type, value) {
        if (BS.getType(value) !== type) throw new TypeError(`Variable "${name}" is required to be "${type}", got "${BS.getType(value)}" instead.`)
        return new Variable(name, type, value);
    },
    setValue(name, oldValue, value) {
        if (oldValue instanceof Variable) {
            oldValue.valueOf = value;
            return oldValue;
        }
        return value;
    },
    ck(value) {
        if (value !== void 0)
            return value;
        return null;
    },
    through (value0, value1, line, col) {
        if (typeof value0 != 'number' || typeof value1 != 'number') {
            throw new TypeError(`Number is expected on the line ${line}, col ${col}.`);
        }
        let output = [];
        let min = Math.min(value0, value1);
        let max = Math.max(value0, value1);
        for (let i = min; i <= max; i++) {
            output.push(i);
        }
        if (value0 != min)
            output = output.reverse();
        return output;
    },
    delete (value, index) {
        // if (typeof value === 'string') {
        //     return value.substring(0, index) + value.substring(index+1, value.length);
        // }
        Array.prototype.splice.call(value, index, 1);
        return value;
    },
    slice (value, start, end, step = 1, line, col) {
        if (!Array.isArray(value) && typeof value != 'string') {
            throw new TypeError(`Array or string was expected at line ${line}, col ${col}`);
        }
        if (typeof start != 'number') {
            throw new TypeError(`Number was expected at line ${line}, col ${col}`);
        }
        if (end === null && step === null) {
            return value.slice(start);
        }
        step = step|0;
        if (step >= 0) step = 1;
        else step = -1;
            // throw new Error(`Step argument on slicing must not be zero at line ${line}, col ${col}`);
        // if (step !== 1 && step !== -1)
        //     throw new Error(`Step must be 1 or -1 at ${line}, col ${col}`);
        let result = value.slice(start, end);
        if (step === -1) {
            if (typeof value === 'string')
                return Array.from(result).reverse().join('');
            return result.reverse();
        }
        return result;
    },
    //ast: (function () {
    //    let r = globalThis.require('./index');
    //    if (r) return r;
    //    return function () {console.warn('Ast is not supported yet in browsers.')}
    //})(),
    //parse: (function () {
    //    let r = globalThis.require('./ast_to_js.js');
    //    if (r) return r;
    //    return function () {console.warn('@eval is not supported yet in browsers.')}
    //})(),
    //fs: (function () {
    //    let r = globalThis.require('fs');
    //    console.log(r);
    //    if (r) return r;
    //    return function () {console.warn('@import is not supported yet in browsers.')};
    //})(),
    customTypes: {},
    types: {
        Array (value) {
            return Array.isArray(value);
        },
        Null (value) {
            return value === null;
        },
        Undefined (value) {
            return value === void 0;
        },
        Int (value) {
            return parseInt(value) === value && !Number.isNaN(value);
        },
        Float (value) {
            return typeof value === 'number' && !Number.isNaN(value);
        },
        Number (value) {
            return typeof value === 'number' && !Number.isNaN(value);
        },
        BigInt(value) {
            return typeof value === 'bigint';
        },
        NaN (value) {
            return Number.isNaN(value);
        },
        String (value) {
            return typeof value === 'string';
        },
        Function (value) {
            return typeof value === 'function';
        },
        Symbol (value) {
            return typeof value === 'symbol';
        },
        Boolean (value) {
            return typeof value === 'boolean';
        },
        Object(value) {
            if (BS.types.HTML && BS.types.HTML(value)) {
                return false;
            }
            return typeof value === 'object' && value !== null;
        },
    },
    checkArgType(type, value, line, col) {
        if (type in this.customTypes) {
            let r = BS.customTypes[type];
            if (r && r(value))
                return true;
        }
        if (type in this.types) {
            let r = BS.types[type];
            if (r && r(value))
                return true;
        }
        throw new TypeError(`Argument "${value}" is not type of "${type}" at line ${line}, col ${col}.`);
    },
    convert(value, type, outerType) {
        let t = this.getType(value);
        if (t) t = t.toLowerCase();
        let tmp = null;
        if (typeof type !== 'object' && t == type.toLowerCase()) return value;
        let gt = function (value, type, outerType) {
            outerType = outerType || this.getType(value);
            switch (type) {
                case 'Number':
                case 'Float':
                    tmp = parseFloat(value);
                    if (isNaN(tmp)) return 0;
                    return tmp;
                case 'Int':
                    return value|0;
                case 'String':
                    if (t == 'html') return JSON.stringify(this.DOMtoJSON(value));
                    if (t == 'array') return value.join('');
                    if (t == 'object') return JSON.stringify(value);
                    if (t == 'boolean') return !!value;
                    if (t == 'null') return 'null';
                    if (t == 'undefined') return 'undefined';
                    else return value.toString();
                case 'Array':
                    if (t == 'undefined' || 'null') return []
                    if (t == 'html') return Object.values(this.DOMtoJSON(value));
                    if (t == 'object') return Object.values(value);
                    if (t == 'string') {
                        try {
                            let z = JSON.parse(t);
                            let v = this.getType(z) == 'array';
                            if (v) return z;
                            throw 'err';
                        } catch (err) {}
                        return value.split('');
                    }
                    if (t == 'number' || t == 'int' || t == 'float') {
                        return (''+value).split('');
                    }
                    else return [value];
                case 'JSON':
                    if (t == 'html') return this.DOMtoJSON(value);
                    if (t == 'object' || t == 'string' || t == 'array' || t == 'null' || t == 'number' )
                        return value;
                    throw new TypeError(`Cannot convert ${t} to ${type}`);
                case 'Object':
                    return Object(value);
                case 'Boolean':
                    return Boolean(value);
                case 'List':
                    let ul = document.createElement('ul');
                    if (t == 'object' || t == 'array' || t == 'html') {
                        for (let i in value) {
                            let li = document.createElement('li');
                            if (t == 'object') {
                                let span = document.createElement('span');
                                span.className = 'convert_key';
                                span.innerText = i;
                                li.append(span);
                                li.appendChild(document.createTextNode(': '));
                            }
                            let span = document.createElement('span');
                            //let li2;
                            //if (ty == 'Array')
                            //    li2 = document.createElement('li');
                            span.className = 'convert_value';
                            let ty = this.getType(value[i]);
                            if (ty == 'String' || ty == 'Number' || ty == 'Int' || ty == 'Float') {
                                //span.className += ' string';
                                if (outerType == 'Array') {
                                    let li2 = document.createElement('li');
                                    li2.innerText = gt(value[i], type, outerType);
                                    if (ty == 'String') li2.innerText = `"${li2.innerText}"`;
                                    span.append(li2);
                                    //span.append(li) = `"${value[i]}"`;
                                } else {
                                    span.innerText = `"${value[i]}"`;
                                }
                            } else if (ty == 'Array') {
                                //debugger
                                //span.className += ' array';
                                //span.innerText = JSON.stringify(value[i], null, 2);
                                span.append('[')
                                span.append(gt(value[i], type, 'Array'))
                                span.append(']')
                            } else if (ty == 'Object') {
                                //span.innerText = JSON.stringify(value[i], null, 2);
                                //let innerSpan = gt(value[i], type)
                                span.append(gt(value[i], type))
                            }
                            else span.innerText = `${value[i]}`;
                            span.className += ` ${ty}`;
                            li.append(span);
                            //if (li2) li.append(li2);
                            ul.append(li);
                        }
                        return ul;
                    } else if (t == 'int' || t == 'float' || t == 'string' || null) {
                        let li = document.createElement('li');
                        li.textContent = value;
                        ul.append(li);
                    }
                    return ul;
            };
        }.bind(this);
        if (typeof type != 'string') {
            let r = value;
            // debugger
            console.log(type.length);
            for (let i = 0; i < type.length; i++) {
                r = gt(r, type[i]);
                console.log({r, type: type[i]});
                if (i != length -1) {
                    if (r.map) {
                        r = r.map(j => {
                            console.log({each: this.convert(j, type[i+1]), type: type[i+1]});
                            return this.convert(j, type[i+1]);
                        });
                    }
                }
                console.log(r);
            }
        };
        // console.log('h', gt(value,type))
        return gt(value, type);
    },
    getType (value) {
        for (let i in this.types) {
            try {
                if (this.types[i](value)) return i;
                //if (this.curstomTypes[i](value)) return i;
            } catch (err) {continue}
        }
    },
    sizeof(object) {
        // ? Can be simplified
        //* No need for so many checks
        if (object instanceof Set || object instanceof Map)
            return object.size;
        if (object instanceof Array || object instanceof String)
            return object.length;
        if (object instanceof Object)
            return Object.keys(object).length;
        //else return 0
        if (object === void 0 || object === null) {
            return 0
            //throw new TypeError('Cannot convert undefined or null to object');
        }
        return Object.keys(object).length;
    },
    deepFreeze (object) {
        // Retrieve the property names defined on object
        const propNames = Object.getOwnPropertyNames(object);
        // Freeze properties before freezing self
        for (const name of propNames) {
            const value = object[name];

            if (value && typeof value === "object") {
                globalThis.BS.deepFreeze(value);
            }
        }
        return Object.freeze(object);
    },
    last(number) {
        // returns the last index of array item
        if (number > 0) return number - 1;
        return 0;
    },
    storage: [],
    // require('./ast_to_js.js')// || function () {console.warn('@eval is not supported yet in browsers.')}
};
const BS = globalThis.BS;

const TypedArray = Reflect.getPrototypeOf(Int8Array);
for (const C of [Array, String, TypedArray]) {
    Object.defineProperty(C.prototype, "at", {
        value: function at(n) {
            // ToInteger() abstract op
            n = Math.trunc(n) || 0;
            // Allow negative indexing from the end
            if (n < 0) n += this.length;
            // OOB access is guaranteed to return undefined
            if (n < 0 || n >= this.length) return undefined;
            // Otherwise, this is just normal property access
            return this[n];
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(C.prototype, "last", {
        value: function last() {
            return this[this.length-1];
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
}
Object.defineProperty(String.prototype, "noBreaks", {
    value: function noBreaks() {
        return this.replace(/\r\n?/g, '');
    },
    writable: true,
    enumerable: false,
    configurable: true
});
// ! causes issues in for in loop
//Array.prototype.last = function () {
//    return this[this.length - 1];
//};
function list (amount, callback) {
    let array = [];
    for (let i = 0; i < amount; i++) {
        if (typeof callback === 'function') {
            console.log(i);
            array.push(callback(i));
        } else {
            array.push(callback);
        }
    }
    return array;
}
function range(start, stop, include = false){
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    if (include) {
        if (start > stop) {
            stop--;
        } else {
            stop++
        }
    }
    let i = start; // start
    return { // iterator protocol
        [Symbol.iterator]:() => { // @@iterator
            return { // object with the next function
                next () {
                    while(i !== stop){
                        let temp = i;
                        if (start > stop) i--;
                        else i++;
                        return {
                            value: temp,
                            done: false,
                        }
                    }
                    return {done: true}
                }
            }
        }
    }
}
const PI = 3.141592653589793,
    E = 2.718281828459045,
    log = (...args) => console.log(...args),
    sqrt = Math.sqrt.bind(Math),
    Time = {
        get now () {
            return Date.now()
        },
        get ms () {
            return new Date().getMilliseconds()
        },
        get seconds () {
            return new Date().getSeconds()
        },
        get minutes () {
            return new Date().getMinutes()
        },
        get hours () {
            return new Date().getHours()
        },
        get day () {
            return new Date().getDay()
        },
        get month () {
            return new Date().getMonth()
        },
        get year () {
            return new Date().getFullYear()
        },
    },
    sizeof = function sizeof (object) {
        if (object === void 0 || object === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        if (object instanceof Set || object instanceof Map) {
            return object.size;
        }
        return Object.keys(object).length;
    };


// your code below this line

var a = 10;