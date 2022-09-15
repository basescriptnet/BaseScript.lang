const moo = require('moo');
const lexer = moo.compile({
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
    keyword: ['interface', 'void', 'defined', 'safeValue', 'swap', 'namespace', 'Boolean', 'Number', 'String', 'Array', 'Object', 'unless', 'than', 'constructor', 'null', 'const', 'print', 'var',
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
    'opening parentesis': '(',
    'closing parentesis': ')',
    fat_arrow: '=>',
    //constant: 'const',
    //variable_name: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
    identifier: [
        {
            match: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
        },
        {
            match: /(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
            value: x => 'emoji_' + x.codePointAt(),
        }
    ],
    //'[': '[',
    //']': ']',
    //'{': '{',
    //'}': '}',
    //spread: '...',
    //escape: '\\',
    //comma: ',',
    //semicolon: ';',
    //double_colon: '::',
    //colon: ':',
    //through: '..',
    //'??': '??',
    //'?.': '?.',
    //'?': '?',
    //period: '.',
    //or: '||',
    //and: '&&',
    //"bitwise operator": ['&', '|', '^', '~', '>>>', '<<', '>>'],
    //comparision: ['==', '===', '!=', '!==', '>', '<', '>=', '<='],
    //equal: '=',
    // thin_arrow: '=>',
    eval: '@eval',
    //at: '@',
    '@include': '@include',
    '#include': '#include',
    import: '@import',
    '@text': '@text',
    decorator: [/*'@php', */'@js'],
    literal: ['#', '@', '[', ']', '{', '}', '(', ')', '...', '..', '.', '\\', ',', ';', '::', ':', '??', '?.', '?', '!', '!=', '!==', '==', '===', '>=', '<=', '>', '<', '&&', '&', '|', '||', '+=', '-=', '*=', '/=', '%=', '**=', '++', '--', '='],
    //than: /\?|\bthan\b/,
    //'|': '|',
    //ampersant: '&',
    //'!': '!',
    //id: '#',
    //asterisk: '*',
    //function_name: /[A-Za-z]+/
});