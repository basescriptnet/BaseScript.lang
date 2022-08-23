module.exports = function (parse) {
    return {
        supported: ['safeValue', 'defined', 'array', 'array_through', 'number', 'bigInt', 'string', 'null', 'boolean', 'regexp', 'new.target', 'object'],
        parse: function parsePrimitive(statement, tmp, isReturn, caller, prepend = '') {
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
    }
}