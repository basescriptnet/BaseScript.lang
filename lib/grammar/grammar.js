// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    console.clear();
// const lexer = require('./lexer');
const assign = Object.assign.bind(Object);
    
const moo = require('moo');
const lexer = moo.compile({
    // comment: /\/\/.*/,
    // comment: /(?:\s*\/\/[^\n]*(?:\n+\s*|\s*))+/,
    // mandatory_space: [{
    //     match: /(?:\s*\/\/[^\n]*\n+\s+)+/, lineBreaks: true,
    // }, {
    //     match: /(?:\s+\/\/[^\n]*\n+\s*)+/, lineBreaks: true,
    // }],
    string: [
        {
            match: /"(?:\\["nrt]|[^"])*"/, value: x => x.slice(1, -1)
        },
        {
            match: /'(?:\\['nrt]|[^'\\])*'/, value: x => x.slice(1, -1)
        },
        {
            match: /`(?:\\[`nrt]|[^`\\])*`/, value: x => JSON.stringify(x).slice(2, -2), lineBreaks: true
        },
    ],
    space: [
        {
            match: /(?:\s+|\/\/[^\n]*(?:\n+\s*)?)+/, lineBreaks: true, value: v => '\n'
            // match: /(?:\s*(?:\/\/[^\n]*\n+\s*))+/, lineBreaks: true,
        },
    // {
    //     match: /\s*\/\/[^\n]*\s*/, lineBreaks: true,
    // },
    // {
    //     // match: /[^\S\r\n]+/, lineBreaks: false
    //     match: /\s+/, lineBreaks: true,
    // }
    ],
    '@constructor': 'constructor',
    keyword: ['through', 'THAT', 'DELETE', 'SAVE', 'LOG', 'ERROR', 'WRITE', 'INTO', 'PUSH', 'POP', 'SHIFT', 'UNSHIFT', 'FROM', 'Int', 'Float', 'BEGIN', 'END', 'SET', 'TO', 'typeof', 'instanceof', 'in', 'of', 'type', 'super', 'extends', 'function', 'this', 'echo', 'export', 'as', 'JSON', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while', 'if', 'else', 'import', 'from', 'let', 'const', 'null', 'of', 'default', 'caseof', 'switch', 'with', 'for', 'case', 'default', 'elif', 'debugger', 'or', 'and', 'return', 'new', 'is', 'is not', 'is greater than', 'is greater or equal to', 'is smaller than', 'is smaller or equal to', 'equal', 'throw', 'break', 'continue'].map(i => new RegExp(`\\b${i}\\b`)),
    regexp: /\/(?:\\[ ><bfnrtswSWdD.+*^$[\]{}|?:]|[^><\n\/\\])*?\//,
    operator: ['+', '-', '/', '**', '*', '%'],
    number: /(?:\+|-)?(?:[0-9]+(?:_?[0-9]+)*)(?:\.[0-9]+)?/,
    lodash: '_',
    boolean: ['true', 'false'],
    // 'false': 'false',
    'null': 'null',
    // NL: {
    //     match: /\r?\n+/, lineBreaks: true
    // },
    multiplicative_operator: /\*|\/|\*\*/,
    additive_operator: /\+|-/,
    'opening parentesis': '(',
    'closing parentesis': ')',
    double_equal: '==',
    equal: '=',
    constant: 'const',
    //variable_name: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
    identifier: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
    // hex: /#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\b/,
    '[': '[',
    ']': ']',
    // '(': '(',
    // ')': ')',
    '{': '{',
    '}': '}',
    spread: '...',
    escape: '\\',
    comma: ',',
    semicolon: ';',
    colon: ':',
    through: '..',
    period: '.',
    fat_arrow: '=>',
    '>=': '>=',
    '<=': '<=',
    '<': '<',
    '>': '>',
    // thin_arrow: '=>',
    or: '||',
    and: '&&',
    eval: '@eval',
    '@include': '@include',
    import: '@import',
    '@text': '@text',
    decorator: ['@php', '@base'],
    than: /\?|\bthan\b/,
    '|': '|',
    ampersant: '&',
    '!': '!',
    id: '#',
    asterisk: '*',
    function_name: /[A-Za-z]+/,
});


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
        // let output = [];
        // let min = Math.min(v[2], v[4]);
        // let max = Math.max(v[2], v[4]);
        // for (let i = min; i <= max; i++) {
        //     output.push({
        //         type: 'number',
        //         value: i
        //     });
        // }
        // if (v[2] != min) 
        //     output = output.reverse()
        return assign(v[0], {
            type: 'array_through',
            value: [v[2], v[6]]
        });
    },
    slice: (v, l, reject) => {
        if (v[0].type == 'debugging') return reject;
        return({
        type: 'array_slice',
        start: v[3][1],
        end: v[6] !== null ? v[6][1] : null,
        step: v[7] ? v[7][3] : null,
        value: v[0]
        // reversed: v[7] ? true : false
    })},
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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "process", "symbols": ["decorated_statements"], "postprocess": id},
    {"name": "decorated_statements", "symbols": ["_", (lexer.has("decorator") ? {type: "decorator"} : decorator), "EOL", "statements"], "postprocess":  v => ({
        	type: 'decorator',
        	line: v[1].line,
        	col: v[1].col,
        	offset: v[1].offset,
        	decorator: v[1].value,
        	value: v[3],
        }) },
    {"name": "decorated_statements", "symbols": ["statements"], "postprocess": id},
    {"name": "statements$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "statement"], "postprocess": v => v[1]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements", "symbols": ["statements$ebnf$1", "_"], "postprocess": id},
    {"name": "statement", "symbols": ["blocks"], "postprocess": id},
    {"name": "statement", "symbols": ["class_declaration"], "postprocess": id},
    {"name": "statement", "symbols": ["with"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"debugger"}, "EOL"], "postprocess": statement.debugger},
    {"name": "statement", "symbols": [{"literal":"SAVE"}, "__", "value", "EOL"], "postprocess":  v => ({
        	type: 'SAVE',
        	value: v[2]
        }) },
    {"name": "statement", "symbols": [{"literal":"DELETE"}, "__", {"literal":"THAT"}, "EOL"], "postprocess":  v => ({
        	type: 'DELETE',
        }) },
    {"name": "statement", "symbols": [{"literal":"delete"}, "__", "value", "EOL"], "postprocess": statement.delete},
    {"name": "statement", "symbols": ["return"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"throw"}, "__", "value", "EOL"], "postprocess": statement.throw},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"break"}]},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"continue"}]},
    {"name": "statement", "symbols": ["statement$subexpression$1", "EOL"], "postprocess": statement.break_continue},
    {"name": "statement", "symbols": [{"literal":"echo"}, "__", "value", "EOL"], "postprocess": statement.echo},
    {"name": "statement", "symbols": [(lexer.has("eval") ? {type: "eval"} : eval), "__", "value", "EOL"], "postprocess": statement.eval},
    {"name": "statement", "symbols": [{"literal":"@import"}, "__", "value", "EOL"], "postprocess": statement.import},
    {"name": "statement", "symbols": [{"literal":"@include"}, "__", "string", "EOL"], "postprocess": statement.include},
    {"name": "statement", "symbols": ["var_assign", "EOL"], "postprocess": id},
    {"name": "statement", "symbols": ["value_reassign", "EOL"], "postprocess": statement.value_reassign},
    {"name": "statement", "symbols": ["value", "EOL"], "postprocess": statement.value},
    {"name": "statement", "symbols": ["switch_multiple", "EOL"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "blocks", "symbols": ["function_declaration"], "postprocess": id},
    {"name": "blocks", "symbols": ["type_declaration"], "postprocess": id},
    {"name": "blocks", "symbols": ["if_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["while_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["for_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["try_catch_finally"], "postprocess": id},
    {"name": "statements_block", "symbols": ["_", {"literal":"{"}, "statements", {"literal":"}"}], "postprocess": v => v[2]},
    {"name": "statements_block", "symbols": ["_", {"literal":"BEGIN"}, "__", "statements", "_", {"literal":"END"}], "postprocess": v => v[3]},
    {"name": "statements_block", "symbols": ["_", {"literal":":"}, "_", "statement"], "postprocess": v => [v[3]]},
    {"name": "statements_block", "symbols": ["_", {"literal":"do"}, "_", "statement"], "postprocess": v => [v[3]]},
    {"name": "type_declaration", "symbols": [{"literal":"type"}, "__", "identifier", "_", "arguments_with_types", "statements_block"], "postprocess":  v => {
        	if (v[2].value[0].toUpperCase() != v[2].value[0]) {
        		throw new SyntaxError(`Type name must be capitalized.`)
        	}
        	//debugger
        	if (v[4].value.length == 0) {
        	//	throw new Error(`Type declaration requires at least one argument.`)
        	}
        	return assign(v[0], {
        		type: 'type_declaration',
        		identifier: v[2],
        		arguments: v[4],
        		value: v[5]
        	})
        } },
    {"name": "with", "symbols": [{"literal":"with"}, "__", "value", "statements_block"], "postprocess":  v => assign(v[0], {
        	type: 'with',
        	obj: v[2],
        	value: v[3]
        }) },
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": v => v[0]},
    {"name": "convert", "symbols": ["value", "__", {"literal":"as"}, "__", "convert_type"], "postprocess":  v => {
        	return {
        		type: 'convert',
        		value: v[0],
        		convert_type: v[4]
        	}
        } },
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"List"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"JSON"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"String"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Number"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Boolean"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Object"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Float"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Int"}]},
    {"name": "convert_type", "symbols": ["convert_type$subexpression$1"], "postprocess": v => v[0][0]},
    {"name": "convert_type", "symbols": [{"literal":"Array"}, {"literal":"["}, "convert_type", {"literal":"]"}], "postprocess":  v => {
        	return {
        		type: 'array_of_type',
        		value: v[2],
        		line: v[0].line,
        		col: v[0].col
        	}
        } },
    {"name": "convert_type", "symbols": [{"literal":"Array"}], "postprocess": id},
    {"name": "pair$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "pair$ebnf$1", "symbols": ["pair$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "pair$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pair", "symbols": ["pair$ebnf$1", "key", "_", "arguments_with_types", "_", "statements_block"], "postprocess": object.es6_key_value},
    {"name": "pair", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": v => [v[0], v[4]]},
    {"name": "key", "symbols": ["string"], "postprocess": id},
    {"name": "key", "symbols": ["identifier"], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": id},
    {"name": "string_concat", "symbols": ["string_concat", "__", (lexer.has("string") ? {type: "string"} : string)], "postprocess": string_concat},
    {"name": "string_concat", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "regexp_flags", "symbols": [/[gmi]/], "postprocess": regexp.flag},
    {"name": "myNull", "symbols": [{"literal":"null"}], "postprocess": Null},
    {"name": "boolean$subexpression$1", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)]},
    {"name": "boolean$subexpression$1", "symbols": [{"literal":"!"}, "_", "value"]},
    {"name": "boolean", "symbols": ["boolean$subexpression$1"], "postprocess": boolean},
    {"name": "string", "symbols": ["string_concat"], "postprocess": id},
    {"name": "string", "symbols": ["number", {"literal":"px"}], "postprocess": string.px},
    {"name": "bigInt", "symbols": [(lexer.has("number") ? {type: "number"} : number), {"literal":"n"}], "postprocess": number.bigInt},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": number.float},
    {"name": "number$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "number$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "number", "symbols": ["number$subexpression$1", "_", "value"], "postprocess":  v => ({
        	type: 'additive',
        	sign: v[0][0].value,
        	value: v[2]
        }) },
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": object.empty},
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "object$ebnf$2", "symbols": ["object$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "object$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "pair", "object$ebnf$1", "object$ebnf$2", "_", {"literal":"}"}], "postprocess": object.extractObject},
    {"name": "regexp$ebnf$1", "symbols": []},
    {"name": "regexp$ebnf$1$subexpression$1", "symbols": ["regexp_flags"]},
    {"name": "regexp$ebnf$1", "symbols": ["regexp$ebnf$1", "regexp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "regexp", "symbols": [(lexer.has("regexp") ? {type: "regexp"} : regexp), "regexp$ebnf$1"], "postprocess": regexp.parse},
    {"name": "object_retraction$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"."}, "_", "right_side_retraction"], "postprocess": v => v[3]},
    {"name": "object_retraction$ebnf$1", "symbols": ["object_retraction$ebnf$1$subexpression$1"]},
    {"name": "object_retraction$ebnf$1$subexpression$2", "symbols": ["_", {"literal":"."}, "_", "right_side_retraction"], "postprocess": v => v[3]},
    {"name": "object_retraction$ebnf$1", "symbols": ["object_retraction$ebnf$1", "object_retraction$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object_retraction", "symbols": ["single_retraction", "object_retraction$ebnf$1"], "postprocess":  v => ({
        	type: 'dot_retraction',
        	from: v[0],
        	value: v[1],
        	//value: v[0].value + '.' + v[4].value
        }) },
    {"name": "single_retraction", "symbols": ["left_side_retraction", "_", {"literal":"."}, "_", "right_side_retraction"], "postprocess":  v => ({
        	type: 'dot_retraction',
        	from: v[0],
        	value: v[4],
        	//value: v[0].value + '.' + v[4].value
        }) },
    {"name": "single_retraction", "symbols": ["left_side_retraction"], "postprocess": id},
    {"name": "right_side_retraction", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": id},
    {"name": "right_side_retraction", "symbols": ["function_call"], "postprocess": id},
    {"name": "right_side_retraction", "symbols": ["identifier"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["function_call"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": [{"literal":"("}, "_", "array_interactions", "_", {"literal":")"}], "postprocess": v => v[2]},
    {"name": "left_side_retraction", "symbols": [{"literal":"("}, "_", "convert", "_", {"literal":")"}], "postprocess": v => v[2]},
    {"name": "left_side_retraction", "symbols": ["object"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["array"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["identifier"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["string"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["bigInt"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["number"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": [{"literal":"this"}], "postprocess": id},
    {"name": "left_side_retraction", "symbols": [{"literal":"THAT"}], "postprocess": v => ({type: 'USE', line: v[0].line, col: v[0].col})},
    {"name": "left_side_retraction", "symbols": ["html"], "postprocess": id},
    {"name": "left_side_retraction", "symbols": ["boolean"], "postprocess": id},
    {"name": "switch$ebnf$1", "symbols": []},
    {"name": "switch$ebnf$1$subexpression$1", "symbols": ["_", "case_single_valued"]},
    {"name": "switch$ebnf$1", "symbols": ["switch$ebnf$1", "switch$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "switch", "symbols": [{"literal":"caseof"}, "_", "value", "_", {"literal":"{"}, "switch$ebnf$1", "_", {"literal":"}"}], "postprocess":  v => assign(v[0], {
        	type: 'switch*',
        	value: v[2],
        	cases: v[5] ? v[5].map(i => i[1]) : []
        }) },
    {"name": "case_single_valued$ebnf$1$subexpression$1", "symbols": ["value", "EOL"]},
    {"name": "case_single_valued$ebnf$1", "symbols": ["case_single_valued$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "case_single_valued$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_single_valued", "symbols": [{"literal":"|"}, "_", "value", "_", {"literal":":"}, "_", "case_single_valued$ebnf$1"], "postprocess":  v => assign(v[0], {
        	type: 'case_with_break',
        	value: v[2],
        	statements: v[6] ? v[6][0] : []
        }) },
    {"name": "case_single_valued", "symbols": [{"literal":"&"}, "_", "value", "_", {"literal":":"}, "_"], "postprocess":  v => assign(v[0], {
        	type: 'case_singular',
        	value: v[2],
        	statements: v[6] ? v[6][0] : []
        }) },
    {"name": "case_single_valued$ebnf$2$subexpression$1", "symbols": ["value", "EOL"]},
    {"name": "case_single_valued$ebnf$2", "symbols": ["case_single_valued$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case_single_valued$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_single_valued", "symbols": [{"literal":"default"}, "_", {"literal":":"}, "_", "case_single_valued$ebnf$2"], "postprocess":  v => assign(v[0], {
        	type: 'case_default_singular',
        	value: v[4] ? v[4][0] : [null],
        }) },
    {"name": "switch_multiple$ebnf$1", "symbols": []},
    {"name": "switch_multiple$ebnf$1$subexpression$1", "symbols": ["_", "case_multiline"]},
    {"name": "switch_multiple$ebnf$1", "symbols": ["switch_multiple$ebnf$1", "switch_multiple$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "switch_multiple", "symbols": [{"literal":"switch"}, "_", "value", "_", {"literal":"{"}, "switch_multiple$ebnf$1", "_", {"literal":"}"}], "postprocess":  v => assign(v[0], {
        	type: 'switch',
        	value: v[2],
        	cases: v[5] ? v[5].map(i => i[1]) : []
        }) },
    {"name": "case_multiline$ebnf$1", "symbols": []},
    {"name": "case_multiline$ebnf$1$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "case_multiline$ebnf$1", "symbols": ["case_multiline$ebnf$1", "case_multiline$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case_multiline", "symbols": [{"literal":"case"}, "_", "value", "_", {"literal":":"}, "case_multiline$ebnf$1"], "postprocess":  v => assign(v[0], {
        	type: 'case',
        	value: v[2],
        	statements: v[5] ? v[5].map(i => i[1]) : []
        }) },
    {"name": "case_multiline$ebnf$2", "symbols": []},
    {"name": "case_multiline$ebnf$2$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "case_multiline$ebnf$2", "symbols": ["case_multiline$ebnf$2", "case_multiline$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case_multiline", "symbols": [{"literal":"default"}, "_", {"literal":":"}, "_", "case_multiline$ebnf$2"], "postprocess":  v => assign(v[0], {
        	type: 'case_default',
        	value: v[4] ? v[4].map(i => i[1]) : [null],
        }) },
    {"name": "class_declaration$ebnf$1", "symbols": []},
    {"name": "class_declaration$ebnf$1$subexpression$1", "symbols": ["_", "es6_key_value"], "postprocess": v => v[1]},
    {"name": "class_declaration$ebnf$1", "symbols": ["class_declaration$ebnf$1", "class_declaration$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "class_declaration", "symbols": [{"literal":"class"}, "_", "identifier", "_", {"literal":"{"}, "_", "construct", "class_declaration$ebnf$1", "_", {"literal":"}"}], "postprocess": classes.parse},
    {"name": "construct", "symbols": [{"literal":"constructor"}, "_", "arguments_with_types", "statements_block"], "postprocess": classes.construct},
    {"name": "es6_key_value", "symbols": ["identifier", "_", "arguments_with_types", "statements_block"], "postprocess": classes.es6_key_value},
    {"name": "if_block", "symbols": [{"literal":"if"}, "statement_condition", "statements_block"], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'if',
        		condition: v[1],
        		value: v[2],
        	});
        } },
    {"name": "if_block", "symbols": ["if_block", "_", "else_block"], "postprocess":  v => {
        	return {
        		type: 'if_else',
        		if: v[0],
        		//elifs: v[1] ? v[1].map(i => i[1]) : null,
        		else: v[2],
        		offset: v[0].offset,
        		lineBreaks: v[0].lineBreaks,
        		line: v[0].line,
        		col: v[0].col
        	}
        } },
    {"name": "else_block", "symbols": [{"literal":"else"}, "__", "statement"], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'else',
        		value: [v[2]],
        	});
        } },
    {"name": "else_block", "symbols": [{"literal":"else"}, "_", {"literal":"{"}, "statements", {"literal":"}"}], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'else',
        		value: v[2],
        	});
        } },
    {"name": "try_catch_finally$ebnf$1$subexpression$1", "symbols": ["_", "finally"]},
    {"name": "try_catch_finally$ebnf$1", "symbols": ["try_catch_finally$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "try_catch_finally$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "try_catch_finally", "symbols": ["try_catch", "try_catch_finally$ebnf$1"], "postprocess":  v => ({
        	type: 'try_catch_finally',
        	value: v[0],
        	finally: v[1] ? v[1][1] : null
        }) },
    {"name": "try_catch$ebnf$1$subexpression$1", "symbols": ["_", "catch"]},
    {"name": "try_catch$ebnf$1", "symbols": ["try_catch$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "try_catch$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "try_catch", "symbols": ["try", "try_catch$ebnf$1"], "postprocess":  v => ({
        	type: 'try_catch',
        	value: v[0],
        	catch: v[1] ? v[1][1] : null
        }) },
    {"name": "try_catch", "symbols": ["try"], "postprocess":  v => ({
        	type: 'try_catch',
        	value: v[0],
        	catch: v[1] ? v[1][1] : null
        }) },
    {"name": "try", "symbols": [{"literal":"try"}, "__", "statements_block"], "postprocess":  v => ({
        	type: 'try',
        	value: v[2]
        }) },
    {"name": "try", "symbols": [{"literal":"try"}, "_", {"literal":":"}, "_", "statement"], "postprocess":  v => ({
        	type: 'try',
        	value: v[4]
        }) },
    {"name": "catch", "symbols": [{"literal":"catch"}, "__", "identifier", "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[3],
        		identifier: v[2].value,
        
        	}
        } },
    {"name": "catch", "symbols": [{"literal":"catch"}, "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[1],
        		identifier: 'err',
        	}
        } },
    {"name": "finally", "symbols": [{"literal":"finally"}, "statements_block"], "postprocess":  v => {
        	//debugger
        	return ({
        		type: 'finally',
        		value: v[1],
        	})
        } },
    {"name": "value_reassign$subexpression$1", "symbols": ["switch"]},
    {"name": "value_reassign$subexpression$1", "symbols": ["value"]},
    {"name": "value_reassign", "symbols": ["value", "_", {"literal":"="}, "_", "value_reassign$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "value_reassign$subexpression$2", "symbols": ["switch"]},
    {"name": "value_reassign$subexpression$2", "symbols": ["value"]},
    {"name": "value_reassign", "symbols": [{"literal":"SET"}, "_", "value", "_", {"literal":"TO"}, "_", "value_reassign$subexpression$2"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[2],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[6][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_assign$subexpression$1", "symbols": [{"literal":"let"}, "__"]},
    {"name": "var_assign$subexpression$1", "symbols": [{"literal":"const"}, "__"]},
    {"name": "var_assign$subexpression$1", "symbols": [{"literal":"\\"}]},
    {"name": "var_assign", "symbols": ["var_assign$subexpression$1", "var_assign_list"], "postprocess": vars.assign},
    {"name": "var_assign$subexpression$2", "symbols": ["switch"]},
    {"name": "var_assign$subexpression$2", "symbols": ["value"]},
    {"name": "var_assign", "symbols": [{"literal":"ASSIGN"}, "_", "var_assign$subexpression$2", "_", {"literal":"TO"}, "_", "identifier"], "postprocess":  v => {
        	return {
        		type: 'var_assign',
        		use_let: true,
        		identifier: v[6],
        		line: v[0].line,
        		col: v[0].col,
        		value: {
        			type: 'var_assign_group',
        			identifier: v[6],
        			value: [v[2][0]]
        		},
        		offset: v[0].offset
        	}
        } },
    {"name": "var_assign_list$ebnf$1", "symbols": []},
    {"name": "var_assign_list$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "var_reassign"]},
    {"name": "var_assign_list$ebnf$1", "symbols": ["var_assign_list$ebnf$1", "var_assign_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "var_assign_list", "symbols": ["var_reassign", "var_assign_list$ebnf$1"], "postprocess": vars.var_assign_list},
    {"name": "var_reassign$subexpression$1", "symbols": ["switch"]},
    {"name": "var_reassign$subexpression$1", "symbols": ["value"]},
    {"name": "var_reassign", "symbols": ["identifier", "_", {"literal":"="}, "_", "var_reassign$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_reassign$subexpression$2", "symbols": ["switch"]},
    {"name": "var_reassign$subexpression$2", "symbols": ["value"]},
    {"name": "var_reassign", "symbols": [{"literal":"SET"}, "_", "identifier", "_", {"literal":"TO"}, "_", "var_reassign$subexpression$2"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "while_block", "symbols": [{"literal":"while"}, "statement_condition", "statements_block"], "postprocess":   v => {
        	return Object.assign(v[0], {
        		type: 'while',
        		condition: v[1],
        		value: v[2],
        	});
        } },
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"in"}]},
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"of"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "identifier", "__", "for_block$subexpression$1", "__", "value", "statements_block"], "postprocess":   v => {
        	return Object.assign(v[0], {
        		type: 'for_' + v[4][0],
        		condition: v[1],
        		identifier: v[2],
        		iterable: v[6],
        		value: v[7],
        	});
        } },
    {"name": "for_block$subexpression$2", "symbols": ["var_assign"]},
    {"name": "for_block$subexpression$2", "symbols": ["var_assign_list"]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "for_block$subexpression$2", "_", {"literal":";"}, "_", "statement_condition", "_", {"literal":";"}, "_", "value_reassign", "statements_block"], "postprocess":   v => {
        	return Object.assign(v[0], {
        		type: 'for_loop',
        		condition: v[6],
        		identifier: v[2][0],
        		change: v[10],
        		value: v[11],
        	});
        } },
    {"name": "function_declaration$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "function_declaration$ebnf$1", "symbols": ["function_declaration$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "function_declaration", "symbols": ["function_declaration$ebnf$1", "function_declaration$subexpression$1", "__", "identifier", "_", "arguments_with_types", "statements_block"], "postprocess": functions.declaration},
    {"name": "function_declaration$ebnf$2$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "function_declaration$ebnf$2", "symbols": ["function_declaration$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "function_declaration$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function_declaration$subexpression$2", "symbols": [{"literal":"function"}]},
    {"name": "function_declaration", "symbols": ["function_declaration$ebnf$2", "function_declaration$subexpression$2", "__", "identifier", "statements_block"], "postprocess": functions.declaration_with_no_args},
    {"name": "annonymous_function$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "annonymous_function$ebnf$1", "symbols": ["annonymous_function$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "annonymous_function$ebnf$2$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "annonymous_function$ebnf$2", "symbols": ["annonymous_function$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$ebnf$3", "symbols": []},
    {"name": "annonymous_function$ebnf$3$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "annonymous_function$ebnf$3$subexpression$1", "symbols": ["_", "return"]},
    {"name": "annonymous_function$ebnf$3", "symbols": ["annonymous_function$ebnf$3", "annonymous_function$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "annonymous_function", "symbols": ["annonymous_function$ebnf$1", "annonymous_function$subexpression$1", "annonymous_function$ebnf$2", "_", "arguments_with_types", "_", {"literal":"{"}, "annonymous_function$ebnf$3", "_", {"literal":"}"}], "postprocess": functions.annonymous},
    {"name": "annonymous_function$ebnf$4$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "annonymous_function$ebnf$4", "symbols": ["annonymous_function$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$subexpression$2", "symbols": [{"literal":"function"}]},
    {"name": "annonymous_function$ebnf$5$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "annonymous_function$ebnf$5", "symbols": ["annonymous_function$ebnf$5$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$ebnf$6", "symbols": []},
    {"name": "annonymous_function$ebnf$6$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "annonymous_function$ebnf$6$subexpression$1", "symbols": ["_", "return"]},
    {"name": "annonymous_function$ebnf$6", "symbols": ["annonymous_function$ebnf$6", "annonymous_function$ebnf$6$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "annonymous_function", "symbols": ["annonymous_function$ebnf$4", "annonymous_function$subexpression$2", "annonymous_function$ebnf$5", "_", {"literal":"{"}, "annonymous_function$ebnf$6", "_", {"literal":"}"}], "postprocess": functions.annonymous_with_no_args},
    {"name": "annonymous_function", "symbols": ["iife"], "postprocess": id},
    {"name": "iife", "symbols": [{"literal":"("}, "_", "annonymous_function", "_", {"literal":")"}, "_", "arguments"], "postprocess": functions.iife},
    {"name": "return", "symbols": [{"literal":"return"}, "__", "value", "EOL"], "postprocess": returns.value},
    {"name": "function_call$ebnf$1", "symbols": []},
    {"name": "function_call$ebnf$1", "symbols": ["function_call$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "function_call", "symbols": ["callable", "function_call$ebnf$1", "arguments"], "postprocess":  v => {
        	return ({
        		type: 'function_call',
        		value: v[0],
        		arguments: v[2],
        		//identifier: v[0].value
        	})
        } },
    {"name": "callable", "symbols": ["function_call"], "postprocess": id},
    {"name": "callable", "symbols": ["identifier"], "postprocess": id},
    {"name": "arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": args.empty},
    {"name": "arguments$ebnf$1", "symbols": []},
    {"name": "arguments$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "arguments$ebnf$1", "symbols": ["arguments$ebnf$1", "arguments$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments$ebnf$2", "symbols": ["arguments$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "arguments$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments", "symbols": [{"literal":"("}, "_", "value", "arguments$ebnf$1", "arguments$ebnf$2", "_", {"literal":")"}], "postprocess": args.extract},
    {"name": "arguments_with_types", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": args.empty_arguments_with_types},
    {"name": "arguments_with_types$ebnf$1", "symbols": []},
    {"name": "arguments_with_types$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "argument_identifier_and_value"]},
    {"name": "arguments_with_types$ebnf$1", "symbols": ["arguments_with_types$ebnf$1", "arguments_with_types$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments_with_types$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments_with_types$ebnf$2", "symbols": ["arguments_with_types$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "arguments_with_types$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments_with_types", "symbols": [{"literal":"("}, "_", "argument_identifier_and_value", "arguments_with_types$ebnf$1", "arguments_with_types$ebnf$2", "_", {"literal":")"}], "postprocess": args.arguments_with_types},
    {"name": "argument_type$subexpression$1", "symbols": ["identifier"]},
    {"name": "argument_type$subexpression$1", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)]},
    {"name": "argument_type$ebnf$1", "symbols": [{"literal":"?"}], "postprocess": id},
    {"name": "argument_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_type", "symbols": ["argument_type$subexpression$1", "argument_type$ebnf$1", "__"], "postprocess":  v => {
        	v[0] = v[0][0]
        	let n = v[0].value[0];
        	if (n.toUpperCase() != n) {
        		throw new SyntaxError(`Argument type must be capitalized at line ${v[0].line}, col ${v[0].col}.`);
        	}
        	return [v[0], v[1]];
        } },
    {"name": "argument_identifier_and_value$ebnf$1", "symbols": ["argument_type"], "postprocess": id},
    {"name": "argument_identifier_and_value$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_identifier_and_value$ebnf$2$subexpression$1", "symbols": ["_", {"literal":"="}, "_", "value"]},
    {"name": "argument_identifier_and_value$ebnf$2", "symbols": ["argument_identifier_and_value$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "argument_identifier_and_value$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_identifier_and_value", "symbols": ["argument_identifier_and_value$ebnf$1", "identifier", "argument_identifier_and_value$ebnf$2"], "postprocess":  v => ({
        	type: 'argument_identifier_and_value',
        	argument_type: v[0][0],
        	can_be_null: v[0][1],
        	identifier: v[1],
        	value: v[2] ? v[2][3] : undefined
        }) },
    {"name": "comparision_operators", "symbols": [{"literal":"is greater than"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is greater or equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is smaller than"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is smaller or equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is not equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is not"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '===' })},
    {"name": "comparision_operators", "symbols": [{"literal":"=="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"!="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"==="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '===' })},
    {"name": "comparision_operators", "symbols": [{"literal":"!=="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!==' })},
    {"name": "comparision_operators", "symbols": [{"literal":">="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"<="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"<"}], "postprocess": v =>assign(v[0], {type: 'comparision_operator', value:  '<' })},
    {"name": "comparision_operators", "symbols": [{"literal":">"}], "postprocess": v =>assign(v[0], {type: 'comparision_operator', value:  '>' })},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"and"}]},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"or"}]},
    {"name": "condition", "symbols": ["condition", "__", "condition$subexpression$1", "__", "condition"], "postprocess":  v => {
        	return {
        		type: 'condition_group',
        		value: [v[0], v[4]],
        		separator: ' ' + v[2][0] + ' ',
        		line: v[0].line,
        		lineBreaks: v[0].lineBreaks,
        		offset: v[0].offset,
        		col: v[0].col,
        	}
        } },
    {"name": "condition", "symbols": ["value", "_", "comparision_operators", "_", "value"], "postprocess":  v => {
        	return {
        		type: 'condition',
        		left: v[0],
        		right: v[4],
        		value: v[2].value,
        		line: v[0].line,
        		lineBreaks: v[0].lineBreaks,
        		offset: v[0].offset,
        		col: v[0].col,
        	}
        } },
    {"name": "condition", "symbols": ["value"], "postprocess": condition.value},
    {"name": "statement_condition", "symbols": ["__", "condition"], "postprocess": v => v[1]},
    {"name": "statement_condition", "symbols": ["_", {"literal":"("}, "_", "condition", "_", {"literal":")"}], "postprocess": v => v[3]},
    {"name": "debugging", "symbols": [{"literal":"LOG"}, "_", "value"], "postprocess":  v => ({
        	type: 'debugging',
        	method: 'log',
        	value: v[2]
        }) },
    {"name": "debugging", "symbols": [{"literal":"ERROR"}, "_", "value"], "postprocess":  v => ({
        	type: 'debugging',
        	method: 'error',
        	value: v[2]
        }) },
    {"name": "debugging", "symbols": [{"literal":"WRITE"}, "_", "value"], "postprocess":  v => ({
        	type: 'debugging',
        	method: 'write',
        	value: v[2]
        }) },
    {"name": "html$ebnf$1", "symbols": []},
    {"name": "html$ebnf$1$subexpression$1", "symbols": ["_", "html_content"]},
    {"name": "html$ebnf$1", "symbols": ["html$ebnf$1", "html$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html", "symbols": ["opening_tag", "html$ebnf$1", "_", "closing_tag"], "postprocess": html.with_content},
    {"name": "html$ebnf$2$subexpression$1", "symbols": [{"literal":"#"}, "identifier"]},
    {"name": "html$ebnf$2", "symbols": ["html$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "html$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "html$ebnf$3", "symbols": []},
    {"name": "html$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "identifier"]},
    {"name": "html$ebnf$3", "symbols": ["html$ebnf$3", "html$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html", "symbols": [{"literal":"<"}, "identifier", "html$ebnf$2", "html$ebnf$3", {"literal":"/"}, {"literal":">"}], "postprocess": html.self_closing_tag},
    {"name": "html", "symbols": [{"literal":"@text"}, "__", "value"], "postprocess": html.value_to_string},
    {"name": "opening_tag$ebnf$1$subexpression$1", "symbols": ["__", "attrubutes"], "postprocess": v => v[1]},
    {"name": "opening_tag$ebnf$1", "symbols": ["opening_tag$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "opening_tag$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "opening_tag", "symbols": [{"literal":"<"}, "identifier", "opening_tag$ebnf$1", "_", {"literal":">"}], "postprocess": html.opening_tag},
    {"name": "closing_tag", "symbols": [{"literal":"<"}, {"literal":"/"}, "identifier", {"literal":">"}], "postprocess": html.closing_tag},
    {"name": "html_content", "symbols": ["string"], "postprocess": id},
    {"name": "html_content", "symbols": ["html"], "postprocess": id},
    {"name": "attrubutes$ebnf$1", "symbols": []},
    {"name": "attrubutes$ebnf$1$subexpression$1", "symbols": ["__", "var_reassign"]},
    {"name": "attrubutes$ebnf$1", "symbols": ["attrubutes$ebnf$1", "attrubutes$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attrubutes", "symbols": ["var_reassign", "attrubutes$ebnf$1"], "postprocess": html.attributes},
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": array.empty},
    {"name": "array$ebnf$1", "symbols": []},
    {"name": "array$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "array$ebnf$2", "symbols": ["array$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "array$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$1", "array$ebnf$2", "_", {"literal":"]"}], "postprocess": array.extract},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "_", {"literal":"through"}, "_", "value", "_", {"literal":"]"}], "postprocess": array.loop},
    {"name": "array_interactions$subexpression$1", "symbols": [{"literal":"PUSH"}]},
    {"name": "array_interactions$subexpression$1", "symbols": [{"literal":"UNSHIFT"}]},
    {"name": "array_interactions", "symbols": ["array_interactions$subexpression$1", "_", "value", "_", {"literal":"INTO"}, "_", "value"], "postprocess":  v => ({
        	type: 'array_interactions',
        	method: v[0][0],
        	into: v[6],
        	value: v[2],
        	line: v[0].line,
        	col: v[0].col
        }) },
    {"name": "array_interactions$subexpression$2", "symbols": [{"literal":"POP"}]},
    {"name": "array_interactions$subexpression$2", "symbols": [{"literal":"SHIFT"}]},
    {"name": "array_interactions", "symbols": ["array_interactions$subexpression$2", "_", "value"], "postprocess":  v => ({
        	type: 'array_interactions',
        	method: v[0][0],
        	value: v[2],
        	line: v[0].line,
        	col: v[0].col
        }) },
    {"name": "array_interactions", "symbols": [{"literal":"..."}, "value"], "postprocess":  v => ({
        	type: 'array_interactions',
        	method: 'spread',
        	value: v[1],
        	line: v[0].line,
        	col: v[0].col
        }) },
    {"name": "expression", "symbols": ["debugging"], "postprocess": id},
    {"name": "expression", "symbols": ["object_retraction"], "postprocess": id},
    {"name": "expression$subexpression$1", "symbols": ["_", "value"]},
    {"name": "expression$ebnf$1$subexpression$1", "symbols": ["_", "value"]},
    {"name": "expression$ebnf$1", "symbols": ["expression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "expression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "expression$ebnf$2$subexpression$1", "symbols": ["_", {"literal":":"}, "_", "value"]},
    {"name": "expression$ebnf$2", "symbols": ["expression$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "expression$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "expression", "symbols": ["value", "_", {"literal":"["}, "expression$subexpression$1", "_", {"literal":":"}, "expression$ebnf$1", "expression$ebnf$2", "_", {"literal":"]"}], "postprocess": array.slice},
    {"name": "expression$subexpression$2", "symbols": [{"literal":"+"}, {"literal":"="}]},
    {"name": "expression$subexpression$2", "symbols": [{"literal":"-"}, {"literal":"="}]},
    {"name": "expression$subexpression$2", "symbols": [{"literal":"*"}, {"literal":"="}]},
    {"name": "expression$subexpression$2", "symbols": [{"literal":"/"}, {"literal":"="}]},
    {"name": "expression", "symbols": ["expression", "_", "expression$subexpression$2", "_", "expression"], "postprocess":  v => ({
        	type: 'expression',
        	value: [v[0], assign(v[2][0], {value: v[2][0].value+'='}), v[4]]
        }) },
    {"name": "expression$subexpression$3", "symbols": [{"literal":"**"}]},
    {"name": "expression$subexpression$3", "symbols": [{"literal":"*"}]},
    {"name": "expression$subexpression$3", "symbols": [{"literal":"+"}]},
    {"name": "expression$subexpression$3", "symbols": [{"literal":"-"}]},
    {"name": "expression$subexpression$3", "symbols": [{"literal":"/"}]},
    {"name": "expression$subexpression$3", "symbols": [{"literal":"%"}]},
    {"name": "expression", "symbols": ["expression", "_", "expression$subexpression$3", "_", "expression"], "postprocess":  v => ({
        	type: 'expression',
        	value: [v[0], v[2][0], v[4]]
        }) },
    {"name": "expression", "symbols": ["annonymous_function"], "postprocess": id},
    {"name": "expression$ebnf$3$subexpression$1", "symbols": ["_", "arguments"]},
    {"name": "expression$ebnf$3", "symbols": ["expression$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "expression$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "expression", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}, "expression$ebnf$3"], "postprocess":  v => ({
        	type: 'expression_with_parenthesis',
        	value: v[2],
        	arguments: v[5] ? v[5][1] : null
        }) },
    {"name": "expression", "symbols": ["convert"], "postprocess": id},
    {"name": "expression", "symbols": ["array_interactions"], "postprocess": id},
    {"name": "expression", "symbols": ["regexp"], "postprocess": id},
    {"name": "expression", "symbols": ["function_call"], "postprocess": id},
    {"name": "expression", "symbols": ["identifier"], "postprocess": id},
    {"name": "expression", "symbols": ["array"], "postprocess": id},
    {"name": "expression", "symbols": ["string"], "postprocess": id},
    {"name": "expression", "symbols": ["bigInt"], "postprocess": id},
    {"name": "expression", "symbols": ["number"], "postprocess": id},
    {"name": "expression", "symbols": [{"literal":"this"}], "postprocess": id},
    {"name": "expression", "symbols": [{"literal":"THAT"}], "postprocess": v => ({type: 'USE', line: v[0].line, col: v[0].col})},
    {"name": "expression", "symbols": ["html"], "postprocess": id},
    {"name": "expression", "symbols": ["object"], "postprocess": id},
    {"name": "expression", "symbols": ["boolean"], "postprocess": id},
    {"name": "expression", "symbols": ["convert"], "postprocess": id},
    {"name": "value", "symbols": [{"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'expression_with_parenthesis',
        	value: v[2]
        }) },
    {"name": "value$ebnf$1$subexpression$1", "symbols": ["_", "arguments"]},
    {"name": "value$ebnf$1", "symbols": ["value$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "value$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value", "symbols": ["value", "_", {"literal":"["}, "_", "value", "_", {"literal":"]"}, "value$ebnf$1"], "postprocess":  v => {
        //debugger
        	return {
        		type: 'item_retraction',
        		arguments: v[7] ? v[7][1] : null,
        		from: v[0],
        		value: v[4]
        		//identifier: v[0].value
        	}
        } },
    {"name": "value", "symbols": ["expression"], "postprocess": id},
    {"name": "value", "symbols": [{"literal":"typeof"}, "__", "value"], "postprocess":  v => ({
        	type: 'typeof',
        	value: v[2]
        }) },
    {"name": "value$subexpression$1", "symbols": [{"literal":"new"}]},
    {"name": "value$subexpression$1", "symbols": [{"literal":"await"}]},
    {"name": "value$subexpression$1", "symbols": [{"literal":"yield"}]},
    {"name": "value", "symbols": ["value$subexpression$1", "__", "value"], "postprocess":  v => {
        	return assign(v[0][0], {
        		type: v[0][0].text,
        		value: v[2]
        	})
        } },
    {"name": "value", "symbols": [{"literal":"@text"}, "__", "value"], "postprocess": html.value_to_string},
    {"name": "value", "symbols": ["value", "__", {"literal":"instanceof"}, "__", "value"], "postprocess":  v => ({
        	type: 'instanceof',
        	left: v[0],
        	value: v[4]
        }) },
    {"name": "value$ebnf$2$subexpression$1", "symbols": ["_", {"literal":":"}, "_", "value"]},
    {"name": "value$ebnf$2", "symbols": ["value$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "value$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value", "symbols": ["condition", "_", {"literal":"?"}, "_", "value", "value$ebnf$2"], "postprocess": condition.ternary},
    {"name": "value", "symbols": ["switch"], "postprocess": id},
    {"name": "value", "symbols": ["myNull"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["identifier"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["function_call"], "postprocess": id},
    {"name": "prefixExp", "symbols": [{"literal":"this"}], "postprocess": id},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": v => ''},
    {"name": "_", "symbols": [], "postprocess": v => ''},
    {"name": "__", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": v => ' '},
    {"name": "EOL", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": v => 'EOL'},
    {"name": "EOL", "symbols": ["_", {"literal":";"}], "postprocess": v => v[1]}
]
  , ParserStart: "process"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
