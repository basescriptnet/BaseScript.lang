if (!globalThis) { globalThis = window || global || this || {}; } try { globalThis.require = require; } catch (err) { globalThis.require = () => undefined; }  
if (!Array.isArray) {Array.isArray=function(arg) {return Object.prototype.toString.call(arg)==='[object Array]';};} globalThis.BS={var(name, type, value) {if (BS.getType(value)!==type) throw new TypeError(`Variable "${name}" is required to be "${type}", got "${BS.getType(value)}" instead.`); return new Variable(name, type, value);}, setValue(name, oldValue, value) {if (oldValue instanceof Variable) {oldValue.valueOf=value; return oldValue;} return value;}, through (value0, value1, line, col) {if (typeof value0!='number'||typeof value1!='number') {throw new TypeError(`Number is expected on the line ${line}, col ${col}.`);} let output=[]; let min=Math.min(value0, value1); let max=Math.max(value0, value1); for (let i=min; i<=max; i++) {output.push(i);} if (value0!=min) output=output.reverse(); return output;}, delete (value, index) {Array.prototype.splice.call(value, index, 1); return value;}, slice (value, start, end, step=1, line, col) {if (!Array.isArray(value)&&typeof value!='string') {throw new TypeError(`Array or string was expected at line ${line}, col ${col}`);} if (typeof start!='number') {throw new TypeError(`Number was expected at line ${line}, col ${col}`);} if (end===null&&step===null) {return value.slice(start);} step=step|0; if (step>=0) step=1; else step=-1; let result=value.slice(start, end); if (step===-1) {if (typeof value==='string') return Array.from(result).reverse().join(''); return result.reverse();} return result;}, customTypes: {}, types: {Array (value) {return Array.isArray(value);}, Null (value) {return value===null;}, Undefined (value) {return value===void 0;}, Int (value) {return parseInt(value)===value&&!Number.isNaN(value);}, Float (value) {return typeof value==='number'&&!Number.isNaN(value);}, Number (value) {return typeof value==='number'&&!Number.isNaN(value);}, BigInt(value) {return typeof value==='bigint';}, NaN (value) {return Number.isNaN(value);}, String (value) {return typeof value==='string';}, Function (value) {return typeof value==='function';}, Symbol (value) {return typeof value==='symbol';}, Boolean (value) {return typeof value==='boolean';}, Object(value) {if (BS.types.HTML&&BS.types.HTML(value)) {return false;} return typeof value==='object'&&value!==null;},}, checkArgType(type, name, value, line, col) {if (type in this.customTypes) {let r=BS.customTypes[type]; if (r&&r(value)) return true;} if (type in this.types) {let r=BS.types[type]; if (r&&r(value)) return true;} throw new TypeError(`Argument "${name}" is not type of "${type}" at line ${line}, col ${col}.`);}, convert(value, type, outerType) {let t=this.getType(value); if (t) t=t.toLowerCase(); let tmp=null; if (typeof type!=='object'&&t==type.toLowerCase()) return value; let gt=function (value, type, outerType) {outerType=outerType||this.getType(value); switch (type) {case 'Number': case 'Float': tmp=parseFloat(value); if (isNaN(tmp)) return 0; return tmp; case 'Int': return value|0; case 'String': if (t=='html') return JSON.stringify(this.DOMtoJSON(value)); if (t=='array') return value.join(''); if (t=='object') return JSON.stringify(value); if (t=='boolean') return !!value; if (t=='null') return 'null'; if (t=='undefined') return 'undefined'; else return value.toString(); case 'Array': if (t=='undefined'||t=='null') return []; if (t=='html') return Object.values(this.DOMtoJSON(value)); if (t=='object') return Object.values(value); if (t=='string') {try {let z=JSON.parse(t); let v=this.getType(z)=='array'; if (v) return z; throw 'err';} catch (err) {} return value.split('');} if (t=='number'||t=='int'||t=='float') {return (''+value).split('');} else return [value]; case 'JSON': if (t=='html') return this.DOMtoJSON(value); if (t=='object'||t=='string'||t=='array'||t=='null'||t=='number' ) return value; throw new TypeError(`Cannot convert ${t} to ${type}`); case 'Object': return Object(value); case 'Boolean': return Boolean(value); case 'List': let ul=document.createElement('ul'); if (t=='object'||t=='array'||t=='html') {for (let i in value) {let li=document.createElement('li'); if (t=='object') {let span=document.createElement('span'); span.className='convert_key'; span.innerText=i; li.append(span); li.appendChild(document.createTextNode(': '));} let span=document.createElement('span'); span.className='convert_value'; let ty=this.getType(value[i]); if (ty=='String'||ty=='Number'||ty=='Int'||ty=='Float') {if (outerType=='Array') {let li2=document.createElement('li'); li2.innerText=gt(value[i], type, outerType); if (ty=='String') li2.innerText=`"${li2.innerText}"`; span.append(li2);} else {span.innerText=`"${value[i]}"`;}} else if (ty=='Array') {span.append('['); span.append(gt(value[i], type, 'Array')); span.append(']');} else if (ty=='Object') {span.append(gt(value[i], type));} else span.innerText=`${value[i]}`; span.className +=` ${ty}`; li.append(span); ul.append(li);} return ul;} else if (t=='int'||t=='float'||t=='string'||null) {let li=document.createElement('li'); li.textContent=value; ul.append(li);} return ul;};}.bind(this); if (typeof type!='string') {let r=value; console.log(type.length); for (let i=0; i<type.length; i++) {r=gt(r, type[i]); console.log({r, type: type[i]}); if (i!=length -1) {if (r.map) {r=r.map(j=>{console.log({each: this.convert(j, type[i+1]), type: type[i+1]}); return this.convert(j, type[i+1]);});}} console.log(r);}}; return gt(value, type);}, getType (value) {for (let i in this.types) {try {if (this.types[i](value)) return i;} catch (err) {continue}}}, sizeof(object) {if (object instanceof Set||object instanceof Map) return object.size; if (object instanceof Array||object instanceof String) return object.length; if (object instanceof Object) return Object.keys(object).length; if (object===void 0||object===null) {return 0;} return Object.keys(object).length;}, deepFreeze (object) {const propNames=Object.getOwnPropertyNames(object); for (const name of propNames) {const value=object[name]; if (value&&typeof value==="object") {globalThis.BS.deepFreeze(value);}} return Object.freeze(object);}, last(number) {if (number>0) return number - 1; return 0;}, storage: [], defineProperty(prototype, propertyName, valueCallback, options) {options=options||{writable: true, enumerable: false, configurable: true}; options.value=valueCallback; Object.defineProperty(prototype, propertyName, options);}, Object(object) {return object;}, Array(array) {if (array instanceof Array===false) array=BS.convert(array, 'Array'); let o=Object.create(null); let proto=['push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'join', 'sort', 'map', 'forEach', 'indexOf', 'at', 'includes']; for (let i in proto) {BS.defineProperty(o, proto[i], function () {return Array.prototype[proto[i]].apply(this, arguments);});} array.__proto__=o; return array;},}; const BS=globalThis.BS; const TypedArray=Reflect.getPrototypeOf(Int8Array); for (const C of [Array, String, TypedArray]) {BS.defineProperty(C.prototype, "at", function at(n) {n=Math.trunc(n)||0; if (n<0) n +=this.length; if (n<0||n>=this.length) return undefined; return this[n];}); BS.defineProperty(C.prototype, "last", function last() {return this[this.length-1];});} BS.defineProperty(String.prototype, "noBreaks", function noBreaks() {return this.replace(/\r\n?/g, '');}); function list (amount, callback) {let array=[]; for (let i=0; i<amount; i++) {if (typeof callback==='function') {console.log(i); array.push(callback(i));} else {array.push(callback);}} return array;} const log=(...args)=>console.log(...args), sizeof=function sizeof (object) {if (object===void 0||object===null) {throw new TypeError('Cannot convert undefined or null to object');} if (object instanceof Set||object instanceof Map) {return object.size;} return Object.keys(object).length;}; function clear_function_value(v) {if (typeof v!=='function') return v; let r=Object.create(null); r.name=v.name; r.value=v.value.toString(); r.type='function'; return r;} function get_clear_value(v) {if (typeof v!='object'||v===null||v.constructor=='Date') {return v;} let r=Object.create(null); if (BS.getType(v)=='Array') {r=BS.Array([]);} for (let i in v) {if (v[i] instanceof Variable) {if (v[i].name=='this') continue; else r[i]=v[i].value;} else if (BS.getType(v[i])=='Object'&&v[i].constructor=='Date') {r[i]=get_clear_value(v[i]);} else {r[i]=v[i];}} return r;} function $get(object, property, unclearValue) {if (object===null||object===void 0) {throw new TypeError(`Cannot read properties of "null"`);} let v=object[property]; if (v!==void 0) {if (v instanceof Variable) {return v.value;} if (BS.getType(v)=='Object') {if (unclearValue) return v; return get_clear_value(v);} return v;} return null;} function $free(object, scope) {if (scope) {if (!object) {throw new TypeError(`Attempt to delete non-existing variable`);} scope.delete(object); return;}} function $delete(object, property) {if (object===null||object===void 0) {throw new TypeError(`Cannot read or delete properties of "null"`);} let type=BS.getType(object); if (type!='Array'&&type!='Object') {throw new TypeError(`Attempt to change immutable objects"`);} if (type=='Array'||type=='String') {if (isNaN(parseInt(property))) {return object;} try {object.splice(property, 1);} finally {return object;}} delete object[property]; return object;} function $return(localScope, globalScope, value) {$clearScope(localScope, globalScope); return value;} function $clearScope(localScope, globalScope) {localScope.scopes.pop(); globalScope.scopes.pop();} function $add(value1, value2) {if (Array.isArray(value1)&&Array.isArray(value2)) {return [].concat(value1, value2);} if (Array.isArray(value1)) {return [].concat(value1, value2)} if (BS.getType(value1)=='Object'&&BS.getType(value2)=='Object') {return Object.assign({}, value1, value2);} if (value1===null||value2===null) {throw new TypeError('"null" cannot be used as in math expressions');} if (typeof value1==='string') {if (typeof value2!=='string') {throw new TypeError('String was expected for concatination, got "'+BS.getType(value2)+'" insetead');} return value1 + value2;} if (typeof value1==='number') {if (typeof value2!=='number') {throw new TypeError('Number was expected for math expression, got "'+BS.getType(value2)+'" insetead');} return value1 + value2;} return value1 + value2;} function $update(obj, property, value) {if (!property in obj) {throw new Error(`Property "${property}" is not found`);} return obj[property]=value;} function $new(value) {return new value;}const range=function range(start, stop, include=false) {if (stop===undefined) {stop=start; start=0;} if (include) {if (start>stop) {stop--;} else {stop++;}} let i=start; 
 return {[Symbol.iterator]: ()=>{return {next() {while (i!==stop) {let temp=i; if (start>stop) i--; else i++; return {value: temp, done: false,}} return {done: true};}}}}}; const isNaN=function isNaN(number) {return typeof number=='number'&&number!==number;}; const BUILT_IN_VALUES={Infinity: Infinity, NaN: NaN, range: range, 
 isNaN: isNaN, 
 empty: function empty(object) {if (['array', 'string', 'object'].includes(typeof object)) {return Object.keys(object).length==0;} throw new TypeError(`Unexpected type of argument for "empty" function. "array", "string" or "object" was expected`)}, round: function round(object) {return Math.round(object)},}; class Variable {constructor(name, type, value, constant=false, ignoreError=false) {this.name=name; this.type=type; this.value=value===void 0 ? null : value; this.constant=constant; this.ignoreError=ignoreError;} set realValue(value) {if (this.constant&&!this.ignoreError) {throw new Error(`Attempt to change value of constant "${this.name}"`)} else if (this.constant) {return this.value;} if (this.type=='let'||this.type=='\\' ) return this.value; if (this.type!==null&&BS.getType(value)!=this.type) {throw new TypeError(`Assignment of a different type to variable "${this.name}" rather than "${this.type}" is prohibited`);} this.value=value;} get realValue () {return this.value;} update(operator, value) {this.value=eval('this.value' + operator + 'value');}} class Scopes {constructor() {this.scopes=[]; this.globalScope=null;} new(level, parent=this) {let scope=new Scope(level, parent); parent.scopes.push(scope); return scope;} global() {let $0=this.new(0); $0.set('this', $0.variables, true, true, true); $0.init(BUILT_IN_VALUES); this.globalScope=$0; return $0;} append_to_global(object) {for (let i in object) {this.globalScope.set(i, object[i], true, true); BUILT_IN_VALUES[i]=object[i];}}} class Scope {constructor(level, parent) {this.level=level; this.variables={}; this.scopes=[]; this.parent=parent;} get(propertyName, unclearValue) {if (this.variables[propertyName]!==void 0) {if (unclearValue) return this.variables[propertyName].value; return this.variables[propertyName].realValue;} let level=this.level; if (level==0||!this.parent) {console.warn(`Variable "${propertyName}" has never been declared. "null" is returned instead.`); return null;} return this.parent.get(propertyName);} getScope(propertyName) {if (this.variables[propertyName]) {return this;} let level=this.level; if (level==0||!this.parent) return null; return this.parent.getScope(propertyName);} init(values) {for (let i in values) {this.set(i, values[i], true, true);}} set(propertyName, value, local=false, constant=false, ignoreError=false) {if (local||constant) {let v=this.variables[propertyName]; if (!v) {this.variables[propertyName]=new Variable(propertyName, null, value, constant, ignoreError)} else {this.variables[propertyName].realValue=value;} return null;} let scope=this.getScope(propertyName); if (scope==null) {scope=this;} let v=scope.variables[propertyName]; if (!v) {scope.variables[propertyName]=new Variable(propertyName, null, value, constant);} else {scope.variables[propertyName].realValue=value;} return null;} delete(propertyName) {if (typeof propertyName!='string') {for (let i in this.variables) {if (this.variables[i].value==propertyName) {delete this.variables[i]; return true;}}} if (this.variables[propertyName]) {delete this.variables[propertyName]; return true;} let level=this.level; if (level==0||!this.parent) return false; return this.parent.delete(propertyName);}} const scopes=new Scopes(); const $0=scopes.global(); 
// your code below this line

(function() {
    class date {
        constructor() {}
        get now() {
            return Date.now()
        }
        // !TODO: implement
        //setDate(value) {
        //    if (typeof value != 'object' || value.constructor != Object) {
        //        throw TypeError('setDate() expects an object.')
        //    }
        //    for (let i in value) {
        //        if (typeof value[i] != 'number' || value[i] < 0 || isNaN(value[i])) {
        //            throw TypeError('setDate() expects an object with positive number values.')
        //        }
        //    }
        //    let _date = new Date();
        //    if (value.hasOwnProperty('year')) {
        //        _date.setFullYear(value.year);
        //    }
        //    if (value.hasOwnProperty('month')) {
        //        _date.setMonth(value.month);
        //    }
        //    if (value.hasOwnProperty('day')) {
        //        _date.setDate(value.day);
        //    }
        //    if (value.hasOwnProperty('hours')) {
        //        _date.setHours(value.hours);
        //    }
        //    if (value.hasOwnProperty('minutes')) {
        //        _date.setMinutes(value.minutes);
        //    }
        //    if (value.hasOwnProperty('seconds')) {
        //        _date.setSeconds(value.seconds);
        //    }
        //    if (value.hasOwnProperty('milliseconds')) {
        //        _date.setMilliseconds(value.milliseconds);
        //    }
        //    _date.prototype = date
        //    return _date;
        //}
        get ms() {
            return new Date().getMilliseconds()
        }
        get seconds() {
            return new Date().getSeconds()
        }
        get msInSecond() {
            return 1000
        }
        get minutes() {
            return new Date().getMinutes()
        }
        get msInMinute() {
            return 60000
        }
        get hours() {
            return new Date().getHours()
        }
        get msInHour() {
            return 3600000
        }
        get day() {
            return new Date().getDay()
        }
        get msInDay() {
            return 86400000
        }
        get month() {
            return new Date().getMonth()
        }
        get msInMonth() {
            return 2628000000
        }
        get year() {
            return new Date().getFullYear()
        }
        get msInYear() {
            return 31536000000
        }
    };
    scopes.append_to_global({
        Date: new date()
    });
})();
(function() {
    console.log(get_clear_value($get($0.get("Date"), "now")));
    console.log(get_clear_value($get($0.get("Date"), "year")));
    console.log(get_clear_value($get($0.get("Date"), "msInYear")));
})();