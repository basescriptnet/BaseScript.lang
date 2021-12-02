(async function() {
    if (!globalThis) {
        globalThis = window || global || this || {};
    }
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
        }
    };
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

    let id = 100;
    let j = (function() {

        console.log("hello world");
    })(10, 20);
})();