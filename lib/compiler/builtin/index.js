// @@@ checkArgType.js
BS.checkArgType = function (type, name, value, line, col) {
    label:
    for (let i = 0; i < type.length; i++) {
        let is_array = type[i].slice(-2) === '[]';
        let clearType = type[i];
        if (is_array) {
            clearType = clearType.slice(0, -2);
        }
        BS.ifTypeExists(clearType);
        if (is_array) {
            if (!this.types['Array'](value)) {
                continue;
            }
            for (let j = 0; j < value.length; j++) {
                if (!this.validateType(value[j], clearType)) {
                    continue label;
                }
            }
            return value;
        }
        if (this.validateType(value, type[i])) {
            return value;
        }
    }
    //if (type in this.customTypes) {
    //    let r = BS.customTypes[type];
    //    if (r && r(value))
    //        return true;
    //}
    //if (type in this.types) {
    //    let r = BS.types[type];
    //    if (r && r(value))
    //        return true;
    //}
    throw new TypeError(`Argument "${name}" is not type of "${type.join(' | ')}" at line ${line}, col ${col}.`);
}
// @@@ END checkArgType.js
// @@@ complexMath.js
BS.operation = function (operationSign) {
    switch (operationSign) {
        case '+':
            return this.sum;
        case '-':
            return this.sub;
        case '*':
            return this.mul;
        case '/':
            return this.div;
        case '%':
            return this.mod;
        case '**':
            return this.pow;
        default:
            throw new TypeError(`Unknown operation ${operationSign}`);
    }
}
BS.sum = function (value1, value2) {
    if (typeof value1 === 'string') {
        if (typeof value2 !== 'string') {
            throw new TypeError('String was expected for concatination, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1.concat(value2);
    }
    if (BS.types.Number(value1)) {
        if (!BS.types.Number(value2)) {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 + value2;
    }
    if (Array.isArray(value1)) {
        return [].concat(value1, value2);
    }
    if (BS.types.Object(value1) && BS.types.Object(value2)) {
        return Object.assign({}, value1, value2);
    }
    //if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
    //    throw new TypeError('"null" or "undefined" cannot be used in math expressions');
    //}
    throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.sub = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 - value2;
    }
    throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.pow = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return Math.pow(value1, value2);
    }
    throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.div = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 / value2;
    }
    throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.mod = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 % value2;
    }
    throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.mul = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'string') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for repeated concatination, got "'+BS.typeof(value2)+'" insetead');
        }
        let result = '';
        for (let i = 0; i < value2; i++) {
            result += value1;
        }
        return result;
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 * value2;
    }
    throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
// @@@ END complexMath.js
// @@@ convert.js
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
// @@@ END convert.js
// @@@ delete.js
BS.delete = function (value, index) {
    // if (typeof value === 'string') {
    //     return value.substring(0, index) + value.substring(index+1, value.length);
    // }
    Array.prototype.splice.call(value, index, 1);
    return value;
}
// @@@ END delete.js
// @@@ expect.js
BS.expect = function (var_name, value, type) {
    if (this.typeof(value) !== type) {
        if (type in this.customTypes) {
            if (this.customTypes[type](value)) {
                return value
            }
        } else if (type in this.types) {
            if (this.types[type](value)) {
                return value
            }
        }
        throw new TypeError(`"${type}" was expected for "${var_name}", got "${this.typeof(value)}"`);
    }
    return value;
}
// @@@ END expect.js
// @@@ expectValue.js
// TODO: expectValue and checkArgType are the same
BS.expectValue = function (value, type) {
    //let found = false;
    label:
    for (let i = 0; i < type.length; i++) {
        let is_array = type[i].slice(-2) === '[]';
        let clearType = type[i];
        if (is_array) {
            clearType = clearType.slice(0, -2);
        }
        BS.ifTypeExists(clearType);
        if (is_array) {
            if (!this.types['Array'](value)) {
                continue;
            }
            for (let j = 0; j < value.length; j++) {
                if (!this.validateType(value[j], clearType)) {
                    continue label;
                }
            }
            return value;
        }
        if (this.validateType(value, type[i])) {
            return value;
        }
    }
    //if (this.validateType(value, type)) {
    //    return value;
    //}
    throw new TypeError(`Value type of "${type.join(' | ')}" was expected, got "${this.typeof(value)}"`);
}
// @@@ END expectValue.js
// @@@ last.js
BS.last = function (number) {
    return number > 0 ? number - 1 : 0;
}

const TypedArrays = Reflect.getPrototypeOf(Int8Array);
for (const C of [Array, String, TypedArrays]) {
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
// @@@ END last.js
// @@@ range.js
globalThis.range = function range(start, stop, include = false) {
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
// @@@ END range.js
// @@@ sizeof.js
BS.sizeof = function (object) {
    if (object === void 0 || object === null)
        return 0;
    if (object instanceof Set || object instanceof Map)
        return object.size;
    if (object instanceof Array || object instanceof String)
        return object.length;
    return Object.keys(object).length;
}
// @@@ END sizeof.js
// @@@ slice.js
BS.slice = function (value, start, end, step = 1, line, col) {
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
}
// @@@ END slice.js
// @@@ through.js
BS.through = function (value0, value1, line, col) {
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
}
// @@@ END through.js
// @@@ typeof.js
BS.types = {
    RegExp(value) {
        return value instanceof RegExp;
    },
    Array(value) {
        return Array.isArray(value);
    },
    Null(value) {
        return value === null;
    },
    Undefined (value) {
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
    BigInt(value) {
        return typeof value === 'bigint';
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
    Object(value) {
        if (BS.types.HTML && BS.types.HTML(value)) {
            return false;
        }
        if (BS.types.Array(value)) return false;
        return typeof value === 'object' && value !== null;
    },
}
BS.curstomTypes = {Any: () => true};
BS.typeof = function (value) {
    for (let i in this.types) {
        try {
            if (this.types[i](value)) return i;
            //if (this.curstomTypes[i](value)) return i;
        } catch (err) {continue}
    }
}
// @@@ END typeof.js
// @@@ validateType.js
BS.validateType = function (value, type, nullable) {
    // can be simplified. Return instantly.
    // may be issues with arrays[]
    let t = null;
    //debugger;
    if (Array.isArray(type)) {
        for (let i in type) {
            if (type[i].indexOf('[]', '') > -1) {
                if (Array.isArray(value)) {
                    let t = true;
                    for (let j in value) {
                        if (!this.validateType(value[j], type[i].replace('[]', ''))) {
                            t = false;
                            break;
                        }
                    }
                    if (t) return true;
                }
            }
            else if (this.customTypes[type[i].replace('[]', '')]) {
                try {
                    t = this.customTypes[type[i].replace('[]', '')](value);
                } finally { }
            }
            else if (this.types[type[i].replace('[]', '')]) t = this.types[type[i].replace('[]', '')](value);
            if (t) return true;
        }
    } else {
        if (this.customTypes[type]) t = this.customTypes[type](value);
        else if (this.types[type]) t = this.types[type](value);
    }
    if (t || nullable && value === null) return true;
    return false;
}

BS.ifTypeExists = function (type) {
    // may be issues with arrays[]
    if (Array.isArray(type)) {
        for (let i in type) {
            if (this.customTypes[type[i].replace('[]', '')]) continue;
            else if (this.types[type[i].replace('[]', '')]) continue;
            throw new TypeError(`Types ${type[i]} do not exist`);
        }
        return type;
    } else {
        if (this.customTypes[type.replace('[]', '')]) return type;
        if (this.types[type.replace('[]', '')]) return type;
    }
    throw new TypeError(`Type ${type} does not exist`);
}
// @@@ END validateType.js
