(function () {
    try {
        Element;
    } catch {
        globalThis.Element = { prototype: {} };
        Element = globalThis.Element;
    }
    Element.prototype._append = Element.prototype.append || function () { };
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
    BS.WRITE = function (value) {
        if (BS.getType(value) !== 'HTML') {
            let el = document.createTextNode(value);
            document.body.append(el);
            return
        }
        document.body.append(value);
    };
    BS.cloneNode = function (value) {
        let clone = value.cloneNode(true);
        return clone;
    };
    BS.DOMtoJSON = function (node) {
        // credit to sumn2u
        node = node || this;
        let obj = {
            nodeType: node.nodeType
        };
        if (node.tagName) {
            obj.tagName = node.tagName.toLowerCase();
        } else if (node.nodeName) {
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
    };
    BS.Node = function (tagName, id, className, attributes, children) {
        let el = document.createElement(tagName);
        id && (el.id = id);
        className && (el.className = className);
        // attributes
        if (children) {
            el.append(children);
        }
        if (typeof attributes == 'object') {
            for(let i in attributes) {
                el.setAttribute(i, attributes[i]);
            }
        }
        return el;
    };
    BS.valueToDOM = function (value) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === void 0) {
            return document.createTextNode(value + '');
        }
        if (BS.types['HTML'](value)) {
            // return BS.cloneNode(value);
            return value;
        }
        if (BS.types['Array'](value)) {
            let fragment = document.createDocumentFragment();
            fragment.className = 'array_to_dom';
            for (let i = 0; i < value.length; i++) {
                fragment.append(BS.valueToDOM(value[i]));
            }
            return fragment;
        }
        return document.createTextNode(value);
    };
    BS.types.HTML = function (value) {
        if (!document && !window) return false;
        return Element && value instanceof Element;
    };
})();
