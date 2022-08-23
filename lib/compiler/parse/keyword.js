module.exports = function (parse) {
    return {
        supported: ['throw', 'new', 'await', 'yield', 'typeof', 'sizeof', 'instanceof', 'in', 'void', 'global'],
        parse: function parseKeyword(statement, tmp, isReturn, caller, prepend = '') {
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
                case 'void':
                    return `void(${value.value.length ? parse(value.value[0]) : 0})`;
                case 'global':
                    return `let ${value.value} = (globalThis !== null && globalThis !== void 0) ? globalThis.${value.value} : undefined;\n`
            }
            return result;
        }
    }
}