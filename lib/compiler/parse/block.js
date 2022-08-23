module.exports = function (parse) {
    return {
        supported: ['try', 'catch', 'finally', 'try_catch', 'try_catch_finally', 'with', 'type_declaration', 'operator_declaration', 'switch', 'case', 'case_default', 'case_default_singular', 'case_singular', 'case_with_break', 'switch*'],
        parse: function parseBlock(statement, tmp, isReturn, caller, prepend = '') {
            let result = '';
            let value = statement.value;
            switch (statement.type) {
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
                case 'case':
                    result += `case ${parse(value, tmp, isReturn)}:`;
                    for (let i = 0; i < statement.statements.length; i++) {
                        result += parse(statement.statements[i], tmp, isReturn);
                    }
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
    }
}