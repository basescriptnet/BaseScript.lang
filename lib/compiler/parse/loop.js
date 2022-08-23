module.exports = function (parse) {
    return {
        supported: ['while', 'for_loop', 'for_in', 'for_of'],
        parse: function parseLoop(statement, tmp, isReturn, caller, prepend = '') {
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
    }
}