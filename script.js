if (!globalThis) {
    globalThis = window || global || this || {};
}
try {
    globalThis.require = require;
} catch (err) {
    globalThis.require = () => undefined;
}
// finally {
//     globalThis.require = () => undefined;
// }
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
                arr[i] = toJSON(childNodes[i]);
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
        array(value) {
            return Array.isArray(value);
        },
        null(value) {
            return value === null;
        },
        undefined(value) {
            return value === void 0;
        },
        int(value) {
            return parseInt(value) === value && !Number.isNaN(value);
        },
        float(value) {
            return typeof value === 'number' && !Number.isNaN(value);
        },
        number(value) {
            return typeof value === 'number' && !Number.isNaN(value);
        },
        NaN(value) {
            return Number.isNaN(value);
        },
        string(value) {
            return typeof value === 'string';
        },
        object(value) {
            return typeof value === 'object' && value !== null;
        },
        function(value) {
            return typeof value === 'function';
        },
        symbol(value) {
            return typeof value === 'symbol';
        },
        boolean(value) {
            return typeof value === 'boolean';
        }
    },
    getType(value) {
        for (let i in this.types) {
            try {
                if (this.types[i](value)) return i;
            } catch (err) {
                continue
            }
        }
    }
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
    log = (...args) => console.log(...args);

// your code below this line!

globalThis.BS.types["Unique"] = function(value, required = false) {
    if (!globalThis.BS.types["array"](value)) throw new TypeError("Argument \"value\" is not type of array at line 1, col 13.");
    if (required && typeof arguments[0] === void 0) {
        throw new TypeError("Missing argument at 1:1");
    }
    let r = [];
    for (const i of value) {
        if (r.includes(i)) {
            return false;
        }
        r.push(i);
    }
    return true;
};

function join(a, b) {
    if (!globalThis.BS.types["Unique"](a)) throw new TypeError("Argument \"a\" is not type of Unique at line 9, col 15.");
    if (!globalThis.BS.types["Unique"](b)) throw new TypeError("Argument \"b\" is not type of Unique at line 9, col 15.");
    let r = [];
    for (const i in a) {
        r.push(a[i]);
    }
    for (const i in b) {
        r.push(b[i]);
    }
    return r;
}
log(globalThis.BS.getType(1 + 1 + 1.5));
log(join([1, 10, 2, 3], [0, 10, 2]));
log("success");
let obj = {
    if: 1,
};
//})();