(function () {if (!Array.isArray){ Array.isArray=function(arg){ return Object.prototype.toString.call(arg)==='[object Array]'; }; } if (!globalThis){ globalThis=window||global||this||{}; } globalThis.BS={ through (value0, value1, line, col){ if (typeof value0!='number'||typeof value1!='number'){ throw new TypeError(`Number is expected on the line ${line}, col ${col}.`); } let output=[]; let min=Math.min(value0, value1); let max=Math.max(value0, value1); for (let i=min; i<=max; i++){ output.push(i); } if (value0!=min) output=output.reverse(); return output; }, sum(value1, value2){ if (typeof value1==='string'){ if (typeof value2!=='string'){ throw new TypeError('String was expected for concatination, got "'+BS.typeof(value2)+'" insetead'); } return value1.concat(value2); } if (BS.types.Number(value1)){ if (!BS.types.Number(value2)){ throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead'); } return value1 + value2; } if (Array.isArray(value1)){ return [].concat(value1, value2); } if (BS.types.Object(value1)&&BS.types.Object(value2)){ return Object.assign({}, value1, value2); } throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead'); }, sub(value1, value2){ if (value1===null||value1===void 0||value2===null||value2===void 0){ throw new TypeError('"null" or "undefined" cannot be used in math expressions'); } if (typeof value1==='number'){ if (typeof value2!=='number'){ throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead'); } return value1 - value2; } throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead'); }, pow(value1, value2){ if (value1===null||value1===void 0||value2===null||value2===void 0){ throw new TypeError('"null" or "undefined" cannot be used in math expressions'); } if (typeof value1==='number'){ if (typeof value2!=='number'){ throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead'); } return Math.pow(value1, value2); } throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead'); }, div(value1, value2){ if (value1===null||value1===void 0||value2===null||value2===void 0){ throw new TypeError('"null" or "undefined" cannot be used in math expressions'); } if (typeof value1==='number'){ if (typeof value2!=='number'){ throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead'); } return value1 / value2; } throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead'); }, mod(value1, value2){ if (value1===null||value1===void 0||value2===null||value2===void 0){ throw new TypeError('"null" or "undefined" cannot be used in math expressions'); } if (typeof value1==='number'){ if (typeof value2!=='number'){ throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead'); } return value1 % value2; } throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead'); }, mul(value1, value2){ if (value1===null||value1===void 0||value2===null||value2===void 0){ throw new TypeError('"null" or "undefined" cannot be used in math expressions'); } if (typeof value1==='string'){ if (typeof value2!=='number'){ throw new TypeError('Number was expected for repeated concatination, got "'+BS.typeof(value2)+'" insetead'); } let result=''; for (let i=0; i<value2; i++){ result +=value1; } return result; } if (typeof value1==='number'){ if (typeof value2!=='number'){ throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead'); } return value1 * value2; } throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead'); }, delete (value, index){ Array.prototype.splice.call(value, index, 1); return value; }, slice (value, start, end, step=1, line, col){ if (!Array.isArray(value)&&typeof value!='string'){ throw new TypeError(`Array or string was expected at line ${line}, col ${col}`); } if (typeof start!='number'){ throw new TypeError(`Number was expected at line ${line}, col ${col}`); } if (end===null&&step===null){ return value.slice(start); } step=step|0; if (step>=0) step=1; else step=-1; let result=value.slice(start, end); if (step===-1){ if (typeof value==='string') return Array.from(result).reverse().join(''); return result.reverse(); } return result; }, customOperators: {}, customTypes: {Any: ()=>true}, types:{ RegExp(value){ return value instanceof RegExp; }, Array (value){ return Array.isArray(value); }, Null (value){ return value===null; }, Undefined (value){ return value===void 0; }, Int (value){ return parseInt(value)===value&&!Number.isNaN(value); }, Float (value){ return typeof value==='number'&&!Number.isNaN(value); }, Number (value){ return typeof value==='number'&&!Number.isNaN(value); }, BigInt(value){ return typeof value==='bigint'; }, NaN (value){ return Number.isNaN(value); }, String (value){ return typeof value==='string'; }, Function (value){ return typeof value==='function'; }, Symbol (value){ return typeof value==='symbol'; }, Boolean (value){ return typeof value==='boolean'; }, Object(value){ if (BS.types.HTML&&BS.types.HTML(value)){ return false; } if (BS.types.Array(value)) return false; return typeof value==='object'&&value!==null; }, }, libs: [], expect(var_name, value, type){ if (this.typeof(value)!==type){ if (type in this.customTypes){ if (this.customTypes[type](value)){ return value} } else if (type in this.types){ if (this.types[type](value)){ return value} } throw new TypeError(`"${type}" was expected for "${var_name}", got "${this.typeof(value)}"`); } return value; }, expectValue(value, type){ label: for (let i=0; i<type.length; i++){ let is_array=type[i].slice(-2)==='[]'; let clearType=type[i]; if (is_array){ clearType=clearType.slice(0, -2); } BS.ifTypeExists(clearType); if (is_array){ if (!this.types['Array'](value)){ continue; } for (let j=0; j<value.length; j++){ if (!this.validateType(value[j], clearType)){ continue label; } } return value; } if (this.validateType(value, type[i])){ return value; } } throw new TypeError(`Value type of "${type.join(' | ')}" was expected, got "${this.typeof(value)}"`); }, checkArgType(type, name, value, line, col){ label: for (let i=0; i<type.length; i++){ let is_array=type[i].slice(-2)==='[]'; let clearType=type[i]; if (is_array){ clearType=clearType.slice(0, -2); } BS.ifTypeExists(clearType); if (is_array){ if (!this.types['Array'](value)){ continue; } for (let j=0; j<value.length; j++){ if (!this.validateType(value[j], clearType)){ continue label; } } return value; } if (this.validateType(value, type[i])){ return value; } } throw new TypeError(`Argument "${name}" is not type of "${type.join(' | ')}" at line ${line}, col ${col}.`); }, convert(value, type, outerType){ let t=this.typeof(value); if (t) t=t.toLowerCase(); let tmp=null; if (typeof type!=='object'&&t==type.toLowerCase()) return value; let gt=function (value, type, outerType){ outerType=outerType||this.typeof(value); switch (type){ case 'Function': if (typeof value==='function'){ return value; } return function(){}; case 'Null': return null; case 'Number': case 'Float': tmp=parseFloat(value); if (Number.isNaN(tmp)) return 0; return tmp; case 'Int': return value|0; case 'String': if (t=='html') return JSON.stringify(this.DOMtoJSON(value)); if (t=='array') return value.join(''); if (t=='object') return JSON.stringify(value); if (t=='boolean') return !!value; if (t=='null') return 'null'; if (t=='undefined') return 'undefined'; else return value.toString(); case 'Array': if (t=='undefined'||t=='null') return []; if (t=='html') return Object.values(this.DOMtoJSON(value)); if (t=='object') return Object.values(value); if (t=='string'){ try{ let z=JSON.parse(t); let v=this.typeof(z)=='array'; if (v) return z; throw 'err'; } catch (err) {} return value.split(''); } if (t=='number'||t=='int'||t=='float'){ return (''+value).split(''); } else return [value]; case 'JSON': if (t=='html') return this.DOMtoJSON(value); if (t=='object'||t=='string'||t=='array'||t=='null'||t=='number' ) return value; throw new TypeError(`Cannot convert ${t} to ${type}`); case 'Object': return Object(value); case 'Boolean': return Boolean(value); }; }.bind(this); if (typeof type!='string'){ let r=value; console.log(type.length); for (let i=0; i<type.length; i++){ r=gt(r, type[i]); console.log({r, type: type[i]}); if (i!=length -1){ if (r.map){ r=r.map(j=>{ console.log({each: this.convert(j, type[i+1]), type: type[i+1]}); return this.convert(j, type[i+1]); }); } } console.log(r); } }; return gt(value, type); }, typeof (value){ for (let i in this.types){ try{ if (this.types[i](value)) return i; } catch (err) {continue} } }, validateType(value, type, nullable){ let t=null; if (Array.isArray(type)){ for (let i in type){ if (type[i].indexOf('[]', '')>-1){ if (Array.isArray(value)){ let t=true; for (let j in value){ if (!this.validateType(value[j], type[i].replace('[]', ''))){ t=false; break; } } if (t) return true; } } else if (this.customTypes[type[i].replace('[]', '')]){ try{ t=this.customTypes[type[i].replace('[]', '')](value); } finally{ } } else if (this.types[type[i].replace('[]', '')]) t=this.types[type[i].replace('[]', '')](value); if (t) return true; } } else{ if (this.customTypes[type]) t=this.customTypes[type](value); else if (this.types[type]) t=this.types[type](value); } if (t||nullable&&value===null) return true; return false; }, isArrayOfType(value, type){ if (!Array.isArray(value)) return false; for (let i in value){ if (!this.validateType(value[i], [type.replace('[]')])) return false; } return true; }, ifTypeExists(type){ if (Array.isArray(type)){ for (let i in type){ if (this.customTypes[type[i].replace('[]', '')]) continue; else if (this.types[type[i].replace('[]', '')]) continue; throw new TypeError(`Types ${type[i]} do not exist`); } return type; } else{ if (this.customTypes[type.replace('[]', '')]) return type; if (this.types[type.replace('[]', '')]) return type; } throw new TypeError(`Type ${type} does not exist`); }, sizeof(object){ if (object===void 0||object===null) return 0; if (object instanceof Set||object instanceof Map) return object.size; if (object instanceof Array||object instanceof String) return object.length; return Object.keys(object).length; }, deepFreeze (object){ const propNames=Object.getOwnPropertyNames(object); for (const name of propNames){ const value=object[name]; if (value&&typeof value==="object"){ globalThis.BS.deepFreeze(value); } } return Object.freeze(object); }, last(number){ if (number>0) return number - 1; return 0; }, defineProperty(prototype, propertyName, valueCallback, options){ options=options||{ writable: true, enumerable: false, configurable: true }; options.value=valueCallback; Object.defineProperty(prototype, propertyName, options); }, storage: [], }; const BS=globalThis.BS; const TypedArray=Reflect.getPrototypeOf(Int8Array); for (const C of [Array, String, TypedArray]){ BS.defineProperty(C.prototype, "at", function at(n){ n=Math.trunc(n)||0; if (n<0) n +=this.length; if (n<0||n>=this.length) return undefined; return this[n]; }); BS.defineProperty(C.prototype, "last", function last(){ return this[this.length-1]; }); } BS.defineProperty(String.prototype, "noBreaks", function noBreaks(){ return this.replace(/\r\n?/g, ''); }); function list (amount, callback){ let array=[]; for (let i=0; i<amount; i++){ if (typeof callback==='function'){ array.push(callback(i)); } else{ array.push(callback); } } return array; } globalThis.range=function range(start, stop, include=false){ if (stop===undefined){ stop=start; start=0; } if (include){ if (start>stop){ stop--; } else{ stop++} } let i=start; return{ [Symbol.iterator]: ()=>{ return{ next(){ while (i!==stop){ let temp=i; if (start>stop) i--; else i++; return{ value: temp, done: false, } } return{ done: true} } } } } }; const PI=3.141592653589793, E=2.718281828459045, log=()=>console.log.apply(console, arguments), sqrt=Math.sqrt.bind(Math), Time={ get now (){ return Date.now() }, get ms (){ return new Date().getMilliseconds() }, get seconds (){ return new Date().getSeconds() }, get minutes (){ return new Date().getMinutes() }, get hours (){ return new Date().getHours() }, get day (){ return new Date().getDay() }, get month (){ return new Date().getMonth() }, get year (){ return new Date().getFullYear() }, }, sizeof=function sizeof (object){ if (object===void 0||object===null){ throw new TypeError('Cannot convert undefined or null to object'); } if (object instanceof Set||object instanceof Map){ return object.size; } return Object.keys(object).length; }; }).call(this); 

// Your code below this line

({});
(function() {
    var $this = globalThis || window || global || this;
    if ($this.random && $this.random.getRandom) {
        return null;
    }
    if (BS && BS.libs && BS.libs.includes["random"]) {
        return null;
    }
    BS.libs.push("random");

    function expect_array_or_string(value, name) {
        const args = Array.from(arguments);
        if ((!Array.isArray(value) && BS.typeof(value) !== "String")) {
            throw new TypeError("Unexpected type of argument for \"random.${name}\" function. \"array\" or \"string\" was expected");
        }
        if ((value.length == 0)) {
            throw new Error("Unexpected empty array or string for \"random.${name}\" function");
        }
        return value;
    };
    $this.random = ({
        ALPHABET: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        getRandom() {
            return Math.random();
        },
        int(min, max) {
            BS.checkArgType(["Float"], "min", arguments[0] ?? null, 24, 8);
            BS.checkArgType(["Float"], "max", arguments[1] ?? null, 24, 8);
            return Math.floor(random.getRandom() * (Math.round(max) - Math.round(min)) + Math.round(min));
        },
        intInclusive(min, max) {
            BS.checkArgType(["Float"], "min", arguments[0] ?? null, 30, 17);
            BS.checkArgType(["Float"], "max", arguments[1] ?? null, 30, 17);
            return random.int(min, max + 1);
        },
        float(min, max) {
            BS.checkArgType(["Float"], "min", arguments[0] ?? null, 36, 10);
            BS.checkArgType(["Float"], "max", arguments[1] ?? null, 36, 10);
            return random.getRandom() * (max - min) + min;
        },
        floatInclusive(min, max) {
            BS.checkArgType(["Float"], "min", arguments[0] ?? null, 42, 19);
            BS.checkArgType(["Float"], "max", arguments[1] ?? null, 42, 19);
            return random.float(min, max + 1);
        },
        boolean() {
            return random.getRandom() > 0.5;
        },
        element(array) {
            expect_array_or_string(array, "element");
            return array[random.int(0, array.length)];
        },
        string(length) {
            BS.checkArgType(["Int"], "length", arguments[0] ?? null, 55, 11);
            let result = "";
            for (let i of range(0, length, false)) {
                result += random.element(random.ALPHABET);
            }
            return result;
        },
        stringFromSample(sample, length) {
            BS.checkArgType(["String"], "sample", arguments[0] ?? null, 64, 21);
            BS.checkArgType(["Int"], "length", arguments[1] ?? null, 64, 21);
            if ((sample.length == 0)) {
                throw new TypeError("Unexpected type of argument for \"random.stringFromSample\" function. \"string\" was expected");
            }
            let result = "";
            for (let i of range(0, length, false)) {
                result += random.element(sample);
            }
            return result;
        },
        shuffle(array) {
            expect_array_or_string(array, "shuffle");
            let curId = array.length;
            let copy = [];
            if (BS.typeof(array) == "String") {
                copy = array.split("");
            } else {
                copy = array.slice();
            }
            while (0 !== curId) {
                let randId = Math.floor(Math.random() * curId);
                curId -= 1;
                let tmp = copy[curId];
                copy[curId] = copy[randId];
                copy[randId] = tmp;
            }
            if (BS.typeof(array) == "String") {
                return copy.join("");
            }
            return copy;
        },
    });
}).call(this);

console.log(random.int(0, 10));