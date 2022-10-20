module.exports = function (parse) {
    return {
        supported: ['custom_operator', 'operator', 'opening parentesis', 'closing parentesis'],
        parse: function parseMath(statement, tmp, isReturn, caller, prepend = '', scopes, useComplexMath = false) {
            let result = '';
            let value = statement.value;
            switch (statement.type) {
                case 'opening parentesis':
                case 'closing parentesis':
                    return value;
                case 'custom_operator':
                    return `BS.customOperators["${parse(statement.operator)}"](${parse(statement.left)}, ${parse(statement.right)})`;
                case 'operator':
                    if (typeof value == 'string') {
                        return value;
                    }
                    return parse(value);
            }
            return result;
        }
    }
}