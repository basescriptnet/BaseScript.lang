// scopes unused now
//function Scope(parent, level) {
//    this.Map = new Map();
//    this.subScopes = [];
//    this.parent = parent;
//    this.level = level || 0;
//    this.clear = this.Map.clear.bind(this.Map);
//    this.get = this.Map.get.bind(this.Map);
//    this.set = (key, value) => {
//        this.lastUsed.Map.set(key, value);
//        return this;
//    };
//    this.lastUsed = this;
//    this.createScope = () => {
//        this.subScopes.push(new Scope(this, this.level + 1));
//        this.lastUsed = this.subScopes[this.subScopes.length - 1];
//        return this.lastUsed;
//    };
//    this.has = (key) => {
//        if (this.Map.has(key)) return true;
//        if (this.parent) {
//            return this.parent.has(key);
//        }
//        return false;
//    }
//    this.pop = () => {
//        this.subScopes.pop();
//        this.lastUsed = this.subScopes[this.subScopes.length - 1] || this;
//    }
//};
//let scopes = new Scope(); // is mostly changed in the var.js file
let namespaces = [];
let lvl = -1;

const fs = require('fs');
const to_ast = require('./text_to_ast.js');
const parsersObject = {
    parseMath: './parse/math.js',
    parseIf: './parse/if.js',
    parseKeyword: './parse/keyword.js',
    parseLoop: './parse/loop.js',
    parseBlock: './parse/block.js',
    parsePrimitive: './parse/primitive.js',
    parseVar: './parse/var.js',
    parseStatement: './parse/statement.js',
    init() {
        for (let i in this) {
            if (typeof this[i] === 'string') {
                this[i] = require(this[i])(parse/*, scopes*/);
            }
        }
        delete this.init;
        this.findMatch = (statement, tmp, isReturn, caller, prepend, scopes) => {
            for (let i in this) {
                if (!this[i].supported) continue;
                if (this[i].supported.indexOf(statement.type) !== -1) {
                    return this[i].parse(statement, tmp, isReturn, caller, prepend, scopes);
                }
            }
        }
        return this;
    }
}.init();
const libs = {
    get random() {
        return 'builtin/random.js';
    },
    get HTML() {
        return 'builtin/HTML.js'
    }
};

function parse (statements, tmp, isReturn, caller, prepend = '', scope) {
    // statememnts must be an array, if no, make it an array
    if (statements === void 0) {
        // something went wrong. This part should never be executed
        throw new Error('[Internal Error]: "statements" is undefined');
    };
    if (!Array.isArray(statements))
        statements = [statements];
    let result = '';
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        if (statement == null) {
            result += null;
            break;
        }
        let value = statement.value;
        var r = [];
        // check if statement is supported by imported parser
        let match = parsersObject.findMatch(statement, tmp, isReturn, caller, prepend/*, scopes.lastUsed*/);
        if (match !== void 0) {
            result += match;
            continue;
        }
        switch (statement.type) {
            case 'decorator':
                if (statement.includes && statement.includes.length) {
                    let includes = statement.includes;
                    for (let i = 0; i < includes.length; i++) {
                        if (!(includes[i].value in libs))
                            throw new Error(`Unknow library "${includes[i].value} at line ${includes[i].line}, column ${includes[i].col}"`);
                        let file = libs[includes[i].value];
                        let content = fs.readFileSync(`${__dirname.replace(/\\/g, '/')}/../../bin/${file}`, 'utf8');
                        if (/\.bs$/i.test(file)) {
                            // console.log(`${parse(to_ast(content))}`);
                            content = `${parse(to_ast(content+'\n'))}`;
                        } else if (/\.js$/i.test(file)) {
                            content = `(function () {${content}}).call(this);`;
                        } else {
                            throw new Error(`Unknow library "${includes[i].value} at line ${includes[i].line}, column ${includes[i].col}"`);
                        }
                        result += content;
                    }
                    // result += parse(includes);
                }
                result += '\n\n// Your code below this line\n\n';
                result += parse({
                    type: 'scope',
                    value: value
                }, tmp, false, 'global');
                // might be unnecessary
                namespaces = [namespaces.pop()];
                break;
            case 'scope': {
                lvl++;
                let namespace_count = namespaces.length;

                result += `${parse(value, tmp, isReturn, caller, prepend/*, scopes.createScope()*/)}\n`;
                if (namespace_count < namespaces.length) {
                    namespaces.splice(namespace_count, namespaces.length - namespace_count);
                }
                //if (caller == 'global') {
                //    scopes.clear();
                //}
                //scopes.pop();
                lvl--;
                break;
            }
            case 'namespace':
                namespaces.push(parse(value));
                break;
            case 'namespace_retraction': {
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
                //parse(value);
                break;
            }
            case 'condition_group':
                for (let i = 0; i < value.length; i++) {
                    r.push(parse(value[i]))
                }
                result += r.join(statement.separator.replace('or', '||').replace('and', '&&'));
                break;
            case 'nullish_check': {
                let condition = parse(statement.condition);
                let v = parse(value);
                result += `(((${condition}) === null) || (${condition}) === void(0)) ? ${v} : ${condition}`;
                break;
            }
            case 'ternary':
                result += `${parse(value)} ? ${parse(statement.left)} : ${statement.right === null ? null : parse(statement.right)}`;
                break;
            case 'convert':
                if (typeof statement.convert_type.value == 'string') {
                    result += `BS.convert(${parse(value)}, "${statement.convert_type.value}")`
                    break;
                }
                // result += `BS.convert(${parse(value)}, ["Array"${parse(statement.convert_type)}])`
                result += `(() => {
                    let r = BS.convert(${parse(value)}, "Array");
                    ${parse(statement.convert_type)};
                    return r
                })()`;

                // result += `for (let i = 0; i < r.length; i++) {
                //         r[i] = BS.convert(r[i], "${statement.convert_type.value.value}")
                //     }`
                break;
            case 'array_of_type':
                var r = [];
                var tm = value;
                // while (true) {
                //     if (value.type == 'keyword') break;
                //     if (value.type == 'identifier') break;
                //     r.push(`"${parse(value)}"`);
                //     // if (tm) tm = tm.value;
                //     else break;
                // }
                // r.push(`"${value.value}"`);
                // result += `, ${r.join(', ')}`;
                // break;
                if (statement.value.type == 'array_of_type') {
                    result += `for (let i = 0; i < r.length; i++) {
                        r[i] = BS.convert(r[i], "Array");
                        ${r}
                    }`
                    break;
                }
                result += `for (let i = 0; i < r.length; i++) {
                    r[i] = BS.convert(r[i], "${value.value}");
                }`
                break;
            case 'array_interactions':
                if (statement.method == 'spread') {
                    result += `...${parse(value)}`;
                    break;
                }
                if (statement.into) {
                    result += `(() => {
                        let v = ${parse(statement.into)};
                        v.${statement.method.value.toLowerCase()}(${parse(value)});
                        return v;
                    })()`;
                    break;
                }
                result += `(() => {
                    let v = ${parse(statement.value)};
                    v.${statement.method.value.toLowerCase()}();
                    return v;
                })()`;
                break;
            case 'SAVE':
                result += `BS.storage.push(${parse(value)});`;
                break;
            case 'USE':
                result += `(() => {
                    if (BS.storage.length == 0) {
                        throw new Error("No saved values to use at line ${statement.line}, col ${statement.col}.");
                    }
                    return BS.storage.last();
                })()`;
                break;
            case 'DELETE':
                result += `BS.storage.pop();`;
                break;
            //case 'dot_retraction':
            //    var from = parse(statement.from);
            //    var v = [];
            //    if (value.length) {
            //        for (let i = 0; value && i < value.length; i++) {
            //            v.push(parse(value[i]))
            //        }
            //        result += `${from}.${v.join('.')}`;
            //        break;
            //    }
            //    result += `${from}.${parse(value)}`;
            //    break;
            case 'dot_retraction_v2': {
                let check = statement.check;
                if (check) {
                    delete statement.check;
                }
                let from = parse(statement.from);
                let v = '';
                if (value.type !== 'identifier') {
                    v = parse(value);
                } else {
                    v = value.value;
                }
                if (!check) {
                    result += `${from}.${v}`;
                    break;
                }
                // needs a fix later on
                result += `${from} && ${from}.${v}`;
                break;
            }
            // not used now ↓
            case 'double_dot_retraction':
                var from = parse(statement.from);
                var v = [];
                if (value.length) {
                    for (let i = 0; value && i < value.length; i++) {
                        v.push(`tmp.${parse(value[i])}`);
                    }
                    result += `(() => {
                        let tmp = ${from};
                        ${v.join(';')}
                        return tmp;
                    })()`;
                    break;
                }
                result += `${from}.${parse(value)}`;
                break;
            case 'array_slice':
                var v = typeof value == 'string' ? value : parse(value)
                result += `BS.slice(${v}, ${parse(statement.start)}, ${statement.end === null ? null : parse(statement.end)}, ${parse(statement.step)}, ${statement.line}, ${statement.col})`
                break;
            case 'string_slice':
                result = result.slice(0, -1);
                for (let i = 0; i < value.length; i++) {
                    r.push(value[i]);
                }
                let reversed_string = statement.reversed ? r.reverse() : r;
                result += `"${reversed_string.slice(parse(statement.start), parse(statement.end)).join('')}"`//.slice(${parse(statement.start)}, ${parse(statement.end)})`
                break;
            case 'name_list':
                result += `${parse(value)}, ${parse(statement.addition)}`
                break;
            case 'iife':
                // statement.type = 'annonymous_function'
                result += `(${parse(value)})(${statement.call_arguments.value.map(i => parse(i)).join(',')})`;
                break;
            case 'annonymous_function': {
                var types = [];
                let res = ''
                res += `${statement.async ? 'async ' : ''}function ${statement.identifier ? statement.identifier.value : ''}`;
                if (statement.arguments)
                    var t = parse(statement.arguments)
                else var t = ['', ''];
                let use_strict = false;
                if (/use strict/.test(statement.value[0]?.value?.value?.value)) {
                    statement.value = statement.value.slice(1)
                    use_strict = true;
                }
                res += `(${t.length ? t[0] : ''}) {\
                    ${use_strict ? '"use strict"' : ''}
                    const args = Array.from(arguments);`
                    + `${t.length ? t[1] + '\n' : ''}${parse(statement.value, statement.text, false, 'function')}
                }`;
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
                //result += `local.get("${value}")`;
                result += value;
                break;
            case 'html_string':
                var v = [];
                for (let i = 0; i < value.length; i++) {
                    if (value[i].type == 'string')
                        v.push(value[i].value);
                    else v.push(value[i].text);
                }
                result += JSON.stringify(v.join(''))
                break;
            case 'function_call': {
                let check = statement.check;
                if (check) {
                    delete statement.check;
                }
                let v = '';
                if (value.type == 'identifier' || value.type == 'keyword') {
                    v += parse(value);
                } else if (value.from && value.type != 'item_retraction') {
                    v += `${parse(value.from)}.`
                }
                if (value && value.value && value.value instanceof Array) {
                    if (value.type == 'array') {
                        v += parse(value)
                    } else {
                        for (let i = 0; i < value.value.length; i++) {
                            v += value.value[i].value;
                            if (i < value.value.length - 1)
                                v += '.';
                        }
                    }
                }
                else if (value.type == 'item_retraction') {
                    v += parse(value)
                }
                else if (typeof value === "object" && value.type != 'identifier') {
                    if (value.type == 'namespace_retraction') {
                        v += parse(value);
                    } else if (value.type === 'expression_with_parenthesis') {
                        v += parse(value);
                    } else if (value.type == 'function_call') {
                        v += parse(value);
                    } else if (value.value.type != 'identifier') {
                        v += parse(value.value);
                    } else {
                        v += value.value.value;
                    }
                }
                else if (typeof value === "object") {
                    //result += parse(value.value);
                    null // no need for anything
                } else if (value.type == 'namespace_retraction') {
                    v = parse(value);
                } else {
                    v = '\n' + value;
                }
                //if (!check) {
                    result += `${v}`
                //} else {
                //    result += ``
                //}
                // arguments
                if (!statement.arguments.value.length) {
                    result += '()';
                    break;
                }
                // result += parse([statement.arguments]);
                result += '(';
                var args = [];
                for (let i = 0; i < statement.arguments.value.length; i++) {
                    args.push(parse(statement.arguments.value[i]));
                }
                result += args.join(',');
                // result += `(${value.map(i => parse(i)).join(',')})`;
                result += ')';
                break;
            }
            //case 'arguments':
            //    result += '(';
            //    let args = [];
            //    for (let i = 0; i < value.length; i++) {
            //        args.push(parse([value[i]]));
            //    }
            //    result += args.join(',');
            //    // result += `(${value.map(i => parse(i)).join(',')})`;
            //    result += ')';
            //    break;
            case 'expression':
                result += `${parse(value[0])} ${value[1].value} ${parse(value[2])}`;
                break;
            case 'expression_with_parenthesis':
                if (!statement.arguments) {
                    result += `(${parse(value)})`;
                    break;
                }
                if (value.result) {
                    // statement.type = 'annonymous_function';
                    result += `(${parse(value)})`;
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
                else result += `(${parse(value)})`;
                break;
            case 'lambda': {
                let args = parse(statement.arguments);
                if (Array.isArray(args)) {
                    args = args.join('');
                }
                result += `(${args}) => {${parse(statement.value)}}`;
                break;
            }
            case 'condition_destructive':
                if (typeof value === 'string') {
                    if (statement.left !== void 0) {
                        for (let i = 0, len = statement.right.value.length; i < len; i++) {
                            result += `${parse(statement.left)}${value}${parse(statement.right.value[i])}`;
                            if (['!=', '!==', '==', '=='].includes(value)) {
                                if (i < len - 1)
                                    result += ' || ';
                            } else {
                                if (i < len - 1)
                                    result += ' && ';
                            }
                        }
                        break;
                    }
                    result += value;
                } else {
                    result += parse(value, tmp);
                }
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
                    result += fs.readFileSync(r.slice(1, -1), 'utf8');
                    break;
                }
                result += `eval(BS.parse(BS.ast(BS.fs.readFileSync(${r}, 'utf8'))));`;
                break;
            case '@include':
                var content = fs.readFileSync(parse(value).slice(1, -1), 'utf8');
                // console.log(`${parse(to_ast(content))}`);
                result += `${parse(to_ast(content))}`;
                break;
            case 'eval':
                // var BS = require('./index');
                result += `eval(BS.parse(BS.ast(${parse(value)})));`;
                break;
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
                result += `${parse(statement.from)}[BS.last(${parse(statement.from)}.length)]`;
                if (statement.arguments) {
                    var r = [];
                    for (let i = 0; i < statement.arguments.value.length; i++) {
                        r.push(parse(statement.arguments.value[i]));
                    }
                    result += `(${r.join(',')})`;
                }
                break;
            case 'boolean_reversed':
                result += `!${parse(value)}`;
                break;
            case 'echo':
                let p = parse(value);
                result += `if (typeof ${p} !== 'string') {
                    throw 'echo must be type of string';
                } else {
                    try {
                        eval(${p})
                    } catch (err) {
                        throw new Error(err);
                        //console.warn(\`[Echo error]: \${err}\`);
                    }}`;
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
                // if (!statement.id && ! statement.classList) {
                //     result += `document.createElement("${parse(value)}")`;
                // } else {
                    result += `BS.Node("${parse(value)}",`;
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
                    } else result += 'null,'
                    if (statement.elements) {
                        var els = parse(statement.elements);
                        result += els;
                        // result += `let children = ${els};`
                        // result += `for (let i = 0; i < children.length; i++) {
                        //     el.append(children[i]);
                        // }`;
                    } else result += 'null'
                    result += `)`;
                    // result += `return el})()`;
                // }
                break;
            case 'keyword':
                result += value;
                break;
            case 'es6_key_value':
                var args = parse(statement.arguments)  || ['', ''];
                var key = statement.key.value;
                result += `${key} (${args[0]}) {\
                    ${args[1]}
                    ${parse(value)}
                }`
                break;
            case 'arguments':
                result += value.join(', ');
                break;
            case 'arguments_with_types':
                var types = [];
                var sav = statement.identifiers || [];
                var values = statement.values;
                var cancelables = statement.cancelables;
                if (statement.types.length == 0) return '';

                for (let i = 0; i < sav.length; i++) {
                    r.push(`${parse(sav[i], tmp)}${values[i] ? '=' + parse(values[i], tmp) : ''}`);
                    if (statement.types[i] !== 'none' && statement.types[i] !== null) {
                        let type = statement.types[i];
                        let v = values[i] !== null && values[i] !== void 0 ? parse(values[i]) : `arguments[${i}] ?? null`;
                        let chk = `BS.checkArgType("${type}", "${sav[i].value}", ${v}, ${statement.line}, ${statement.col})`;

                        if (cancelables[i]) chk += `&& ${parse(sav[i])} !== null`;
                        chk += ';';
                        types.push(chk);
                        // types.push([statement.types[i], sav[i]]);
                        // switch (type) {
                        //     case 'int':
                        //         types.push(`if (parseInt(${parse(sav[i])}) !== ${parse(sav[i])}) {
                        //                 throw new TypeError('"${parse(sav[i])}" should be type of int')
                        //             }`);
                        //         break;
                        //     case 'string':
                        //         types.push(`if (typeof ${parse(sav[i])} !== 'string') {
                        //                 throw new TypeError('"${parse(sav[i])}" should be type of string')
                        //             }`);
                        //         break;
                        // }
                    }
                }
                // result += `(${r.join(', ')})`;
                return [r.join(', '), types.length ? types.join('') : '']
                // result += `(${r.join(', ')}) {
                //     ${types.length ? types.join('') : ''}
                //     ${parse(statement.value, statement.text)}
                // }`;
                // result += `constructor (${parse(statement.arguments)}) {
                // }`
                break;
            case 'period':
                result += `.`
                break;
            case undefined: // whitespace
                break;
            default:
                result += '/* Unhandled expression: '+JSON.stringify(statement)+' */'
        }
    }
    return result.trim();
}
module.exports = parse;