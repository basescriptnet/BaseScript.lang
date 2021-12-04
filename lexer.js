
const moo = require('moo');
const lexer = moo.compile({
    comment: /\/\/.*/,
    keyword: ['typeof', 'instanceof', 'constructor', 'super', 'extends', 'function', 'this', 'echo', 'export', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while', 'if', 'else', 'import', 'from', 'let', 'const', 'true', 'false', 'null', 'of', 'default', 'switch', 'switch*', 'with', 'for', 'case', 'default', 'elif', 'debugger', 'or', 'and', 'return', 'new', 'is', 'is not', 'is greater than', 'is greater or equal to', 'is smaller than', 'is smaller or equal to', 'equal', 'throw', 'break', 'continue'],
    regexp: /\/(?:\\[ ><bfnrtswSWdD.+*^$[\]{}|?:]|[^><\n\/\\])*?\//,
    operator: ['+', '-', '/', '**', '*', '%'],
    number: /(?:\+|-)?(?:[0-9]+(?:_?[0-9]+)*)(?:\.[0-9]+)?/,
    lodash: '_',
    'true': 'true',
    'false': 'false',
    'null': 'null',
    // NL: {
    //     match: /\r?\n+/, lineBreaks: true
    // },
    space: {
        // match: /[^\S\r\n]+/, lineBreaks: false
        match: /\s+/, lineBreaks: true
    },
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
    multiplicative_operator: /\*|\/|\*\*/,
    additive_operator: /\+|-/,
    'opening parentesis': '(',
    'closing parentesis': ')',
    int: 'int',
    float: 'float',
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
    or: '||',
    and: '&&',
    eval: '@eval',
    '@include': '@include',
    import: '@import',
    than: /\?|\bthan\b/,
    '|': '|',
    '&': '&',
    '!': '!',
    id: '#',
    asterisk: '*',
    function_name: /[A-Za-z]+/,
});
module.exports = lexer;