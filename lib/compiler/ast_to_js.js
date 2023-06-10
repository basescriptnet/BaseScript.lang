let inspect = require('util').inspect;
let slice = (array, start, end) => Array.prototype.slice.call(array, start, end);
const getRandomName = () => '___' + Math.random().toString(36).substring(2, 15) + '___'
const isBrowser = typeof window !== 'undefined' && globalThis === window;
class Scopes {
    constructor() {
        this.last = this;
        this.variables = {};
        this.scopes = [];
        this.isGlobal = true;
    }
    has(identifier) {
        if (this.variables.hasOwnProperty(identifier)) {
            return true;
        }
        return false;
    }
    new(level, parent = scopes) {
        let scope = new Scope(level, parent);
        parent.scopes.push(scope);
        scopes.last = scope;
        return scope;
    }
    remove() {
        let last = this.last;
        if (last === this.parent) return;
        if (last) {
            let parent = last.parent;
            if (parent) {
                this.last = parent;
            } else {
                this.last = scopes;
            }
        }
        // parent remove
        if (this.last) {
            let index = this.last.scopes.indexOf(last);
            this.last.scopes.splice(index, 1);
        }
        return last;
    }
    global() {
        let $0 = this.new(0);
        return $0;
    }
}

let features = [
    'topLevelAwait',
    'typeof',
    'sizeof',
    'last',
    'range',
    'complexMath',
    'delete',
    'slice',
    'expect',
    'validateType',
    'convert',
    //'WRITE',
]

global.usedFeatures = {}
features.map(i => usedFeatures[i] = false)

class Scope {
    constructor(level, parent) {
        this.level = level
        this.variables = {}
        this.scopes = []
        this.parent = parent
    }
    has(propertyName) {
        if (this.variables.hasOwnProperty(propertyName)) {
            return true;
        }

        if (this.parent && this.parent !== scopes) {
            return this.parent.has(propertyName);
        }
        return false;
    }
    getScope(propertyName) {
        if (this.variables[propertyName]) {
            return this
        }
        let level = this.level
        if (level == 0 || !this.parent) return null
        return this.parent.getScope(propertyName)
    }
}

const scopes = new Scopes();

function includeFile(includes) {
    let result = '';
    for (let i = 0; i < includes.length; i++) {
        let include = includes[i];

        if (include.value === 'builtins') {
            builtinsAdded = true;
            console.log('[Warning]: <builtins> is deprecated. It will be removed in the future. All necessary builtins are already included.')
            continue;
        }
        if (include.type != 'include' && !(include.value in libs)) {
            // TODO: add support for custom libs
            // libraries, that are not in the libs object
            if (include.value == 'math') {
                useComplexMath = true;
                continue;
            }
            throw new Error(`Unknow library "${include.value} at line ${include.line}, column ${include.col}"`);
        } else if (include.type == 'include') {
            let p = pathJS(pathJS().relative());
            let filename = p.add(include.value);
            //console.log(filename)

            let code = readFileSync(filename, 'utf8');
            let dirs = {
                dirname: p.dir.replace(/\//g, '\\\\'),
                filename: filename.replace(/\//g, '\\\\'),
            }
            modulesBeingProcessed.push(dirs)
            code = parse(to_ast(code));
            modulesBeingProcessed.pop()
            //console.log(code)
            if (typeof code !== 'object') {
                throw new Error(`Error while parsing file "${include.value}" at line ${include.line}, column ${include.col}`);
            }
            code = minify(code.includes) + '\n' + minify(code.result);
            if (include.name) {
                result += `var ${include.name}=`;
            }
            result += `(function(){${code}}).call(this);\n\n`;
            continue;
        }
        let file = libs[include.value];
        if (!file) {
            throw new Error(`Library "${include.value}" not found at line ${include.line}, column ${include.col}"`);
        }
        let filename = pathJS(__dirname).add(file).replace(/\//g, '\\\\');
        let content = readFileSync(filename, 'utf8');
        let p = pathJS(pathJS().relative());
        //let filename = p.add(include.value);
        let dirs = `var __dirname="${p.path.replace(/\//g, '\\\\')}",__filename="${filename.replace(/\//g, '\\\\')}";`;
        if (/\.b(s|m)$/i.test(file)) {
            let code = parse(to_ast(content + '\n'));
            result += `${code.moduleName}(function(){${dirs} ${minify(code.result)}}).call(this);\n\n`;
            continue;
        }
        if (/\.js$/i.test(file)) {
            result += `(function(){${dirs} ${content}}).call(this);\n\n`;
            continue;
        }
        throw new Error(`Unknow library "${include.value} at line ${include.line}, column ${include.col}"`);
    }
    return result;
}

let namespaces = [];
let modulesBeingProcessed = [];
let useComplexMath = false;
let lvl = -1;
let relPath = '';

let minify = function (code) {
    if (!code) return '';
    return code.replace(/[ \t]*\/\/[^\n]*\n*/g, '')
        .replace(/(\r\n?|[ \t])+/g, ' ')
        //.replace(/[ \t]+/g, ' ')
        //.replace(/\{\s+/g, '{')
        //.replace(/\s+\}/g, '}')
        //.replace(/\}\s+/g, '}')
        .replace(/\s*(,|;|\}|\{)\s+/g, '$1 ')
        .replace(/(?:\s*)(==?=?|<=?|>=?|!==?|\+=|\-=|\*=|\/=|\|\||&&)(?:\s*)/g, '$1');
}

const { readFileSync } = require('fs');
const to_ast = require(internalPaths.text_to_ast);
const libs = {
    get random() {
        return '../../bin/builtin/random.bs';
    },
    get HTML() {
        return '../../bin/builtin/HTML.js'
    },
    get builtins() {
        return global.internalPaths.built_in;
    }
};
let builtinsAdded = false;
let isMain = true

function parse(statements, tmp, isReturn, caller, prepend = '') {
    // statememnts must be an array, if no, make it an array
    if (statements === void 0) {
        // something went wrong. This part should never be executed
        throw new Error('[Internal Error]: "statements" is undefined');
    }
    if (!Array.isArray(statements))
        statements = [statements];
    let result = '';
    let argslice = slice(arguments, 1);
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        if (statement == null) {
            result += null;
            break;
        }
        let { value } = statement;
        var r = [];
        switch (statement.type) {
            case 'decorator': {
                var dirs = {};
                let includedCode = '';
                if (isMain) {
                    let p = {}
                    if (!isBrowser) {
                        p = pathJS(pathJS(baseUrl.path).add(baseUrl.filename));
                        let filename = p.filename
                        dirs.dirname = p.dir.replace(/\//g, '\\\\')
                        dirs.filename = filename.replace(/\//g, '\\\\')
                        modulesBeingProcessed.push(dirs)
                    } else {}
                    isMain = false
                }
                //console.log(pathJS().full())
                //console.log(pathJS(baseUrl.path).add(baseUrl.relative), baseUrl.filename)

                if (!isBrowser) {
                    if (statement.includes && statement.includes.length) {
                        let includes = statement.includes;
                        includedCode = includeFile(includes);
                    }
                }
                if (lvl === -1) {
                    relPath = tmp;
                }
                result += parse({
                    type: 'scope',
                    value: value,
                }, '', false, 'global');
                // reset all variables
                // might be unnecessary
                namespaces = [];
                useComplexMath = false;
                //modulesBeingProcessed.pop()
                //console.log(modulesBeingProcessed)

                return {
                    //result: (filename.replace(/\\/g, '/') === pathJS(pathJS(baseUrl.path).add(baseUrl.relative)).add(baseUrl.filename)) ? dirs +
                    result : result,
                    includes: includedCode,
                    //dirs: dirs,
                    builtins: builtinsAdded,
                    usedFeatures: usedFeatures,
                    moduleName: '',
                }
            }
            case 'scope': {
                lvl++;
                let namespace_count = namespaces.length;

                let scope = scopes;
                if (caller !== 'global') {
                    scope = scopes.new(lvl);
                }
                let r = `${parse(value, tmp, isReturn, caller, prepend, scopes)}\n`;
                result += r;
                if (namespace_count < namespaces.length) {
                    namespaces.splice(namespace_count, namespaces.length - namespace_count);
                }
                scopes.remove();
                lvl--;
                break;
            }
            case 'namespace':
                namespaces.push(parse(value));
                break;
            case 'namespace_retraction': {
                usedFeatures.last = true;
                let namespace = namespaces[namespaces.length - 1];
                result += namespace;
                if (statement.retraction_type == 'dot') {
                    result += '.' + parse(value);
                } else if (statement.retraction_type == 'item_retraction') {
                    result += '[' + parse(value) + ']';
                } else if (statement.retraction_type == 'item_retraction_last') {
                    result += `[BS.last(${namespace}.length - 1)]`;
                } else if (statement.retraction_type == 'function_call') {
                    let args = [];
                    for (let i = 0; i < statement.arguments.value.length; i++) {
                        args.push(`${parse(statement.arguments.value[i])}`);
                    }
                    result += `(${args.join(', ')})`;
                }
                break;
            }
            case 'interface': {
                usedFeatures.typeof = true;
                usedFeatures.validateType = true;
                result += `BS.customTypes["${statement.identifier}"] = function ${statement.identifier}(value) {`;
                result += `if (!BS.types.Object(value)) return false;`;
                result += `if (Object.keys(value).length !== ${Object.keys(statement.value).length}) return false;`;
                for (let i in value) {
                    let type = [];
                    for (let j in value[i].value) {
                        type.push(value[i].is_array[j] ? '"' + value[i].value[j] + '[]"' : '"' + value[i].value[j] + '"');
                    }
                    result += `if (!BS.validateType(value["${i}"], BS.ifTypeExists([${type.join(', ')}]), ${value[i].nullable})) {`
                        +'return false;'
                    +'}';
                }
                result += 'return true;';
                result += '};';
                break;
            }
            case 'locator': {
                if (isBrowser) {
                    throw new Error('@dirname and @filename are not supported in the browser');
                }
                let m = modulesBeingProcessed[modulesBeingProcessed.length - 1];
                if (value == 'dirname') {
                    result += `"${m.dirname}"`;
                } else if (value == 'filename') {
                    result += `"${m.filename}"`
                }
                break;
            }
            /* if else */
            case 'if_else':
                if (statement.if.condition.type == 'expression_with_parenthesis') {
                    result += `if ${parse(statement.if.condition)} {${parse(statement.if.value, tmp)}}`;
                } else {
                    result += `if (${parse(statement.if.condition)}) {${parse(statement.if.value, tmp)}}`;
                }
                result += ` else ${parse(statement.else.value, tmp)}`;
                break;
            case 'if':
                if (statement.unless) {
                    result += `if (!(${parse(statement.condition)})) {${parse(value, tmp)}}`;
                    break;
                } else {
                    if (statement.condition.type == 'expression_with_parenthesis') {
                        result += `if ${parse(statement.condition)} {${parse(value, tmp)}}`;
                        break;
                    }
                    result += `if (${parse(statement.condition)}) {${parse(value, tmp)}}`;
                    break;
                }
            case 'else':
                result += `else {${parse(value, tmp)}}`;
                break;
            /* END if else */
            /* keywords */
            case 'new':
            case 'await':
            case 'yield':
                result += `${statement.type} ${parse(value)}`;
                break;
            case 'typeof':
                usedFeatures.typeof = true;
                result += `BS.typeof(${parse(value)})`;
                break;
            case 'sizeof':
                usedFeatures.sizeof = true;
                result += `BS.sizeof(${parse(value)})`;
                break;
            case 'throw':
                result += `throw ${parse(value)};`;
                break;
            case 'global':
                result += `let ${value.value} = (globalThis !== null && globalThis !== void 0) ? globalThis.${value.value} : undefined;\n`
                break;
            /* END keywords */
            case 'nullish_check': {
                let condition = parse(statement.condition);
                let v = parse(value);
                result += `((typeof ${condition}==='null')||typeof ${condition}==='undefined')?${v}:${condition}`;
                break;
            }
            case 'semicolon':
                result += value;
                break;
            /* loops */
            case 'while':
                result += `while (${parse(statement.condition)}) {${parse(value, tmp)}}`;
                break;
            case 'for_loop':
                if (!statement.from) {
                    result += `for (${parse(statement.identifier).replace(';', '')}; ${parse(statement.condition)}; ${parse(statement.change)}) {${parse(value)}}`
                    break;
                }
                usedFeatures.range = true
                var value0 = parse(statement.from);
                var value1 = parse(statement.through);
                if (!/^\d+$/.test(value0) || !/^\d+$/.test(value1)) {
                    usedFeatures.range = true;
                    result += `for (let ${parse(statement.identifier)} of range(${value0}, ${value1}, ${statement.include})) {${parse(value, tmp)}}`
                    break;
                }
                var min = Math.min(value0, value1);
                var max = Math.max(value0, value1);
                var identifier = statement.identifier.value;
                var include = statement.include ? '=' : '';
                if (value0 == max) {
                    result += `for (let ${identifier} = ${max}; ${identifier} > ${include} ${min}; ${identifier}--) {${parse(value, tmp)}}`
                } else {
                    result += `for (let ${identifier} = ${min}; ${identifier} < ${include} ${max}; ${identifier}++) {${parse(value, tmp)}}`
                }
                break;
            case 'for_in':
                result += `for (let ${parse(statement.identifier)} in ${parse(statement.iterable)}) {${parse(value, tmp)}}`
                break;
            case 'for_of':
                usedFeatures.range = true
                result += `for (let ${parse(statement.identifier)} of ${parse(statement.iterable)}) {${parse(value, tmp)}}`
                break;
            case 'for_loop_regular': {
                let identifier;
                if (statement.identifier.type == 'var_assign') {
                    identifier = parse(statement.identifier);
                } else {
                    identifier = `let ${parse(statement.identifier)};`;
                }
                result += `for (${identifier} ${parse(statement.condition)}; ${parse(statement.change)}) {${parse(statement.value)}}`
                break;
            }
            /* END loops */
            /* class */
            case 'construct':
                var args = parse(statement.arguments) || ['', ''];
                result += `constructor (${args[0]}) {`
                    + args[1]
                    + parse(value, tmp)
                    + '}';
                break;
            case 'class_declaration':
                result += `class ${parse(statement.identifier)} {`
                    + parse(statement.construct)
                    + `${value ? value.map(i => parse(i)).join('\n') : ''}`
                    + '}';
                break;
            /* END class */
            /* statement */
            case 'break_continue':
                result += `${value};`;
                break;
            case 'swap':
                // tmp -> [a, b] = [b, a]
                result += `(function(){var tmp=${parse(statement.left)};${parse(statement.right)}=${parse(statement.left)};${parse(statement.left)}=tmp;}).call(this);`;
                break;
            case 'return':
                if (value === void 0) {
                    if (tmp === 'void') {
                        value = 'void 0';
                    } else {
                        value = 'null';
                    }
                } else {
                    value = parse(value, tmp, isReturn);
                }
                if (!tmp) {
                    result += `return ${value};`;
                    break;
                }

                if (tmp[0][0] != 'function' && tmp[0][0] != 'def' && tmp[0][0] !== void 0) {
                    if (tmp[0][0] == 'void') {
                        result += `return void(${value});`
                        break;
                    }
                    usedFeatures.expectValue = true;
                    usedFeatures.validateType = true;
                    result += `return BS.expectValue(${value},[${tmp}]);`
                    break;
                }
                result += `return ${value};`
                break;
            case 'statement_value':
                result += `${parse(value, tmp, null, 'statement')};`;
                break;
            case 'delete':
                if (value.type === 'item_retraction') {
                    usedFeatures.delete = true;
                    result += `BS.delete(${parse(value.from)},${parse(value.value)});`;
                    break;
                }
                result += `delete ${parse(value)};`
                break;
            case 'debugger':
                result += 'debugger;';
                break;
            case 'debugging': {
                let args = [];
                let v = '';
                if (value.type == 'arguments') {
                    for (let i = 0; i < value.value.value.length; i++) {
                        args.push(parse(value.value.value[i]));
                    }
                    v = args.join(',');
                } else {
                    v = parse(value);
                }
                if (statement.method == 'log' || statement.method == 'error') {
                    if (statement.conditional) {
                        result += `if(${v}){console.${statement.method}(${v});}`;
                        break;
                    }
                    result += `console.${statement.method}(${v});`
                    break;
                }
                if (value.opening_tag) {
                    result += `(document.body.append(${r}));`
                    break;
                }
                //result += `BS.WRITE(${v});`
                break;
            }
            /* END statement */
            case 'custom_operator':
                result += `BS.customOperators["${parse(statement.operator)}"](${parse(statement.left)}, ${parse(statement.right)})`;
                break;
            case 'operator':
                if (typeof value == 'string') {
                    result += value;
                    break;
                }
                result += parse(value);
                break;
            case 'convert':
                usedFeatures.convert = true;
                usedFeatures.typeof = true;
                if (typeof statement.convert_type.value == 'string') {
                    result += `BS.convert(${parse(value)}, "${statement.convert_type.value}")`
                    break;
                }
                // result += `BS.convert(${parse(value)}, ["Array"${parse(statement.convert_type)}])`
                result += '(()=>{'
                    +`let r = BS.convert(${parse(value)}, "Array");`
                    +`${parse(statement.convert_type)};`
                    +'return r'
                    + '})()';
                break;
            case 'comment':
                result += '\n// ' + value.slice(3).trim() + '\n'
                break;
            case 'dot_retraction_v2': {
                let check = statement.check;
                if (check) {
                    delete statement.check;
                }
                let from = parse(statement.from, ...argslice);
                let v = '';
                if (value.type !== 'identifier') {
                    v = parse(value, ...argslice);
                } else {
                    v = value.value;
                }
                if (!check) {
                    result += `${from}.${v}`;
                    break;
                }
                // TODO: needs a fix later on
                result += `${from} && ${from}.${v}`;
                break
            }
            case 'arrow_array_execution':
                let from = parse(statement.from);
                value = value.value
                if (!value.length) {
                    break
                }
                let randomName = getRandomName()
                result += `(()=>{const ${randomName} = ${from};return [\n`
                for (let i = 0; i < value.length; i++) {
                    let o = value[i]
                    if (['dot_property_addition', 'dot_retraction_v2', 'function_call', 'identifier', 'item_retraction_last', 'item_retraction'].includes(o.type)) {
                        result += `${randomName}.${parse(o, 'arrow_array_execution', false, null, randomName)},\n`;
                    } else {
                        result += `${randomName}[${parse(o, ...argslice)}],\n`;
                    }
                }
                result += `]}).call(this)`;
                break
            case 'dot_property_addition': {
                let from = parse(statement.from);
                let v = '';
                let randomName = getRandomName()
                for (let i in value.value) {
                    let o = value.value[i]
                    if (o.type == 'es6_key_value') {
                        let args = parse(o.arguments) || ['', ''];
                        v += `${randomName}.${i} = function (${args[0]}){`
                            + args[1]
                            + parse(o.value)
                            + '};';
                        continue;
                    }
                    v += `${randomName}.${i}=${parse(o)};`;
                }
                for (let i in value.rest) {
                    let r = value.rest[i];
                    let randomName1 = getRandomName()
                    v += `const ${randomName1} = {...${r}};`
                        + `for (let i in ${randomName1}) {`
                        + `${randomName}[i] = ${randomName1}[i];`
                        + '}';

                }
                result += `(function () {let ${randomName} = ${from}; ${v}\nreturn ${randomName}}).call(this)`;
                break
            }
            case 'ignore':
                break;
            case 'array_slice': {
                usedFeatures.slice = true;
                let v = typeof value == 'string' ? value : parse(value)
                result += `BS.slice(${v}, ${parse(statement.start)}, ${statement.end === null ? null : parse(statement.end)}, ${parse(statement.step)}, ${statement.line}, ${statement.col})`
                break;
            }
            case 'name_list':
                result += `${parse(value)}, ${parse(statement.addition)}`
                break;
            case 'anonymous_function': {
                var types = [];
                let res = ''
                res += `${statement.async ? 'async ' : ''}function ${statement.identifier ? statement.identifier.value : ''}`;
                if (statement.arguments)
                    var t = parse(statement.arguments)
                else var t = ['', ''];
                let use_strict = false;
                let exists = statement.value[0] && statement.value[0].value && statement.value[0].value.value ? statement.value[0].value.value.value : null;
                if (exists && /use strict/.test(exists)) {
                    statement.value = statement.value.slice(1)
                    use_strict = true;
                }
                let returnValue = '';
                let typeArray = [];
                // something here isn't right
                // if def, void or function, then no other inputs present in the array
                if (!['def', 'function', 'void'].includes(statement.declarator.value[0])) {
                    returnValue = 'throw new TypeError("Invalid return type at line ' + statement.line + ', col ' + statement.col + '");';
                    for (let i = 0; i < statement.declarator.value.length; i++) {
                        typeArray.push([`"${statement.declarator.value[i]}${statement.declarator.is_array[i] ? '[]' : ''}"`]);
                    }
                } else {
                    typeArray.push([statement.declarator.value[0], false]);
                }
                res += `(${t.length ? t[0] : ''}) {`
                    +`${use_strict ? '"use strict"' : ''}`
                    + 'const args=Array.from(arguments);'
                    + `${t.length ? t[1] + '\n' : ''}${parse(statement.value, typeArray, false, 'function')}`
                    +`${returnValue}`
                +'}';
                if (statement.identifier) {
                    result += res;
                    break;
                }
                result += `(${res})`;
                break;
            }
            case 'identifier':
                if (typeof value !== 'string') {
                    result += value.value;
                    break;
                }
                result += value;
                break;
            case 'html_string': {
                let v = [];
                for (let i = 0; i < value.length; i++) {
                    if (value[i].type == 'string')
                        v.push(value[i].value);
                    else v.push(value[i].text);
                }
                result += JSON.stringify(v.join(''))
                break;
            }
            case 'function_call': {
                let check = statement.check;
                if (check) {
                    delete statement.check;
                }
                let v = '';
                if (value.type == 'identifier' || value.type == 'keyword') {
                    v += parse(value);
                } else if (value.from && value.type != 'item_retraction' && value.type != 'item_retraction_last') {
                    v += `${parse(value.from, ...argslice)}.`
                }

                if (value.type == 'item_retraction_last') {
                    v += parse(value, ...argslice)
                }
                else if (value && value.value && value.value instanceof Array) {
                    if (value.type == 'array') {
                        v += parse(value, ...argslice)
                    } else {
                        for (let i = 0; i < value.value.length; i++) {
                            v += value.value[i].value;
                            if (i < value.value.length - 1)
                                v += '.';
                        }
                    }
                }
                else if (value.type == 'item_retraction') {
                    v += parse(value, ...argslice)
                }
                else if (typeof value === "object" && value.type != 'identifier') {
                    if (value.type == 'namespace_retraction') {
                        v += parse(value);
                    } else if (value.type === 'expression_with_parenthesis') {
                        v += parse(value);
                    } else if (value.type == 'function_call') {
                        v += parse(value, ...argslice);
                    } else if (value.value && value.value.type != 'identifier') {
                        v += parse(value.value, ...argslice);
                    } else {
                        v += value.value.value;
                    }
                }
                else if (value.type == 'namespace_retraction') {
                    v = parse(value, ...argslice);
                } else {
                    v = '\n' + value;
                }
                result += `${v}`
                // arguments
                if (!statement.arguments.value.length) {
                    result += '()';
                    break;
                }
                result += '(';
                var args = [];
                for (let i = 0; i < statement.arguments.value.length; i++) {
                    args.push(parse(statement.arguments.value[i], ...argslice));
                }
                result += args.join(',');
                result += ')';
                break;
            }
            case 'expression_with_parenthesis':
                if (!statement.arguments) {
                    result += `(${parse(value, ...argslice)})`;
                    break;
                }
                if (value.result) {
                    // statement.type = 'anonymous_function';
                    result += `(${parse(value, ...argslice)})`;
                    if (statement.call_arguments || statement.arguments) {
                        let args = statement.call_arguments || statement.arguments;
                        let v = args.value;
                        var r = [];
                        for (let i = 0; i < v.length; i++) {
                            r.push(parse(args.value[i]));
                        }
                        result += `(${r.join(',')})`;
                    }
                }
                else result += `(${parse(value, ...argslice)})`;
                break;
            case 'value':
                if (typeof value === 'string') {
                    if (statement.left !== void 0) {
                        result += `${parse(statement.left)}${value}${parse(statement.right)}`;
                        break;
                    }
                    result += value;
                } else {
                    result += parse(value, tmp, null, caller);
                }
                break;
            case '@import':
                var r = parse(value).trim();
                if (/\.js"/i.test(r)) {
                    result += readFileSync(r.slice(1, -1), 'utf8');
                    break;
                }
                result += `eval(BS.parse(BS.ast(BS.fs.readFileSync(${r}, 'utf8'))));`;
                break;
            case '@include': {
                var content = readFileSync(relPath.replace(/\\/g, '/') + '/' + parse(value).slice(1, -1), 'utf8');
                // console.log(`${parse(to_ast(content))}`);
                let code = parse(to_ast(content));
                result += `${code.includes}${code.result}`;
                break;
            }
            case 'item_retraction':
                result += `${parse(statement.from)}[${parse(value)}]`;
                if (statement.arguments) {
                    var r = [];
                    for (let i = 0; i < statement.arguments.value.length; i++) {
                        r.push(parse(statement.arguments.value[i]));
                    }
                    result += `(${r.join(',')})`;
                }
                break;
            case 'item_retraction_last':
                usedFeatures.last = true;
                if (prepend) {
                    //console.log(prepend)
                    let r = `${parse(statement.from, ...argslice)}[BS.last(${prepend}.${parse(statement.from, ...argslice)}.length)]`
                    prepend = r
                    result += r;
                } else {
                    result += `${parse(statement.from, ...argslice)}[BS.last(${parse(statement.from, ...argslice)}.length)]`;
                }
                if (statement.arguments) {
                    var r = [];
                    for (let i = 0; i < statement.arguments.value.length; i++) {
                        r.push(parse(statement.arguments.value[i], ...argslice));
                    }
                    result += `(${r.join(',')})`;
                }
                break;
            case 'html_text':
                result += `BS.valueToDOM(${parse(value)})`;
                break;
            case 'html_expression':
                // doesn't work when putting value other than string
                result += `BS.Node("${statement.opening_tag}",`;
                // result += `(() => {let el = document.createElement("${parse(value)}");`;
                if (statement.id) {
                    result += `"${statement.id.value}", `;
                    // result += `el.id = "${statement.id.value}";`;
                } else result += 'null,'
                if (statement.classList) {
                    result += '"'
                    // result += 'el.className = "'
                    for (let i in statement.classList) {
                        result += statement.classList[i].value + ' ';
                    }
                    result = result.trimEnd();
                    result += '",'
                } else result += 'null,';

                if (statement.attributes && statement.attributes.length) {
                    result += '{'
                    for (let i in statement.attributes) {
                        result += statement.attributes[i].identifier.value + ':';
                        result += parse(statement.attributes[i].value) + ',';
                    }
                    result += `},`;
                } else result += 'null,';

                if (value) {
                    // var els = parse(value);
                    for (let i = 0; i < value.length; i++) {
                        r.push(parse(value[i]));
                    }
                    result += `[${r.join(',')}]`;
                    // result += `let children = ${els};`
                    // result += `for (let i = 0; i < children.length; i++) {
                    //     el.append(children[i]);
                    // }`;
                } else result += 'null'
                result += `)`;
                break;
            case 'html':
                    result += `BS.Node("${parse(value)}",`;
                    if (statement.id) {
                        result += `"${statement.id.value}", `;
                    } else result += 'null,'
                    if (statement.classList) {
                        result += '"'
                        for (let i in statement.classList) {
                            result += statement.classList[i].value + ' ';
                        }
                        result = result.trimEnd();
                        result += '",'
                    } else result += 'null,'
                    if (statement.elements) {
                        var els = parse(statement.elements);
                        result += els;
                    } else result += 'null'
                    result += `)`;
                break;
            case 'keyword':
                result += value;
                break;
            case 'es6_key_value':
                var args = parse(statement.arguments)  || ['', ''];
                var key = statement.key.value;
                result += `${key}(${args[0]}){`
                    + args[1]
                    + parse(value)
                    + '}';
                break;
            case 'arguments':
                result += value.join(',');
                break;
            case 'arguments_with_types':
                var types = [];
                var identifiers = statement.identifiers || [];
                var values = statement.values;
                var cancelables = statement.cancelables;
                if (statement.types.length == 0) return '';

                for (let i = 0; i < identifiers.length; i++) {
                    let assign = values[i] ? '=' + parse(values[i], tmp) : '';

                    r.push(`${identifiers[i]}${assign}`);
                    if (statement.types[i][0][0] === 'none') {
                        continue;
                    }
                    let outputType = [];
                    for (let j = 0; j < statement.types[i].length; j++) {
                        let type = statement.types[i][j];
                        if (type[1]) {
                            outputType.push(`"${type[0]}[]"`);
                        } else {
                            outputType.push(`"${type[0]}"`);
                        }
                    }
                    let v = values[i] !== null && values[i] !== void 0 ? parse(values[i]) : `args[${i}]!== null&&args[${i}]!==void 0?args[${i}]:null` // `arguments[${i}] ?? null`;
                    usedFeatures.validateType = true;
                    usedFeatures.checkArgType = true;
                    let chk = `BS.checkArgType([${outputType.join(',')}],"${identifiers[i]}",${v},${statement.line},${statement.col})`;

                    if (cancelables[i]) chk += `&&${parse(identifiers[i])}!==null`;
                    chk += ';';
                    types.push(chk);
                }
                return [r.join(', '), types.length ? types.join('') : '']
            case 'period':
                result += `.`
                break;
            /* expressions and presedence */
            case 'unary_plus_minus':
                result += `${statement.operator}${parse(value)}`;
                break;
            case 'conditional':
                result += `(${parse(statement.condition)}) ? ${parse(statement.true)} : ${parse(statement.false)}`;
                break;
            case 'logical_and':
                result += `${parse(statement.left)} && ${parse(statement.right)}`;
                break;
            case 'logical_or':
                result += `${parse(statement.left)} || ${parse(statement.right)}`;
                break;
            case 'bitwise_and':
                result += `${parse(statement.left)} & ${parse(statement.right)}`;
                break;
            case 'bitwise_or':
                result += `${parse(statement.left)} | ${parse(statement.right)}`;
                break;
            case 'bitwise_xor':
                result += `${parse(statement.left)} ^ ${parse(statement.right)}`;
                break;
            case 'bitwise_not_unary':
                result += `~${parse(statement.value)}`;
                break;
            case 'prefix':
                result += `${statement.operator}${parse(value)}`;
                break;
            case 'postfix':
                result += `${parse(value)}${statement.operator}`;
                break;
            case 'exponentiation':
                if (useComplexMath) {
                    usedFeatures.complexMath = true;
                    result += `BS.operation("**")(${parse(statement.left)},${parse(statement.right)})`;
                    break;
                }
                result += `${parse(statement.left)} ** ${parse(statement.right)}`;
                break;
            case 'delete_unary':
                result += `delete ${parse(value)}`;
                break;
            case 'void_unary':
                result += `void(${parse(value)})`;
                break;
            case 'unary_keyword':
                result += `${statement.operator} ${parse(value)}`;
                break;
            case 'relational': {
                let r = `${parse(statement.left)} ${statement.operator} ${parse(statement.right)}`;
                if (statement.reversed) {
                    r = `!(${r})`;
                }
                result += r;
                break;
            }
            case 'condition_destructive': {
                let r = '';
                for (let i = 0, len = statement.right.value.length; i < len; i++) {
                    r += `${parse(statement.left)} ${statement.operator} ${parse(statement.right.value[i])}`;
                    if (['!=', '!==', '==', '==', 'in', 'instanceof'].includes(statement.operator)) {
                        if (i < len - 1)
                            r += ' || ';
                    } else {
                        if (i < len - 1)
                            r += ' && ';
                    }
                }
                if (statement.reversed) {
                    r = `!(${r})`;
                }
                result += r;
                break;
            }
            case 'shift':
            case 'equality':
                result += `${parse(statement.left)} ${statement.operator} ${parse(statement.right)}`;
                break;
            case 'multiplicative':
            case 'additive':
                if (useComplexMath) {
                    usedFeatures.complexMath = true;
                    result += `BS.operation("${statement.operator}")(${parse(statement.left)},${parse(statement.right)})`;
                    break;
                }
                result += `${parse(statement.left)} ${statement.operator} ${parse(statement.right)}`;
                break;
            case 'reversed_unary':
                result += `!${parse(statement.value)}`;
                break;
            case 'placeholder':
                result += 'null'// `BS.placeholder`;
                break;
            case 'pipeback':
                if (statement.left.type === 'function_call') {
                    let args = statement.left.arguments.value;
                    let placeholders = false;
                    for (let i = 0; i < args.length; i++) {
                        if (args[i].type == 'placeholder') {
                            args[i] = statement.right;
                            placeholders = true;
                        }
                    }
                    if (placeholders) {
                        result += parse(statement.left);
                    } else {
                        args.unshift(statement.right);
                        result += parse(statement.left);
                    }
                    break;
                }
                result += `${parse(statement.left)}(${parse(statement.right)})`;
                break;
            case 'pipeforward':
                if (statement.right.type === 'function_call') {
                    let args = statement.right.arguments.value;
                    let placeholders = false;
                    for (let i = 0; i < args.length; i++) {
                        if (args[i].type == 'placeholder') {
                            args[i] = statement.left;
                            placeholders = true;
                        }
                    }
                    if (placeholders) {
                        result += parse(statement.right);
                    } else {
                        args.unshift(statement.left);
                        result += parse(statement.right);
                    }
                    break;
                }
                result += `${parse(statement.right)}(${parse(statement.left)})`;
                break;
            /* END expressions and presedence*/
            case 'expression_short_equation':
                result += `${parse(statement.left)} ${statement.operator} ${parse(statement.right)}`;
                break;
            /* blocks */
            case 'switch*': {
                result += `(function () {`;
                result += `switch (${parse(statement.value)}) {`;
                for (let i = 0; i < statement.cases.length; i++) {
                    result += parse(statement.cases[i]);
                }
                result += `}})()`;
                break;
            }
            case 'case_with_break':
                result += `case ${parse(statement.value)}:`;
                result += `return ${parse(statement.statements)};`;
                //result += `break;`;
                break;
            case 'case_singular':
                result += `case ${parse(statement.value)}:`;
                break;
            case 'case_default_singular':
                result += `default: return ${parse(statement.value)};`;
                break;
            case 'case':
                result += `case ${parse(value, tmp, isReturn)}:`;
                for (let i = 0; i < statement.statements.length; i++) {
                    result += parse(statement.statements[i], tmp, isReturn);
                }
                break;
            case 'broken_case':
                result += `case ${parse(value, tmp, isReturn)}:`;
                for (let i = 0; i < statement.statements.length; i++) {
                    result += parse(statement.statements[i], tmp, isReturn);
                }
                result += `break;`;
                break;
            case 'case_default':
                result += `default:`;
                for (let i = 0; i < statement.value.length; i++) {
                    result += parse(statement.value[i], tmp, isReturn);
                }
                break;
            case 'switch':
                result += `switch (${parse(value, tmp, isReturn)}) {`;
                for (let i = 0; i < statement.cases.length; i++) {
                    result += parse(statement.cases[i], tmp, isReturn);
                }
                if (statement.default) {
                    result += parse(statement.default, tmp, isReturn);
                }
                result += '\n}'
                break;
            case 'try':
                result += `try {${parse(statement.value)}}`
                break;
            case 'catch':
                result += `catch (${statement.identifier}) {${parse(statement.value)}}`
                break;
            case 'finally':
                result += `finally {${parse(value, tmp)}}`
                break;
            case 'try_catch':
                result += `${parse(statement.value)}${statement.catch ? parse(statement.catch) : 'catch (err) {console.warn(err)}'}`
                break;
            case 'try_catch_finally':
                result += `${parse(statement.value)}${statement.finally ? parse(statement.finally) : ''}`
                break;
            case 'with':
                result += `with (${parse(statement.obj)}) {${parse(statement.value, tmp)}}`
                break;
            case 'type_declaration':
                var t = parse(statement.arguments) || ['', ''];
                result += `BS.customTypes["${parse(statement.identifier)}"] = function (${t[0]}, required = false) {
                    ${t[1]}
                    if (required && typeof arguments[0] === void 0) {
                        throw new TypeError("Missing argument at ${statement.line}:${statement.col}");
                    }
                    ${parse(value)}
                };`;
                break;
            case 'operator_declaration':
                var t = parse(statement.arguments) || ['', ''];
                result += `BS.customOperators["${parse(statement.identifier)}"] = function (${t[0]}, required = false) {
                    ${t[1]}
                    if (required && typeof arguments[0] === void 0) {
                        throw new TypeError("Missing argument at ${statement.line}:${statement.col}");
                    }
                    ${parse(value)}
                };`;
                break;
            /* END blocks */
            /* primitives */
            case 'array':
                result += '[';
                for (let i = 0; i < value.length; i++) {
                    result += parse(value[i]);
                    if (i !== value.length - 1)
                        result += ',';
                }
                result += ']';
                break;
            case 'array_through':
                usedFeatures.through = true;
                result += `BS.through(${parse(value[0])}, ${parse(value[1])}, ${statement.line}, ${statement.col})`;
                break;
            case 'number':
            case 'bigInt':
            case 'regexp':
            case 'boolean':
                result += value;
                break;
            case 'string':
                if (/\r\n/.test(value) || /\$\{/.test(value)) {
                    result += `${statement.quoteType}${value.replace(/\'/g, '\x27').replace(/"/g, '\x22')/*.replace(/(?:(?:[^\$\\]|(?:\\\\|\\\$)+)(\$))([A-Za-z$_][A-Za-z$_0-9]*)/gmi, `" + $2 + "`)*/.replace(/\`/g, '\x60')}${statement.quoteType}`
                    break;
                }
                //result += JSON.stringify(value)
                result += `${statement.quoteType}${value.replace(/\'/g, '\x27').replace(/"/g, '\x22')/*.replace(/(?:(?:[^\$\\]|(?:\\\\|\\\$)+)(\$))([A-Za-z$_][A-Za-z$_0-9]*)/gmi, `" + $2 + "`)*/.replace(/\`/g, '\x60')}${statement.quoteType}`//value.indexOf('$') > -1 ? `\`${value}\`` : `${JSON.stringify(value)}`;
                break;
            case 'null':
                result += null;
                break;
            case 'new.target':
                result += 'new.target';
                break;
            case 'safeValue':
                let v = '';
                if (value.value.length < 1) {
                    throw new Error('safeValue() must have at least one argument');
                }
                v += parse(value.value[0], tmp);
                result += `(function () { try { ${v} } catch (e) { return void(0); } return ${v}; })()`;
                break;
            case 'defined':
                result += `(function () { try { ${parse(value)} } catch (e) { return false; } return true; })()`;
                break;
            case 'object':
                result += '({';
                for (let i in value) {
                    if (value[i].type == 'es6_key_value') {
                        result += `${parse(value[i])},`;
                    } else if (value[i].type == 'string') {
                        result += `"${i}":${parse(value[i])},`;
                    } else {
                        result += `${i}:${parse(value[i])},`;
                    }
                }
                for (let i in statement.rest) {
                    let r = statement.rest[i];
                    result += `...${parse(r)},`;
                }
                result += '})';
                break;
            /* END primitives */
            /* vars */
            case 'var_assign':
                if (statement.use_const || tmp === 'const' || statement.type_text == 'const') {
                    result += `const ${parse(value, 'const')};\n`;
                    break;
                }
                var prepend = statement.use_let ? 'let' : ''
                var type = typeof statement.type_text === 'string' ? statement.type_text : statement.type_text.value
                if (statement.type_text.type != 'escape') {
                    prepend = typeof statement.type_text === 'string' ? statement.type_text : ''
                    if (statement.type_text) {
                        prepend = 'let';
                    }
                }
                let pr = prepend;
                if (caller == 'global' || caller == 'function')
                    pr = 'var';
                if (typeof pr !== 'string') {
                    pr = 'let';
                }
                // here
                let variables = {};
                if (value.type == 'var_assign_group') {
                    let group = value.value;
                    for (let i = 0; i < group.length; i++) {
                        let item = group[i];
                        let name = item.identifier
                        let type = item.type;

                        if (type == 'var_reassign') {
                            variables[name.value] = true
                        } else if (type == 'identifier') {
                            variables[item.value.value] = true
                        }
                    }
                }
                scopes.last.variables = { ...scopes.last.variables, ...variables };

                result += `${pr} ${parse(value, type, prepend && prepend.trim ? prepend.trim() : prepend)};\n`;
                break;
            case 'var_assign_group':
                if (!!value.value) value = value.value;
                for (let i = 0; i < value.length; i++) {
                    r.push(`${parse(value[i], tmp, isReturn)}`);
                }
                if (statement.identifier) {
                    result += `${statement.identifier.value}=${r.join()}`
                    break;
                }
                // ! will need a check if type provided
                result += `${r.join()}`;
                break;
            case 'var_reassign': {
                let v = parse(statement.value, tmp);
                if (tmp == 'const') {
                    result += `${statement.identifier.value}=${v}`;
                    break;
                }
                //return `${statement.identifier.value} = BS.deepFreeze(${v})`;
                if (typeof statement.identifier.value != 'string') {
                    result += `${parse(statement.identifier)}=${v}`;
                    break;
                }
                if (value === void 0) {
                    //if (!scopes.last.has(statement.identifier.value)) {
                    //    scopes.last.variables[statement.identifier.value] = true;
                    //}
                    result += statement.identifier.value;
                    break;
                }
                if (tmp && tmp.toLowerCase && tmp.toLowerCase() != tmp) {
                    console.log(tmp.toLowerCase())
                    usedFeatures.expect = true;
                    usedFeatures.typeof = true;
                    result += `${statement.identifier.value}=BS.expect("${statement.identifier.value}",${v},"${tmp}")`;
                    break;
                }
                //if (!scopes.last.has(statement.identifier.value)) {
                //    scopes.last.variables[statement.identifier.value] = true;
                //}
                result += `${statement.identifier.value}=${v}`;
                break;
            }
            /* END vars */
            case undefined: // whitespace
                break;
            default:
                result += '/* Unhandled expression: '+inspect(statement)+' */'
        }
    }
    return result.trim();
}

module.exports = parse;
