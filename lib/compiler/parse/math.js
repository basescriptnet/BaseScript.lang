module.exports = function (parse) {
    return {
        supported: ['pow', 'sum', 'operator', 'product', 'opening parentesis', 'closing parentesis'],
        parse: function parseMath(statement, tmp, isReturn, caller, prepend = '') {
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
    }
}