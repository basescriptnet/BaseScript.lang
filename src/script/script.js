if (!globalThis) { globalThis = window || global || this || {}; } try { globalThis.require = require; } catch (err) { globalThis.require = () => undefined; } 
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
    checkArgType(type, name, value, line, col) {
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
        throw new TypeError(`Argument "${name}" is not type of "${type}" at line ${line}, col ${col}.`);
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
                    if (t == 'undefined' || t == 'null') return []
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
    defineProperty(prototype, propertyName, valueCallback, options) {
        options = options || {
            writable: true,
            enumerable: false,
            configurable: true
        }
        options.value = valueCallback;
        Object.defineProperty(prototype, propertyName, options);
    },
    Object(object) {
        //let o = Object.create(null);
        //return Object.assign(o, object);
        return object
    },
    Array(array) {
        if (array instanceof Array === false) array = BS.convert(array, 'Array');
        let o = Object.create(null);
        let proto = ['push', 'pop', 'shift', 'unshift', 'slice', 'splice',
            'join', 'sort', 'map', 'forEach', 'indexOf', 'at', 'includes'];
        for (let i in proto) {
            BS.defineProperty(o, proto[i], function () {
                return Array.prototype[proto[i]].apply(this, arguments);
            });
        }
        array.__proto__ = o;
        return array;
    },
    // require('./ast_to_js.js')//
    //|| function () { console.warn('@eval is not supported yet in browsers.') }
};

const BS = globalThis.BS;

const TypedArray = Reflect.getPrototypeOf(Int8Array);
for (const C of [Array, String, TypedArray]) {
    BS.defineProperty(C.prototype, "at", function at(n) {
        // ToInteger() abstract op
        n = Math.trunc(n) || 0;
        // Allow negative indexing from the end
        if (n < 0) n += this.length;
        // OOB access is guaranteed to return undefined
        if (n < 0 || n >= this.length) return undefined;
        // Otherwise, this is just normal property access
        return this[n];
    });
    BS.defineProperty(C.prototype, "last", function last() {
        return this[this.length-1];
    });
}
BS.defineProperty(String.prototype, "noBreaks", function noBreaks() {
    return this.replace(/\r\n?/g, '');
});
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
const log = (...args) => console.log(...args),
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
function clear_function_value(v) {
    if (typeof v !== 'function') return v;
    let r = Object.create(null);
    r.name = v.name;
    r.value = v.value.toString()
    r.type = 'function';
    return r;
}
function get_clear_value(v) {
    if (typeof v != 'object' || v === null) {
        return v;
        //return clear_function_value(v);
    }
    let r = Object.create(null);
    for (let i in v) {
        if (v[i] instanceof Variable) {
            if (v[i].name == 'this') continue;
            //if (typeof v[i].value == 'function') {
            //    r[`function ${i}`] = clear_function_value(v[i]);
            //}
            else r[i] = v[i].value
        }
        else if (BS.getType(v[i]) == 'Object') {
            r[i] = get_clear_value(v[i]);
        }
        else {
            r[i] = v[i]
        }
    }
    return r;
}
function get_item(object, property) {
    if (object === null || object === void 0) {
        throw new TypeError(`Cannot read properties of "null"`)
    }
    let v = object[property];
    if (v !== void 0) {
        if (v instanceof Variable) {
            return v.value;
        }
        if (BS.getType(v) == 'Object') {
            return get_clear_value(v);
        }
        return v
    }
    return null
}
const range = function range(start, stop, include = false) {
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
        [Symbol.iterator]: () => { // @@iterator
            return { // object with the next function
                next() {
                    while (i !== stop) {
                        let temp = i;
                        if (start > stop) i--;
                        else i++;
                        return {
                            value: temp,
                            done: false,
                        }
                    }
                    return { done: true }
                }
            }
        }
    }
};
const isNaN = function isNaN(number) {
    return typeof number == 'number' && number !== number;
}
class Variable {
    constructor(name, type, value, constant = false, ignoreError = false) {
        this.name = name;
        this.type = type;
        this.value = value === void 0 ? null : value;
        this.constant = constant;
        this.ignoreError = ignoreError
    }
    set realValue(value) {
        if (this.constant && !this.ignoreError) {
            throw new Error(`Attempt to change value of constant "${this.name}"`)
        } else if (this.constant) {
            return this.value;
        }
        if (this.type == 'let' || this.type == '\\'
            //|| this.type === null
        ) return this.value;
        if (this.type !== null && BS.getType(value) != this.type) {
            throw new TypeError(`Assignment of a different type to variable "${this.name}" rather than "${this.type}" is prohibited`)
        }
        this.value = value;
    }
    get realValue () {
        return get_clear_value(this.value);
    }
}

class Scopes {
    constructor() {
        this.scopes = []
    }
    new(level, parent = this) {
        let scope = new Scope(level, parent);
        parent.scopes.push(scope);
        return scope
    }
    global() {
        let scope0 = this.new(0);
        scope0.set('PI', Math.PI, true, true);
        scope0.set('E', Math.E, true, true);
        scope0.set('range', range, true, true);
        scope0.set('this', scope0.variables, true, true, true);
        scope0.set('Infinity', Infinity, true, true);
        scope0.set('NaN', NaN, true, true);
        scope0.set('isNaN', isNaN, true, true);
        scope0.set('empty', function empty(object) {
            if (['array', 'string', 'object'].includes(typeof object)) {
                return Object.keys(object).length == 0;
            }
            throw new TypeError(`Unexpected type of argument for "empty" function. "array", "string" or "object" was expected`)
        }, true, true);
        scope0.set('round', function round(object) {
            return Math.round(object)
        }, true, true);
        scope0.set('ceil', function ceil(object) {
            return Math.ceil(object)
        }, true, true);
        scope0.set('floor', function floor(object) {
            return Math.floor(object)
        }, true, true);
        //scope0.set('Object', BS.Object.bind(BS, true, true);
        //scope0.set('Array', BS.Array.bind(BS, true, true);
        return scope0;
    }
}

class Scope {
    constructor(level, parent) {
        this.level = level
        this.variables = {}
        this.scopes = []
        this.parent = parent
    }
    get(propertyName) {
        if (this.variables[propertyName] !== void 0) {
            return this.variables[propertyName].realValue
        }
        let level = this.level
        if (level == 0 || !this.parent) {
            console.warn(`Variable "${propertyName}" has never been declared. "null" is returned instead.`)
            return null
            //throw ReferenceError(`Variable "${propertyName}" has never been declared.`)
        }
        return this.parent.get(propertyName);
    }
    getScope(propertyName) {
        if (this.variables[propertyName]) {
            return this
        }
        let level = this.level
        if (level == 0 || !this.parent) return null
        return this.parent.getScope(propertyName)
    }
    set(propertyName, value, local = false, constant = false, ignoreError = false) {
        if (local || constant) {
            let v = this.variables[propertyName]
            if (!v) {
                this.variables[propertyName] = new Variable(propertyName, null, value, constant, ignoreError)
            }
            else {
                this.variables[propertyName].realValue = value;
            }
            return null;
        }
        let scope = this.getScope(propertyName)
        // not found
        if (scope == null) {
            scope = this;
        }
        let v = scope.variables[propertyName]
        if (!v) {
            scope.variables[propertyName] = new Variable(propertyName, null, value, constant)
        }
        else {
            scope.variables[propertyName].realValue = value;
        }
        return null;
    }
}

const scopes = new Scopes();
const scope0 = scopes.global();



// your code below this line

(function() {
    scope0.set("i", 0, true);
    for (let _i3f54c42d of scope0.get("range")(0, 10)) {
        const scope1 = scopes.new(1, scope0);
        scope1.set("j", _i3f54c42d, true);
        scope1.set("i", 1, true);
        console.log(scope1.get("i"));
        scope0.scopes.pop();
        scopes.scopes.pop();
    }
    console.log(scope0.get("i"));
})();