if (!globalThis) {
    globalThis = window || global || this || {};
}
try {
    globalThis.require = require;
} catch (err) {
    globalThis.require = () => undefined;
}
//(async function () {
// console.log(requirejs);
globalThis.BS = {
    Node(tagName, id, className, attributes, children) {
        let el = document.createElement(tagName);
        id && (el.id = id);
        className && (el.className = className);
        // attributes
        if (children) {
            el.append(children);
        }
        if (typeof attributes == 'object') {
            for (let i in attributes) {
                el.setAttribute(i, attributes[i]);
            }
        }
        return el;
    },
    DOMtoJSON(node) {
        // credit to sumn2u
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
    ast: (function() {
        let r = globalThis.require('./index.js');
        if (r) return r;
        return function() {
            console.warn('Ast is not supported yet in browsers.')
        }
    })(),
    parse: (function() {
        let r = globalThis.require('./ast_to_js.js');
        if (r) return r;
        return function() {
            console.warn('@eval is not supported yet in browsers.')
        }
    })(),
    fs: (function() {
        let r = globalThis.require('fs');
        if (r) return r;
        return function() {
            console.warn('@import is not supported yet in browsers.')
        };
    })(),
    types: {
        Array(value) {
            return Array.isArray(value);
        },
        Null(value) {
            return value === null;
        },
        Undefined(value) {
            return value === void 0;
        },
        Int(value) {
            return parseInt(value) === value && !Number.isNaN(value);
        },
        Float(value) {
            return typeof value === 'number' && !Number.isNaN(value);
        },
        Number(value) {
            return typeof value === 'number' && !Number.isNaN(value);
        },
        NaN(value) {
            return Number.isNaN(value);
        },
        String(value) {
            return typeof value === 'string';
        },
        Function(value) {
            return typeof value === 'function';
        },
        Symbol(value) {
            return typeof value === 'symbol';
        },
        Boolean(value) {
            return typeof value === 'boolean';
        },
        HTML(value) {
            return value instanceof Element;
        },
        Object(value) {
            return typeof value === 'object' && value !== null;
        },
    },
    convert(value, type) {
        let t = this.getType(value)
        if (t) t = t.toLowerCase();
        let tmp = null;
        if (typeof type !== 'object' && t == type.toLowerCase()) return value;
        let gt = function(value, type) {
            switch (type) {
                case 'Number':
                case 'Float':
                    tmp = parseFloat(value)
                    if (isNaN(tmp)) return 0;
                    return tmp;
                case 'Int':
                    return value | 0;
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
                            let z = JSON.parse(t)
                            let v = this.getType(z) == 'array'
                            if (v) return z;
                            throw 'err';
                        } catch (err) {}
                        return value.split('');
                    }
                    if (t == 'number' || t == 'int' || t == 'float') {
                        return ('' + value).split('')
                    } else return [value];
                case 'JSON':
                    if (t == 'html') return this.DOMtoJSON(value);
                    if (t == 'object' || t == 'string' || t == 'array' || t == 'null' || t == 'number')
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
                                li.appendChild(document.createTextNode(': '))
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
                            } else span.innerText = `${value[i]}`;
                            li.append(span);
                            ul.append(li);
                        }
                        return ul;
                    }
                    return document.createElement('ul');
            }
        }
        if (typeof type != 'string') {
            let r = value;
            // debugger
            console.log(type.length)
            for (let i = 0; i < type.length; i++) {
                r = gt(r, type[i]);
                console.log({
                    r,
                    type: type[i]
                })
                if (i != length - 1) {
                    if (r.map) {
                        r = r.map(j => {
                            console.log({
                                each: this.convert(j, type[i + 1]),
                                type: type[i + 1]
                            })
                            return this.convert(j, type[i + 1])
                        });
                    }
                }
                console.log(r)
            }
        }
        // console.log('h', gt(value,type))
        return gt(value, type);
    },
    getType(value) {
        for (let i in this.types) {
            try {
                if (this.types[i](value)) return i;
            } catch (err) {
                continue
            }
        }
    },
    storage: [],
    // require('./ast_to_js.js')// || function () {console.warn('@eval is not supported yet in browsers.')}
};
try {
    Element;
} catch {
    globalThis.Element = {
        prototype: {}
    };
}
Element.prototype._append = Element.prototype.append;
Element.prototype.append = function(children) {
    if (Array.isArray(children)) {
        for (let i = 0, l = children.length; i < l; i++) {
            this._append(children[i]);
        }
    } else {
        this._append(children);
    }
    return this;
}
Element.prototype.json = function() {
    return globalThis.BS.DOMtoJSON(this);
}
Element.prototype.text = function(content) {
    if (content === void 0) {
        return this.textContent;
    }
    this.textContent = content;
    return this;
}
Element.prototype.css = function(obj) {
    for (let i in obj) {
        this.style[i] = obj[i];
    }
    return this;
}
Element.prototype.events = function(obj) {
    for (let i in obj) {
        this.addEventListener(i, obj[i]);
    }
    return this;
}
Array.prototype.last = function() {
    return this[this.length - 1];
}

function list(amount, callback) {
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

function range(n) {
    let i = 0 // start
    return { // iterator protocol
        [Symbol.iterator]: () => { // @@iterator
            return { // object with the next function
                next() {
                    while (i !== n) {
                        let temp = i
                        i++
                        return {
                            value: temp,
                            done: false
                        }
                    }
                    return {
                        done: true
                    }
                }
            }
        }
    }
}
const PI = 3.141592653589793,
    E = 2.718281828459045,
    log = (...args) => console.log(...args),
    Time = {
        get now() {
            return Date.now()
        },
        get ms() {
            return new Date().getMilliseconds()
        },
        get seconds() {
            return new Date().getSeconds()
        },
        get minutes() {
            return new Date().getMinutes()
        },
        get hours() {
            return new Date().getHours()
        },
        get day() {
            return new Date().getDay()
        },
        get month() {
            return new Date().getMonth()
        },
        get year() {
            return new Date().getFullYear()
        },
    };

// your code below this line!

console.log(...((() => {
    let r = globalThis.BS.convert(10, "Array");
    for (let i = 0; i < r.length; i++) {
        r[i] = globalThis.BS.convert(r[i], "Int");
    };
    return r
})()));
globalThis.BS.storage.push([0, 1, 2]);
globalThis.BS.storage.push(10);
console.log((() => {
    if (globalThis.BS.storage.length == 0) {
        throw new Error("No saved values to use at line 58, col 5.");
    }
    return globalThis.BS.storage.last();
})());
globalThis.BS.storage.pop();
console.log((() => {
    if (globalThis.BS.storage.length == 0) {
        throw new Error("No saved values to use at line 61, col 5.");
    }
    return globalThis.BS.storage.last();
})());
globalThis.BS.storage.pop();
console.log((() => {
    if (globalThis.BS.storage.length == 0) {
        throw new Error("No saved values to use at line 64, col 5.");
    }
    return globalThis.BS.storage.last();
})());
//})();