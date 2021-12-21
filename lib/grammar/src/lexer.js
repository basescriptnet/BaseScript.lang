
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
    keyword: ['THAT', 'DELETE', 'SAVE', 'LOG', 'ERROR', 'WRITE', 'INTO', 'PUSH', 'POP', 'SHIFT', 'UNSHIFT', 'FROM', 'Int', 'Float', 'BEGIN', 'END', 'SET', 'TO', 'typeof', 'instanceof', 'in', 'of', 'type', 'super', 'extends', 'function', 'this', 'echo', 'export', 'as', 'JSON', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while', 'if', 'else', 'import', 'from', 'let', 'const', 'null', 'of', 'default', 'switch', 'switch*', 'with', 'for', 'case', 'default', 'elif', 'debugger', 'or', 'and', 'return', 'new', 'is', 'is not', 'is greater than', 'is greater or equal to', 'is smaller than', 'is smaller or equal to', 'equal', 'throw', 'break', 'continue'].map(i => new RegExp(`\\b${i}\\b`)),
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
    semicolon: ';',
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
    '>': '>',
    '<': '<',
    '>=': '>=',
    '<=': '<=',
    arrow: '=>',
    or: '||',
    and: '&&',
    eval: '@eval',
    '@include': '@include',
    import: '@import',
    '@text': '@text',
    than: /\?|\bthan\b/,
    '|': '|',
    ampersant: '&',
    '!': '!',
    id: '#',
    asterisk: '*',
    function_name: /[A-Za-z]+/,
});