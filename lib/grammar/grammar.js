// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    console.clear();
// const lexer = require('./lexer');
const assign = Object.assign.bind(Object);

let HTML_ALLOWED = false;
    let rand = [(Math.random() + 1).toString(36).substring(7), (Math.random() + 1).toString(36).substring(7)].join('').slice(4, 10);
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
            match: /"(?:\\["nrt]|[^"\\])*"/, value: x => x.slice(1, -1)
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
            //match: /(?:\s+|\/\/[^\n]*(?:\n+\s*)?)+/,
            // this is test, the one on the top works
            //match: /(?:\s+|\/\/[^\n]*(?:\n+\s*)?|\/\*[^]*?\*\/)+/,
            match: /(?:\s+|\/\/[^\n]*(?:\n+\s*)?)+/,
            lineBreaks: true,
            value: v => v.replace(/\/\/[^\n]*/g, '')
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
    //'@constructor': 'constructor',
    keyword: ['void', 'defined', 'safeValue', 'swap', 'namespace', 'Boolean', 'Number', 'String', 'Array', 'Object', 'unless', 'than', 'constructor', 'null', 'const', 'print', 'var',
        'sizeof', 'Infinity', 'NaN', 'undefined', 'globalThis', 'through', 'delete', 'THAT', 'DELETE', 'SAVE', 'LOG', 'ERROR', 'WRITE', 'INTO', 'PUSH',
        'POP', 'SHIFT', 'UNSHIFT', 'FROM', 'Int', 'Float', 'BEGIN', 'END', 'SET', 'TO', 'typeof', 'instanceof', 'in', 'of', 'type', 'super',
        'extends', 'function', 'def', 'this', 'echo', 'export', 'as', 'JSON', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while',
        'if', 'else', 'import', 'from', 'let', 'const', 'null', 'of', 'default', 'caseof', 'switch', 'with', 'for', 'case', 'default', 'elif',
        'debugger', 'or', 'and', 'return', 'new', 'is', 'not', 'throw', 'break', 'continue'].map(i => new RegExp(`\\b${i}\\b`)),
    //regexp: /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/,
    regexp: /\/(?:\\[ ><bfnrtsSwWdD.+*^$[\]{}|?:\\]|[^><\n\/\\])*?\//,
    operator: ['+', '-', '/', '**', '*', '%'],
    // ! is not tested
    bigInt: /(?:\+|-)?(?:[0-9]+(?:_?[0-9]+)*)n/,
    number: /(?:\+|-)?(?:[0-9]+(?:_?[0-9]+)*)(?:\.[0-9]+)?/,
    boolean: ['true', 'false'],
    // 'false': 'false',
    //'null': 'null',
    // NL: {
    //     match: /\r?\n+/, lineBreaks: true
    // },
    //multiplicative_operator: /\*|\/|\*\*/,
    //additive_operator: /\+|-/,
    'opening parentesis': '(',
    'closing parentesis': ')',
    fat_arrow: '=>',
    type_unequal: '!==',
    type_equal: '===',
    unequal: '!=',
    double_equal: '==',
    equal: '=',
    //constant: 'const',
    //variable_name: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
    identifier: [
        {
            match: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
        },
        {
            match: /(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
            value: x => 'emoji_var' + rand + x.codePointAt(),
        }
    ],
    //lodash: '_',
    // hex: /#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\b/,
    '[': '[',
    ']': ']',
    // '(': '(',
    // ')': ')',
    //'{{': '{{',
    //'}}': '}}',
    '{': '{',
    '}': '}',
    spread: '...',
    escape: '\\',
    comma: ',',
    semicolon: ';',
    double_colon: '::',
    colon: ':',
    through: '..',
    '??': '??',
    '?.': '?.',
    '?': '?',
    period: '.',
    '>=': '>=',
    '<=': '<=',
    '<': '<',
    '>': '>',
    // thin_arrow: '=>',
    or: '||',
    and: '&&',
    eval: '@eval',
    at: '@',
    '@include': '@include',
    '#include': '#include',
    import: '@import',
    '@text': '@text',
    decorator: [/*'@php', */'@js'],
    //than: /\?|\bthan\b/,
    '|': '|',
    ampersant: '&',
    '!': '!',
    id: '#',
    asterisk: '*',
    //function_name: /[A-Za-z]+/
});


    const functions = {
    annonymous: v => {
        // console.log(v[0][0].value)
        return assign(v[1][0], {
            type: 'annonymous_function',
            identifier: v[2] ? v[2][1] : '',
            arguments: v[4],
            value: v[5],
            declarator: v[1][0].value,
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
            value: v[3] ? v[3] : [],
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
        //debugger
        return assign(v[1][0], {
            type: 'function_declaration',
            async: v[0] ? true : false,
            identifier: v[3],
            arguments: [],
            value: v[4],
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
        type: 'value',
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
    ternary_with_if: v => ({
        type: 'ternary',
        left: v[0],
        right: v[5] ? v[5][3] : null,
        value: v[4],
        line: v[0].line,
        lineBreaks: v[0].lineBreaks,
        offset: v[0].offset,
        col: v[0].col,
    }),
}
const vars = {
    assign: v => {
        let f = v[0] ? v[0] : v[1];
        let k = v[0] ? v[0] : '';
        return {
            type: 'var_assign',
            use_let: v[0] && (v[0].value != 'const') ? true : false,
            use_const: v[0] && v[0].value == 'const' ? true : false,
            type_text: k,
            line: f.line,
            col: f.col,
            value: v[1],
            offset: f.offset
        }
    },
    var_assign_list: v => {
        //debugger
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
    swap: v => assign(v[0], {
        type: 'swap',
        left: v[2],
        right: v[6]
    }),
    namespace: v => assign(v[0], {
        type: 'namespace',
        value: v[2]
    }),
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
        value: v[3]
    }),
    // insert_value_as_string: v => v[2]
    self_closing_tag: v => assign(v[0], {
        type: 'html',
        value: v[1],
        id: v[2] ? v[2][1] : null,
        classList: v[3].length ? v[3].map(i => i[1]) : null
    }),
    opening_tag: v => [v[1], v[2] ? v[2] : []],
    closing_tag: v => v[2],
    with_content(v) {
        //console.log(v[0][0].value, v[1], v[3].value)
        //debugger
        if (!Array.isArray(v[0][0].value)) {
            if (v[0][0].value != v[3].value) {
                throw new Error(`Opening tag does not much the closing tag at ${v[0].line}:${v[0].col}`);
            }
        }
        // else {
        //     debugger
        //     // add case, when attribute is not a string
        // }
        //debugger

        return assign(v[0][0], {
            type: 'html_expression',
            opening_tag: v[0][0].text,
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
        value: v[4],
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
        value: v[0].value.replace(/_/g, '')
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
        value: v[0].value + v[4].value
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
    {"name": "process$ebnf$1$subexpression$1", "symbols": [{"literal":";"}, "_"]},
    {"name": "process$ebnf$1", "symbols": ["process$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "process$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "process", "symbols": ["decorated_statements", "_", "process$ebnf$1"], "postprocess":  (v, l, reject) => {
            return v[0];
        } },
    {"name": "includes$subexpression$1", "symbols": ["identifier"]},
    {"name": "includes$subexpression$1", "symbols": ["keyword"]},
    {"name": "includes", "symbols": ["_", {"literal":"#include"}, "_", {"literal":"<"}, "includes$subexpression$1", {"literal":">"}], "postprocess":  v => {
            if (v[4][0].value == 'HTML') HTML_ALLOWED = true;
            return {
                type: 'built_in_include',
                value: v[4][0].value,
                line: v[1].line,
                col: v[1].col
            }
        } },
    {"name": "decorated_statements$ebnf$1", "symbols": []},
    {"name": "decorated_statements$ebnf$1", "symbols": ["decorated_statements$ebnf$1", "includes"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decorated_statements", "symbols": ["_", (lexer.has("decorator") ? {type: "decorator"} : decorator), "decorated_statements$ebnf$1", "statements"], "postprocess":  v => ({
        	type: 'decorator',
        	line: v[1].line,
        	col: v[1].col,
        	offset: v[1].offset,
        	decorator: v[1].value,
        	includes: v[2],
        	value: v[3],
        }) },
    {"name": "decorated_statements$ebnf$2", "symbols": []},
    {"name": "decorated_statements$ebnf$2", "symbols": ["decorated_statements$ebnf$2", "includes"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decorated_statements", "symbols": ["decorated_statements$ebnf$2", "statements"], "postprocess":  v => ({
        	type: 'decorator',
        	includes: v[0],
        	value: v[1],
                line: v[0] ? v[0].line : v[1].line,
                col: v[0] ? v[0].col : v[1].col
        }) },
    {"name": "statements$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "global", "EOL"], "postprocess": v => v[1]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements$ebnf$2", "symbols": []},
    {"name": "statements$ebnf$2$subexpression$1", "symbols": ["_", "statement", "EOL"]},
    {"name": "statements$ebnf$2", "symbols": ["statements$ebnf$2", "statements$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements$ebnf$3$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "statements$ebnf$3", "symbols": ["statements$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "statements$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "statements", "symbols": ["statements$ebnf$1", "statements$ebnf$2", "statements$ebnf$3"], "postprocess":  (v, l, reject) => {
        	let result = []
            // debugger
            // if (!v[0]?.length && !v[1]?.length && !v[2]) return reject
            if (v[0] && v[0].length) {
                if (!v[1].length && !v[2]) {
                    //debugger
                    //console.error('[Parser]: Unnecessary @global keyword usage. Declared, but never used.')
                    return reject;
                }
                for (let i = 0; i < v[0].length; i++) {
                    result.push(v[0][i])
                }
            }
            // this line prevent result duplication because of v[1]
            // if only one statement is provided v[2], needs to handle it
            if (v[1].length && !v[2]) return reject
        	// let removeComments = text => text.replace(/\/\/.*\n?/, '');
        	for (let i = 0, indent = 0; i < v[1].length; i++) {
        		/*if (i == 0) indent = (v[0][i][0].text)
        		if (indent !== (v[0][i][0].text)) {
        			throw new Error('Invalid indentation.')
        		}*/
        		result.push(v[1][i][1])
        	}
            //debugger
            if (v[2]) result.push(v[2][1])
        	return result
        } },
    {"name": "statement", "symbols": ["blocks"], "postprocess": id},
    {"name": "statement", "symbols": ["debugging"], "postprocess": id},
    {"name": "statement", "symbols": ["class_declaration"], "postprocess": id},
    {"name": "statement", "symbols": ["with"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"debugger"}], "postprocess": statement.debugger},
    {"name": "statement", "symbols": [{"literal":"delete"}, "_nbsp", "value"], "postprocess": statement.delete},
    {"name": "statement", "symbols": ["return"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"throw"}, "__", "value"], "postprocess": statement.throw},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"break"}]},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"continue"}]},
    {"name": "statement", "symbols": ["statement$subexpression$1"], "postprocess": statement.break_continue},
    {"name": "statement", "symbols": [{"literal":"swap"}, "__", "value", "_", {"literal":","}, "_", "value"], "postprocess": statement.swap},
    {"name": "statement", "symbols": ["var_assign"], "postprocess": id},
    {"name": "statement", "symbols": ["value_reassign"], "postprocess": statement.value_reassign},
    {"name": "statement", "symbols": ["value"], "postprocess": statement.value},
    {"name": "statement", "symbols": [{"literal":"namespace"}, "__", "value"], "postprocess": statement.namespace},
    {"name": "blocks", "symbols": ["if_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["while_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["for_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["try_catch_finally"], "postprocess": id},
    {"name": "blocks", "symbols": ["switch_multiple"], "postprocess": id},
    {"name": "blocks", "symbols": ["type_declaration"], "postprocess": id},
    {"name": "blocks", "symbols": ["operator_declaration"], "postprocess": id},
    {"name": "statements_block$ebnf$1$subexpression$1", "symbols": [{"literal":";"}, "_"]},
    {"name": "statements_block$ebnf$1", "symbols": ["statements_block$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "statements_block$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "statements_block", "symbols": ["_", {"literal":"{"}, "statements", "_", "statements_block$ebnf$1", {"literal":"}"}], "postprocess":  v => ({
            type: 'scope',
            value: v[2],
            line: v[2].line,
            col: v[2].col
        }) },
    {"name": "statements_block$ebnf$2$subexpression$1", "symbols": [{"literal":";"}, "_"]},
    {"name": "statements_block$ebnf$2", "symbols": ["statements_block$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "statements_block$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "statements_block", "symbols": ["_", {"literal":"BEGIN"}, "__", "statements", "_", "statements_block$ebnf$2", {"literal":"END"}], "postprocess":  v => ({
            type: 'scope',
            value: v[3],
            line: v[3].line,
            col: v[3].colva
        }) },
    {"name": "statements_block", "symbols": ["_", {"literal":":"}, "_", "statement"], "postprocess":  v => ({
            type: 'scope',
            value: [v[3]],
            line: v[3].line,
            col: v[3].colva
        }) },
    {"name": "statements_block", "symbols": ["_", {"literal":"do"}, "__", "statement"], "postprocess":  v => ({
            type: 'scope',
            value: [v[3]],
            line: v[3].line,
            col: v[3].colva
        }) },
    {"name": "type_declaration", "symbols": [{"literal":"type"}, "__", "identifier", "_", "arguments_with_types", "statements_block"], "postprocess":  v => {
        	if (v[2].value[0].toUpperCase() != v[2].value[0]) {
        		throw new SyntaxError(`Type name must be capitalized.`)
        	}
        	//debugger
        	if (v[4].value.length == 0) {
                throw new Error(`Type declaration requires at least one argument.`)
        	}
        	return assign(v[0], {
        		type: 'type_declaration',
        		identifier: v[2],
        		arguments: v[4],
        		value: v[5],
                line: v[0].line,
                col: v[0].col
        	})
        } },
    {"name": "operator$ebnf$1", "symbols": [/[A-Za-z0-9_\/*+-.&|$@!^#~]/]},
    {"name": "operator$ebnf$1", "symbols": ["operator$ebnf$1", /[A-Za-z0-9_\/*+-.&|$@!^#~]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operator", "symbols": [{"literal":"#"}, "operator$ebnf$1"], "postprocess":  v => ({
            type: 'operator',
            value: v[1],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "operator_declaration", "symbols": [{"literal":"operator"}, "__", "operator", "_", "arguments_with_types", "statements_block"], "postprocess":  v => {
            if (v[4].value.length < 2 && v[4].value.length > 2) {
                throw new Error(`Operator declaration requires two argument`)
            }
            return assign(v[0], {
                type: 'operator_declaration',
                identifier: v[2],
                arguments: v[4],
                value: v[5],
                line: v[0].line,
                col: v[0].col
            })
        } },
    {"name": "with", "symbols": [{"literal":"with"}, "__", "value", "statements_block"], "postprocess":  v => assign(v[0], {
        	type: 'with',
        	obj: v[2],
        	value: v[3],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "with", "symbols": [{"literal":"with"}, "_", {"literal":"("}, "_", "value", "_", {"literal":")"}, "statements_block"], "postprocess":  v => assign(v[0], {
        	type: 'with',
        	obj: v[4],
        	value: v[7],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "global", "symbols": [{"literal":"@"}, {"literal":"global"}, "__", "identifier"], "postprocess":  v => ({
            type: 'global',
        	value: v[3]
        }) },
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess":  (v, l, reject) => {
            if (v[0].type == 'null' ||
                ['Infinity', 'this', 'globalThis', 'NaN'
                , 'Boolean', 'Object', 'Array', 'String', 'Number', 'JSON'
                ].includes(v[0].value)) {
                return reject;
            }
            return v[0]
        } },
    {"name": "identifier", "symbols": ["allowed_keywords"], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"Infinity"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"this"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"globalThis"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"NaN"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"Boolean"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"Object"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"Array"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"String"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"Number"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"JSON"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"undefined"}], "postprocess":  v => assign(v[0], {
            type: 'keyword',
            value: 'void(0)'
        }) },
    {"name": "convert", "symbols": ["prefixExp", "__", {"literal":"as"}, "__", "convert_type"], "postprocess":  (v, l, reject) => {
            //if (v[0] && !v[6] || !v[0] && v[6]) return reject
            return {
                type: 'convert',
                value: v[0],
                convert_type: v[4],
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Function"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"JSON"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"String"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Number"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Boolean"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Object"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Float"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Int"}]},
    {"name": "convert_type$subexpression$1", "symbols": [{"literal":"Array"}]},
    {"name": "convert_type", "symbols": ["convert_type$subexpression$1"], "postprocess": v => v[0][0]},
    {"name": "pair$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "pair$ebnf$1", "symbols": ["pair$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "pair$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pair", "symbols": ["pair$ebnf$1", "key", "_", "arguments_with_types", "statements_block"], "postprocess": object.es6_key_value},
    {"name": "pair", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": v => [v[0], v[4]]},
    {"name": "pair", "symbols": ["key"], "postprocess": v => [v[0], v[0]]},
    {"name": "key", "symbols": ["string"], "postprocess": id},
    {"name": "key", "symbols": ["identifier"], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": id},
    {"name": "string_concat", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "regexp_flags", "symbols": [/[gmi]/], "postprocess": regexp.flag},
    {"name": "myNull", "symbols": [{"literal":"null"}], "postprocess": Null},
    {"name": "boolean$subexpression$1", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)]},
    {"name": "boolean", "symbols": ["boolean$subexpression$1"], "postprocess": boolean},
    {"name": "boolean", "symbols": [{"literal":"defined"}, "_nbsp", "identifier"], "postprocess":  v => ({
            type: 'defined',
            value: v[2],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "boolean", "symbols": [{"literal":"defined"}, "_nbsp", {"literal":"("}, "_", "identifier", "_", {"literal":")"}], "postprocess":  v => ({
            type: 'defined',
            value: v[4],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "string", "symbols": ["string_concat"], "postprocess": id},
    {"name": "string", "symbols": [{"literal":"typeof"}, "_", {"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'typeof',
        	value: v[4],
                line: v[0].line,
                col: v[0].col
        }) },
    {"name": "bigInt", "symbols": [(lexer.has("bigInt") ? {type: "bigInt"} : bigInt)], "postprocess": number.bigInt},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": number.float},
    {"name": "number", "symbols": [{"literal":"sizeof"}, "_", {"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'sizeof',
        	value: v[4],
                line: v[0].line,
                col: v[0].col
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
    {"name": "_base", "symbols": ["base"], "postprocess": id},
    {"name": "_base", "symbols": ["regexp"], "postprocess": id},
    {"name": "Var", "symbols": ["_base", "_nbsp", {"literal":"["}, "_", {"literal":"]"}], "postprocess":  v => ({
                type: 'item_retraction_last',
                //arguments: v[7] ? v[7][1] : null,
                from: v[0],
                line: v[0].line,
                col: v[0].col
                //value: v[4]
                //identifier: v[0].value
        }) },
    {"name": "Var$subexpression$1", "symbols": ["_", "value"]},
    {"name": "Var$ebnf$1$subexpression$1", "symbols": ["_", "value"]},
    {"name": "Var$ebnf$1", "symbols": ["Var$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Var$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Var$ebnf$2$subexpression$1", "symbols": ["_", {"literal":":"}, "_", "value"]},
    {"name": "Var$ebnf$2", "symbols": ["Var$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "Var$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Var", "symbols": ["_base", "_", {"literal":"["}, "Var$subexpression$1", "_", {"literal":":"}, "Var$ebnf$1", "Var$ebnf$2", "_", {"literal":"]"}], "postprocess": array.slice},
    {"name": "Var", "symbols": ["_base", "_nbsp", {"literal":"["}, "_", "value", "_", {"literal":"]"}], "postprocess":  v => ({
                type: 'item_retraction',
                //arguments: v[7] ? v[7][1] : null,
                from: v[0],
                value: v[4],
                line: v[0].line,
                col: v[0].col
                //identifier: v[0].value
        }) },
    {"name": "Var$subexpression$2", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)]},
    {"name": "Var$subexpression$2", "symbols": ["identifier"]},
    {"name": "Var", "symbols": ["_base", "_", {"literal":"."}, "_", "Var$subexpression$2"], "postprocess":  (v, l, reject) => {
            if (v[0].type == 'annonymous_function') return reject
            return {
                type: 'dot_retraction_v2',
                from: v[0],
                value: v[4][0],
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "Var$subexpression$3", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)]},
    {"name": "Var$subexpression$3", "symbols": ["identifier"]},
    {"name": "Var", "symbols": [{"literal":"::"}, "Var$subexpression$3"], "postprocess":  (v, l, reject) => {
            return {
                type: 'namespace_retraction',
                retraction_type: 'dot',
                value: v[1][0],
                line: v[1][0].line,
                col: v[1][0].col
            }
        } },
    {"name": "Var", "symbols": [{"literal":"::"}, {"literal":"["}, "_", "value", "_", {"literal":"]"}], "postprocess":  v => ({
                type: 'namespace_retraction',
                retraction_type: 'item_retraction',
                value: v[3],
                line: v[0].line,
                col: v[0].col
                //identifier: v[0].value
        }) },
    {"name": "Var", "symbols": [{"literal":"::"}, {"literal":"["}, "_", {"literal":"]"}], "postprocess":  v => ({
                type: 'namespace_retraction',
                retraction_type: 'item_retraction_last',
                line: v[0].line,
                col: v[0].col
        }) },
    {"name": "Var", "symbols": ["function_call"], "postprocess": id},
    {"name": "Var", "symbols": ["identifier"], "postprocess": id},
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
    {"name": "switch_multiple$ebnf$2$subexpression$1", "symbols": ["_", "case_default"]},
    {"name": "switch_multiple$ebnf$2", "symbols": ["switch_multiple$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "switch_multiple$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "switch_multiple", "symbols": [{"literal":"switch"}, "__", "value", "_", {"literal":"{"}, "switch_multiple$ebnf$1", "switch_multiple$ebnf$2", "_", {"literal":"}"}], "postprocess":  v => assign(v[0], {
        	type: 'switch',
        	value: v[2],
        	cases: v[5] ? v[5].map(i => i[1]) : [],
            default: v[6] ? v[6][1] : null
        }) },
    {"name": "case_multiline$ebnf$1$subexpression$1", "symbols": ["_", {"literal":";"}]},
    {"name": "case_multiline$ebnf$1", "symbols": ["case_multiline$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "case_multiline$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_multiline", "symbols": [{"literal":"case"}, "__", "value", "_", {"literal":":"}, "statements", "case_multiline$ebnf$1"], "postprocess":  v => assign(v[0], {
        	type: 'case',
        	value: v[2],
        	statements: v[5]
        }) },
    {"name": "case_default$ebnf$1$subexpression$1", "symbols": ["_", {"literal":";"}]},
    {"name": "case_default$ebnf$1", "symbols": ["case_default$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "case_default$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_default", "symbols": [{"literal":"default"}, "_", {"literal":":"}, "statements", "case_default$ebnf$1"], "postprocess":  v => assign(v[0], {
        	type: 'case_default',
        	value: v[3]
        }) },
    {"name": "class_declaration$ebnf$1", "symbols": []},
    {"name": "class_declaration$ebnf$1$subexpression$1", "symbols": ["_", "es6_key_value"], "postprocess": v => v[1]},
    {"name": "class_declaration$ebnf$1", "symbols": ["class_declaration$ebnf$1", "class_declaration$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "class_declaration", "symbols": [{"literal":"class"}, "_", "identifier", "_", {"literal":"{"}, "_", "construct", "class_declaration$ebnf$1", "_", {"literal":"}"}], "postprocess": classes.parse},
    {"name": "construct", "symbols": [{"literal":"constructor"}, "_", "arguments_with_types", "statements_block"], "postprocess": classes.construct},
    {"name": "es6_key_value", "symbols": ["identifier", "_", "arguments_with_types", "statements_block"], "postprocess": classes.es6_key_value},
    {"name": "if_block", "symbols": [{"literal":"if"}, "statement_condition", "statements_block"], "postprocess":  v => {
        	return assign(v[0], {
        		type: 'if',
        		condition: v[1],
        		value: v[2]
        	});
        } },
    {"name": "if_block", "symbols": [{"literal":"unless"}, "statement_condition", "statements_block"], "postprocess":  v => {
        	return assign(v[0], {
        		type: 'if',
        		condition: v[1],
        		value: v[2],
                unless: true
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
    {"name": "else_block", "symbols": [{"literal":"else"}, "__", "statement"], "postprocess":  (v, l, reject) => {
            //if (v[2].type == 'if') return reject;
            if (v[2].type == 'statement_value' && v[2].value.type == 'value' && v[2].value.value.type == 'object') return reject
            //if (v[2].type == 'value' && v[2].value.type == 'object') debugger
        	return assign(v[0], {
        		type: 'else',
        		value: [v[2]],
        	});
        } },
    {"name": "else_block", "symbols": [{"literal":"else"}, "statements_block"], "postprocess":  v => {
            //if (v[1].type == 'value' && v[1].value.type == 'object') debugger
            return assign(v[0], {
        		type: 'else',
        		value: v[1],
        	});
        } },
    {"name": "ternary$ebnf$1$subexpression$1", "symbols": ["_", {"literal":":"}, "_", "value"]},
    {"name": "ternary$ebnf$1", "symbols": ["ternary$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ternary$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ternary", "symbols": ["condition", "_", {"literal":"?"}, "_", "value", "ternary$ebnf$1"], "postprocess": condition.ternary},
    {"name": "ternary$ebnf$2$subexpression$1", "symbols": ["_", {"literal":"else"}, "_", "value"]},
    {"name": "ternary$ebnf$2", "symbols": ["ternary$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "ternary$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ternary", "symbols": ["value", "__nbsp", {"literal":"if"}, "_", "condition", "ternary$ebnf$2"], "postprocess": condition.ternary_with_if},
    {"name": "try_catch_finally$ebnf$1$subexpression$1", "symbols": ["_", "finally"]},
    {"name": "try_catch_finally$ebnf$1", "symbols": ["try_catch_finally$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "try_catch_finally$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "try_catch_finally", "symbols": ["try_catch", "try_catch_finally$ebnf$1"], "postprocess":  v => ({
        	type: 'try_catch_finally',
        	value: v[0],
        	finally: v[1] ? v[1][1] : null,
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "try_catch$ebnf$1$subexpression$1", "symbols": ["_", "catch"]},
    {"name": "try_catch$ebnf$1", "symbols": ["try_catch$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "try_catch$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "try_catch", "symbols": ["try", "try_catch$ebnf$1"], "postprocess":  v => ({
        	type: 'try_catch',
        	value: v[0],
        	catch: v[1] ? v[1][1] : null,
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "try", "symbols": [{"literal":"try"}, "statements_block"], "postprocess":  v => ({
        	type: 'try',
        	value: v[1],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "catch", "symbols": [{"literal":"catch"}, "__", "identifier", "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[3],
        		identifier: v[2].value,
                line: v[0].line,
                col: v[0].col
        	}
        } },
    {"name": "catch", "symbols": [{"literal":"catch"}, "_", {"literal":"("}, "_", "identifier", "_", {"literal":")"}, "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[7],
        		identifier: v[4].value,
                line: v[0].line,
                col: v[0].col
        	}
        } },
    {"name": "catch", "symbols": [{"literal":"catch"}, "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[1],
        		identifier: 'err',
                line: v[0].line,
                col: v[0].col
        	}
        } },
    {"name": "finally", "symbols": [{"literal":"finally"}, "statements_block"], "postprocess":  v => {
        	//debugger
        	return ({
        		type: 'finally',
        		value: v[1],
                line: v[0].line,
                col: v[0].col
        	})
        } },
    {"name": "left_assign", "symbols": ["Var"], "postprocess": id},
    {"name": "left_assign", "symbols": ["function_call"], "postprocess": id},
    {"name": "value_reassign$subexpression$1", "symbols": ["value"]},
    {"name": "value_reassign", "symbols": ["left_assign", "_", {"literal":"="}, "_", "value_reassign$subexpression$1"], "postprocess":  v => {
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
    {"name": "value_reassign", "symbols": ["value_addition"], "postprocess": id},
    {"name": "var_assign", "symbols": ["assign_type", "var_assign_list"], "postprocess": vars.assign},
    {"name": "var_assign$subexpression$1", "symbols": ["switch"]},
    {"name": "var_assign$subexpression$1", "symbols": ["value"]},
    {"name": "var_assign", "symbols": [{"literal":"ASSIGN"}, "_", "var_assign$subexpression$1", "_", {"literal":"TO"}, "_", "identifier"], "postprocess":  v => {
        	return {
        		type: 'var_assign',
        		use_let: true,
        		identifier: v[6],
        		line: v[0].line,
        		col: v[0].col,
        		value: {
        			type: 'var_assign_group',
        			identifier: v[6],
        			value: [v[2][0]],
                    line: v[2][0].line,
                    col: v[2][0].col
        		},
        		offset: v[0].offset
        	}
        } },
    {"name": "assign_type$subexpression$1", "symbols": [{"literal":"let"}, "__"]},
    {"name": "assign_type$subexpression$1", "symbols": [{"literal":"const"}, "__"]},
    {"name": "assign_type$subexpression$1", "symbols": [{"literal":"\\"}]},
    {"name": "assign_type", "symbols": ["assign_type$subexpression$1"], "postprocess": v => v[0][0].value},
    {"name": "var_assign_list$ebnf$1", "symbols": []},
    {"name": "var_assign_list$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "var_reassign"], "postprocess": v => v[3]},
    {"name": "var_assign_list$ebnf$1", "symbols": ["var_assign_list$ebnf$1", "var_assign_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "var_assign_list", "symbols": ["var_reassign", "var_assign_list$ebnf$1"], "postprocess": vars.var_assign_list},
    {"name": "var_reassign", "symbols": ["identifier", "_", {"literal":"="}, "_", "value"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_reassign", "symbols": ["identifier"], "postprocess":  v => ({
            type: 'identifier',
            value: v[0],
            line: v[0].line,
            col: v[0].col,
        }) },
    {"name": "var_reassign$subexpression$1", "symbols": ["switch"]},
    {"name": "var_reassign$subexpression$1", "symbols": ["value"]},
    {"name": "var_reassign", "symbols": [{"literal":"SET"}, "_", "identifier", "_", {"literal":"TO"}, "_", "var_reassign$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"+"}, {"literal":"="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"-"}, {"literal":"="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"*"}, {"literal":"="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"/"}, {"literal":"="}]},
    {"name": "value_addition", "symbols": ["prefixExp", "_nbsp", "value_addition$subexpression$1", "_", "sum"], "postprocess":  (v, l, reject) => {
            if (v[0].type == 'string' || v[0].type == 'number' || v[0].type == 'boolean' || v[0].type == 'null') {
                throw new Error(`Unexpected assignment at line ${v[2][0].line}, col ${v[2][0].col}`)
            }
            // console.log(v[4])
            return ({
                type: 'expression_short_equation',
                value: [v[0], assign(v[2][0], {value: v[2][0].value}), v[4]]
            })
        } },
    {"name": "while_block", "symbols": [{"literal":"while"}, "statement_condition", "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'while',
        		condition: v[1],
        		value: v[2],
        	});
        } },
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"in"}]},
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"of"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "identifier", "__", "for_block$subexpression$1", "__", "value", "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'for_' + v[4][0],
        		condition: v[1],
        		identifier: v[2],
        		iterable: v[6],
        		value: v[7],
        	});
        } },
    {"name": "for_block$subexpression$2", "symbols": [{"literal":"in"}]},
    {"name": "for_block$subexpression$2", "symbols": [{"literal":"of"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "_", {"literal":"("}, "_", "identifier", "__", "for_block$subexpression$2", "__", "value", "_", {"literal":")"}, "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'for_' + v[6][0],
        		//condition: v[4],
        		identifier: v[4],
        		iterable: v[8],
        		value: v[11],
        	});
        } },
    {"name": "for_block$subexpression$3", "symbols": [{"literal":"through"}]},
    {"name": "for_block$subexpression$3", "symbols": [{"literal":"till"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "identifier", "__", {"literal":"from"}, "__", "value", "_", "for_block$subexpression$3", "_", "value", "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'for_loop',
        		identifier: v[2],
        		from: v[6],
        		through: v[10],
        		include: v[8][0].text == 'till' ? false : true,
        		value: v[11],
        	});
        } },
    {"name": "for_block$subexpression$4", "symbols": [{"literal":"through"}]},
    {"name": "for_block$subexpression$4", "symbols": [{"literal":"till"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "_", {"literal":"("}, "_", "identifier", "__", {"literal":"from"}, "__", "value", "_", "for_block$subexpression$4", "_", "value", "_", {"literal":")"}, "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'for_loop',
        		identifier: v[4],
        		from: v[8],
        		through: v[12],
        		include: v[10][0].text == 'till' ? false : true,
        		value: v[15],
        	});
        } },
    {"name": "for_loop_changes", "symbols": ["value_reassign"], "postprocess": statement.value_reassign},
    {"name": "for_loop_changes", "symbols": ["value"], "postprocess": statement.value},
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
    {"name": "annonymous_function$ebnf$2$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "annonymous_function$ebnf$2", "symbols": ["annonymous_function$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function", "symbols": ["annonymous_function$ebnf$1", "function_declarator", "annonymous_function$ebnf$2", "_", "arguments_with_types", "statements_block"], "postprocess": functions.annonymous},
    {"name": "annonymous_function$ebnf$3$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "annonymous_function$ebnf$3", "symbols": ["annonymous_function$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$ebnf$4$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "annonymous_function$ebnf$4", "symbols": ["annonymous_function$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function", "symbols": ["annonymous_function$ebnf$3", "function_declarator", "annonymous_function$ebnf$4", "statements_block"], "postprocess": functions.annonymous_with_no_args},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"def"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"void"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Int"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Float"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Array"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Object"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Null"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Boolean"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"Number"}]},
    {"name": "function_declarator$subexpression$1", "symbols": [{"literal":"String"}]},
    {"name": "function_declarator", "symbols": ["function_declarator$subexpression$1"], "postprocess": v => v[0]},
    {"name": "return", "symbols": [{"literal":"return"}, "__nbsp", "value"], "postprocess": returns.value},
    {"name": "return", "symbols": [{"literal":"return"}], "postprocess": returns.empty},
    {"name": "return", "symbols": [{"literal":"=>"}, "_nbsp", "value"], "postprocess": returns.value},
    {"name": "function_call", "symbols": ["_base", "_nbsp", "arguments"], "postprocess":  (v, l, reject) => {
            if (v[0].type == 'annonymous_function') return reject
        	return ({
        		type: 'function_call',
                //check: v[1] ? true : false,
        		value: v[0],
        		arguments: v[2],
        	})
        } },
    {"name": "function_call", "symbols": [{"literal":"::"}, "arguments"], "postprocess":  (v, l, reject) => {
            if (v[0].type == 'annonymous_function') return reject
        	return ({
                type: 'namespace_retraction',
                retraction_type: 'function_call',
        		arguments: v[1],
        	})
        } },
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
    {"name": "argument_identifier_and_value$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"="}, "_", "value"]},
    {"name": "argument_identifier_and_value$ebnf$1", "symbols": ["argument_identifier_and_value$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "argument_identifier_and_value$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_identifier_and_value", "symbols": ["argument_type", "identifier", "argument_identifier_and_value$ebnf$1"], "postprocess":  v => ({
        	type: 'argument_identifier_and_value',
        	argument_type: v[0] ? v[0][0] : 'none',
        	can_be_null: v[0] ? v[0][1] : false,
        	identifier: v[1],
        	value: v[2] ? v[2][3] : null
        }) },
    {"name": "argument_type$ebnf$1$subexpression$1$ebnf$1", "symbols": [{"literal":"?"}], "postprocess": id},
    {"name": "argument_type$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_type$ebnf$1$subexpression$1", "symbols": ["identifier", "argument_type$ebnf$1$subexpression$1$ebnf$1", "__"]},
    {"name": "argument_type$ebnf$1", "symbols": ["argument_type$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "argument_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_type", "symbols": ["argument_type$ebnf$1"], "postprocess":  v => {
            if (!v[0]) return;
        	v[0] = v[0][0];
            if (v[0] && v[0] instanceof Array) {
                v[0] = v[0][0]
            }
        	let n = v[0].value[0];
        	if (n.toUpperCase() != n) {
                return;
        		throw new SyntaxError(`Argument type must be capitalized at line ${v[0].line}, col ${v[0].col}.`);
            }
        	return [v[0], v[1]];
        } },
    {"name": "lambda_arguments", "symbols": ["arguments_with_types"], "postprocess": id},
    {"name": "lambda_arguments", "symbols": ["identifier"], "postprocess": id},
    {"name": "lambda$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "lambda$ebnf$1", "symbols": ["lambda$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "lambda$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "lambda", "symbols": ["lambda$ebnf$1", "_", "lambda_arguments", "_", {"literal":"=>"}, "statements_block"], "postprocess":  v => {
            return {
                type: 'annonymous_function',
                value: v[5],
                arguments: v[2],
                async: v[0] ? true : false
            }
        } },
    {"name": "comparision_operators", "symbols": [{"literal":"is"}, "_", {"literal":"not"}, "__"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is"}, "__"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '===' })},
    {"name": "comparision_operators", "symbols": [{"literal":"==="}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '===' })},
    {"name": "comparision_operators", "symbols": [{"literal":"!=="}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"=="}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"!="}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!=' })},
    {"name": "comparision_operators", "symbols": [{"literal":">="}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"<="}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"<"}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value:  '<' })},
    {"name": "comparision_operators", "symbols": [{"literal":">"}, "_"], "postprocess": v => assign(v[0], {type: 'comparision_operator', value:  '>' })},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"and"}]},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"or"}]},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"&&"}]},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"||"}]},
    {"name": "condition", "symbols": ["condition", "__", "condition$subexpression$1", "__", "_value"], "postprocess":  v => {
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
    {"name": "condition", "symbols": ["condition", "_", "comparision_operators", "_value"], "postprocess":  v => {
            return {
                type: 'value',
                left: v[0],
                right: v[3],
                value: v[2].value,
                line: v[0].line,
                lineBreaks: v[0].lineBreaks,
                offset: v[0].offset,
                col: v[0].col,
            }
        } },
    {"name": "condition", "symbols": ["condition", "_", "comparision_operators", "arguments"], "postprocess":  (v, l, reject) => {
            if (v[3].value.length < 2) return reject;
            return {
                type: 'condition_destructive',
                left: v[0],
                right: v[3],
                value: v[2].value,
                line: v[0].line,
                lineBreaks: v[0].lineBreaks,
                offset: v[0].offset,
                col: v[0].col,
            }
        } },
    {"name": "condition", "symbols": ["_value", "_", {"literal":"in"}, "_", "_value"], "postprocess":  v => {
        	return {
        		type: 'in',
        		from: v[4],
        		value: v[0]
        	}
        } },
    {"name": "condition", "symbols": ["_value", "_", {"literal":"??"}, "_", "_value"], "postprocess":  v => ({
            type: 'nullish_check',
            condition: v[0],
            value: v[4],
        }) },
    {"name": "condition", "symbols": ["_value"], "postprocess": condition.value},
    {"name": "statement_condition", "symbols": ["_", "condition"], "postprocess": v => v[1]},
    {"name": "debugging$subexpression$1", "symbols": [{"literal":"LOG"}]},
    {"name": "debugging$subexpression$1", "symbols": [{"literal":"print"}]},
    {"name": "debugging$ebnf$1$subexpression$1", "symbols": ["__", {"literal":"if"}]},
    {"name": "debugging$ebnf$1", "symbols": ["debugging$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "debugging$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "debugging", "symbols": ["debugging$subexpression$1", "debugging$ebnf$1", "debugging_body"], "postprocess":  v => ({
        	type: 'debugging',
        	method: 'log',
            conditional: v[1],
        	value: v[2],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "debugging$ebnf$2$subexpression$1", "symbols": ["__", {"literal":"if"}]},
    {"name": "debugging$ebnf$2", "symbols": ["debugging$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "debugging$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "debugging", "symbols": [{"literal":"ERROR"}, "debugging$ebnf$2", "debugging_body"], "postprocess":  v => ({
        	type: 'debugging',
        	method: 'error',
            conditional: v[1],
        	value: v[2],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "debugging_body", "symbols": ["__", "value"], "postprocess": v => v[1]},
    {"name": "debugging_body", "symbols": ["_nbsp", "arguments"], "postprocess":  v => ({
            type: 'arguments',
            value: v[1],
            line: v[1].line,
            col: v[1].col
        }) },
    {"name": "html", "symbols": [{"literal":"#"}, {"literal":"{"}, "_", "value", "_", {"literal":"}"}], "postprocess": html.value_to_string},
    {"name": "html$ebnf$1", "symbols": []},
    {"name": "html$ebnf$1$subexpression$1", "symbols": ["_", "html_content"], "postprocess": v => v[1]},
    {"name": "html$ebnf$1", "symbols": ["html$ebnf$1", "html$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html", "symbols": ["opening_tag", "html$ebnf$1", "_", "closing_tag"], "postprocess": html.with_content},
    {"name": "html$ebnf$2$subexpression$1", "symbols": [{"literal":"#"}, "identifier"]},
    {"name": "html$ebnf$2", "symbols": ["html$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "html$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "html$ebnf$3", "symbols": []},
    {"name": "html$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "identifier"]},
    {"name": "html$ebnf$3", "symbols": ["html$ebnf$3", "html$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html", "symbols": [{"literal":"<"}, "identifier", "html$ebnf$2", "html$ebnf$3", {"literal":"/"}, {"literal":">"}], "postprocess": html.self_closing_tag},
    {"name": "opening_tag$ebnf$1$subexpression$1", "symbols": ["__", "attrubutes"], "postprocess": v => v[1]},
    {"name": "opening_tag$ebnf$1", "symbols": ["opening_tag$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "opening_tag$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "opening_tag", "symbols": [{"literal":"<"}, "identifier", "opening_tag$ebnf$1", "_", {"literal":">"}], "postprocess": html.opening_tag},
    {"name": "closing_tag", "symbols": [{"literal":"<"}, {"literal":"/"}, "identifier", {"literal":">"}], "postprocess": html.closing_tag},
    {"name": "html_content", "symbols": ["html_string"], "postprocess":  v => ({
        	type: 'html_string',
        	value: v[0]
        }) },
    {"name": "html_content$ebnf$1$subexpression$1", "symbols": ["__", "html_string"], "postprocess": v => v[1]},
    {"name": "html_content$ebnf$1", "symbols": ["html_content$ebnf$1$subexpression$1"]},
    {"name": "html_content$ebnf$1$subexpression$2", "symbols": ["__", "html_string"], "postprocess": v => v[1]},
    {"name": "html_content$ebnf$1", "symbols": ["html_content$ebnf$1", "html_content$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html_content", "symbols": ["html_string", "html_content$ebnf$1"], "postprocess":  v => ({
            type: 'html_string',
            value: v[0],
            additions: v[1]
        }) },
    {"name": "html_content", "symbols": ["html"], "postprocess": v => v[0]},
    {"name": "html_string", "symbols": ["string"], "postprocess":  v => {
        	// debugger
        	return v
        } },
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
    {"name": "array_interactions", "symbols": ["array_interactions$subexpression$1", "_", "value", "_", {"literal":"INTO"}, "_", "prefixExp"], "postprocess":  v => ({
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
    {"name": "base", "symbols": ["parenthesized"], "postprocess": id},
    {"name": "base", "symbols": ["Var"], "postprocess": id},
    {"name": "base", "symbols": ["string"], "postprocess": id},
    {"name": "base", "symbols": ["bigInt"], "postprocess": id},
    {"name": "base", "symbols": ["number"], "postprocess": id},
    {"name": "base", "symbols": ["array"], "postprocess": id},
    {"name": "base", "symbols": ["convert"], "postprocess": id},
    {"name": "base", "symbols": ["object"], "postprocess": id},
    {"name": "base", "symbols": [{"literal":"safeValue"}, "_", "arguments"], "postprocess":  v => ({
            type: 'safeValue',
            value: v[2],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "sum$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "sum$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "sum", "symbols": ["sum", "_nbsp", "sum$subexpression$1", "_", "product"], "postprocess":  v => ({
            type: 'sum',
            left: v[0],
            right: v[4],
            operator: v[2][0].value,
            value: (function (v) {
                if (v[0].type == 'number' && v[4].type == 'number') {
                    if (v[2][0].value == '+') {
                        return v[0].value + v[4].value
                    } else {
                        return v[0].value - v[4].value
                    }
                } else {
                    return null
                }
            })(v),
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "sum", "symbols": ["product"], "postprocess": id},
    {"name": "product$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "product$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "product", "symbols": ["product", "_nbsp", "product$subexpression$1", "_", "unary"], "postprocess":  v => ({
            type: 'product',
            left: v[0],
            right: v[4],
            operator: v[2][0].value,
            value: (function (v) {
                if (v[0].type == 'number' && v[4].type == 'number') {
                    if (v[2][0].value == '*') {
                        return v[0].value * v[4].value
                    } else {
                        return v[0].value / v[4].value
                    }
                } else {
                    return null
                }
            })(v),
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "product", "symbols": ["unary"], "postprocess": id},
    {"name": "unary", "symbols": [{"literal":"-"}, "_nbsp", "unary"], "postprocess":  v => {
            return {
            type: 'number_negative',
            value: v[2],
            line: v[0].line,
            col: v[0].col
        }} },
    {"name": "unary", "symbols": ["pow"], "postprocess": id},
    {"name": "pow$subexpression$1", "symbols": [{"literal":"**"}]},
    {"name": "pow$subexpression$1", "symbols": [{"literal":"%"}]},
    {"name": "pow", "symbols": ["pow", "_nbsp", "pow$subexpression$1", "_", "unary"], "postprocess":  v => ({
            type: 'pow',
            left: v[0],
            right: v[4],
            operator: v[2][0].value,
            value: (function (v) {
                if (v[0].type == 'number' && v[4].type == 'number') {
                    if (v[2][0].value == '**') {
                        return v[0].value ** v[4].value
                    } else {
                        return v[0].value % v[4].value
                    }
                } else {
                    return null
                }
            })(v),
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "pow", "symbols": ["pow", "_nbsp", "operator", "_", "unary"], "postprocess":  v => ({
            type: 'pow',
            left: v[0],
            right: v[4],
            operator: v[2].value,
            value: null,
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "pow", "symbols": ["base"], "postprocess": id},
    {"name": "expression", "symbols": ["prefixExp"], "postprocess": id},
    {"name": "value", "symbols": ["condition"], "postprocess": id},
    {"name": "_value", "symbols": ["expression"], "postprocess": id},
    {"name": "_value", "symbols": [{"literal":"!"}, "_", "prefixExp"], "postprocess":  v => {
            return {
                type: 'boolean_reversed',
                value: v[2],
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "_value$subexpression$1", "symbols": [{"literal":"new"}]},
    {"name": "_value$subexpression$1", "symbols": [{"literal":"await"}]},
    {"name": "_value$subexpression$1", "symbols": [{"literal":"yield"}]},
    {"name": "_value", "symbols": ["_value$subexpression$1", "__", "prefixExp"], "postprocess":  v => {
        	return assign(v[0][0], {
        		type: v[0][0].text,
        		value: v[2]
        	})
        } },
    {"name": "_value", "symbols": ["prefixExp", "__", {"literal":"instanceof"}, "__", "prefixExp"], "postprocess":  v => ({
        	type: 'instanceof',
        	left: v[0],
        	value: v[4],
                line: v[0].line,
                col: v[0].col
        }) },
    {"name": "_value", "symbols": ["myNull"], "postprocess": id},
    {"name": "_value", "symbols": [{"literal":"new"}, "_", {"literal":"."}, "_", {"literal":"target"}], "postprocess":  v => ({
            type: 'new.target',
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "_value", "symbols": [{"literal":"void"}, "_nbsp", "arguments"], "postprocess":  v => ({
            type: 'void',
            value: v[2],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "_value", "symbols": ["ternary"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["sum"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["annonymous_function"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["regexp"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["boolean"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["html"], "postprocess":  (v, l, reject) => {
            if (!HTML_ALLOWED) {
                throw new ReferenceError('HTML syntax is not imported. Use #include <HTML> first.')
            }
            return v[0];
        } },
    {"name": "parenthesized", "symbols": [{"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess":  (v, l, reject) => {
            //if (v[2].type == 'convert') return reject;
            return {
                type: 'expression_with_parenthesis',
                value: v[2],
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": id},
    {"name": "__", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id},
    {"name": "EOL$ebnf$1", "symbols": [/[\n]/]},
    {"name": "EOL$ebnf$1", "symbols": ["EOL$ebnf$1", /[\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "EOL", "symbols": ["EOL$ebnf$1"], "postprocess": v => 'EOL'},
    {"name": "EOL$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "EOL$ebnf$2$subexpression$1$ebnf$1", "symbols": ["EOL$ebnf$2$subexpression$1$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "EOL$ebnf$2$subexpression$1$ebnf$2", "symbols": []},
    {"name": "EOL$ebnf$2$subexpression$1$ebnf$2", "symbols": ["EOL$ebnf$2$subexpression$1$ebnf$2", /[\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "EOL$ebnf$2$subexpression$1", "symbols": ["_nbsp", {"literal":"/"}, {"literal":"/"}, "EOL$ebnf$2$subexpression$1$ebnf$1", "EOL$ebnf$2$subexpression$1$ebnf$2"]},
    {"name": "EOL$ebnf$2", "symbols": ["EOL$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "EOL$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EOL", "symbols": ["_nbsp", {"literal":";"}, "EOL$ebnf$2"], "postprocess": v => v[1]},
    {"name": "EOL$ebnf$3", "symbols": []},
    {"name": "EOL$ebnf$3", "symbols": ["EOL$ebnf$3", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "EOL$ebnf$4", "symbols": []},
    {"name": "EOL$ebnf$4", "symbols": ["EOL$ebnf$4", /[\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "EOL", "symbols": ["_nbsp", {"literal":"/"}, {"literal":"/"}, "EOL$ebnf$3", "EOL$ebnf$4"], "postprocess": v => 'EOL'},
    {"name": "_nbsp$ebnf$1", "symbols": []},
    {"name": "_nbsp$ebnf$1$subexpression$1", "symbols": [/[ ]/]},
    {"name": "_nbsp$ebnf$1$subexpression$1", "symbols": [/[\t]/]},
    {"name": "_nbsp$ebnf$1", "symbols": ["_nbsp$ebnf$1", "_nbsp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_nbsp", "symbols": ["_nbsp$ebnf$1"], "postprocess":  (v, l, reject) => {
            if (v[0].length) {
                if (/\n/g.test(v[0][0])) {
                    return reject
                }
            }
            return {type: 'nbsp', value: ''}
        } },
    {"name": "__nbsp$ebnf$1$subexpression$1", "symbols": [/[ ]/]},
    {"name": "__nbsp$ebnf$1$subexpression$1", "symbols": [/[\t]/]},
    {"name": "__nbsp$ebnf$1", "symbols": ["__nbsp$ebnf$1$subexpression$1"]},
    {"name": "__nbsp$ebnf$1$subexpression$2", "symbols": [/[ ]/]},
    {"name": "__nbsp$ebnf$1$subexpression$2", "symbols": [/[\t]/]},
    {"name": "__nbsp$ebnf$1", "symbols": ["__nbsp$ebnf$1", "__nbsp$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__nbsp", "symbols": ["__nbsp$ebnf$1"], "postprocess":  (v, l, reject) => {
            if (v[0].length) {
                if (/\n/g.test(v[0][0])) {
                    return reject
                }
            }
            return {type: 'nbsp', value: ' '}
        } }
]
  , ParserStart: "process"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
