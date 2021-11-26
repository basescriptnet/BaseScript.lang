module.exports = function parse (statements, tmp) {
    // statememnts must be an array, if no, make it an array
    if (!Array.isArray(statements)) 
        statements = [statements];
    let result = '';
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        let value = statement.value;
        let r = [];
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
            case 'debugger':
                result += 'debugger;';
                break;
            case 'var_assign':
                result += `${statement.use_let ? 'let ' : ''}${parse([value])};`;
                break;
            case 'var_assign_group':
                if (!!value.value) value = value.value;
                for (let i = 0; i < value.length; i++) {
                    r.push(`${parse([value[i]])}`);
                }
                result += `${r.join()}`;
                break;
            case 'var_reassign':
                result += `${parse(statement.identifier)} = ${parse([value])}`;
                break;
            case 'array':
                result += '[';
                for (let i = 0; i < value.length; i++) {
                    result += parse([value[i]]);
                    if (i !== value.length -1)
                        result += ',';
                }
                result += ']';
                break;
            case 'number':
                result += value;
                break;
            case 'string':
                result += value.indexOf('$') > -1 ? `\`${value}\`` : `"${value}"`;
                break;
            case 'null':
                result += null;
                break;
            case 'dot_retraction':
                let from = parse([statement.from]);
                let v = parse([value]);
                // console.log(from, v);
                // debugger;
                result += `${parse([statement.from])}.${parse([value])}`;
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
                result += `new ${parse(value)}`;
                break;
            case 'function_declaration':
                let types = [];
                result += `function ${parse(statement.identifier)}`;
                let sav = statement.arguments.value;
                for (let i = 0; i < sav.length; i++) {
                    r.push(parse(sav[i]));
                    if (statement.arguments.types[i] !== 'none') {
                        let type = statement.arguments.types[i];
                        // types.push([statement.arguments.types[i], sav[i]]);
                        switch (type) {
                            case 'int':
                                types.push(`if (parseInt(${parse(sav[i])}) !== ${parse(sav[i])}) {
                                        throw new TypeError('"${parse(sav[i])}" should be type of int')
                                    }`);
                                break;
                            case 'string':
                                types.push(`if (typeof ${parse(sav[i])} !== 'string') {
                                        throw new TypeError('"${parse(sav[i])}" should be type of string')
                                    }`);
                                break;
                        }
                    }
                } 
                // console.log(types)
                result += `(${r.join(', ')}) {
                    ${types.length ? types.join('') : ''}
                    ${parse(statement.value, statement.text)}
                }`;
                break;
            case 'return':
                if (value === void 0) {
                    value = 'null';
                } else {
                    value = parse(value);
                }
                switch (tmp) {
                    case 'int':
                        result += `if (parseInt(${value}) !== ${value}) {
                                throw new TypeError('Returned value should be type of int')
                            }`
                        break;
                    case 'string':
                        result += `if (typeof ${value} !== 'string') {
                                throw new TypeError('Returned value should be type of string')
                            }`
                        break;
                    default:
                        result += 'if (null) {}'
                }
                result += `else return ${value};`;
                break;
            case 'identifier':
                result += value;
                break;
            case 'semicolon':
                result += value;
                break;
            case 'function_call':
                result += '\n'+value;
                if (!statement.arguments.value.length) {
                    result += '()';
                    break;
                }
                // result += parse([statement.arguments]);
                    result += '(';
                    let args = [];
                    for (let i = 0; i < statement.arguments.value.length; i++) {
                        args.push(parse([statement.arguments.value[i]]));
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
                result += `if (${statement.if.condition}) {${parse(statement.if.value)}}`;
                result += ` else {${parse(statement.else.value)}}`;
                break;
            case 'if':
            result += `if (${parse(statement.condition)}) {${parse(value)}}`;
                break;
            case 'else':
                result += `else {${parse(value)}}`;
                break;
            case 'while':
                result += `while (${statement.condition}) {${parse(value)}}`;
                break;
            case 'sleep':
                result += `sleep(${value});`;
                break;
            case 'switch*':
                result += '(function () { let ___switch_result___ = null;';
                result += `switch (${parse([statement.value])}) {`;
                for (let i = 0; i < statement.cases.length; i++) {
                    result += parse(statement.cases[i]);
                }
                result += '} return ___switch_result___; })()';
                break;
            case 'case_with_break':
                result += `case ${parse([statement.value])}:`;
                result += `___switch_result___ = ${parse(statement.statements)};`;
                result += `break;`;
                break;
            case 'case':
                result += `case ${parse([statement.value])}:`;
                break;
            
            case 'case_default':
                result += `default: ___switch_result___ = ${parse([statement.value])};`;
                break;
            case 'expression':
                result += `${parse(value[0])} ${value[1].value} ${parse(value[2])}`;
                break;
            case 'expression_with_parenthesis':
                result += `(${parse(value)})`;
                break;
            case 'operator':
                result += value;
                break;
            default:
                result += '/* Unhandled expression: '+JSON.stringify(statement)+' */'
        }
    }
    return result.trim();
}
