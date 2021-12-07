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
        function(value) {
            return typeof value === 'function';
        },
        symbol(value) {
            return typeof value === 'symbol';
        },
        boolean(value) {
            return typeof value === 'boolean';
        },
        HTML(value) {
            return value instanceof Element;
        },
        object(value) {
            return typeof value === 'object' && value !== null;
        },
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

function dumpHTML(el) {
    if (!globalThis.BS.types["HTML"](el)) throw new TypeError("Argument \"el\" is not type of HTML at line 9, col 19.");
    let result = "<pre>";
    el = el.json();
    for (const i in el) {
        if ((globalThis.BS.getType(el[i])) == "int") {
            result += `<span style=\"color: darkblue;\">${i}</span>: <span style=\"color: purple\">${el[i]}</span><br>`;
        } else {
            if ((globalThis.BS.getType(el[i])) == "array") {
                result += `<span style=\"color: darkblue;\">${i}</span>: <span style=\"color: purple\">${JSON.stringify(el[i], null, 2)}</span><br>`;
            }
        }
    }
    document.body.innerHTML = result + "</pre>";
}
let canvas = globalThis.BS.Node("canvas", "canvas", null, null);
let ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
document.body.append(canvas);
let p = 600 / 8;
let r = true;
for (const i of range(8)) {
    for (const j of range(8)) {
        if (r) {
            ctx.fillStyle = "black";
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(p * j, p * i, p, p);
        r = !r;
    }
    r = !r;
}
//})();