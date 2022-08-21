const fs = require('fs');
const to_ast = require('./parser.js');
//const path = require('path');
const libs = {
    get random() {
        return 'builtin/random.js';
    },
    get HTML() {
        return 'builtin/HTML.js'
    }
}
let namespaces = [];
let lvl = -1;
let scopes = [];
function parseMath(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    switch (statement.type) {
        case 'opening parentesis':
        case 'closing parentesis':
            return value;
        case 'sum':
            if (typeof value == 'number') {
                return value;
            }
            if (statement.operator == '+') {
                return `BS.sum(${parse(statement.left)}, ${parse(statement.right)})`;
            }
            if (statement.operator == '-') {
                return `BS.sub(${parse(statement.left)}, ${parse(statement.right)})`;
            }
            return `${parse(statement.left)} ${statement.operator} ${parse(statement.right)}`;
        case 'product':
        case 'pow':
            if (typeof value == 'number') {
                return value;
            }
            if (statement.operator == '**') {
                return `BS.pow(${parse(statement.left)}, ${parse(statement.right)})`;
            }
            if (statement.operator == '*') {
                return `BS.mul(${parse(statement.left)}, ${parse(statement.right)})`;
            }
            if (statement.operator == '/') {
                return `BS.div(${parse(statement.left)}, ${parse(statement.right)})`;
            }
            if (statement.operator == '%') {
                return `BS.mod(${parse(statement.left)}, ${parse(statement.right)})`;
            }
            return `BS.customOperators["${parse(statement.operator)}"](${parse(statement.left)}, ${parse(statement.right)})`;
        case 'operator':
            if (typeof value == 'string') {
                return value;
            }
            return parse(value);
    }
    return result;
}
function parsePrimitive(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    switch (statement.type) {
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
            return `BS.through(${parse(value[0])}, ${parse(value[1])}, ${statement.line}, ${statement.col})`;
        case 'number':
        case 'bigInt':
        case 'regexp':
        case 'boolean':
            return value;
        case 'string':
            if (/\r\n/.test(value)) {
                return `\`${value.replace(/\'/g, '\x27').replace(/"/g, '\x22').replace(/\`/g, '\x60')}\``
            }
            //result += JSON.stringify(value)
            return `"${value.replace(/\'/g, '\x27').replace(/"/g, '\x22').replace(/\`/g, '\x60')}"`//value.indexOf('$') > -1 ? `\`${value}\`` : `${JSON.stringify(value)}`;
        case 'null':
            return null;
        case 'new.target':
            return 'new.target';
        case 'safeValue':
            let v = '';
            if (value.value.length < 1) {
                throw new Error('safeValue must have at least one value');
            }
            v += parse(value.value[0], tmp);
            return `(function () { try { ${v} } catch (e) { return undefined; } return ${v}; })()`;
        case 'defined':
            return `(function () { try { ${parse(value)} } catch (e) { return false; } return true; })()`;
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
            result += '})';
            break;
    }
    return result;
}
function parseIf(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    switch (statement.type) {
        case 'if_else':
            result += `if (${parse(statement.if.condition)}) {${parse(statement.if.value, tmp)}}`;
            result += ` else {${parse(statement.else.value, tmp)}}`;
            break;
        case 'if':
            if (statement.unless) {
                return `if (!(${parse(statement.condition)})) {${parse(value, tmp)}}`;
            } else {
                return `if (${parse(statement.condition)}) {${parse(value, tmp)}}`;
            }
        case 'else':
            result += `else {${parse(value, tmp)}}`;
            break;
    }
    return result;
}
function parseKeyword(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    switch (statement.type) {
        case 'new':
        case 'await':
        case 'yield':
            return `${statement.type} ${parse(value)}`;
        case 'typeof':
            return `BS.typeof(${parse(value)})`;
        case 'sizeof':
            return `BS.sizeof(${parse(value)})`;
        case 'instanceof':
            return `${parse(statement.left)} instanceof ${parse(value)}`;
        case 'in':
            return `${parse(value)} in ${parse(statement.from)}`;
        case 'throw':
            return `throw ${parse(value)};`;
    }
    return result;
}
function parseLoop(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    switch (statement.type) {
        case 'while':
            return `while (${parse(statement.condition)}) {${parse(value, tmp)}}`;
        case 'for_loop':
            if (!statement.from) {
                return `for (${parse(statement.identifier).replace(';', '')}; ${parse(statement.condition)}; ${parse(statement.change)}) {${parse(value)}}`
            }
            var value0 = parse(statement.from);
            var value1 = parse(statement.through);
            if (!/^\d+$/.test(value0) || !/^\d+$/.test(value1)) {
                return `for (let ${parse(statement.identifier)} of range(${value0}, ${value1}, ${statement.include})) {${parse(value, tmp)}}`
            }
            var min = Math.min(value0, value1);
            var max = Math.max(value0, value1);
            var identifier = statement.identifier.value;
            var include = statement.include ? '=' : '';
            if (value0 == max) {
                return `for (let ${identifier} = ${max}; ${identifier} > ${include} ${min}; ${identifier}--) {${parse(value, tmp)}}`
            } else {
                return `for (let ${identifier} = ${min}; ${identifier} < ${include} ${max}; ${identifier}++) {${parse(value, tmp)}}`
            }
        case 'for_in':
            return `for (let ${parse(statement.identifier)} in ${parse(statement.iterable)}) {${parse(value, tmp)}}`
        case 'for_of':
            return `for (let ${parse(statement.identifier)} of ${parse(statement.iterable)}) {${parse(value, tmp)}}`
    }
    return result;
}
function parseVar(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    let r = [];
    switch (statement.type) {
        case 'var_assign':
            if (statement.use_const) {
                return `const ${parse(value, 'const')};`;
            }
            var prepend = statement.use_let ? 'let' : ''
            if (statement.type_text.type != 'escape') {
                prepend = statement.type_text ? statement.type_text.value : ''
            }
            let pr = prepend;
            if (tmp == 'isGloobal' || caller == 'global' || caller == 'function')
                pr = 'var';
            let var_name = parse(value, prepend || '', prepend && prepend.trim ? prepend.trim() : prepend);
            scopes.push(var_name);
            return `${pr} ${var_name};`;
        case 'var_assign_group':
            if (!!value.value) value = value.value;
            for (let i = 0; i < value.length; i++) {
                r.push(`${parse(value[i], tmp)}`);
            }
            if (statement.identifier) {
                if (tmp == 'const') {
                    return `${statement.identifier.value} = Object.freeze(${r.join()})`
                }
                return `${statement.identifier.value} = ${r.join()}`
            }
            return `${r.join()}`;
        case 'var_reassign':
            if (tmp == 'const')
                return `${statement.identifier.value} = BS.deepFreeze(${parse([value])})`;
            if (typeof statement.identifier.value != 'string')
                return `${parse(statement.identifier)} = ${parse([value])}`;
            if (value === void 0) {
                return statement.identifier.value;
            }
            return `${statement.identifier.value} = ${parse(value)}`;
    }
    return result;
}
function parseBlock(statement, tmp, isReturn, caller, prepend = '') {
    let result = '';
    let value = statement.value;
    switch (statement.type) {
        case 'try':
            return `try {${parse(statement.value)}}`
        case 'catch':
            return `catch (${statement.identifier}) {${parse(statement.value)}}`
        case 'finally':
            return `finally {${parse(value, tmp)}}`
        case 'try_catch':
            return `${parse(statement.value)}${statement.catch ? parse(statement.catch) : 'catch (err) {console.warn(err)}'}`
        case 'try_catch_finally':
            return `${parse(statement.value)}${statement.finally ? parse(statement.finally) : ''}`
        case 'with':
            return `with (${parse(statement.obj)}) {${parse(statement.value, tmp)}}`
        case 'type_declaration':
            var t = parse(statement.arguments) || ['', ''];
            return `BS.customTypes["${parse(statement.identifier)}"] = function (${t[0]}, required = false) {
                    ${t[1]}
                    if (required && typeof arguments[0] === void 0) {
                        throw new TypeError("Missing argument at ${statement.line}:${statement.col}");
                    }
                    ${parse(value)}
                };`;
        case 'operator_declaration':
            var t = parse(statement.arguments) || ['', ''];
            return `BS.customOperators["${parse(statement.identifier)}"] = function (${t[0]}, required = false) {
                    ${t[1]}
                    if (required && typeof arguments[0] === void 0) {
                        throw new TypeError("Missing argument at ${statement.line}:${statement.col}");
                    }
                    ${parse(value)}
                };`;
    }
    return result;
}
function parse (statements, tmp, isReturn, caller, prepend = '') {
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
        // primitives
        if (['safeValue', 'defined', 'array', 'array_through', 'number', 'bigInt', 'string', 'null', 'boolean', 'regexp', 'new.target', 'object'].indexOf(statement.type) > -1) {
            result += parsePrimitive(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        // math expressions
        if (['pow', 'sum', 'operator', 'product', 'opening parentesis', 'closing parentesis'].indexOf(statement.type) > -1) {
            result += parseMath(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        // if else statements
        if (['if', 'else', 'if_else'].indexOf(statement.type) > -1) {
            result += parseIf(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        // keyword related
        if (['throw', 'new', 'await', 'yield', 'typeof', 'sizeof', 'instanceof', 'in'].indexOf(statement.type) > -1) {
            result += parseKeyword(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        // loops
        if (['while', 'for_loop', 'for_in', 'for_of'].indexOf(statement.type) > -1) {
            result += parseLoop(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        // var/value reassign/assign
        if (['var_assign', 'var_assign_group', 'var_reassign'].indexOf(statement.type) > -1) {
            result += parseVar(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        // blocks
        if (['try', 'catch', 'finally', 'try_catch', 'try_catch_finally', 'with', 'type_declaration', 'operator_declaration'].indexOf(statement.type) > -1) {
            result += parseBlock(statement, tmp, isReturn, caller, prepend);
            continue;
        }
        //
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
                }, 'isGloobal', false, 'global');
                // might be unnecessary
                namespaces = [namespaces.pop()];
                break;
            case 'scope': {
                //result += `const $${++lvl} = scopes.new(${lvl}, $${lvl - 1});`
                //result += prependStr || '';
                //if (caller == 'function')
                //    result += `$${lvl}.set("args", Array.from(arguments));`
                lvl++;
                let namespace_count = namespaces.length;

                result += `${parse(value, tmp, isReturn, caller, prepend)}\n`;
                if (namespace_count < namespaces.length) {
                    namespaces.splice(namespace_count, namespaces.length - namespace_count);
                    //namespaces.pop();
                }
                //$clearScope($${lvl - 1}, scopes);`;
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
            case 'statement_value':
                result += `${parse(value, tmp, null, 'statement')};`;
                break;
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
            case 'delete':
                if (value.type === 'item_retraction') {
                    result += `BS.delete(${parse(value.from)}, ${parse(value.value)});`;
                } else {
                    result += `delete ${parse(value)};`
                }
                break;
            case 'debugger':
                result += 'debugger;';
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
                    if (statement.conditional) {
                        result += `if (${v}) {console.${statement.method}(${v});}`;
                        break;
                    }
                    result += `console.${statement.method}(${v});`
                    break;
                }
                if (value.opening_tag) {
                    result += `(document.body.append(${r}));`
                    break;
                }
                result += `BS.WRITE(${v});`
                break;
            };
            case 'void':
                result += `void(${value.value.length ? parse( value.value[0]) : 0})`;
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
                if (tmp != 'function' && tmp != 'def' && tmp !== void 0) {
                    if (tmp == 'void') {
                        result += `return void(${value});`
                        break;
                    }
                    result += `return BS.convert(${value}, "${tmp}");`
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
                //result += `local.get("${value}")`;
                result += value;
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
            case 'swap':
                // tmp -> [a, b] = [b, a]
                result += `(function () {var tmp = ${parse(statement.left)};${parse(statement.right)} = ${parse(statement.left)};${parse(statement.left)} = tmp;}).call(this);`;
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
            case 'break_continue':
                result += `${value};`;
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
            case 'class_declaration':
                result += `class ${parse(statement.identifier)} {
                    ${parse(statement.construct)}
                    ${value ? value.map(i => parse(i)).join('\n') : ''}
                }`
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
            case 'construct':
                var args = parse(statement.arguments) || ['', ''];
                result += `constructor (${args[0]}) {
                    ${args[1]}
                    ${parse(value, tmp)}
                }`
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