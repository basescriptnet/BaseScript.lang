const fs = require('fs');
const to_ast = require('./parser.js');
module.exports = function parse (statements, tmp) {
    // statememnts must be an array, if no, make it an array
    if (statements === void 0) {
        debugger
        return;
    };
    if (!Array.isArray(statements)) 
        statements = [statements];
    let result = '';
    let extraResult = '';
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        let value = statement.value;
        var r = [];
        switch (statement.type) {
            case 'statement_value':
                result += `${parse(value)};`;
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
            case 'delete':
                result += `delete ${parse(value)};`;
                break;
            // case 'inherit':
            //     result += `${parse(value)};`;
            //     break;
            case 'debugger':
                result += 'debugger;';
                break;
            case 'var_assign':
                result += `${statement.use_let ? 'let ' : statement.use_const ? 'const ' : ''}${parse(value)};`;
                break;
            case 'var_assign_group':
                if (!!value.value) value = value.value;
                for (let i = 0; i < value.length; i++) {
                    r.push(`${parse(value[i])}`);
                }
                if (statement.identifier) {
                    result += `${parse(statement.identifier)} = ${r.join()}`
                }
                else 
                    result += `${r.join()}`;
                break;
            case 'var_reassign':
                result += `${parse(statement.identifier)} = ${parse([value])}`;
                break;
            case 'array':
                result += '[';
                for (let i = 0; i < value.length; i++) {
                    result += parse(value[i]);
                    if (i !== value.length -1)
                        result += ',';
                }
                result += ']';
                break;
            case 'convert':
                if (typeof statement.convert_type.value == 'string') {
                    result += `globalThis.BS.convert(${parse(value)}, "${statement.convert_type.value}")`
                    break;
                }
                // result += `globalThis.BS.convert(${parse(value)}, ["Array"${parse(statement.convert_type)}])`
                result += `(() => {
                    let r = globalThis.BS.convert(${parse(value)}, "Array");
                    ${parse(statement.convert_type)};
                    return r
                })()`;
                    
                // result += `for (let i = 0; i < r.length; i++) {
                //         r[i] = globalThis.BS.convert(r[i], "${statement.convert_type.value.value}")
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
                        r[i] = globalThis.BS.convert(r[i], "Array");
                        ${r}
                    }`
                    break;
                }
                result += `for (let i = 0; i < r.length; i++) {
                    r[i] = globalThis.BS.convert(r[i], "${value.value}");
                }`
                // result += `(() => {
                //     let r = globalThis.BS.convert(${parse(value)}, "Array");
                //     ${parse(statement.convert_type)};
                //     return r
                // })()`;
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
            case 'debugging':
                if (statement.method == 'log' || statement.method == 'error') {
                    result += `console.${statement.method}(${parse(value)})`
                } else {
                    result += `(() => {
                        let el = document.createTextNode(${parse(value)});
                        document.body.append(el);
                    })()`
                }
                break;
            case 'number':
            case 'bigInt':
                result += value;
                break;
            case 'SAVE':
                result += `globalThis.BS.storage.push(${parse(value)});`;
                break;
            case 'USE':
                result += `(() => {
                    if (globalThis.BS.storage.length == 0) {
                        throw new Error("No saved values to use at line ${statement.line}, col ${statement.col}.");
                    }
                    return globalThis.BS.storage.last();
                })()`;
                break;
            case 'DELETE':
                result += `globalThis.BS.storage.pop();`;
                break;
            case 'string':
                result += value.indexOf('$') > -1 ? `\`${value}\`` : `${JSON.stringify(value)}`;
                break;
            case 'null':
                result += null;
                break;
            case 'dot_retraction':
                let from = parse(statement.from);
                let v = [];
                if (value.length) {
                    for (let i = 0; value && i < value.length; i++) {
                        v.push(parse(value[i]))
                    }
                    result += `${from}.${v.join('.')}`;
                    break;
                }
                result += `${from}.${parse(value)}`;
                // console.log(from, v);
                // debugger;
                break;
            case 'array_slice':
                result = result.slice(0, -1);
                for (let i = 0; i < value.length; i++) {
                    r.push(parse(value[i]));
                }
                let reversed = statement.reversed ? r.reverse() : r;
                result += `[${reversed.slice(parse(statement.start), parse(statement.end))}]`//.slice(${parse(statement.start)}, ${parse(statement.end)})`
                break;
            case 'string_slice':
                result = result.slice(0, -1);
                for (let i = 0; i < value.length; i++) {
                    r.push(value[i]);
                }
                let reversed_string = statement.reversed ? r.reverse() : r;
                result += `"${reversed_string.slice(parse(statement.start), parse(statement.end)).join('')}"`//.slice(${parse(statement.start)}, ${parse(statement.end)})`
                break;
            case 'new':
            case 'await':
            case 'yield':
                result += `${statement.type} ${parse(value)}`;
                break;
            case 'typeof':
                result += `globalThis.BS.getType(${parse(value)})`;
                break;
            case 'instanceof':
                result += `${parse(statement.left)} instanceof ${parse(value)}`;
                break;
            case 'function_declaration':
                var types = [];
                result += `${statement.async ? 'async ' : ''}function ${parse(statement.identifier)}`;
                // var sav = statement.arguments.value;
                // for (let i = 0; i < sav.length; i++) {
                //     r.push(parse(sav[i], tmp));
                //     if (statement.arguments.types[i] !== 'none') {
                //         let type = statement.arguments.types[i];
                //         // types.push([statement.arguments.types[i], sav[i]]);
                //         switch (type) {
                //             case 'int':
                //                 types.push(`if (parseInt(${parse(sav[i])}) !== ${parse(sav[i])}) {
                //                         throw new TypeError('"${parse(sav[i])}" should be type of int')
                //                     }`);
                //                 break;
                //             case 'string':
                //                 types.push(`if (typeof ${parse(sav[i])} !== 'string') {
                //                         throw new TypeError('"${parse(sav[i])}" should be type of string')
                //                     }`);
                //                 break;
                //         }
                //     }
                // } 
                // // console.log(types)
                // result += `(${r.join(', ')}) {
                //     ${types.length ? types.join('') : ''}
                //     ${parse(statement.value, statement.text)}
                // }`;
                
                var t = parse(statement.arguments) || ['', ''];
                result += `(${t[0]}) {
                    ${t[1]}
                    ${parse(statement.value, statement.text)}
                }`;
                break;
            case 'iife':
                // debugger
                // statement.type = 'annonymous_function'
                result += `(${parse(value)})(${statement.call_arguments.value.map(i => parse(i)).join(',')})`;
                break;
            case 'annonymous_function':
                var types = [];
                result += `${statement.async ? 'async ' : ''}function ${statement.identifier ? parse(statement.identifier) : ''}`;
                // var sav = statement.arguments.value;
                // for (let i = 0; i < sav.length; i++) {
                //     r.push(parse(sav[i], tmp));
                //     if (statement.arguments.types[i] !== 'none') {
                //         let type = statement.arguments.types[i];
                //         // types.push([statement.arguments.types[i], sav[i]]);
                //         switch (type) {
                //             case 'int':
                //                 types.push(`if (parseInt(${parse(sav[i])}) !== ${parse(sav[i])}) {
                //                         throw new TypeError('"${parse(sav[i])}" should be type of int')
                //                     }`);
                //                 break;
                //             case 'string':
                //                 types.push(`if (typeof ${parse(sav[i])} !== 'string') {
                //                         throw new TypeError('"${parse(sav[i])}" should be type of string')
                //                     }`);
                //                 break;
                //         }
                //     }
                // } 
                // console.log(types)
                if (statement.arguments)
                    var t = parse(statement.arguments)
                else var t = ['', ''];
                result += `(${t[0]}) {
                    ${t[1]}
                    ${parse(statement.value, statement.text)}
                }`;
                // result += `(${r.join(', ')}) {
                //     ${types.length ? types.join('') : ''}
                //     ${parse(statement.value, statement.text)}
                // }`;
                break;
            case 'return':
                if (value === void 0) {
                    value = 'null';
                } else {
                    value = parse(value, tmp);
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
                if (tmp && tmp != 'function') {
                    result += `return globalThis.BS.types["${tmp}"](${value});`
                    break;
                }
                result += `return ${value};`
                // result += `${t ? t + 'else ' : ''} return ${value};`;
                break;
            case 'identifier':
                result += value;
                break;
            case 'semicolon':
                result += value;
                break;
            case 'function_call':
                if (statement.identifier) {
                    result += statement.identifier;
                } else if (statement.from) {
                    result += `${parse(statement.from)}.`
                }
                if (typeof value === "object") {
                    result += '\n'+parse(value);
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
                
            // case 'arguments':
                    // result += '(';
                    // let args = [];
                    // for (let i = 0; i < value.length; i++) {
                    //     args.push(parse([value[i]]));
                    // }
                    // result += args.join(',');
                    // // result += `(${value.map(i => parse(i)).join(',')})`;
                    // result += ')';
                // break;
            case 'if_else':
                result += `if (${parse(statement.if.condition)}) {${parse(statement.if.value, tmp)}}`;
                result += ` else {${parse(statement.else.value, tmp)}}`;
                break;
            case 'if':
                result += `if (${parse(statement.condition)}) {${parse(value, tmp)}}`;
                break;
            case 'else':
                result += `else {${parse(value, tmp)}}`;
                break;
            case 'while':
                result += `while (${statement.condition}) {${parse(value, tmp)}}`;
                break;
            case 'for_loop':
                result += `for (${parse(statement.identifier).replace(';', '')}; ${parse(statement.condition)}; ${parse(statement.change)}) {${parse(value)}}`
                break;
            case 'for_in':
                result += `for (const ${parse(statement.identifier)} in ${parse(statement.iterable)}) {${parse(value, tmp)}}`
                break;
            case 'for_of':
                result += `for (const ${parse(statement.identifier)} of ${parse(statement.iterable)}) {${parse(value, tmp)}}`
                break;
            case 'sleep':
                result += `sleep(${value});`;
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
            case 'case':
                result += `case ${parse(statement.value)}:`;
                break;
            
            case 'case_default':
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
                if (statement.result) {
                    statement.type = 'annonymous_function';
                    result += `(${parse(statement)})`;
                    if (statement.call_arguments) {
                        var r = [];
                        for (let i = 0; i < statement.call_arguments.value.length; i++) {
                            r.push(parse(statement.call_arguments.value[i]));
                        }
                        result += `(${r.join(',')})`;
                        }
                }
                break;
            case 'regexp':
                result += value;
                break;
            case 'operator':
                result += value;
                break;
            case 'condition':
                if (typeof value === 'string') {
                    if (statement.left !== void 0) {
                        result += `${parse(statement.left)}${value}${parse(statement.right)}`;
                        break;
                    }
                    result += value;
                } else {
                    result += parse(value, tmp);
                }
                break;
            case 'throw':
                result += `throw ${parse(value)};`;
                break;
            case '@import':
                result += `eval(globalThis.BS.parse(globalThis.BS.ast(globalThis.BS.fs.readFileSync(${parse(value)}, 'utf8'))));`;
                break;
            case '@include':
                var content = fs.readFileSync(parse(value).slice(1, -1), 'utf8');
                // console.log(`${parse(to_ast(content))}`);
                result += `${parse(to_ast(content))}`;
                break;
            case 'eval':
                // var BS = require('./index');
                result += `eval(globalThis.BS.parse(globalThis.BS.ast(${parse(value)})));`;
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
                        console.warn(\`[Echo error]: \${err}\`);
                    }}`;
                break;
            case 'html_text':
                result += `document.createTextNode(${parse(value)})`;
                break;
            case 'html_expression':
                // doesn't work when putting value other than string
                result += `globalThis.BS.Node("${statement.opening_tag}",`;
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
                    result += `globalThis.BS.Node("${parse(value)}",`;
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
                var output = '{';
                for (let i in value) {
                    // if (value[i].type == 'identifier' && value[i].value == 'inherit') {
                    //     output += `${i}:(function (self) {return self["${i}"]})(this),`;
                    // } else {
                    if (value[i].type == 'es6_key_value') {
                        output += `${parse(value[i])},`;
                    } else {
                        output += `${i}:${parse(value[i])},`;
                    }
                    // }
                }
                output += '}';
                result += output;
                break;
            case 'keyword':
                if (value == 'this') {
                    result += 'this';
                    break;
                }
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
                    globalThis.BS.types["${parse(statement.identifier)}"] = function (${t[0]}, required = false) {
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
                var sav = statement.value;
                
                for (let i = 0; i < sav.length; i++) {
                    r.push(parse(sav[i], tmp));
                    if (statement.types[i] !== 'none') {
                        let type = statement.types[i];
                        types.push(`if (!globalThis.BS.types["${type}"](${parse(sav[i])})) throw new TypeError("Argument \\"${parse(sav[i])}\\" is not type of ${type} at line ${statement.line}, col ${statement.col}.");`);
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
                result += `${parse(statement.value)}${statement.catch ? parse(statement.catch) : 'catch (err) {}'}`
                break;
            case 'try_catch_finally':
            // debugger
                result += `${parse(statement.value)}${statement.finally ? parse(statement.finally) : ''}`
                break;
            case 'with':
            // debugger
                result += `with (${parse(statement.obj)}) {${parse(statement.value, tmp)}}`
                break;
            case 'period':
            // debugger
                result += `.`
                break;
            // case undefined: // whitespace
            //     break;
            default:
                result += '/* Unhandled expression: '+JSON.stringify(statement)+' */'
        }
    }
    return result.trim();
}
