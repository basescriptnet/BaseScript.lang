const functions = {
    annonymous: v => {
        // console.log(v[0][0].value)
        return assign(v[1][0], {
            type: 'annonymous_function',
            identifier: v[2] ? v[2][1] : '',
            arguments: v[4],
            value: v[7] ? v[7].map(i => i[1]) : [],
            result: v[1][0].text,
            async: v[0] ? true : false
            // text is one of the options above: string; int...
        })
    },
    annonymous_with_no_args: v => {
        // console.log(v[0][0].value)
        return assign(v[1][0], {
            type: 'annonymous_function',
            identifier: v[2] ? v[2][1] : '',
            arguments: [],
            value: v[5] ? v[5].map(i => i[1]) : [],
            result: v[1][0].text,
            result: 'iife',
            async: v[0] ? true : false
            // text is one of the options above: string; int...
        })
    },
    iife: v => {
        return ({
        type: 'iife',
        value: v[2],
        call_arguments: v[6],
    })},
    declaration: v => {
        // console.log(v[0][0].value)
        return assign(v[1][0], {
            type: 'function_declaration',
            identifier: v[3],
            arguments: v[5] ? v[5] : [],
            value: v[6],
            async: v[0] ? true : false
            // text is one of the options above: string; int...
        })
    },
    declaration_with_no_args: v => {
        // console.log(v[0][0].value)
        return assign(v[1][0], {
            type: 'function_declaration',
            identifier: v[3],
            arguments: [],
            value: v[4],
            async: v[0] ? true : false
            // text is one of the options above: string; int...
        })
    }
}
const returns = {
    value: v => assign(v[0], {
        type: 'return',
        value: v[2]
    }),
    empty: v => assign(v[0], {
        type: 'return',
        value: undefined
    })
}
const condition = {
    value: v => ({
        type: 'condition',
        value: v[0],
        line: v[0].line,
        lineBreaks: v[0].lineBreaks,
        offset: v[0].offset,
        col: v[0].col,
    }),
    ternary: v => ({
        type: 'ternary',
        left: v[4],
        right: v[5] ? v[5][3] : null,
        value: v[0],
        line: v[0].line,
        lineBreaks: v[0].lineBreaks,
        offset: v[0].offset,
        col: v[0].col,
    }),
}
const vars = {
    assign: v => {
        let f = v[0] ? v[0][0] : v[1];
        return {
            type: 'var_assign',
            use_let: v[0] && (v[0][0].value == 'let' || v[0][0].value == '\\') ? true : false,
            use_const: v[0] && v[0][0].value == 'const' ? true : false,
            line: f.line,
            col: f.col,
            value: v[1],
            offset: f.offset
        }
    },
    var_assign_list: v => {
        v[1] = v[1].map(i => assign(i[3], {type: 'var_reassign'}));
        return {
            type: 'var_assign_group',
            line: v[0].line,
            col: v[0].col,
            value: v[1] ? [v[0], ...v[1]] : [v[0]],
            offset: v[0].offset
        }
    }
}
const args = {
    empty_arguments_with_types: v => assign(v[0], {
        type: 'arguments_with_types',
        value: [],
        types: []
    }),
    arguments_with_types: v => {
        let output = [v[2].identifier];
        let types = [v[2].argument_type ? v[2].argument_type.value : 'none'];
        let cancelables = [v[2].can_be_null ? true : false];
        let values = [v[2].value];
        // console.log(output)
        // debugger
        for (let i in v[3]) {
            output.push(v[3][i][3].identifier);
            types.push(v[3][i][3].argument_type ? v[3][i][3].argument_type.value : 'none');
            values.push(v[3][i][3].value);
            cancelables.push(v[3][i][3].can_be_null ? true : false);
        }
        delete v[0].text
        return assign(v[0], {
            type: 'arguments_with_types',
            identifiers: output,
            cancelables,
            types: types,
            values
        });
    },
    empty: v => assign(v[0], {
        type: 'arguments',
        value: []
    }),
    extract: v => {
        let output = [v[2]];
        for (let i in v[3]) {
            output.push(v[3][i][3])
        }
        delete v[0].text
        return Object.assign(v[0], {
            type: 'arguments',
            value: output
        });
    }
}
const classes = {
    es6_key_value: v => ({
        type: 'es6_key_value',
        key: v[0],
        arguments: v[2],
        value: v[3],
    }),
    construct: v => ({
        type: 'construct',
        arguments: v[2],
        value: v[3]
    }),
    parse: v => assign(v[0], {
        type: 'class_declaration',
        identifier: v[2],
        construct: v[6],
        value: v[7] 
    })
}
const statement = {
    value_reassign: v => ({
        type: 'statement_value',
        value: v[0],
        line: v[0].line,
        col: v[0].col,
        lineBreak: v[0].lineBreak,
        offset: v[0].offset,
    }),
    debugger: v => assign(v[0], {type: 'debugger'}),
    delete: v => assign(v[0], {type: 'delete', value: v[2] }),
    throw: v => assign(v[0], {
        type: 'throw',
        value: v[2]
    }),
    break_continue: v => assign(v[0][0], {
        type: 'break_continue',
    }),
    echo: v => assign(v[0], {
        type: 'echo',
        value: v[2]
    }),
    eval: v => assign(v[0], {
        type: 'eval',
        value: v[2]
    }),
    import: v => assign(v[0], {
        type: '@import',
        value: v[2]
    }),
    include: v => assign(v[0], {
        type: '@include',
        value: v[2]
    }),
    value: v => ({
        type: 'statement_value',
        value: v[0],
        line: v[0].line,
        col: v[0].col,
        lineBreak: v[0].lineBreak,
        offset: v[0].offset,
    }),
}
const regexp = {
    parse: v => assign(v[0], {
        value: v[0] + (v[1] ? v[1].join('') : '')
    }),
    flag: v => v[0].value,
}
const html = {
    value_to_string: v => assign(v[0], {
        type: 'html_text',
        value: v[2]
    }),
    self_closing_tag: v => assign(v[0], {
        type: 'html',
        value: v[1],
        id: v[2] ? v[2][1] : null,
        classList: v[3].length ? v[3].map(i => i[1]) : null
    }),
    opening_tag: v => [v[1], v[2] ? v[2] : []],
    closing_tag: v => v[2],
    with_content (v) {
        if (!Array.isArray(v[0][0].value)) {
            if (v[0][0].value != v[3].value) {
                throw new Error(`Opening tag does not much the closing tag at ${v[0].line}:${v[0].col}`);
            }
        } else {
            debugger
            // add case, when attribute is not a string
        }
        //debugger

        return assign(v[0][0], {
            type: 'html_expression',
            opening_tag: v[0][0].value,
            closing_tag: v[3].value,
            value: v[1],
            attributes: v[0][1]
        })
    },
    attributes: v => {
        let output = [v[0]];
        for (let i in v[1]) {
            output.push(v[1][i][1])
        }
        return output;
        /*return Object.assign(v[0], {
            type: 'array',
            value: output
        });*/
    },
}
const array = {
    empty: v => {
        v[0].value = []
        v[0].type = 'array'
        delete v[0].text;
        return v[0]
    },
    extract: v => {
        let output = [v[2]];
        for (let i in v[3]) {
            output.push(v[3][i][3])
        }
        delete v[0].text
        return Object.assign(v[0], {
            type: 'array',
            value: output
        });
    },
    loop: v => {
        let output = [];
        let min = Math.min(v[2], v[4]);
        let max = Math.max(v[2], v[4]);
        for (let i = min; i <= max; i++) {
            output.push({
                type: 'number',
                value: i
            });
        }
        if (v[2] != min) 
            output = output.reverse()
        return Object.assign(v[0], {
            type: 'array',
            value: output
        });
    },
    slice: v => assign(v[0], {
        type: 'array_slice',
        start: v[4],
        end: v[9],
        reversed: v[7] ? true : false
    }),
}
const object = {
    empty: v => {
        v[0].value = {}
        v[0].type = 'object'
        delete v[0].text;
        return v[0]
    },
    extractObject (v) {
        let output = {};
        extractPair(v[2], output);
        for (let i in v[3]) {
            extractPair(v[3][i][3], output);
        }
        return assign(v[0], {
            type: 'object',
            value: output
        });
    },
    es6_key_value: v => [v[1], {
        type: 'es6_key_value',
        arguments: v[3],
        key: v[1],
        value: v[5],
        async: v[0] ? true : false
        // .text is the key
    }]
}
const number = {
    float: v => assign(v[0], {
        value: v[0].value.replace(/_/g, '') 
    }),
    bigInt: v => assign(v[0], {
        type: 'bigInt',
        value: v[0].value.replace(/_/g, '') + 'n'
    })
}
const string = {
    px: v => assign(v[0], {
        type: 'string',
        value: v[0].value + 'px'
    }),
    slice: v => assign(v[0], {
        type: 'string_slice',
        start: v[4],
        end: v[9],
        reversed: v[7] ? true : false
    })
}
function string_concat (v) {
    return assign(v[0], {
        value: v[0].value + v[2].value
    })
}
function Null (v) {
    // debugger
    return assign(v[0], {
        type: 'null',
        value: null
    })
}
function boolean ([v]) {
    if (v.length > 1) // ! _ value
        return assign(v[0], {type: 'boolean_reversed', value: v[2] })
    return assign(v[0], {type: 'boolean', value: v[0].value })
}
function extractPair (kv, output) {
    if (kv[0]) {
        output[kv[0]] = kv[1];
    } else {
        output[kv.text] = kv;
    }
}
const global = {};
Object.join = function (obj) {
    return {...this, ...obj};
}