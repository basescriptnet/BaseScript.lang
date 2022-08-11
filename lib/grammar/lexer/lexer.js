
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
    keyword: ['void', 'Boolean', 'Number', 'String', 'Array', 'Object', 'unless', 'than', 'constructor', 'null', 'const', 'print', 'var', 'sizeof', 'Infinity', 'NaN', 'undefined', 'globalThis', 'through', 'THAT', 'DELETE', 'SAVE', 'LOG', 'ERROR', 'WRITE', 'INTO', 'PUSH', 'POP', 'SHIFT', 'UNSHIFT', 'FROM', 'Int', 'Float', 'BEGIN', 'END', 'SET', 'TO', 'typeof', 'instanceof', 'in', 'of', 'type', 'super', 'extends', 'function', 'def', 'this', 'echo', 'export', 'as', 'JSON', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while', 'if', 'else', 'import', 'from', 'let', 'const', 'null', 'of', 'default', 'caseof', 'switch', 'with', 'for', 'case', 'default', 'elif', 'debugger', 'or', 'and', 'return', 'new', 'is', 'not', 'throw', 'break', 'continue'].map(i => new RegExp(`\\b${i}\\b`)),
    //regexp: /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/,
    regexp: /\/(?:\\[ ><bfnrtsSwWdD.+*^$[\]{}|?:\\]|[^><\n\/\\])*?\//,
    operator: ['+', '-', '/', '**', '*', '%', '^'],
    // ! is not tested
    bigInt: /(?:[0-9]+(?:_?[0-9]+)*)n/,
    number: /(?:[0-9]+(?:_?[0-9]+)*)(?:\.[0-9]+)?/,
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
    identifier: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
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
    colon: ':',
    through: '..',
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
    function_name: /[A-Za-z]+/,
});