
const moo = require('moo');
const lexer = moo.compile({
    comment: /\/\/.*/,
    keyword: ['while', 'if', 'else', 'import', 'from', 'let', 'const', 'true', 'false', 'null', 'of', 'default', 'switch', 'switch*', 'with', 'for', 'case', 'default', 'elif', 'debugger', 'or', 'and', 'return', 'new'],
    operator: ['+', '-', '/', '*', '%'],
    number: /(?:\+|-)?[0-9]+(?:\.[0-9]+)?/,
    'true': 'true',
    'false': 'false',
    'null': 'null',
    space: {
        match: /\s+/, lineBreaks: true
    },
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
    multiplicative_operator: /\*|\//,
    additive_operator: /\+|-/,
    'opening parentesis': '(',
    'closing parentesis': ')',
    int: 'int',
    float: 'float',
    equal: '=',
    semicolon: ';',
    constant: 'const',
    //variable_name: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
    identifier: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
    hex: /#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\b/,
    '[': '[',
    ']': ']',
    // '(': '(',
    // ')': ')',
    '{': '{',
    '}': '}',
    comma: ',',
    semicolon: ';',
    colon: ':',
    through: '..',
    period: '.',
    or: '||',
    and: '&&',
    '|': '|',
    '&': '&',
    asterisk: '*',
    function_name: /[A-Za-z]+/,
});
module.exports = lexer;