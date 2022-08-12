const fs = require('fs');
const to_ast = require('./parser.js');
const path = require('path');
const libs = {
    //Math() {
    //    return
    //},
    //Random() {
    //    return
    //}
    get HTML() {
        return 'builtin/HTML.js'
    }
}
let scopeLevel = 0;
module.exports = function parse (statements, tmp, isReturn, caller, prependStr = '') {
    // statememnts must be an array, if no, make it an array
    if (statements === void 0) {
        // something went wrong. This part should never be executed
        debugger
        return;
    };
    if (!Array.isArray(statements))
        statements = [statements];
    let result = '';
    let extraResult = '';
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        if (statement == null) {
            result += null;
            break;
        }
        let value = statement.value;
        var r = [];
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
                            result += `${parse(to_ast(content+'\n'))}`;
                        } else if (/\.js$/i.test(file)) {
                            result += content;
                        } else {
                            throw new Error(`Unknow library "${includes[i].value} at line ${includes[i].line}, column ${includes[i].col}"`);
                        }
                    }
                    // result += parse(includes);
                }
                result += `(function () {
                    ${parse(value, 'isGloobal')}
                })();`
                break;
            case 'scope':
                result += `const $${++scopeLevel} = scopes.new(${scopeLevel}, $${scopeLevel - 1});`
                result += prependStr || '';
                if (caller == 'function')
                    result += `$${scopeLevel}.set("args", Array.from(arguments));`
                result += `${parse(value)}
                $${scopeLevel - 1}.scopes.pop();
                scopes.scopes.pop();`;
                scopeLevel--;
                break;
            case 'private':
                result += `(function private () {
                    const scopes = new Scopes();
                    const $${++scopeLevel} = scopes.global();
                    ${parse(value)}
                })()`;
                scopeLevel--;
                break;
            case 'statement_value':
                result += `${parse(value, tmp, null, 'statement')};`;
                break;
            case 'condition_group':
                for (let i = 0; i < value.length; i++) {
                    r.push(parse(value[i]))
                }
                result += r.join(statement.separator.replace('or', '||').replace('and', '&&'));
                break;
            case 'ternary':
                result += `${parse(value)} ? ${parse(statement.left)} : ${statement.right === null ? null : parse(statement.right)}`;
                break;
            case 'free': {
                let r = [];
                value = value.value
                for (let i = 0; i < value.length; i++) {
                    if (value[i].value.type != 'identifier') {
                        throw new Error(`Identifier expected for "free" statement at line ${value[i].line}, column ${value[i].col}"`);
                    }
                    r.push(parse(value[i], 'realValue'))
                }
                if (r.length > 1 || r.length < 1) {
                    throw new Error(`"free" statement expected only one argument at line ${statement.line}, column ${statement.col}`);
                }
                r.push(`$${scopeLevel}`);
                result += `$free(${r.join(', ')});`;
                break;
            }
            case 'delete': {
                let r = [];
                value = value.value
                for (let i = 0; i < value.length; i++) {
                    r.push(parse(value[i], 'realValue'))
                }
                if (r.length > 2 || r.length < 2) {
                    throw new Error(`"delete" statement expected exactly two arguments at line ${statement.line}, column ${statement.col}`);
                }
                result += `$delete(${r.join(', ')});`;
                break;
            }
            case 'debugger':
                result += 'debugger;';
                break;
            case 'in':
                result += `${parse(value)} in ${parse(statement.from)}`;
                break;
            case 'var_assign':
                if (statement.use_const) {
                    result += `${parse(value, 'const')}`;
                    break;
                }
                var prepend = statement.use_let ? 'let' : ''
                prepend = statement.type_text ? statement.type_text.value : ''
                let pr = prepend;
                if (tmp == 'isGloobal')
                    pr = 'var';
                result += `${parse(value, prepend || '', prepend && prepend.trim ? prepend.trim() : prepend)}`;
                //result += `${pr} ${parse(value, prepend && prepend.trim ? prepend.trim() : prepend)};`;
                break;
            case 'var_assign_group':
                if (!!value.value) value = value.value;
                for (let i = 0; i < value.length; i++) {
                    r.push(`${parse(value[i], tmp)};`);
                }
                if (statement.identifier) {
                    if (tmp == 'const') {
                        result += `${statement.identifier.value} = Object.freeze(${r.join()})`
                        break;
                    }
                    result += `${statement.identifier.value} = ${r.join()}`
                }
                else {
                    result += `${r.join('')}`;
                }
                break;
            case 'var_reassign':
                if (tmp == 'const') {
                    result += `$${scopeLevel}.set("${statement.identifier.value}", BS.deepFreeze(${parse(value)}), true, true)`;
                    break;
                }
                //if (tmp == 'Int') {
                //    result += `${statement.identifier.value} = BS.var("${statement.identifier.value}", "${tmp}", ${value ? parse(value): null})`;
                //    break;
                //}
                if (typeof statement.identifier.value != 'string')
                    result += `${parse(statement.identifier)} = ${parse(value)}`;
                else if (value === void 0) {
                    result += statement.identifier.value;
                    break;
                }
                else
                    //result += `${statement.identifier.value} = BS.setValue("${statement.identifier.value}", ${statement.identifier.value}, ${parse(value)})`;
                    //result += `${statement.identifier.value} = ${parse(value)}`;
                    result += `$${scopeLevel}.set("${statement.identifier.value}", ${parse(value)}${['Int', 'Array', 'Object', 'let', '\\'].includes(tmp) ? ', true' : ''})`;
                break;
            case 'array':
                result += 'BS.Array([';
                for (let i = 0; i < value.length; i++) {
                    result += parse(value[i]);
                    if (i !== value.length -1)
                        result += ',';
                }
                result += '])';
                break;
            case 'array_through':
                result += `BS.through(${parse(value[0])}, ${parse(value[1])}, ${statement.line}, ${statement.col})`;
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
                    result += `console.${statement.method}(${v});`
                } else {
                    //let v = parse(value);
                    if (value.opening_tag) {
                        result += `(document.body.append(${r}));`
                        break;
                    }
                    result += `BS.WRITE(${v});`
                }
                break;
            };
            case 'number':
            case 'bigInt':
                result += value;
                break;
            case 'number_negative':
                result += `-${parse(value)}`;
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
            case 'string':
                if (/\r\n/.test(value)) {
                    result += `\`${value.replace(/\'/g, '\x27').replace(/"/g, '\x22').replace(/\`/g, '\x60').replace(/\$/g, '\x24')}\``
                    break;
                }
                //result += JSON.stringify(value)
                result += `"${value.replace(/\'/g, '\x27').replace(/"/g, '\x22').replace(/\`/g, '\x60').replace(/\$/g, '\x24')}"`//value.indexOf('$') > -1 ? `\`${value}\`` : `${JSON.stringify(value)}`;
                break;
            case 'null':
                result += null;
                break;
            case 'opening parentesis':
            case 'closing parentesis':
                result += value;
                break;
            case 'dot_retraction':
                var from = parse(statement.from);
                var v = [];
                if (value.length) {
                    for (let i = 0; value && i < value.length; i++) {
                        v.push(parse(value[i]))
                    }
                    result += `${from}.${v.join('.')}`;
                    break;
                }
                result += `${from}.${parse(value)}`;
                break;
            case 'dot_retraction_v2':
                var from = parse(statement.from, tmp);
                r = tmp == 'realValue' ? ', 1' : '';
                if (value.type !== 'identifier') {
                    if (tmp == 'delete') {
                        result += `$delete(${from}, "${parse(value)}");`;
                        break;
                    }
                    result += `$get(${from}, "${parse(value, tmp)}"${tmp})`;
                    break;
                }
                if (tmp == 'delete') {
                    if (statement.from.type != 'identifier') {
                        result += `$${scopeLevel}.set(${from}, $delete(${from}, "${value.value}"));`;
                        break;
                    }
                    result += `$${scopeLevel}.set("${statement.from.value}", $delete(${from}, "${value.value}"));`;
                    break;
                }
                result += `$get(${from}, "${value.value}"${r})`;
                break;
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
            case 'additive':
                result += `${statement.sign}${parse(value)}`
                break;
            case 'new':
            case 'await':
            case 'yield':
                result += `${statement.type} ${parse(value)}`;
                break;
            case 'typeof':
                result += `BS.getType(${parse(value)})`;
                break;
            case 'sizeof':
                result += `BS.sizeof(${parse(value)})`;
                break;
            case 'instanceof':
                result += `${parse(statement.left)} instanceof ${parse(value)}`;
                break;
            case 'name_list':
                result += `${parse(value)}, ${parse(statement.addition)}`
                break;
            case 'function_declaration':
                var types = [];
                result += `${statement.async ? 'async ' : ''}function ${parse(statement.identifier)}`;
                var t = parse(statement.arguments) || ['', ''];
                result += `(${t[0]}) {
                    var arguments = Array.from(arguments || []);
                    ${t[1].length ? t[1] + '\n' : ''}${parse(statement.value, statement.text)}
                }`;
                break;
            case 'iife':
                result += `(${parse(value)})(${statement.call_arguments.value.map(i => parse(i)).join(',')})`;
                break;
            case 'annonymous_function': {
                var types = [];
                let res = ''
                res += `${statement.async ? 'async ' : ''}function ${statement.identifier ? statement.identifier.value : ''}`;
                if (statement.arguments)
                    var t = parse(statement.arguments)
                else var t = ['', '', '', ''];
                let use_strict = false;
                //if (/use strict/.test(statement.value[0]?.value?.value?.value)) {
                //    statement.value = statement.value.slice(1)
                //    use_strict = true;
                //}
                res += `(${t.length ? t[0] : ''}) {
                    ${parse(statement.value, statement.text, null, 'function',
                        `${use_strict ? '"use strict"' : ''}`
                        +`$${scopeLevel+1}.set("this", $${scopeLevel+1}.variables, true, true, true);`
                        + `${t.length ? t[1] + '\n' : ''}`
                        +`${t[2] ? t[2] : ''}`)
                    }
                    return null;
                }`;
                //scopeLevel--;
                if (caller == 'statement' && statement.identifier) {
                    res = `$${scopeLevel}.set("${statement.identifier.value}", ${res})`
                }
                if (statement.identifier) {
                    result += res;
                    break;
                }
                result += `(${res})`;
                break;
            }
            case 'return':
                if (value === void 0) {
                    value = 'null';
                } else {
                    value = parse(value, tmp, isReturn);
                }
                var t = '';
                // switch (tmp) {
                //     case 'int':
                //         t += `if (parseInt(${value}) !== ${value}) {
                //                 throw new TypeError('Returned value should be type of int')
                //             }`
                //         break;
                //     case 'string':
                //         t += `if (typeof ${value} !== 'string') {
                //                 throw new TypeError('Returned value should be type of string')
                //             }`
                //         break;
                //     default:
                //         t += ''
                // }
                if (tmp && tmp != 'function' && isReturn) {
                    result += `return BS.types["${tmp}"](${value});`
                    break;
                }
                result += `return ${value};`
                // result += `${t ? t + 'else ' : ''} return ${value};`;
                break;
            case 'identifier':
                if (typeof value !== 'string') {
                    result += value.value;
                    break;
                }
                if (tmp == 'realValue') {
                    result += `$${scopeLevel}.get("${value}", 1)`;
                    break;
                }
                result += `$${scopeLevel}.get("${value}")`;
                //result += value;
                break;
            case 'global':
                result += `let ${value.value} = (globalThis !== null && globalThis !== void 0) ? globalThis.${value.value} : undefined;\n`
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
            case 'semicolon':
                result += value;
                break;
            case 'function_call':
                if (value.type == 'identifier' || value.type == 'keyword') {
                    result += parse(value);
                } else if (value.from && value.type != 'item_retraction') {
                    result += `${parse(value.from)}.`
                }
                if (value && value.value && value.value instanceof Array) {
                    if (value.type == 'array') {
                        result += parse(value)
                    } else {
                        for (let i = 0; i < value.value.length; i++) {
                            result += value.value[i].value
                            if (i < value.value.length - 1)
                                result += '.'
                        }
                    }
                }
                else if (value.type == 'item_retraction') {
                    result += parse(value)
                }
                else if (typeof value === "object" && value.type != 'identifier') {
                    if (value.type === 'expression_with_parenthesis') {
                        result += parse(value);
                    } else if (value.type == 'function_call') {
                        result += parse(value);
                    } else if (value.value.type != 'identifier') {
                        result += parse(value.value);
                    } else {
                        result += value.value.value;
                    }
                }
                else if (typeof value === "object") {
                    //result += parse(value.value);
                    null // no need for anything
                } else {
                    result += '\n'+value;
                }
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
            case 'function_call_from_value':
                result += '\n'+parse(value);
                if (!statement.arguments.value.length) {
                    result += '()';
                    break;
                }
                result += '(';
                var args = [];
                for (let i = 0; i < statement.arguments.value.length; i++) {
                    args.push(parse(statement.arguments.value[i]));
                }
                result += args.join(',');
                result += ')';
                break;
            case 'if_else':
                result += `if (${parse(statement.if.condition)}) {${parse(statement.if.value, tmp)}}`;
                result += ` else {${parse(statement.else.value, tmp)}}`;
                break;
            case 'if':
                if (statement.unless) {
                    result += `if (!(${parse(statement.condition)})) {${parse(value, tmp)}}`;
                } else {
                    result += `if (${parse(statement.condition)}) {${parse(value, tmp)}}`;
                }
                break;
            case 'else':
                result += `else {${parse(value, tmp)}}`;
                break;
            case 'while':
                result += `while (${parse(statement.condition)}) {${parse(value, tmp)}}`;
                break;
            case 'for_loop':
                if (!statement.from) {
                    //result += `for (${statement.identifier.value}; ${parse(statement.condition)}; ${parse(statement.change)}) {${parse(value)}}`
                    result += `for (${parse(statement.identifier).replace(';', '')}; ${parse(statement.condition)}; ${parse(statement.change)}) {${parse(value)}}`
                    break;
                }
                var value0 = parse(statement.from);
                var value1 = parse(statement.through);
                var iterator = Math.random().toString(16).substr(2, 8);
                if (!/^\d+$/.test(value0) || !/^\d+$/.test(value1)) {
                    result += `for (let _i${iterator} of range(${value0}, ${value1}, ${statement.include})) {
                        ${parse(value, tmp, null, '', `$${scopeLevel+1}.set("${statement.identifier.value}", _i${iterator}, true);`)}
                    }`
                    break;
                }
                var min = Math.min(value0, value1);
                var max = Math.max(value0, value1);
                var identifier = statement.identifier.value;
                var include = statement.include ? '=' : '';
                if (value0 == max) {
                    result += `for (let ${identifier} = ${max}; ${identifier} >${include} ${min}; ${identifier}--) {${parse(value, tmp)}}`
                } else {
                    result += `for (let ${identifier} = ${min}; ${identifier} <${include} ${max}; ${identifier}++) {${parse(value, tmp)}}`
                }
                break;
            case 'for_in':
                var iterator = Math.random().toString(16).substr(2, 8);
                result += `for (let _i${iterator} in ${parse(statement.iterable)}) {
                    ${parse(value, tmp, null, '', `$${scopeLevel+1}.set("${statement.identifier.value}", _i${iterator}, true);`)}
                }`
                break;
            case 'for_of':
                var iterator = Math.random().toString(16).substr(2, 8);
                result += `for (let _i${iterator} of ${parse(statement.iterable)}) {
                    ${parse(value, tmp, null, '', `$${scopeLevel+1}.set("${statement.identifier.value}", _i${iterator}, true);`)}
                }`
                break;
            case 'case':
                result += `case ${parse(value)}:`;
                for (let i = 0; i < statement.statements.length; i++) {
                    result += parse(statement.statements[i]);
                }
                break;
            case 'case_default':
                result += `default:`;
                for (let i = 0; i < statement.value.length; i++) {
                    result += parse(statement.value[i]);
                }
                break;
            case 'switch':
                result += `switch (${parse(value)}) {`;
                for (let i = 0; i < statement.cases.length; i++) {
                    result += parse(statement.cases[i]);
                }
                result += '\n}'
                break;
            case 'switch*':
                result += '(function () { let ___switch_result___ = null;';
                result += `switch (${parse(statement.value)}) {`;
                for (let i = 0; i < statement.cases.length; i++) {
                    result += parse(statement.cases[i]);
                }
                result += '} return ___switch_result___; })()';
                break;
            case 'case_with_break':
                result += `case ${parse(statement.value)}:`;
                result += `___switch_result___ = ${parse(statement.statements)};`;
                result += `break;`;
                break;
            case 'case_singular':
                result += `case ${parse(statement.value)}:`;
                break;

            case 'case_default_singular':
                result += `default: ___switch_result___ = ${parse(statement.value)};`;
                break;
            case 'expression':
                result += `${parse(value[0])} ${value[1].value} ${parse(value[2])}`;
                break;
            case 'expression_short_equation': {
                let v = parse(value[0]);
                if (value[0].type == 'identifier') {
                    result += `$${scopeLevel}.set("${value[0].value}", ${v} ${value[1].value} ${parse(value[2])})`;
                    break;
                }
                result += `${v} = ${v} ${value[1].value} ${parse(value[2])}`;
                break;
            }
            case 'expression_with_parenthesis':
                if (!statement.arguments) {
                    result += `(${parse(value)})`;
                    break;
                }
                if (value.result) {
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
            case 'regexp':
                result += value;
                break;
            case 'sum':
            case 'product':
            case 'pow':
                if (typeof value == 'number') {
                    result += value;
                    break;
                }
                result += `${parse(statement.left)} ${statement.operator} ${parse(statement.right)}`;
                break;
            case 'operator':
                debugger
                result += value;
                break;
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
            case 'throw':
                result += `throw ${parse(value)};`;
                break;
            case '@import':
                var r = parse(value).trim();
                if (/\.js"/i.test(r)) {
                    result += `BS.fs.readFileSync(${r}, 'utf8');`;
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
                if (tmp == 'delete') {
                    let v = parse(value, tmp);
                    let from = null;
                    if (statement.from.type == 'identifier') {
                        from = `"${statement.from.value}"`;
                    } else {
                        from = parse(statement.from);
                    }
                    if (v[0] == '"' || v[0] == "'" || v[0] == '`') {
                        v = v.slice(1, -1);
                    }
                    result += `$${scopeLevel}.set(${from}, $delete(${parse(statement.from)}, "${v}"));`;
                } else {
                    result += `$get(${parse(statement.from, tmp)}, ${parse(value, tmp)})`;
                }
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
            case 'break_continue':
                result += `${value};`;
                break;
            case 'boolean_reversed':
                result += `!${parse(value)}`;
                break;
            case 'boolean':
                result += `${value}`;
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
            case 'object':
                var output = 'BS.Object({';
                for (let i in value) {
                    // if (value[i].type == 'identifier' && value[i].value == 'inherit') {
                    //     output += `${i}:(function (self) {return self["${i}"]})(this),`;
                    // } else {
                    if (value[i].type == 'es6_key_value') {
                        output += `${parse(value[i])},`;
                    } else if (value[i].type == 'string') {
                        output += `"${i}":${parse(value[i])},`;
                    } else {
                        output += `${i}:${parse(value[i])},`;
                    }
                    // }
                }
                output += '})';
                result += output;
                break;
            case 'keyword':
                result += `$${scopeLevel}.get("${value}")`;
                break;
            case 'class_declaration':
                result += `class ${parse(statement.identifier)} {
                    ${parse(statement.construct)}
                    ${value ? value.map(i => parse(i)).join('\n') : ''}
                }`
                break;
            case 'es6_key_value':
                var args = parse(statement.arguments)  || ['', ''];
                var key = statement.key.value;
                result += `${key} (${args[0]}) {
                    ${args[1]}
                    ${parse(value)}
                }`
                break;
            case 'arguments':
                result += value.join(', ');
                break;
            case 'construct':
                var args = parse(statement.arguments) || ['', ''];
                result += `constructor (${args[0]}) {
                    ${args[1]}
                    ${parse(value, tmp)}
                }`
                break;
            case 'type_declaration':
                var t = parse(statement.arguments) || ['', ''];
                result += `
                    BS.customTypes["${parse(statement.identifier)}"] = function (${t[0]}, required = false) {
                        ${t[1]}
                        if (required && typeof arguments[0] === void 0) {
                            throw new TypeError("Missing argument at ${statement.line}:${statement.col}");
                        }
                        ${parse(value)}
                    };
                `;
                break;
            case 'arguments_with_types':
                var types = [];
                var sav = statement.identifiers || [];
                var values = statement.values;
                var cancelables = statement.cancelables;
                var args = [];
                if (statement.types.length == 0) return '';

                for (let i = 0; i < sav.length; i++) {
                    r.push(`${sav[i].value}${values[i] ? '=' + parse(values[i], tmp) : ''}`);
                    //r.push(`${parse(sav[i], tmp)}${values[i] ? '=' + parse(values[i], tmp) : ''}`);
                    if (statement.types[i] !== 'none' && statement.types[i] !== null) {
                        let type = statement.types[i];
                        let v = values[i] !== null && values[i] !== void 0 ? parse(values[i]) : `arguments[${i}] ?? null`;
                        let chk = `BS.checkArgType("${type}", "${sav[i].value}", ${v}, ${statement.line}, ${statement.col})`;

                        if (cancelables[i]) chk += `&& ${parse(sav[i])} !== null`;
                        chk += ';';
                        types.push(chk);
                    }
                    args.push(`$${scopeLevel+1}.set("${sav[i].value}", ${sav[i].value});`)
                }
                return [r.join(', '), types.length ? types.join('') : '', args.join('')]
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
            case 'period':
                result += `.`
                break;
            case 'test':
                result += `console.log(eval('(function () {${parse(value)}})()') == ${parse(statement.expect)})`
                break;
            case undefined: // whitespace
                break;
            default:
                result += '/* Unhandled expression: '+JSON.stringify(statement)+' */'
        }
    }
    return result.trim();
}
