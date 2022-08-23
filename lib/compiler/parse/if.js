module.exports = function (parse) {
    return {
        supported: ['if', 'else', 'if_else'],
        parse: function parseIf(statement, tmp, isReturn, caller, prepend = '') {
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
    }
}