// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const done = [];
    const operators = {};
    const assign = Object.assign.bind(Object);
    let HTML_ALLOWED = false;
    const assure = function (data, location, reject, result) {
        //console.log('first', data[0])
        if (done.includes[location]) {
            return reject;
        }
        done.push(location);
        return result;
    };
    const moo = require('moo');
const numberify = function (v, radix) {
    if (v.endsWith('n'))
        v = v.slice(0, -1);
    if (v[0] === '-' || v[0] === '+')
        return parseInt(v.slice(3), radix) * (v[0] === '-' ? -1 : 1);
    return parseInt(v.slice(2).replace(/_/g, ''), radix)
}
const lexer = moo.compile({
    string: [
        {
            match: /"(?:\\["'`bfnrtvxu$\\/]|[^"\\])*"/, quoteType: '\"'
        },
        {
            match: /'(?:\\["'`bfnrtvxu$\\/]|[^'\\])*'/, quoteType: '\''
        },
        {
            match: /`(?:\\["'`bfnrtvxu$\\/]|[^`\\])*`/, lineBreaks: true, quoteType: '\`'
        },
    ],
    space: {
        match: /(?:\s+|\/\/[^\n\r]*(?:\n+\s*)?)+/,
        lineBreaks: true,
        value: v => v.replace(/\/\/[^-\n\r]?[^\n\r]*/g, '')
    },
    //'@constructor': 'constructor',
    keyword: ['class', 'interface', 'void', 'defined', 'safeValue', 'swap', 'namespace', 'Boolean', 'Number', 'String', 'Array', 'Object', 'unless', 'than', 'constructor', 'null', 'const', 'print', 'var',
        'sizeof', 'Infinity', 'NaN', 'undefined', 'globalThis', 'through', 'delete', 'THAT', 'DELETE', 'SAVE', 'LOG', 'ERROR', 'WRITE', 'INTO', 'PUSH',
        'POP', 'SHIFT', 'UNSHIFT', 'FROM', 'Int', 'Float', 'BEGIN', 'END', 'set', 'get', 'package', 'private', 'SET', 'TO', 'typeof', 'instanceof', 'in', 'of', 'type', 'super',
        'extends', 'function', 'def', 'this', 'echo', 'export', 'as', 'JSON', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while',
        'if', 'else', 'import', 'from', 'let', 'const', 'null', 'of', 'default', 'caseof', 'switch*', 'switch', 'with', 'for', 'case', 'default', 'elif',
        'debugger', 'or', 'and', 'return', 'new', 'is', 'not', 'throw', 'break', 'continue', 'when', 'exit',].map(i => new RegExp(`\\b${i}\\b`)),
    //regexp: /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/,
    regexp: /\/(?:\\[ \/><bBfFnNrRtTvVxXuUsSwWdD.+\-!@#&()*^$[\]{}|?:\\]|[^><\n\/\\])*?\//,
    // ! is not tested
    bigInt: [
        {
            match: /0[xX](?:[0-9A-Fa-f]+(?:_?[0-9A-Fa-f]+)*)n/,
            value: v => numberify(v, 16) + 'n'
        },
        {
            match: /0[oO](?:[0-7]+(?:_?[0-7]+)*)n/,
            value: v => numberify(v, 8) + 'n'
        },
        {
            match: /0[bB](?:[01]+(?:_?[01]+)*)n/,
            value: v => numberify(v, 2) + 'n'
        },
        {
            match: /(?:[0-9]+(?:_?[0-9]+)*)n/,
            value: v => parseFloat(v.replace(/_/g, '')) + 'n'
        },
    ],
    number: [
        {
            match: /0[xX](?:[0-9A-Fa-f]+(?:_?[0-9A-Fa-f]+)*)/,
            value: v => numberify(v, 16)
        },
        {
            match: /0[oO](?:[0-7]+(?:_?[0-7]+)*)/,
            value: v => numberify(v, 8)
        },
        {
            match: /0[bB](?:[01]+(?:_?[01]+)*)/,
            value: v => numberify(v, 2)
        },
        {
            match: /(?:[0-9]+(?:_?[0-9]+)*)(?:\.[0-9]+)?/,
            value: v => parseFloat(v.replace(/_/g, ''))
        },
    ],
    identifier: [
        {
            match: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
        },
        {
            match: /(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
            value: x => 'emoji_' + x.codePointAt(),
        }
    ],
    boolean: ['true', 'false'],
    eval: '@eval',
    //at: '@',
    '@include': '@include',
    '#include': '#include',
    import: '@import',
    '@text': '@text',
    decorator: [/*'@php', */'@js'],
    operator: ['++', '--', /*'+', '-', '/', '**', '*', '%'*/],
    literal: ['|>', '<|', '#', '@', '~', '>>>', '>>', '<<', '^'
        , '[', ']', '{', '}', '(', ')', '...', '..', '.', '\\'
        , ',', ';', '::', ':', '??', '?.', '?', '!'
        , '!=', '!==', '==', '===', '>=', '<=', '>', '<'
        , '&&', '&', '||', '|'
        , '+=', '-=', '*=', '/=', '%=', '**=', '='
        , '+', '-', '/', '**', '*', '%'],
    '': {
        match: /./,
        error: true,
    }
});



    const parsed = new Map();
const functions = {
    annonymous: (v, l, reject) => {
        if (v[4].inline) {
            return reject
        }
        return {
            type: 'anonymous_function',
            identifier: v[2] ? v[2][1] : '',
            arguments: v[4],
            value: v[5],
            declarator: v[1],
            async: v[0] ? true : false,
            line: v[1].line,
            col: v[1].col
            // text is one of the options above: string; int...
        }
    },
    annonymous_with_no_args: (v, l, reject) => {
        if (v[3].inline) {
            return reject
        }
        //for (let i = 0; i < v[1].value.length; i++) {
        //    if (v[1].value[i][0] === v[1].value[i][0].toLowerCase()) {
        //        throw new SyntaxError('Function argument names should be in capitalized at line ' + v[1].line + ', col ' + v[1].col)
        //    }
        //}
        return {
            type: 'anonymous_function',
            identifier: v[2] ? v[2][1] : '',
            arguments: [],
            value: v[3],
            declarator: v[1],
            result: 'iife',
            async: v[0] ? true : false,
            line: v[1].line,
            col: v[1].col
            // text is one of the options above: string; int...
        }
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
    ternary: (v, l, reject) => {
        if (v[0].value && v[0].value.type === 'anonymous_function')
            return reject;
        //if (parsed.has(v[0].line)) {
        //    if (parsed.get(v[0].line).indexOf(v[0].col) != -1) {
        //        return reject;
        //    }
        //    parsed.get(v[0].line).push(v[0].col);
        //} else {
        //    parsed.set(v[0].line, [v[0].col]);
        //}

        if (parsed.has(v[0].line)) {
            let v0 = parsed.get(v[0].line);
            let any = v0.filter(i => i.col === v[0].col);
            for (let i = 0; i < any.length; i++) {
                if (any[i].else === !!v[6] && any[i].offset === v[0].offset + v[2].offset + v[4].offset + (!!v[6] ? v[6].offset : 0)) {
                    //debugger
                    return reject;
                }
            }
            v0.push({ col: v[0].col, offset: v[0].offset, else: !!v[6] });
        } else {
            parsed.set(v[0].line, [{ col: v[0].col, offset: v[0].offset + v[2].offset + v[4].offset + (!!v[6] ? v[6].offset : 0), else: !!v[6] }]);
        }

        return {
            type: 'ternary',
            left: v[4],
            right: v[5] ? v[5][3] : null,
            value: v[0],
            line: v[0].line,
            lineBreaks: v[0].lineBreaks,
            offset: v[0].offset,
            col: v[0].col,
        }
    },
    ternary_with_if: (v, l, reject) => {
        if (v[0].value && v[0].value.type === 'anonymous_function')
            return reject;
        //if (parsed.has(v[0].line)) {
        //    if (parsed.get(v[0].line).indexOf(v[0].col) != -1) {
        //        //console.log(v[5])
        //        return reject;
        //    }
        //    parsed.get(v[0].line).push(v[0].col);
        //} else {
        //    parsed.set(v[0].line, [v[0].col]);
        //}

        if (parsed.has(v[0].line)) {
            let v0 = parsed.get(v[0].line);
            let any = v0.filter(i => i.col === v[0].col);
            for (let i = 0; i < any.length; i++) {
                if (any[i].else === !!v[6] && any[i].offset === v[0].offset + v[2].offset + v[4].offset + (!!v[6] ? v[6].offset : 0)) {
                    //debugger
                    return reject;
                }
            }
            v0.push({ col: v[0].col, offset: v[0].offset, else: !!v[6] });
        } else {
            parsed.set(v[0].line, [{ col: v[0].col, offset: v[0].offset + v[2].offset + v[4].offset + (!!v[6] ? v[6].offset : 0), else: !!v[6] }]);
        }

        return {
            type: 'ternary',
            left: v[0],
            right: v[5] ? v[5][3] : null,
            value: v[4],
            line: v[0].line,
            lineBreaks: v[0].lineBreaks,
            offset: v[0].offset,
            col: v[0].col,
        }
    },
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
        //console.log(v)
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
        let types = []// ? v[2].argument_type.value : 'none'];
        let t = v[2].argument_type;
        let subt = [];
        for (let i = 0; t && i < t.value.length; i++) {
            subt.push([t.value[i], t.is_array[i]]);
        }
        if (subt.length === 0) {
            subt.push(['none', false])
        }
        types.push(subt);
        let cancelables = [v[2].can_be_null ? true : false];
        let values = [v[2].value];
        //console.log(v[3]);
        for (let i in v[3]) {
            subt = [];
            t = v[3][i][3].argument_type;
            output.push(v[3][i][3].identifier);
            for (let j = 0; t && j < t.value.length; j++) {
                subt.push([t.value[j], t.is_array[j]]);
            }
            if (subt.length === 0) {
                subt.push(['none', false])
            }
            types.push(subt);
            values.push(v[3][i][3].value);
            cancelables.push(v[3][i][3].can_be_null ? true : false);
        }
        //v[0].value = 'arguments_with_types';
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
    extract_with_no_parenthesis: v => {
        let output = [v[0]];
        for (let i in v[1]) {
            output.push(v[1][i][3]);
        }
        //console.log(v[0])
        return ({
            type: 'arguments',
            value: output
        });
    },
    extract: v => {
        let output = [v[2]];
        for (let i in v[3]) {
            output.push(v[3][i][3])
        }
        delete v[0].text
        return assign(v[0], {
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
        value: v[3]
    }),
    value: (v, l, reject) => {
        if (v[0].type == 'anonymous_function') {
            if (!v[0].identifier) {
                return reject;
            }
        }
        return ({
            type: 'statement_value',
            value: v[0],
            line: v[0].line,
            col: v[0].col,
            offset: v[0].offset,
        })
    },
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
        if (!Array.isArray(v[0][0].value)) {
            if (v[0][0].value != v[3].value) {
                throw new Error(`Opening tag does not much the closing tag at ${v[0].line}:${v[0].col}`);
            }
        }

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
        return assign(v[0], {
            type: 'array',
            value: output
        });
    },
    loop: v => {
        return assign(v[0], {
            type: 'array_through',
            value: [v[2], v[6]]
        });
    },
    slice: (v, l, reject) => {
        if (v[0].type == 'debugging') return reject;
        //if (done.includes(l)) return reject;

        done.push(l);

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
        let rest = [];
        extractPair(v[2], output, rest);
        for (let i in v[3]) {
            extractPair(v[3][i][3], output, rest);
        }
        return assign(v[0], {
            type: 'object',
            value: output,
            rest
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
        value: v[0].value
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
function string_concat(v) {
    console.log(v[0])
    return assign(v[0], {
        value: v[0].value + v[4].value
    })
}
function Null (v) {
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
function extractPair (kv, output, rest) {
    //debugger
    // for spread operators kv is object
    if (kv.type) {
        rest.push(kv)
        return;
    }
    if (kv[0]) {
        if (typeof kv[0] == 'string') {
            output[kv[0]] = kv[1];
        }
        else {
            output[kv[0].value] = kv[1];
        }
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
    {"name": "single_include$subexpression$1", "symbols": ["identifier"]},
    {"name": "single_include$subexpression$1", "symbols": ["keyword"]},
    {"name": "single_include", "symbols": [{"literal":"#include"}, "_nbsp", {"literal":"<"}, "single_include$subexpression$1", {"literal":">"}], "postprocess":  v => {
            if (v[3][0].value == 'HTML') HTML_ALLOWED = true;
            return {
                type: 'built_in_include',
                value: v[3][0].value,
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "single_include$ebnf$1$subexpression$1", "symbols": ["__", {"literal":"as"}, "__", "identifier"]},
    {"name": "single_include$ebnf$1", "symbols": ["single_include$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "single_include$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_include", "symbols": [{"literal":"#include"}, "__nbsp", "string", "single_include$ebnf$1"], "postprocess":  v => ({
            type: "include",
            value: v[2].value,
            line: v[0].line,
            col: v[0].col,
            name: v[3] ? v[3][3].value : null
        }) },
    {"name": "includes", "symbols": ["includes", "EOL", "single_include"], "postprocess":  (v, l, reject) =>
        v[0].concat(v[2])
        },
    {"name": "includes", "symbols": ["single_include"], "postprocess": v => [v[0]]},
    {"name": "group_include$ebnf$1$subexpression$1", "symbols": ["_", "includes"]},
    {"name": "group_include$ebnf$1", "symbols": ["group_include$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "group_include$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_include", "symbols": ["group_include$ebnf$1"], "postprocess": v => v[0] ? v[0][1] : []},
    {"name": "decorated_statements", "symbols": ["_", (lexer.has("decorator") ? {type: "decorator"} : decorator), "group_include", "statements"], "postprocess":  v => ({
        	type: 'decorator',
        	line: v[3] ? v[3].line : v[4].line,
        	col: v[3] ? v[3].col : v[4].col,
        	offset: v[3].offset,
        	decorator: v[1].value,
        	includes: v[2],
        	value: v[3],
            comment: v[0].value
        }) },
    {"name": "decorated_statements", "symbols": ["group_include", "statements"], "postprocess":  v => {
                return ({
        	type: 'decorator',
        	includes: v[0],
        	value: v[1],
                line: 1,
                col: 0
        })} },
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
            if (v[0] && v[0].length) {
                if (!v[1].length && !v[2]) {
                    return reject;
                }
                for (let i = 0; i < v[0].length; i++) {
                    result.push(v[0][i])
                }
            }
            // this line prevent result duplication because of v[1]
            // if only one statement is provided v[2], needs to handle it
            if (v[1].length && !v[2]) return reject
        	for (let i = 0/*, indent = 0*/; i < v[1].length; i++) {
                // ? unused
        		/*if (i == 0) indent = (v[0][i][0].text)
        		if (indent !== (v[0][i][0].text)) {
        			throw new Error('Invalid indentation.')
        		}*/
        		result.push(v[1][i][1])
        	}
            if (v[2]) result.push(v[2][1])
        	return result
        } },
    {"name": "statement", "symbols": ["blocks"], "postprocess": id},
    {"name": "statement", "symbols": ["debugging"], "postprocess": id},
    {"name": "statement", "symbols": ["class_declaration"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"debugger"}], "postprocess": statement.debugger},
    {"name": "statement", "symbols": ["return"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"throw"}, "__", "superValue"], "postprocess": statement.throw},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"break"}]},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"continue"}]},
    {"name": "statement", "symbols": ["statement$subexpression$1"], "postprocess": statement.break_continue},
    {"name": "statement", "symbols": [{"literal":"swap"}, "__", "superValue", "_", {"literal":","}, "_", "superValue"], "postprocess": statement.swap},
    {"name": "statement", "symbols": ["var_assign"], "postprocess": id},
    {"name": "statement", "symbols": ["value_reassign"], "postprocess": statement.value_reassign},
    {"name": "statement", "symbols": ["superValue"], "postprocess": statement.value},
    {"name": "statement", "symbols": [{"literal":"namespace"}, "__", "superValue"], "postprocess": statement.namespace},
    {"name": "statement", "symbols": ["declare"], "postprocess": id},
    {"name": "blocks", "symbols": ["if_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["while_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["for_block"], "postprocess": id},
    {"name": "blocks", "symbols": ["try_catch_finally"], "postprocess": id},
    {"name": "blocks", "symbols": ["type_declaration"], "postprocess": id},
    {"name": "blocks", "symbols": ["operator_declaration"], "postprocess": id},
    {"name": "blocks", "symbols": ["interface"], "postprocess": id},
    {"name": "blocks", "symbols": [{"literal":"@"}, {"literal":"ignore"}, "statements_block"], "postprocess":  v => ({
            type: 'ignore',
            value: v[3],
            line: v[0].line,
            col: v[0].col
        }) },
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
            col: v[3].col
        }) },
    {"name": "statements_block", "symbols": ["_", {"literal":":"}, "_", "statement"], "postprocess":  v => {
            return ({
                type: 'scope',
                value: [v[3]],
                line: v[3].line,
                col: v[3].col,
                inline: true,
                mustEndWithEOL: true
            })
        } },
    {"name": "statements_block", "symbols": ["_nbsp", {"literal":"do"}, "__", "statement"], "postprocess":  v => ({
            type: 'scope',
            value: [v[3]],
            line: v[3].line,
            col: v[3].col,
            inline: true,
            mustEndWithEOL: true
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
                line: v[0].line, col: v[0].col, offset: v[0].offset,
        	})
        } },
    {"name": "operator$ebnf$1", "symbols": [/[A-Za-z0-9_\/*+-.&|$@!^#~]/]},
    {"name": "operator$ebnf$1", "symbols": ["operator$ebnf$1", /[A-Za-z0-9_\/*+-.&|$@!^#~]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operator", "symbols": [{"literal":"#"}, "operator$ebnf$1"], "postprocess":  v => ({
            type: 'operator',
            value: v[1].join(''),
            line: v[0].line, col: v[0].col, offset: v[0].offset,
        }) },
    {"name": "operator_declaration", "symbols": [{"literal":"operator"}, "__", "operator", "_", "arguments_with_types", "statements_block"], "postprocess":  v => {
            if (v[4].value.length < 2 && v[4].value.length > 2) {
                throw new Error(`Operator declaration requires two argument`)
            }
            if (v[2].value == 'include') {
                throw new Error(`Operator name 'include' is reserved.`)
            }
            return assign(v[0], {
                type: 'operator_declaration',
                identifier: v[2],
                arguments: v[4],
                value: v[5],
                line: v[0].line, col: v[0].col, offset: v[0].offset,
            })
        } },
    {"name": "interface$subexpression$1$ebnf$1", "symbols": [{"literal":"?"}], "postprocess": id},
    {"name": "interface$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "interface$subexpression$1", "symbols": ["key", "interface$subexpression$1$ebnf$1", "_", {"literal":":"}, "_", "_value_type", "_"]},
    {"name": "interface$ebnf$1", "symbols": []},
    {"name": "interface$ebnf$1$subexpression$1$ebnf$1", "symbols": [{"literal":"?"}], "postprocess": id},
    {"name": "interface$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "interface$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "_", "key", "interface$ebnf$1$subexpression$1$ebnf$1", "_", {"literal":":"}, "_", "_value_type", "_"], "postprocess": v => v.slice(2)},
    {"name": "interface$ebnf$1", "symbols": ["interface$ebnf$1", "interface$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "interface$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "_"]},
    {"name": "interface$ebnf$2", "symbols": ["interface$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "interface$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "interface", "symbols": [{"literal":"interface"}, "__", "identifier", "_", {"literal":"{"}, "_", "interface$subexpression$1", "interface$ebnf$1", "interface$ebnf$2", {"literal":"}"}], "postprocess":  v => {
            if (v[2].value[0].toUpperCase() != v[2].value[0]) {
                throw new SyntaxError(`Interface name must be capitalized.`)
            }
            if (v[6].length == 0) {
                throw new Error(`Interface declaration requires at least one argument.`)
            }
            let values = [v[6], ...v[7]];
            let obj = {};
            for (let i in values) {
                for (let j in values[i][5].value) {
                    let key = values[i][5].value[j];
                    // Interface key must be capitalized
                    if (key[0].toUpperCase() != key[0]) {
                        throw new SyntaxError(`Interface key must be capitalized.`)
                    }
                }
                if (obj[values[i][0].value]) {
                    throw new SyntaxError(`Interface key must be unique. "${values[i][0].value}" is already defined`)
                }
                obj[values[i][0].value] = {
                    nullable: values[i][1] ? true : false,
                    value: values[i][5].value,
                    is_array: values[i][5].is_array
                }
            }
            return {
                type: 'interface',
                identifier: v[2].value,
                value: obj,
                line: v[0].line, col: v[0].col, offset: v[0].offset,
            }
        } },
    {"name": "global", "symbols": [{"literal":"@"}, {"literal":"global"}, "__", "identifier"], "postprocess":  v => ({
            type: 'global',
        	value: v[3],
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
    {"name": "allowed_keywords", "symbols": [{"literal":"Float"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"Int"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"super"}], "postprocess": id},
    {"name": "allowed_keywords", "symbols": [{"literal":"undefined"}], "postprocess":  v => assign(v[0], {
            type: 'keyword',
            value: 'void(0)'
        }) },
    {"name": "convert", "symbols": ["base", "__", {"literal":"as"}, "__", "convert_type"], "postprocess":  (v, l, reject) => {
            return {
                type: 'convert',
                value: v[0],
                convert_type: v[4],
                line: v[0].line, col: v[0].col, offset: v[0].offset,
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
    {"name": "pair", "symbols": [{"literal":"..."}, "_", "Var"], "postprocess": v => v[2]},
    {"name": "key", "symbols": ["string"], "postprocess": id},
    {"name": "key", "symbols": ["identifier"], "postprocess": id},
    {"name": "key", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": id},
    {"name": "string_concat", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess":  v => {
            if (v[0].value.startsWith('"')) {
                v[0].quoteType = '"'
                v[0].value = v[0].value.slice(1, -1)
            } else if (v[0].value.startsWith("'")) {
                v[0].quoteType = "'"
                v[0].value = v[0].value.slice(1, -1)
            } else {
                v[0].quoteType = '`'
                v[0].value = JSON.stringify(v[0].value).slice(2, -2)
            }
            return {
                quoteType: v[0].quoteType,
                type: 'string',
                value: v[0].value,
                line: v[0].line, col: v[0].col, offset: v[0].offset,
            }
        } },
    {"name": "regexp_flags", "symbols": [/[gmi]/], "postprocess": regexp.flag},
    {"name": "myNull", "symbols": [{"literal":"null"}], "postprocess": Null},
    {"name": "boolean$subexpression$1", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)]},
    {"name": "boolean", "symbols": ["boolean$subexpression$1"], "postprocess": boolean},
    {"name": "boolean", "symbols": [{"literal":"defined"}, "__nbsp", "identifier"], "postprocess":  v => ({
            type: 'defined',
            value: v[2],
            line: v[0].line, col: v[0].col, offset: v[0].offset,
        }) },
    {"name": "boolean", "symbols": [{"literal":"defined"}, "_nbsp", {"literal":"("}, "_", "identifier", "_", {"literal":")"}], "postprocess":  v => ({
            type: 'defined',
            value: v[4],
            line: v[0].line, col: v[0].col, offset: v[0].offset,
        }) },
    {"name": "string", "symbols": ["string_concat"], "postprocess": id},
    {"name": "string$subexpression$1", "symbols": [{"literal":"@"}, {"literal":"dirname"}]},
    {"name": "string$subexpression$1", "symbols": [{"literal":"@"}, {"literal":"filename"}]},
    {"name": "string", "symbols": ["string$subexpression$1"], "postprocess":  v => ({
            type: 'locator',
            value: v[0][1],
        }) },
    {"name": "bigInt", "symbols": [(lexer.has("bigInt") ? {type: "bigInt"} : bigInt)], "postprocess": number.bigInt},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": number.float},
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
    {"name": "Var", "symbols": ["base", "_nbsp", {"literal":"["}, "_", {"literal":"]"}], "postprocess":  (v, l, reject) => {
        return {
            type: 'item_retraction_last',
            from: v[0],
            line: v[0].line,
            col: v[0].col
        } } },
    {"name": "Var$subexpression$1", "symbols": ["_", "superValue"]},
    {"name": "Var$ebnf$1$subexpression$1", "symbols": ["_", "superValue"]},
    {"name": "Var$ebnf$1", "symbols": ["Var$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Var$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Var$ebnf$2$subexpression$1", "symbols": ["_", {"literal":":"}, "_", "superValue"]},
    {"name": "Var$ebnf$2", "symbols": ["Var$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "Var$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Var", "symbols": ["base", "_", {"literal":"["}, "Var$subexpression$1", "_", {"literal":":"}, "Var$ebnf$1", "Var$ebnf$2", "_", {"literal":"]"}], "postprocess": array.slice},
    {"name": "Var", "symbols": ["base", "_nbsp", {"literal":"["}, "_", "superValue", "_", {"literal":"]"}], "postprocess":  v => ({
                type: 'item_retraction',
                from: v[0],
                value: v[4],
                line: v[0].line,
                col: v[0].col
        }) },
    {"name": "Var", "symbols": ["base", "_", {"literal":"-"}, {"literal":">"}, "_", "array"], "postprocess":  (v, l, reject) => {
            //if (v[0].type == 'annonymous_function') return reject
            return {
                type: 'arrow_array_execution',
                from: v[0],
                value: v[5],
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "Var", "symbols": ["base", "_", {"literal":"."}, "_", "object"], "postprocess":  (v, l, reject) => {
            //if (v[0].type == 'annonymous_function') return reject
            return {
                type: 'dot_property_addition',
                from: v[0],
                value: v[4],
                line: v[0].line,
                col: v[0].col
            }
        } },
    {"name": "Var$subexpression$2", "symbols": [(lexer.has("keyword") ? {type: "keyword"} : keyword)]},
    {"name": "Var$subexpression$2", "symbols": ["identifier"]},
    {"name": "Var", "symbols": ["base", "_", {"literal":"."}, "_", "Var$subexpression$2"], "postprocess":  (v, l, reject) => {
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
    {"name": "Var", "symbols": [{"literal":"::"}, {"literal":"["}, "_", "superValue", "_", {"literal":"]"}], "postprocess":  v => ({
                type: 'namespace_retraction',
                retraction_type: 'item_retraction',
                value: v[3],
                line: v[0].line,
                col: v[0].col
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
    {"name": "switch", "symbols": [{"literal":"switch"}, {"literal":"*"}, "_", "superValue", "_", {"literal":"{"}, "switch$ebnf$1", "_", {"literal":"}"}], "postprocess":  v => assign(v[0], {
        	type: 'switch*',
        	value: v[3],
        	cases: v[6] ? v[6].map(i => i[1]) : []
        }) },
    {"name": "case_single_valued$ebnf$1$subexpression$1", "symbols": ["superValue", "EOL"]},
    {"name": "case_single_valued$ebnf$1", "symbols": ["case_single_valued$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "case_single_valued$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_single_valued", "symbols": [{"literal":"case"}, "_", "superValue", "_", {"literal":":"}, "_", "case_single_valued$ebnf$1"], "postprocess":  v => assign(v[0], {
        type: 'case_with_break',
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
    {"name": "switch_multiple", "symbols": [{"literal":"switch"}, "__", "superValue", "_", {"literal":"{"}, "switch_multiple$ebnf$1", "switch_multiple$ebnf$2", "_", {"literal":"}"}], "postprocess":  v => assign(v[0], {
        	type: 'switch',
        	value: v[2],
        	cases: v[5] ? v[5].map(i => i[1]) : [],
            default: v[6] ? v[6][1] : null
        }) },
    {"name": "case_multiline$ebnf$1$subexpression$1", "symbols": ["_", {"literal":";"}]},
    {"name": "case_multiline$ebnf$1", "symbols": ["case_multiline$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "case_multiline$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_multiline", "symbols": [{"literal":"case"}, "__", "superValue", "_", {"literal":":"}, "statements", "case_multiline$ebnf$1"], "postprocess":  v => assign(v[0], {
            type: 'case',
            value: v[2],
            statements: v[5]
        }) },
    {"name": "case_multiline$ebnf$2$subexpression$1", "symbols": ["_", {"literal":";"}]},
    {"name": "case_multiline$ebnf$2", "symbols": ["case_multiline$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case_multiline$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_multiline", "symbols": [{"literal":"case"}, {"literal":"*"}, "__", "superValue", "_", {"literal":":"}, "statements", "case_multiline$ebnf$2"], "postprocess":  v => assign(v[0], {
            type: 'broken_case',
            value: v[3],
            statements: v[6]
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
        		else: v[2],
        		offset: v[0].offset,
        		lineBreaks: v[0].lineBreaks,
        		line: v[0].line,
        		col: v[0].col
        	}
        } },
    {"name": "else_block", "symbols": [{"literal":"else"}, "statements_block"], "postprocess":  v => {
            return assign(v[0], {
        		type: 'else',
        		value: v[1],
                inline: v[1].inline
        	});
        } },
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
        	return ({
        		type: 'finally',
        		value: v[1],
                line: v[0].line,
                col: v[0].col
        	})
        } },
    {"name": "value_reassign", "symbols": ["Var", "_", {"literal":"="}, "_", "superValue"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4],
        		offset: v[0].offset
        	}
        } },
    {"name": "value_reassign$subexpression$1", "symbols": ["switch"]},
    {"name": "value_reassign$subexpression$1", "symbols": ["superValue"]},
    {"name": "value_reassign", "symbols": [{"literal":"SET"}, "_", "superValue", "_", {"literal":"TO"}, "_", "value_reassign$subexpression$1"], "postprocess":  v => {
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
    {"name": "var_assign$subexpression$1", "symbols": ["superValue"]},
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
    {"name": "var_reassign", "symbols": ["identifier", "_", {"literal":"="}, "_", "superValue"], "postprocess":  v => {
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
    {"name": "var_reassign$subexpression$1", "symbols": ["superValue"]},
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
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"+="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"-="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"*="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"/="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"%="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"**="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"<<="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":">>="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":">>>="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"&="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"^="}]},
    {"name": "value_addition$subexpression$1", "symbols": [{"literal":"|="}]},
    {"name": "value_addition", "symbols": ["value", "_", "value_addition$subexpression$1", "_", "superValue"], "postprocess":  (v, l, reject) => ({
            type: 'expression_short_equation',
            left: v[0],
            right: v[4],
            operator: v[2][0].value
        }) },
    {"name": "while_block", "symbols": [{"literal":"while"}, "statement_condition", "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'while',
        		condition: v[1],
        		value: v[2],
        	});
        } },
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"in"}]},
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"of"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "identifier", "__", "for_block$subexpression$1", "__", "superValue", "statements_block"], "postprocess":   v => {
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
    {"name": "for_block", "symbols": [{"literal":"for"}, "_", {"literal":"("}, "_", "identifier", "__", "for_block$subexpression$2", "__", "superValue", "_", {"literal":")"}, "statements_block"], "postprocess":   v => {
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
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "identifier", "__", {"literal":"from"}, "__", "superValue", "_", "for_block$subexpression$3", "_", "superValue", "statements_block"], "postprocess":   v => {
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
    {"name": "for_block", "symbols": [{"literal":"for"}, "_", {"literal":"("}, "_", "identifier", "__", {"literal":"from"}, "__", "superValue", "_", "for_block$subexpression$4", "_", "superValue", "_", {"literal":")"}, "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'for_loop',
        		identifier: v[4],
        		from: v[8],
        		through: v[12],
        		include: v[10][0].text == 'till' ? false : true,
        		value: v[15],
        	});
        } },
    {"name": "for_block$subexpression$5", "symbols": ["var_assign"]},
    {"name": "for_block$subexpression$5", "symbols": ["var_assign_list"]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "for_block$subexpression$5", "_", {"literal":";"}, "statement_condition", "_", {"literal":";"}, "_", "superValue", "statements_block"], "postprocess":   v => {
        	return assign(v[0], {
        		type: 'for_loop_regular',
        		condition: v[5],
        		identifier: v[2][0],
        		change: v[9],
        		value: v[10],
        	});
        } },
    {"name": "anonymous_function$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "anonymous_function$ebnf$1", "symbols": ["anonymous_function$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "anonymous_function$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anonymous_function$ebnf$2$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "anonymous_function$ebnf$2", "symbols": ["anonymous_function$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "anonymous_function$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anonymous_function", "symbols": ["anonymous_function$ebnf$1", "value_type", "anonymous_function$ebnf$2", "_", "arguments_with_types", "statements_block"], "postprocess": functions.annonymous},
    {"name": "anonymous_function$ebnf$3$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "anonymous_function$ebnf$3", "symbols": ["anonymous_function$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "anonymous_function$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anonymous_function$ebnf$4$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "anonymous_function$ebnf$4", "symbols": ["anonymous_function$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "anonymous_function$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anonymous_function", "symbols": ["anonymous_function$ebnf$3", "value_type", "anonymous_function$ebnf$4", "statements_block"], "postprocess": functions.annonymous_with_no_args},
    {"name": "value_type", "symbols": ["_value_type"], "postprocess": id},
    {"name": "value_type$subexpression$1", "symbols": [{"literal":"void"}]},
    {"name": "value_type$subexpression$1", "symbols": [{"literal":"def"}]},
    {"name": "value_type$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "value_type", "symbols": ["value_type$subexpression$1"], "postprocess":  v => ({
            type: 'value_type',
            value: [v[0][0].value],
            is_array: [false],
            line: v[0][0].line,
            col: v[0][0].col
        }) },
    {"name": "_value_type$subexpression$1", "symbols": ["identifier"]},
    {"name": "_value_type$ebnf$1$subexpression$1", "symbols": ["_nbsp", {"literal":"["}, "_", {"literal":"]"}]},
    {"name": "_value_type$ebnf$1", "symbols": ["_value_type$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "_value_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_value_type", "symbols": ["_value_type$subexpression$1", "_value_type$ebnf$1"], "postprocess":  v => {
        //if (v[0][0].value[0].toUpperCase() !== v[0][0].value[0]) {
        //    throw new Error(`Type "${v[0][0].value}" must be capitalized at line ${v[0][0].line}, col ${v[0][0].col}`)
        //}
        return {
            type: 'value_type',
            value: [v[0][0].value],
            is_array: [v[1] !== null],
            line: v[0][0].line,
            col: v[0][0].col,
        }
        } },
    {"name": "_value_type", "symbols": ["value_type", "_nbsp", {"literal":"|"}, "_", "value_type"], "postprocess":  v => ({
            type: 'value_type',
            value: v[0].value.concat(v[4].value),
            is_array: v[0].is_array.concat(v[4].is_array),
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "return", "symbols": [{"literal":"return"}, "__nbsp", "superValue"], "postprocess": returns.value},
    {"name": "return", "symbols": [{"literal":"return"}], "postprocess": returns.empty},
    {"name": "return", "symbols": [{"literal":"=>"}, "_nbsp", "superValue"], "postprocess": returns.value},
    {"name": "function_call", "symbols": ["base", "_nbsp", "arguments"], "postprocess":  (v, l, reject) => {
            if (v[0].type == 'anonymous_function') return reject
        	return ({
        		type: 'function_call',
        		value: v[0],
        		arguments: v[2],
        	})
        } },
    {"name": "function_call", "symbols": [{"literal":"::"}, "arguments"], "postprocess":  (v, l, reject) => {
        	return ({
                type: 'namespace_retraction',
                retraction_type: 'function_call',
        		arguments: v[1],
        	})
        } },
    {"name": "arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": args.empty},
    {"name": "arguments$ebnf$1", "symbols": []},
    {"name": "arguments$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "argument"]},
    {"name": "arguments$ebnf$1", "symbols": ["arguments$ebnf$1", "arguments$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments$ebnf$2", "symbols": ["arguments$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "arguments$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments", "symbols": [{"literal":"("}, "_", "argument", "arguments$ebnf$1", "arguments$ebnf$2", "_", {"literal":")"}], "postprocess": args.extract},
    {"name": "argument", "symbols": ["value"], "postprocess": id},
    {"name": "argument", "symbols": [{"literal":"."}], "postprocess":  v => ({
            type: 'placeholder',
            value: null,
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "arguments_with_types", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": args.empty_arguments_with_types},
    {"name": "arguments_with_types$ebnf$1", "symbols": []},
    {"name": "arguments_with_types$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "argument_identifier_and_value"]},
    {"name": "arguments_with_types$ebnf$1", "symbols": ["arguments_with_types$ebnf$1", "arguments_with_types$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments_with_types$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments_with_types$ebnf$2", "symbols": ["arguments_with_types$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "arguments_with_types$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments_with_types", "symbols": [{"literal":"("}, "_", "argument_identifier_and_value", "arguments_with_types$ebnf$1", "arguments_with_types$ebnf$2", "_", {"literal":")"}], "postprocess": args.arguments_with_types},
    {"name": "argument_identifier_and_value$ebnf$1$subexpression$1", "symbols": ["_value_type", "__"]},
    {"name": "argument_identifier_and_value$ebnf$1", "symbols": ["argument_identifier_and_value$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "argument_identifier_and_value$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_identifier_and_value$ebnf$2$subexpression$1", "symbols": ["_", {"literal":"="}, "_", "value"]},
    {"name": "argument_identifier_and_value$ebnf$2", "symbols": ["argument_identifier_and_value$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "argument_identifier_and_value$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_identifier_and_value", "symbols": ["argument_identifier_and_value$ebnf$1", "identifier", "argument_identifier_and_value$ebnf$2"], "postprocess":  v => {
            return {
        	type: 'argument_identifier_and_value',
        	argument_type: v[0] ? v[0][0] : null,
        	can_be_null: false, //v[0] ? v[0][1] : false,
        	identifier: v[1].value,
        	value: v[2] ? v[2][3] : void 0
        }
        } },
    {"name": "argument_type", "symbols": ["_value_type", "__"], "postprocess": id},
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
    {"name": "debugging_body", "symbols": ["__", "superValue"], "postprocess": v => v[1]},
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
    {"name": "array", "symbols": [{"literal":"["}, "_", "superValue", "_", {"literal":"through"}, "_", "superValue", "_", {"literal":"]"}], "postprocess": array.loop},
    {"name": "new_statement2", "symbols": [{"literal":"new"}, "__", "base"], "postprocess":  (v, l, reject) => {
        if ('new' == v[2].type) return reject;
        return ({
            type: 'new',
            value: v[2]
        }) } },
    {"name": "new_statement2", "symbols": ["base"], "postprocess": id},
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"++"}]},
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"--"}]},
    {"name": "postfix", "symbols": ["base", "_nbsp", "postfix$subexpression$1"], "postprocess":  (v, l, reject) => {
        if (['function_call'].includes(v[0].type)) return reject;
        return ({
            type: 'postfix',
            value: v[0],
            operator: v[2][0].value
        }) } },
    {"name": "postfix", "symbols": ["new_statement2"], "postprocess": id},
    {"name": "unary2", "symbols": [{"literal":"!"}, "_", "unary2"], "postprocess":  (v, l, reject) => ({
            type: 'reversed_unary',
            value: v[2],
            operator: '!',
            reject: v[0].value === 'not'
        }) },
    {"name": "unary2", "symbols": [{"literal":"~"}, "_", "unary2"], "postprocess":  (v, l, reject) => {
            return ({
                type: 'bitwise_not_unary',
                value: v[2],
                operator: '~'
            })
        } },
    {"name": "unary2$subexpression$1", "symbols": [{"literal":"++"}]},
    {"name": "unary2$subexpression$1", "symbols": [{"literal":"--"}]},
    {"name": "unary2", "symbols": ["unary2$subexpression$1", "_nbsp", "base"], "postprocess":  (v, l, reject) => {
            //if (['item_retraction_last', 'item_retraction', 'dot_retraction_v2', 'namespace_retraction', 'function_call', 'identifier'].includes(v[2].type))
            //    throw new SyntaxError('Invalid left-hand side expression in prefix operation');
            return ({
                type: 'prefix',
                value: v[2],
                operator: v[0][0].value
            })
        } },
    {"name": "unary2$subexpression$2", "symbols": [{"literal":"+"}]},
    {"name": "unary2$subexpression$2", "symbols": [{"literal":"-"}]},
    {"name": "unary2", "symbols": ["unary2$subexpression$2", "_", "unary2"], "postprocess":  (v, l, reject) => ({
            type: 'unary_plus_minus',
            value: v[2],
            operator: v[0][0].value
        }) },
    {"name": "unary2", "symbols": [{"literal":"typeof"}, "_", "unary2"], "postprocess":  (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'typeof',
            value: v[2],
        }) } },
    {"name": "unary2", "symbols": [{"literal":"sizeof"}, "_", "unary2"], "postprocess":  (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'sizeof',
            value: v[2],
        }) } },
    {"name": "unary2", "symbols": [{"literal":"void"}, "_", "unary2"], "postprocess":  (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'void_unary',
            value: v[2],
        }) } },
    {"name": "unary2", "symbols": [{"literal":"delete"}, "_", "unary2"], "postprocess":  (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'delete_unary',
            value: v[2],
        }) } },
    {"name": "unary2", "symbols": [{"literal":"await"}, "_", "unary2"], "postprocess":  (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'await_unary',
            value: v[2],
        }) } },
    {"name": "unary2", "symbols": ["postfix"], "postprocess": id},
    {"name": "exponentiation", "symbols": ["unary2", "_", {"literal":"**"}, "_", "exponentiation"], "postprocess":  (v, l, reject) => ({
            type: 'exponentiation',
            left: v[0],
            right: v[4]
        }) },
    {"name": "exponentiation", "symbols": ["unary2", "_", "operator", "_", "exponentiation"], "postprocess":  (v, l, reject) => {
            return ({
                type: 'custom_operator',
                left: v[0],
                right: v[4],
                operator: v[2]
            })
        } },
    {"name": "exponentiation", "symbols": ["unary2"], "postprocess": id},
    {"name": "multiplicative$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "multiplicative$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "multiplicative$subexpression$1", "symbols": [{"literal":"%"}]},
    {"name": "multiplicative", "symbols": ["multiplicative", "_", "multiplicative$subexpression$1", "_", "exponentiation"], "postprocess":  (v, l, reject) => ({
            type: 'multiplicative',
            left: v[0],
            right: v[4],
            operator: v[2][0].value
        }) },
    {"name": "multiplicative", "symbols": ["exponentiation"], "postprocess": id},
    {"name": "additive$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "additive$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "additive", "symbols": ["additive", "_", "additive$subexpression$1", "_", "multiplicative"], "postprocess":  (v, l, reject) => ({
            type: 'additive',
            left: v[0],
            right: v[4],
            operator: v[2][0].value
        }) },
    {"name": "additive", "symbols": ["multiplicative"], "postprocess": id},
    {"name": "shift$subexpression$1", "symbols": [{"literal":"<<"}]},
    {"name": "shift$subexpression$1", "symbols": [{"literal":">>"}]},
    {"name": "shift$subexpression$1", "symbols": [{"literal":">>>"}]},
    {"name": "shift", "symbols": ["shift", "_", "shift$subexpression$1", "_", "additive"], "postprocess":  (v, l, reject) => ({
            type: 'shift',
            left: v[0],
            right: v[4],
            operator: v[2][0].value
        }) },
    {"name": "shift", "symbols": ["additive"], "postprocess": id},
    {"name": "relational$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "relational$subexpression$1", "symbols": [{"literal":">"}]},
    {"name": "relational$subexpression$1", "symbols": [{"literal":"<="}]},
    {"name": "relational$subexpression$1", "symbols": [{"literal":">="}]},
    {"name": "relational$subexpression$1", "symbols": [{"literal":"in"}]},
    {"name": "relational$subexpression$1", "symbols": [{"literal":"instanceof"}]},
    {"name": "relational$subexpression$1$subexpression$1", "symbols": [{"literal":"not"}, "_", {"literal":"in"}]},
    {"name": "relational$subexpression$1$subexpression$1", "symbols": [{"literal":"!"}, "_", {"literal":"in"}]},
    {"name": "relational$subexpression$1", "symbols": ["relational$subexpression$1$subexpression$1"]},
    {"name": "relational$subexpression$1$subexpression$2", "symbols": [{"literal":"not"}, "_", {"literal":"instanceof"}]},
    {"name": "relational$subexpression$1$subexpression$2", "symbols": [{"literal":"!"}, "_", {"literal":"instanceof"}]},
    {"name": "relational$subexpression$1", "symbols": ["relational$subexpression$1$subexpression$2"]},
    {"name": "relational", "symbols": ["relational", "_", "relational$subexpression$1", "_", "shift"], "postprocess":  (v, l, reject) => {
            let reversed = false;
            let o = v[2][0].value;
            if (v[2][0] instanceof Array && (v[2][0][0].value == 'not' || v[2][0][0].value == '!')) {
                reversed = true;
                o = v[2][0][2].value;
            }
            return {
                type: 'relational',
                left: v[0],
                right: v[4],
                operator: o,
                reversed
            }
        } },
    {"name": "relational$subexpression$2", "symbols": [{"literal":"<"}]},
    {"name": "relational$subexpression$2", "symbols": [{"literal":">"}]},
    {"name": "relational$subexpression$2", "symbols": [{"literal":"<="}]},
    {"name": "relational$subexpression$2", "symbols": [{"literal":">="}]},
    {"name": "relational$subexpression$2", "symbols": [{"literal":"in"}]},
    {"name": "relational$subexpression$2", "symbols": [{"literal":"instanceof"}]},
    {"name": "relational$subexpression$2$subexpression$1", "symbols": [{"literal":"not"}, "_", {"literal":"in"}]},
    {"name": "relational$subexpression$2$subexpression$1", "symbols": [{"literal":"!"}, "_", {"literal":"in"}]},
    {"name": "relational$subexpression$2", "symbols": ["relational$subexpression$2$subexpression$1"]},
    {"name": "relational$subexpression$2$subexpression$2", "symbols": [{"literal":"not"}, "_", {"literal":"instanceof"}]},
    {"name": "relational$subexpression$2$subexpression$2", "symbols": [{"literal":"!"}, "_", {"literal":"instanceof"}]},
    {"name": "relational$subexpression$2", "symbols": ["relational$subexpression$2$subexpression$2"]},
    {"name": "relational", "symbols": ["relational", "_", "relational$subexpression$2", "_", "arguments"], "postprocess":  (v, l, reject) => {
            if (v[4].value.length < 2) return reject;
            let reversed = false;
            let o = v[2][0].value;
            if (v[2][0] instanceof Array && (v[2][0][0].value == 'not' || v[2][0][0].value == '!')) {
                reversed = true;
                o = v[2][0][2].value;
            }
            return {
                type: 'condition_destructive',
                left: v[0],
                right: v[4],
                operator: o,
                reversed
            }
        } },
    {"name": "relational", "symbols": ["shift"], "postprocess": id},
    {"name": "equality$subexpression$1", "symbols": [{"literal":"=="}]},
    {"name": "equality$subexpression$1", "symbols": [{"literal":"!="}]},
    {"name": "equality$subexpression$1", "symbols": [{"literal":"==="}]},
    {"name": "equality$subexpression$1", "symbols": [{"literal":"!=="}]},
    {"name": "equality$subexpression$1", "symbols": [{"literal":"is"}]},
    {"name": "equality$subexpression$1", "symbols": [{"literal":"is"}, "_", {"literal":"not"}]},
    {"name": "equality", "symbols": ["equality", "_", "equality$subexpression$1", "_", "relational"], "postprocess":  (v, l, reject) => {
        let o = v[2][0].value;
        if (o == 'is' && v[2][2].value === 'not') o = '!==';
        else if (o == 'is') o = '===';
        return ({
            type: 'equality',
            left: v[0],
            right: v[4],
            operator: o
        }) } },
    {"name": "equality$subexpression$2", "symbols": [{"literal":"=="}]},
    {"name": "equality$subexpression$2", "symbols": [{"literal":"!="}]},
    {"name": "equality$subexpression$2", "symbols": [{"literal":"==="}]},
    {"name": "equality$subexpression$2", "symbols": [{"literal":"!=="}]},
    {"name": "equality$subexpression$2", "symbols": [{"literal":"is"}]},
    {"name": "equality$subexpression$2", "symbols": [{"literal":"is"}, "_", {"literal":"not"}]},
    {"name": "equality", "symbols": ["equality", "_", "equality$subexpression$2", "_", "arguments"], "postprocess":  (v, l, reject) => {
            if (v[4].value.length < 2) return reject;
            let o = v[2][0].value;
            if (o == 'is' && v[2][2].value === 'not') o = '!==';
            else if (o == 'is') o = '===';
        
            return {
                type: 'condition_destructive',
                left: v[0],
                right: v[4],
                operator: o,
            }
        } },
    {"name": "equality", "symbols": ["relational"], "postprocess": id},
    {"name": "bitwise_and", "symbols": ["bitwise_and", "_", {"literal":"&"}, "_", "equality"], "postprocess":  (v, l, reject) => ({
            type: 'bitwise_and',
            left: v[0],
            right: v[4]
        }) },
    {"name": "bitwise_and", "symbols": ["equality"], "postprocess": id},
    {"name": "bitwise_xor", "symbols": ["bitwise_xor", "_", {"literal":"^"}, "_", "bitwise_and"], "postprocess":  (v, l, reject) => ({
            type: 'bitwise_xor',
            left: v[0],
            right: v[4]
        }) },
    {"name": "bitwise_xor", "symbols": ["bitwise_and"], "postprocess": id},
    {"name": "bitwise_or", "symbols": ["bitwise_or", "_", {"literal":"|"}, "_", "bitwise_xor"], "postprocess":  (v, l, reject) => ({
            type: 'bitwise_or',
            left: v[0],
            right: v[4]
        }) },
    {"name": "bitwise_or", "symbols": ["bitwise_xor"], "postprocess": id},
    {"name": "logical_and$subexpression$1", "symbols": [{"literal":"&&"}]},
    {"name": "logical_and$subexpression$1", "symbols": [{"literal":"and"}]},
    {"name": "logical_and", "symbols": ["logical_and", "_", "logical_and$subexpression$1", "_", "bitwise_or"], "postprocess":  (v, l, reject) => ({
            type: 'logical_and',
            left: v[0],
            right: v[4]
        }) },
    {"name": "logical_and", "symbols": ["bitwise_or"], "postprocess": id},
    {"name": "logical_or$subexpression$1", "symbols": [{"literal":"||"}]},
    {"name": "logical_or$subexpression$1", "symbols": [{"literal":"or"}]},
    {"name": "logical_or", "symbols": ["logical_or", "_", "logical_or$subexpression$1", "_", "logical_and"], "postprocess":  (v, l, reject) => ({
            type: 'logical_or',
            left: v[0],
            right: v[4]
        }) },
    {"name": "logical_or", "symbols": ["logical_or", "_", {"literal":"??"}, "_", "logical_and"], "postprocess":  v => ({
            type: 'nullish_check',
            condition: v[0],
            value: v[4],
        }) },
    {"name": "logical_or", "symbols": ["logical_and"], "postprocess": id},
    {"name": "conditional$ebnf$1$subexpression$1", "symbols": ["_", {"literal":":"}, "_", "conditional"]},
    {"name": "conditional$ebnf$1", "symbols": ["conditional$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "conditional$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "conditional", "symbols": ["logical_or", "_", {"literal":"?"}, "_", "conditional", "conditional$ebnf$1"], "postprocess":  (v, l, reject) => {
        return {
            type: 'conditional',
            condition: v[0],
            true: v[4],
            false: v[5] ? v[5][3] : null
        }
        } },
    {"name": "conditional", "symbols": ["logical_or", "_nbsp", {"literal":"if"}, "_", "conditional", "_", {"literal":"else"}, "_", "conditional"], "postprocess":  (v, l, reject) => ({
            type: 'conditional',
            condition: v[4],
            true: v[0],
            false: v[8]
        }) },
    {"name": "conditional", "symbols": ["logical_or", "_nbsp", {"literal":"if"}, "_", "conditional"], "postprocess":  (v, l, reject) => ({
            type: 'conditional',
            condition: v[4],
            true: v[0],
            false: null
        }) },
    {"name": "conditional", "symbols": ["logical_or"], "postprocess": id},
    {"name": "spread", "symbols": [{"literal":"..."}, "_", "conditional"], "postprocess":  (v, l, reject) => ({
            type: 'spread',
            value: v[2]
        }) },
    {"name": "spread", "symbols": ["conditional"], "postprocess": id},
    {"name": "pipeback", "symbols": ["spread", "_", {"literal":"<|"}, "_", "pipeback"], "postprocess":  (v, l, reject) => ({
            type: 'pipeback',
            left: v[0],
            right: v[4]
        }) },
    {"name": "pipeback", "symbols": ["spread"], "postprocess": id},
    {"name": "pipeforward", "symbols": ["pipeforward", "_", {"literal":"|>"}, "_", "pipeback"], "postprocess":  (v, l, reject) => ({
            type: 'pipeforward',
            left: v[0],
            right: v[4]
        }) },
    {"name": "pipeforward", "symbols": ["pipeback"], "postprocess": id},
    {"name": "statement_condition", "symbols": ["_", "superValue"], "postprocess": v => v[1]},
    {"name": "base", "symbols": ["parenthesized"], "postprocess": id},
    {"name": "base", "symbols": ["Var"], "postprocess": id},
    {"name": "base", "symbols": ["anonymous_function"], "postprocess": id},
    {"name": "base", "symbols": ["regexp"], "postprocess": id},
    {"name": "base", "symbols": ["boolean"], "postprocess": id},
    {"name": "base", "symbols": ["string"], "postprocess": id},
    {"name": "base", "symbols": ["bigInt"], "postprocess": id},
    {"name": "base", "symbols": ["number"], "postprocess": id},
    {"name": "base", "symbols": ["array"], "postprocess": id},
    {"name": "base", "symbols": ["myNull"], "postprocess": id},
    {"name": "base", "symbols": ["convert"], "postprocess": id},
    {"name": "base", "symbols": ["object"], "postprocess": id},
    {"name": "base", "symbols": [{"literal":"new"}, {"literal":"."}, {"literal":"target"}], "postprocess":  v => assign(v[0], {
            type: 'new.target',
            value: 'new.target'
        }) },
    {"name": "base", "symbols": [{"literal":"safeValue"}, "_", "arguments"], "postprocess":  v => ({
            type: 'safeValue',
            value: v[2],
            line: v[0].line,
            col: v[0].col
        }) },
    {"name": "base", "symbols": ["switch"], "postprocess": id},
    {"name": "superValue", "symbols": ["value"], "postprocess": id},
    {"name": "superValue", "symbols": ["html"], "postprocess":  (v, l, reject) => {
            if (!HTML_ALLOWED) {
                throw new ReferenceError('HTML syntax is not imported. Use #include <HTML> first.')
            }
            return v[0];
        } },
    {"name": "value", "symbols": ["pipeforward"], "postprocess": id},
    {"name": "parenthesized", "symbols": [{"literal":"("}, "_", "superValue", "_", {"literal":")"}], "postprocess":  (v, l, reject) => {
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
    {"name": "_nbsp$ebnf$1$subexpression$1", "symbols": [{"literal":" "}]},
    {"name": "_nbsp$ebnf$1$subexpression$1", "symbols": [/[\t]/]},
    {"name": "_nbsp$ebnf$1", "symbols": ["_nbsp$ebnf$1", "_nbsp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_nbsp", "symbols": ["_nbsp$ebnf$1"], "postprocess":  (v, l, reject) => {
            let f = v[0].map(i => i.value).join('');
                return {type: 'nbsp', value: f}
        } },
    {"name": "__nbsp$ebnf$1$subexpression$1", "symbols": [{"literal":" "}]},
    {"name": "__nbsp$ebnf$1$subexpression$1", "symbols": [/[\t]/]},
    {"name": "__nbsp$ebnf$1", "symbols": ["__nbsp$ebnf$1$subexpression$1"]},
    {"name": "__nbsp$ebnf$1$subexpression$2", "symbols": [{"literal":" "}]},
    {"name": "__nbsp$ebnf$1$subexpression$2", "symbols": [/[\t]/]},
    {"name": "__nbsp$ebnf$1", "symbols": ["__nbsp$ebnf$1", "__nbsp$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__nbsp", "symbols": ["__nbsp$ebnf$1"], "postprocess":  (v, l, reject) => {
            let f = v[0].map(i => i.value).join('');
                return {type: 'nbsp', value: f}
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
