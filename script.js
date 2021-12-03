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
(async function() { // console.log(requirejs);
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
        E = 2.718281828459045;

    // your code below this line!

    let table = globalThis.BS.Node("table", null, null, null);
    let possibles = ["X", "O"];
    let turn = 0;
    (async function() {

        console.log(10);
    })();
    for (const i of range(3)) {
        let tr = globalThis.BS.Node("tr", null, null, null);
        for (const j of range(3)) {
            tr.append(globalThis.BS.Node("td", null, null, null).css({
                width: "100px",
                height: "100px",
                border: "10px solid black",
                textAlign: "center",
            }).events({
                click: async function() {

                    this.text(possibles[turn]);
                    turn = Number(!turn);
                },
            }));
        }
        table.append(tr);
    }
    document.body.append(table);
})();