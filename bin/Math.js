if (!globalThis) { globalThis = window || global || this || {}; } try { globalThis.require = require; } catch (err) { globalThis.require = () => undefined; } 
                globalThis.BS = {
    Node (tagName, id, className, attributes, children) {
        let el = document.createElement(tagName);
        id && (el.id = id);
        className && (el.className = className); 
        if (children) {
            el.append(children);
        }
        if (typeof attributes == 'object') {
            for(let i in attributes) {
                el.setAttribute(i, attributes[i]);
            }
        }
        return el;
    },
    DOMtoJSON (node) { 
        node = node || this;
        let obj = {
            nodeType: node.nodeType
        };
        if (node.tagName) {
            obj.tagName = node.tagName.toLowerCase();
        } else
        if (node.nodeName) {
            obj.nodeName = node.nodeName;
        }
        if (node.nodeValue) {
            obj.nodeValue = node.nodeValue;
        }
        let attrs = node.attributes;
        let childNodes = node.childNodes;
        let length;
        let arr;
        if (attrs) {
            length = attrs.length;
            arr = obj.attributes = new Array(length);
            for (let i = 0; i < length; i++) {
                const attr = attrs[i];
                arr[i] = [attr.nodeName, attr.nodeValue];
            }
        }
        if (childNodes) {
            length = childNodes.length;
            arr = obj.childNodes = new Array(length);
            for (let i = 0; i < length; i++) {
                arr[i] = this.DOMtoJSON(childNodes[i]);
            }
        }
        return obj;
    },
    valueToDOM (value) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === void 0) {
            return value + '';
        }
        if (BS.types['HTML'](value)) { 
            return value;
        }
        return document.createTextNode(value);
    },
    cloneNode (value) {
        let clone = value.cloneNode(true);
        return clone;
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
            output = output.reverse()
        return output;
    },
    delete (value, index) {   
        Array.prototype.splice.call(value, index, 1);
        return value;
    },
    slice (value, start, end, step = 1, line, col) {
        if (!Array.isArray(value) && typeof value != 'string') {
            throw new TypeError(`Array or string was expected at line ${line}, col ${col}`);
        }
        if (typeof start != 'number') {
            throw new TypeError(`Number was expected at line ${line}, col ${col}`)
        }
        if (end === null && step === null) {
            return value.slice(start)
        }
        step = step|0;
        if (step >= 0) step = 1;
        else step = -1;   
        let result = value.slice(start, end);
        if (step === -1) {
            if (typeof value === 'string')
                return Array.from(result).reverse().join('');
            return result.reverse();
        }
        return result;
    },
    ast: (function () {
        let r = globalThis.require('./index.js');
        if (r) return r;
        return function () {console.warn('Ast is not supported yet in browsers.')}
    })(),
    parse: (function () {
        let r = globalThis.require('./ast_to_js.js');
        if (r) return r;
        return function () {console.warn('@eval is not supported yet in browsers.')}
    })(),
    fs: (function () {
        let r = globalThis.require('fs');
        if (r) return r;
        return function () {console.warn('@import is not supported yet in browsers.')};
    })(),
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
        HTML (value) {
            return value instanceof Element;
        },
        Object (value) {
            return typeof value === 'object' && value !== null;
        },
    },
    convert (value, type) {
        let t = this.getType(value);
        if (t) t = t.toLowerCase();
        let tmp = null;
        if (typeof type !== 'object' && t == type.toLowerCase()) return value;
        let gt = function (value, type) {
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
                    if (t == 'object' || t == 'array' || t == 'html') {
                        let ul = document.createElement('ul');
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
                            span.className = 'convert_value';
                            if (this.getType(value[i]) == 'string') {
                                span.className += ' string';
                                span.innerText = `"${value[i]}"`;
                            } else if (this.getType(value[i]) == 'number') {
                                span.className += ' number';
                                span.innerText = `${value[i]}`;
                            } else if (this.getType(value[i]) == 'array') {
                                span.className += ' array';
                                span.innerText = JSON.stringify(value[i], null, 2);
                            }
                            else span.innerText = `${value[i]}`;
                            li.append(span);
                            ul.append(li);
                        }
                        return ul;
                    }
                    return document.createElement('ul');
            };
        };
        if (typeof type != 'string') {
            let r = value; 
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
        return gt(value, type);
    },
    getType (value) {
        for (let i in this.types) {
            try {
                if (this.types[i](value)) return i;
            } catch (err) {continue}
        }
    },
    sizeof(object) {  
        if (object instanceof Set || object instanceof Map)
            return object.size;
        if (object instanceof Array || object instanceof String)
            return object.length;
        if (object instanceof Object)
            return Object.keys(object).length; 
        if (object === void 0 || object === null) {
            return 0 
        }
        return Object.keys(object).length;
    },
    deepFreeze (object) { 
        const propNames = Object.getOwnPropertyNames(object); 
        for (const name of propNames) {
            const value = object[name];

            if (value && typeof value === "object") {
                BS.deepFreeze(value);
            }
        }
        return Object.freeze(object);
    },
    storage: [], 
};
const BS = globalThis.BS;
try {
    Element;
} catch {
    globalThis.Element = {prototype: {}};
    Element = globalThis.Element;
}
Element.prototype._append = Element.prototype.append;
Element.prototype.append = function (children) {
    if (Array.isArray(children)) {
        for (let i = 0, l = children.length; i < l; i++) {
            this._append(children[i]);
        }
    } else {
        this._append(children);
    }
    return this;
};
Element.prototype.json = function () {
    return globalThis.BS.DOMtoJSON(this);
};
Element.prototype.text = function (content) {
    if (content === void 0) {
        return this.textContent;
    }
    this.textContent = content;
    return this;
};
Element.prototype.listen = function (event, callback) {
    this.addEventListener(event, callback);
    return this;
};
Element.prototype.css = function (obj) {
    for (let i in obj) {
        this.style[i] = obj[i];
    }
    return this;
};
Element.prototype.events = function (obj) {
    for (let i in obj) {
        this.addEventListener(i, obj[i]);
    }
    return this;
};
Array.prototype.last = function () {
    return this[this.length - 1];
};
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
    let i = start; 
    return { 
        [Symbol.iterator]:() => { 
            return { 
                next () {
                    while(i !== stop){
                        let temp = i;
                        if (start > stop) i--;
                        else i++;
                        return {
                            value: temp,
                            done: false
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
        if (object instanceof Set || object instanceof Map)
            return object.size;
        return Object.keys(object).length;
    };


// your code below this line

const sin = BS.deepFreeze(Math.sin.bind(Math)),
    cos = BS.deepFreeze(Math.cos.bind(Math));