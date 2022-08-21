if (!globalThis) { globalThis = window || global || this || {}; } try { globalThis.require = require; } catch (err) { globalThis.require = () => undefined; } 
                 
if (!Array.isArray) {Array.isArray=function(arg) {return Object.prototype.toString.call(arg)==='[object Array]';};} globalThis.BS={through (value0, value1, line, col) {if (typeof value0!='number'||typeof value1!='number') {throw new TypeError(`Number is expected on the line ${line}, col ${col}.`);} let output=[]; let min=Math.min(value0, value1); let max=Math.max(value0, value1); for (let i=min; i<=max; i++) {output.push(i);} if (value0!=min) output=output.reverse(); return output;}, sum(value1, value2) {if (Array.isArray(value1)&&Array.isArray(value2)) {return [].concat(value1, value2);} if (Array.isArray(value1)) {return [].concat(value1, value2)} if (BS.typeof(value1)=='Object'&&BS.typeof(value2)=='Object') {return Object.assign({}, value1, value2);} if (value1===null||value1===void 0||value2===null||value2===void 0) {throw new TypeError('"null" or "undefined" cannot be used in math expressions');} if (typeof value1==='string') {if (typeof value2!=='string') {throw new TypeError('String was expected for concatination, got "'+BS.typeof(value2)+'" insetead');} return value1.concat(value2);} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');} return value1 + value2;} throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');}, sub(value1, value2) {if (value1===null||value1===void 0||value2===null||value2===void 0) {throw new TypeError('"null" or "undefined" cannot be used in math expressions');} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');} return value1 - value2;} throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');}, pow(value1, value2) {if (value1===null||value1===void 0||value2===null||value2===void 0) {throw new TypeError('"null" or "undefined" cannot be used in math expressions');} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');} return Math.pow(value1, value2);} throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');}, div(value1, value2) {if (value1===null||value1===void 0||value2===null||value2===void 0) {throw new TypeError('"null" or "undefined" cannot be used in math expressions');} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');} return value1 / value2;} throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');}, mod(value1, value2) {if (value1===null||value1===void 0||value2===null||value2===void 0) {throw new TypeError('"null" or "undefined" cannot be used in math expressions');} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');} return value1 % value2;} throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');}, mul(value1, value2) {if (value1===null||value1===void 0||value2===null||value2===void 0) {throw new TypeError('"null" or "undefined" cannot be used in math expressions');} if (typeof value1==='string') {if (typeof value2!=='number') {throw new TypeError('Number was expected for repeated concatination, got "'+BS.typeof(value2)+'" insetead');} let result=''; for (let i=0; i<value2; i++) {result +=value1;} return result;} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');} return value1 * value2;} throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');}, delete (value, index) {Array.prototype.splice.call(value, index, 1); return value;}, slice (value, start, end, step=1, line, col) {if (!Array.isArray(value)&&typeof value!='string') {throw new TypeError(`Array or string was expected at line ${line}, col ${col}`);} if (typeof start!='number') {throw new TypeError(`Number was expected at line ${line}, col ${col}`);} if (end===null&&step===null) {return value.slice(start);} step=step|0; if (step>=0) step=1; else step=-1; let result=value.slice(start, end); if (step===-1) {if (typeof value==='string') return Array.from(result).reverse().join(''); return result.reverse();} return result;}, customOperators: {}, customTypes: {}, types: {Array (value) {return Array.isArray(value);}, Null (value) {return value===null;}, Undefined (value) {return value===void 0;}, Int (value) {return parseInt(value)===value&&!Number.isNaN(value);}, Float (value) {return typeof value==='number'&&!Number.isNaN(value);}, Number (value) {return typeof value==='number'&&!Number.isNaN(value);}, BigInt(value) {return typeof value==='bigint';}, NaN (value) {return Number.isNaN(value);}, String (value) {return typeof value==='string';}, Function (value) {return typeof value==='function';}, Symbol (value) {return typeof value==='symbol';}, Boolean (value) {return typeof value==='boolean';}, Object(value) {if (BS.types.HTML&&BS.types.HTML(value)) {return false;} return typeof value==='object'&&value!==null;},}, checkArgType(type, name, value, line, col) {if (type in this.customTypes) {let r=BS.customTypes[type]; if (r&&r(value)) return true;} if (type in this.types) {let r=BS.types[type]; if (r&&r(value)) return true;} throw new TypeError(`Argument "${name}" is not type of "${type}" at line ${line}, col ${col}.`);}, convert(value, type, outerType) {let t=this.typeof(value); if (t) t=t.toLowerCase(); let tmp=null; if (typeof type!=='object'&&t==type.toLowerCase()) return value; let gt=function (value, type, outerType) {outerType=outerType||this.typeof(value); switch (type) {case 'Null': return null; case 'Number': case 'Float': tmp=parseFloat(value); if (Number.isNaN(tmp)) return 0; return tmp; case 'Int': return value|0; case 'String': if (t=='html') return JSON.stringify(this.DOMtoJSON(value)); if (t=='array') return value.join(''); if (t=='object') return JSON.stringify(value); if (t=='boolean') return !!value; if (t=='null') return 'null'; if (t=='undefined') return 'undefined'; else return value.toString(); case 'Array': if (t=='undefined'||t=='null') return []; if (t=='html') return Object.values(this.DOMtoJSON(value)); if (t=='object') return Object.values(value); if (t=='string') {try {let z=JSON.parse(t); let v=this.typeof(z)=='array'; if (v) return z; throw 'err';} catch (err) {} return value.split('');} if (t=='number'||t=='int'||t=='float') {return (''+value).split('');} else return [value]; case 'JSON': if (t=='html') return this.DOMtoJSON(value); if (t=='object'||t=='string'||t=='array'||t=='null'||t=='number' ) return value; throw new TypeError(`Cannot convert ${t} to ${type}`); case 'Object': return Object(value); case 'Boolean': return Boolean(value);};}.bind(this); if (typeof type!='string') {let r=value; console.log(type.length); for (let i=0; i<type.length; i++) {r=gt(r, type[i]); console.log({r, type: type[i]}); if (i!=length -1) {if (r.map) {r=r.map(j=>{console.log({each: this.convert(j, type[i+1]), type: type[i+1]}); return this.convert(j, type[i+1]);});}} console.log(r);}}; return gt(value, type);}, typeof (value) {for (let i in this.types) {try {if (this.types[i](value)) return i;} catch (err) {continue}}}, sizeof(object) {if (object===void 0||object===null) return 0; if (object instanceof Set||object instanceof Map) return object.size; if (object instanceof Array||object instanceof String) return object.length; return Object.keys(object).length;}, deepFreeze (object) {const propNames=Object.getOwnPropertyNames(object); for (const name of propNames) {const value=object[name]; if (value&&typeof value==="object") {globalThis.BS.deepFreeze(value);}} return Object.freeze(object);}, last(number) {if (number>0) return number - 1; return 0;}, storage: [],}; const BS=globalThis.BS; const TypedArray=Reflect.getPrototypeOf(Int8Array); for (const C of [Array, String, TypedArray]) {Object.defineProperty(C.prototype, "at", {value: function at(n) {n=Math.trunc(n)||0; if (n<0) n +=this.length; if (n<0||n>=this.length) return undefined; return this[n];}, writable: true, enumerable: false, configurable: true}); Object.defineProperty(C.prototype, "last", {value: function last() {return this[this.length-1];}, writable: true, enumerable: false, configurable: true});} Object.defineProperty(String.prototype, "noBreaks", {value: function noBreaks() {return this.replace(/\r\n?/g, '');}, writable: true, enumerable: false, configurable: true}); function list (amount, callback) {let array=[]; for (let i=0; i<amount; i++) {if (typeof callback==='function') {array.push(callback(i));} else {array.push(callback);}} return array;} function range(start, stop, include=false) {if (stop===undefined) {stop=start; start=0;} if (include) {if (start>stop) {stop--;} else {stop++}} let i=start; 
 return {[Symbol.iterator]:()=>{return {next () {while(i!==stop){let temp=i; if (start>stop) i--; else i++; return {value: temp, done: false,}} return {done: true}}}}}} const PI=3.141592653589793, E=2.718281828459045, log=()=>console.log.apply(console, arguments), sqrt=Math.sqrt.bind(Math), Time={get now () {return Date.now()}, get ms () {return new Date().getMilliseconds()}, get seconds () {return new Date().getSeconds()}, get minutes () {return new Date().getMinutes()}, get hours () {return new Date().getHours()}, get day () {return new Date().getDay()}, get month () {return new Date().getMonth()}, get year () {return new Date().getFullYear()},}, sizeof=function sizeof (object) {if (object===void 0||object===null) {throw new TypeError('Cannot convert undefined or null to object');} if (object instanceof Set||object instanceof Map) {return object.size;} return Object.keys(object).length;}; 


// Your code below this line

var var_name;
if ((function() {
        try {
            var_name
        } catch (e) {
            return false;
        }
        return true;
    })()) {
    console.log("var_name is defined");
} else {
    console.log("var_name is not defined");
}
var existing_var = 10;
console.log((function() {
    try {
        existing_var.non_existing_property.another_non_existing_property
    } catch (e) {
        return undefined;
    }
    return existing_var.non_existing_property.another_non_existing_property;
})());
console.log((function() {
    try {
        existing_var
    } catch (e) {
        return undefined;
    }
    return existing_var;
})());
console.log(((((function() {
    try {
        I_dont_exist
    } catch (e) {
        return undefined;
    }
    return I_dont_exist;
})()) === null) || ((function() {
    try {
        I_dont_exist
    } catch (e) {
        return undefined;
    }
    return I_dont_exist;
})()) === void(0)) ? "I_dont_exist is not defined" : (function() {
    try {
        I_dont_exist
    } catch (e) {
        return undefined;
    }
    return I_dont_exist;
})());
console.log((function() {
    try {
        non_existing_var
    } catch (e) {
        return undefined;
    }
    return non_existing_var;
})());