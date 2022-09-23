module.exports = function (parse) {
    return {
        supported: ['var_assign', 'var_assign_group', 'var_reassign'],
        parse: function parseVar(statement, tmp, isReturn, caller, prepend = '', scopes) {
            let result = '';
            let value = statement.value;
            let r = [];
            switch (statement.type) {
                case 'var_assign':
                    if (statement.use_const || tmp === 'const' || statement.type_text == 'const') {
                        return `const ${parse(value, 'const')};\n`;
                    }
                    var prepend = statement.use_let ? 'let' : ''
                    var type = typeof statement.type_text === 'string' ? statement.type_text : statement.type_text.value
                    if (statement.type_text.type != 'escape') {
                        prepend = typeof statement.type_text === 'string' ? statement.type_text : ''
                        if (statement.type_text) {
                            prepend = 'let';
                        }
                    }
                    let pr = prepend;
                    if (caller == 'global' || caller == 'function')
                        pr = 'var';
                    if (typeof pr !== 'string') {
                        pr = 'let';
                    }
                    return `${pr} ${parse(value, type, prepend && prepend.trim ? prepend.trim() : prepend)};\n`;
                case 'var_assign_group':
                    if (!!value.value) value = value.value;
                    for (let i = 0; i < value.length; i++) {
                        r.push(`${parse(value[i], tmp, isReturn)}`);
                    }
                    if (statement.identifier) {
                        //if (tmp == 'const') {
                        //    return `${statement.identifier.value} = Object.freeze(${r.join()})`
                        //}
                        return `${statement.identifier.value}=${r.join()}`
                    }
                    // ! will need a check if type provided
                    return `${r.join()}`;
                case 'var_reassign':
                    let v = parse(statement.value, tmp);
                    if (tmp == 'const')
                        return `${statement.identifier.value}=${v}`;
                        //return `${statement.identifier.value} = BS.deepFreeze(${v})`;
                    if (typeof statement.identifier.value != 'string')
                        return `${parse(statement.identifier)}=${v}`;
                    //if (!scopes.has(statement.identifier.value) && tmp) {
                    //    scopes.set(statement.identifier.value, {
                    //        type: tmp.toLowerCase() != tmp ? 'let' : tmp,
                    //        value: v
                    //    });
                    //} else if (scopes.has(statement.identifier.value)) {
                    //    let obj = scopes.get(statement.identifier.value);
                    //    if (!tmp && obj.type.toLowerCase() != obj.type) {
                    //        tmp = obj.type
                    //    }
                    //}
                    if (value === void 0) {
                        return statement.identifier.value;
                    }
                    if (tmp && tmp.toLowerCase && tmp.toLowerCase() != tmp) {
                        console.log(tmp.toLowerCase())
                        return `${statement.identifier.value}=BS.expect("${statement.identifier.value}",${v},"${tmp}")`;
                    }
                    return `${statement.identifier.value}=${v}`;
            }
            return result;
        }
    }
}