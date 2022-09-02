module.exports = function (parse) {
    return {
        supported: ['delete', 'debugger', 'debugging', 'statement_value', 'return', 'swap', 'break_continue', 'class_declaration', 'construct', 'semicolon'],
        parse: function parseStatement(statement, tmp, isReturn, caller, prepend = '') {
            let result = '';
            let value = statement.value;
            switch (statement.type) {
                case 'semicolon':
                    return value;
                case 'construct':
                    var args = parse(statement.arguments) || ['', ''];
                    return `constructor (${args[0]}) {\
                        ${args[1]}
                        ${parse(value, tmp)}
                    }`;
                case 'class_declaration':
                    return `class ${parse(statement.identifier)} {
                        ${parse(statement.construct)}
                        ${value ? value.map(i => parse(i)).join('\n') : ''}
                    }`;
                case 'break_continue':
                    return `${value};`;
                case 'swap':
                    // tmp -> [a, b] = [b, a]
                    return `(function () {var tmp = ${parse(statement.left)};${parse(statement.right)} = ${parse(statement.left)};${parse(statement.left)} = tmp;}).call(this);`;
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
                    var t = '';
                    //if (tmp && tmp != 'function' && isReturn) {
                    //    return `return BS.types["${tmp}"](${value});`
                    //}
                    if (!tmp) return `return ${value};`;

                    if (tmp[0][0] != 'function' && tmp[0][0] != 'def' && tmp[0][0] !== void 0) {
                        if (tmp[0][0] == 'void') {
                            return `return void(${value});`
                        }
                        return `return BS.expectValue(${value}, [${tmp}]);`
                    }
                    return `return ${value};`
                case 'statement_value':
                    return `${parse(value, tmp, null, 'statement')};`;
                case 'delete':
                    if (value.type === 'item_retraction') {
                        return `BS.delete(${parse(value.from)}, ${parse(value.value)});`;
                    }
                    return `delete ${parse(value)};`
                case 'debugger':
                    return 'debugger;';
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
                }
            }
            return result;
        }
    }
}