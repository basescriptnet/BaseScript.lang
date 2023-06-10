BS.convert = function (value, type, outerType) {
    let t = this.typeof(value);
    if (t) t = t.toLowerCase();
    let tmp = null;
    if (typeof type !== 'object' && t == type.toLowerCase()) return value;
    let gt = function (value, type, outerType) {
        outerType = outerType || this.typeof(value);
        switch (type) {
            case 'Function':
                if (typeof value === 'function') {
                    return value;
                }
                return function(){};
            // null used in typed functions
            case 'Null':
                return null;
            case 'Number':
            case 'Float':
                tmp = parseFloat(value);
                if (Number.isNaN(tmp)) return 0;
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
                if (t == 'undefined' || t == 'null') return [];
                //if (t == 'html') return Object.values(this.DOMtoJSON(value));
                if (t == 'object') return Object.values(value);
                if (t == 'string') {
                    try {
                        let z = JSON.parse(t);
                        let v = this.typeof(z) == 'array';
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
                //if (t == 'html') return this.DOMtoJSON(value);
                if (t == 'object' || t == 'string' || t == 'array' || t == 'null' || t == 'number' )
                    return value;
                throw new TypeError(`Cannot convert ${t} to ${type}`);
            case 'Object':
                return Object(value);
            case 'Boolean':
                return Boolean(value);//@in
            //case 'List':
            //    let ul = document.createElement('ul');
            //    if (t == 'object' || t == 'array' || t == 'html') {
            //        for (let i in value) {
            //            let li = document.createElement('li');
            //            if (t == 'object') {
            //                let span = document.createElement('span');
            //                span.className = 'convert_key';
            //                span.innerText = i;
            //                li.append(span);
            //                li.appendChild(document.createTextNode(': '));
            //            }
            //            let span = document.createElement('span');
            //            //let li2;
            //            //if (ty == 'Array')
            //            //    li2 = document.createElement('li');
            //            span.className = 'convert_value';
            //            let ty = this.typeof(value[i]);
            //            if (ty == 'String' || ty == 'Number' || ty == 'Int' || ty == 'Float') {
            //                //span.className += ' string';
            //                if (outerType == 'Array') {
            //                    let li2 = document.createElement('li');
            //                    li2.innerText = gt(value[i], type, outerType);
            //                    if (ty == 'String') li2.innerText = `"${li2.innerText}"`;
            //                    span.append(li2);
            //                    //span.append(li) = `"${value[i]}"`;
            //                } else {
            //                    span.innerText = `"${value[i]}"`;
            //                }
            //            } else if (ty == 'Array') {
            //                //debugger
            //                //span.className += ' array';
            //                //span.innerText = JSON.stringify(value[i], null, 2);
            //                span.append('[');
            //                span.append(gt(value[i], type, 'Array'));
            //                span.append(']');
            //            } else if (ty == 'Object') {
            //                //span.innerText = JSON.stringify(value[i], null, 2);
            //                //let innerSpan = gt(value[i], type)
            //                span.append(gt(value[i], type));
            //            }
            //            else span.innerText = `${value[i]}`;
            //            span.className += ` ${ty}`;
            //            li.append(span);
            //            //if (li2) li.append(li2);
            //            ul.append(li);
            //        }
            //        return ul;
            //    } else if (t == 'int' || t == 'float' || t == 'string' || null) {
            //        let li = document.createElement('li');
            //        li.textContent = value;
            //        ul.append(li);
            //    }
            //    return ul;//@out
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
}
