@%
    const assign = Object.assign.bind(Object)
    let HTML_ALLOWED = false
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
            match: /"(?:\\["'`bfnrtvxu$\\/]|[^\n\r"\\])*?"/, quoteType: '\"'
        },
        {
            match: /'(?:\\["'`bfnrtvxu$\\/]|[^\n\r'\\])*?'/, quoteType: '\''
        },
        {
            match: /`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^}]|\\[\s\S])*\})*?`/, lineBreaks: true, quoteType: '\`'
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
    },
});

%
@lexer lexer

process -> decorated_statements _ (";" _):? {% (v, l, reject) => {
    return v[0];
} %}

single_include -> "#include" _nbsp "<" (identifier | keyword) ">" {% v => {
    if (v[3][0].value == 'HTML') HTML_ALLOWED = true;
    return {
        type: 'built_in_include',
        value: v[3][0].value,
        line: v[0].line,
        col: v[0].col
    }
} %}
| "#include" __nbsp string (__ "as" __ identifier):? {% v => ({
    type: "include",
    value: v[2].value,
    line: v[0].line,
    col: v[0].col,
    name: v[3] ? v[3][3].value : null
}) %}

includes -> includes EOL single_include {% (v, l, reject) =>
    v[0].concat(v[2])
%}
| single_include {% v => [v[0]] %}

group_include -> (_ includes):? {% v => v[0] ? v[0][1] : [] %}

decorated_statements -> _ %decorator group_include statements {% v => ({
	type: 'decorator',
	line: v[3] ? v[3].line : v[4].line,
	col: v[3] ? v[3].col : v[4].col,
	offset: v[3].offset,
	decorator: v[1].value,
	includes: v[2],
	value: v[3],
    comment: v[0].value
}) %}
	| group_include statements {% v => {
        return ({
		type: 'decorator',
		includes: v[0],
		value: v[1],
        line: 1,
        col: 0
	})} %}

### statements ###
statements -> (_ global EOL {% v => v[1] %}):* (_ statement EOL):* (_ statement):? {% (v, l, reject) => {
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
} %}

statement -> blocks {% id %}
    # ! needs test
	| debugging {% id %}
	| class_declaration {% id %}
	#| with {% id %} # ! deprecated
	| "debugger" {% statement.debugger %}
    #| "delete" _nbsp value {% statement.delete %}
	| return {% id %}
	| "throw" __ superValue {% statement.throw %}
	| ("break" | "continue") (__ ("when" | "when" __ "not") statement_condition):? {% statement.break_continue %}
    | "swap" __ superValue _ "," _ superValue {% statement.swap %}
	| "import" (__ identifier (__ "as" __ identifier {% v => v[3] %}):?
        (_ "," _ identifier
            (__ "as" __ identifier {% v => v[3] %}):?
            {% v => [v[3], v[4]] %}):* _ "from"
        ):? __ string_concat {% statement.import %}
    | "import" __ "*" __ "as" __ identifier __ "from" __ string_concat {% statement.importAll %}
    | "export" __ "default" __ superValue {% statement.exportDefault %}
    | "export" __ (var_assign | class_declaration | superValue) {% statement.export %}
	| var_assign {% id %}
	| value_reassign {% statement.value_reassign %}
	| superValue {% statement.value %}
    | "namespace" __ superValue {% statement.namespace %}
    | declare {% id %}

blocks ->
	if_block {% id %}
	| while_block {% id %}
	| for_block {% id %}
	| try_catch_finally {% id %}
	| type_declaration {% id %}
    | operator_declaration {% id %}
    | interface {% id %}
    | "@" "ignore" statements_block {% v => ({
        type: 'ignore',
        value: v[3],
        line: v[0].line,
        col: v[0].col
    }) %}
    | switch_multiple {% id %}
    #| "test" statements_block _ "expect" _ value {% v => ({
    #    type: 'test',
    #    value: v[1],
    #    expect: v[5]
    #}) %}

statements_block -> _ "{" statements _ (";" _):? "}" {% v => ({
    type: 'scope',
    value: v[2],
    line: v[1].line,
    col: v[1].col
}) %}
	| _ "BEGIN" __ statements _ (";" _):? "END" {% v => ({
    type: 'scope',
    value: v[3],
    line: v[1].line,
    col: v[1].col
}) %}
	| _ ":" _ statement {% (v, l, r) => {
        //if (done.includes[l]) {
            //return r
        //}
        //done.push(l)
        return {
            type: 'scope',
            value: [v[3]],
            line: v[1].line,
            col: v[1].col,
            inline: true,
            mustEndWithEOL: true
        }
    } %}
	| _nbsp "do" __ statement {% v => ({
        type: 'scope',
        value: [v[3]],
        line: v[1].line,
        col: v[1].col,
        inline: true,
        mustEndWithEOL: true
    }) %}
### END statements ###

type_declaration -> "type" __ identifier _ arguments_with_types statements_block {% v => {
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
} %}
operator -> "#" [A-Za-z0-9_\/*+-.&|$@!^#~]:+ {% v => ({
    type: 'operator',
    value: v[1].join(''),
    line: v[0].line,
    col: v[0].col
}) %}
operator_declaration -> "operator" __ operator _ arguments_with_types statements_block {% v => {
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
        line: v[0].line,
        col: v[0].col
    })
} %}

# TODO replace "identifier" with "_value_type"
interface -> "interface" __ identifier _ "{" _ (key "?":? _ ":" _ _value_type _) ("," _ key "?":? _ ":" _ _value_type _ {% v => v.slice(2) %}):* ("," _):? "}" {% v => {
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
} %}
global -> "@" "global" __ identifier {% v => ({
    type: 'global',
	value: v[3],
}) %}

# base line
identifier -> %identifier {% (v, l, reject) => {
    if (v[0].type == 'null' ||
        ['Infinity', 'this', 'globalThis', 'NaN'
        , 'Boolean', 'Object', 'Array', 'String', 'Number', 'JSON'
        ].includes(v[0].value)) {
        return reject;
    }
    return v[0]
} %}
    | allowed_keywords {% id %}

allowed_keywords ->
    "Infinity" {% id %}
	| "this" {% id %}
    | "globalThis" {% id %}
    | "NaN" {% id %}
    | "Boolean" {% id %}
    | "Object" {% id %}
    | "Array" {% id %}
    | "String" {% id %}
    | "Number" {% id %}
    | "JSON" {% id %}
    | "Float" {% id %}
    | "Int" {% id %}
    | "super" {% id %}
    | "undefined" {% v => assign(v[0], {
        type: 'keyword',
        value: 'void(0)'
    }) %}

convert -> base __ "as" __ convert_type {% (v, l, reject) => {
    return {
        type: 'convert',
        value: v[0],
        convert_type: v[4],
        line: v[0].line, col: v[0].col, offset: v[0].offset,
    }
} %}

convert_type -> ("Function" | "JSON" | "String" | "Number" | "Boolean" | "Object" | "Float" | "Int" | "Array") {% v => v[0][0] %}
### primitives' essentials ###
# objects
pair -> ("async" __):? key _ arguments_with_types statements_block {% object.es6_key_value %}
	| key _ ":" _ value {% v => [v[0], v[4]] %}
    | key {% v => [v[0], v[0]] %}
    | "..." _ Var {% v => v[2] %}

key -> string {% id %}
	| identifier {% id %}
	| %keyword {% id %}

# strings
string_concat -> %string {% v => {
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
} %}

# regexp
regexp_flags -> [gmi] {% regexp.flag %}
### END primitives' essentials ###

### primitives ###
# null
myNull -> "null" {% Null %}

# booleans
boolean -> (%boolean) {% boolean %}
    | "defined" __nbsp identifier {% v => ({
        type: 'defined',
        value: v[2],
        line: v[0].line, col: v[0].col, offset: v[0].offset,
    }) %}
    | "defined" _nbsp "(" _ identifier _ ")" {% v => ({
        type: 'defined',
        value: v[4],
        line: v[0].line, col: v[0].col, offset: v[0].offset,
    }) %}

# strings
string -> string_concat {% id %}
    | ("@" "dirname" | "@" "filename") {% v => ({
        type: 'locator',
        value: v[0][1],
    }) %}

# numbers
bigInt -> %bigInt {% number.bigInt %}

number -> %number {% number.float %}

# objects
object -> "{" _ "}" {% object.empty %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% object.extractObject %}

# regexp
regexp -> %regexp (regexp_flags):* {% regexp.parse %}

### END primitives ###

Var -> base _nbsp "[" _ "]" {% (v, l, reject) => {
    return {
        type: 'item_retraction_last',
        from: v[0],
        line: v[0].line,
        col: v[0].col
    } } %}
	| base _ "[" (_ superValue) _ ":" (_ superValue):? (_ ":" _ superValue):? _ "]" {% array.slice %}
	| base _nbsp "[" _ superValue _ "]" {% v => ({
        type: 'item_retraction',
        from: v[0],
        value: v[4],
        line: v[0].line,
        col: v[0].col
	}) %}
	| base _ "." _ object {% (v, l, reject) => {
        //if (v[0].type == 'annonymous_function') return reject
        return {
            type: 'dot_property_addition',
            from: v[0],
            value: v[4],
            line: v[0].line,
            col: v[0].col
        }
    } %}
    #| base _ "." _ array {% (v, l, reject) => {
    #    if (v[0].type == 'annonymous_function') return reject
    #    return {
    #        type: 'dot_array_addition',
    #        from: v[0],
    #        value: v[4],
    #        line: v[0].line,
    #        col: v[0].col
    #    }
    #} %}
    | base _ "." _ (%keyword | identifier) {% (v, l, reject) => {
        if (v[0].type == 'annonymous_function') return reject
        if (v[0].type == 'number') v[0].value = `(${v[0].value})`
        return {
            type: 'dot_retraction_v2',
            from: v[0],
            value: v[4][0],
            line: v[0].line,
            col: v[0].col
        }
    } %}
    | "::" (%keyword | identifier) {% (v, l, reject) => {
        return {
            type: 'namespace_retraction',
            retraction_type: 'dot',
            value: v[1][0],
            line: v[1][0].line,
            col: v[1][0].col
        }
    } %}
    | "::" "[" _ superValue _ "]" {% v => ({
        type: 'namespace_retraction',
        retraction_type: 'item_retraction',
        value: v[3],
        line: v[0].line,
        col: v[0].col
	}) %}
    | "::" "[" _ "]" {% v => ({
        type: 'namespace_retraction',
        retraction_type: 'item_retraction_last',
        line: v[0].line,
        col: v[0].col
	}) %}
    | function_call {% id %}
    | identifier {% id %}

arrow_arguments -> "(" _ arrow_argument (_ "," _ arrow_argument):* (_ ","):? _ ")" {% args.extract %}

arrow_argument -> "&" _ arguments {% v => ({
    type: 'arrow_argument',
    value: v[2],
}) %}
    | superValue {% id %}
# "&" _ "(" _ ")" {% args.empty %}
#	| "&" _ "(" _ (argument | arguments) (_ "," _ (argument | arguments)):* (_ ","):? _ ")" {% v => {
#        return args.extract(v.slice(2))
    #} %}

switch -> "switch" "*" _ superValue _ "{" (_ case_single_valued):* _ "}" {% v => assign(v[0], {
	type: 'switch*',
	value: v[3],
	cases: v[6] ? v[6].map(i => i[1]) : []
}) %}
# switch case addons
case_single_valued -> "case" _ superValue _ ":" _ (superValue EOL):? {% v => assign(v[0], {
    type: 'case_with_break',
    value: v[2],
    statements: v[6] ? v[6][0] : []
    }) %}
    #| "&" _ value _ ":" _ {% v => assign(v[0], {
    #    type: 'case_singular',
    #    value: v[2],
    #    statements: v[6] ? v[6][0] : []
    #}) %}
    | "default" _ ":" _ (value EOL):? {% v => assign(v[0], {
    type: 'case_default_singular',
    value: v[4] ? v[4][0] : [null],
}) %}

switch_multiple -> "switch" __ superValue _ "{" (_ case_multiline):* (_ case_default):? _ "}" {% v => assign(v[0], {
	type: 'switch',
	value: v[2],
	cases: v[5] ? v[5].map(i => i[1]) : [],
    default: v[6] ? v[6][1] : null
}) %}

case_multiline -> "case" __ superValue _ ":" statements (_ ";"):? {% v => assign(v[0], {
    type: 'case',
    value: v[2],
    statements: v[5]
}) %}
| "case" __ superValue _ ":" _ "{" statements _ (";" _):? "}" (";" _):? {% v => assign(v[0], {
    type: 'case',
    value: v[2],
    statements: v[7],
    scoped: true
}) %}
| "case" "*" __ superValue _ ":" _ "{" statements _ (";" _):? "}" (";" _):? {% v => assign(v[0], {
    type: 'broken_case',
    value: v[3],
    statements: v[8],
    scoped: true
}) %}
| "case" "*" __ superValue _ ":" statements (_ ";"):? {% v => assign(v[0], {
    type: 'broken_case',
    value: v[3],
    statements: v[6]
}) %}
case_default -> "default" _ ":"  _ "{" statements _ (";" _):? "}" (_ ";"):? {% v => assign(v[0], {
    type: 'case_default',
    value: v[5],
    scoped: true
}) %}
| "default" _ ":" statements (_ ";"):? {% v => assign(v[0], {
    type: 'case_default',
    value: v[3]
}) %}

# classes
class_declaration -> "class" _ identifier _ "{" _ construct (_ es6_key_value {% v => v[1] %}):* _ "}" {% classes.parse %}
construct -> "constructor" _ arguments_with_types statements_block {% classes.construct %}
# add async
es6_key_value -> (identifier | %keyword {% (v, l, reject) => v.value == 'constructor' ? reject : v %}) _ arguments_with_types statements_block {% classes.es6_key_value %}

# if else
#if_block -> if_block else_if
#    | "if" condition statement

#else_if -> else_if else_if
#| "else" "if" condition statement

#else -> "else" statement

if_block -> if_block _ else_block {% (v, l, r) => {
    return {
        type: 'if_else_if',
        if: v[0],
        else: v[2],
        //offset: v[0].offset,
        //lineBreaks: v[0].lineBreaks,
        line: v[0].line,
        col: v[0].col
    }
} %}
| ("if" | "unless") statement_condition statements_block {% v => {
    // works perfectly
	return {
		type: 'if',
		condition: v[1],
		value: v[2],
        unless: v[0][0] == 'if' ? false : true,
        line: v[1].line,
        col: v[1].col,
        //offset: v[1].offset,
	};
} %}
# else if blocks not implemented yet
#else_if -> _ "else" _ ("if" | "unless") statement_condition statements_block {% v => {
#    // works perfectly
#	return {
#		type: 'else_if',
#		condition: v[4],
#		value: v[5],
#        unless: v[3][0] == 'if' ? false : true,
#        line: v[1].line,
#        col: v[1].col,
#        //offset: v[1].offset,
#	};
#} %}
#| else_if else_if {% (v, l, r) => {
#    console.log(v[5])
#    if (done.includes(l)) return r
#    done.push(l)
#    // works perfectly
#    return {
#        type: 'else_if',
#        condition: v[1],
#        value: v[2],
#        unless: v[0].unless,
#        line: v[1].line,
#        col: v[1].col,
#        //offset: v[1].offset,
#    };
#} %}

else_block ->
"else" _ "if" statement_condition statements_block {% v => {
    return assign(v[0], {
        type: 'else_if',
        condition: v[3],
        value: v[4],
        flatten: true,
        inline: v[4].inline
    });
} %}
| "else" statements_block {% v => {
    return assign(v[0], {
		type: 'else',
		value: v[1],
        inline: v[1].inline
	});
} %}

# try catch finally
try_catch_finally -> try_catch (_ finally):? {% v => ({
	type: 'try_catch_finally',
	value: v[0],
	finally: v[1] ? v[1][1] : null,
    line: v[0].line,
    col: v[0].col
}) %}

try_catch -> try (_ catch):? {% v => ({
	type: 'try_catch',
	value: v[0],
	catch: v[1] ? v[1][1] : null,
    line: v[0].line,
    col: v[0].col
}) %}

try -> "try" statements_block {% v => ({
	type: 'try',
	value: v[1],
    line: v[0].line,
    col: v[0].col
}) %}
catch -> "catch" __ identifier statements_block {% v => {
	return {
		type: 'catch',
		value: v[3],
		identifier: v[2].value,
        line: v[0].line,
        col: v[0].col
	}
} %}
    | "catch" _ "(" _ identifier _ ")" statements_block {% v => {
	return {
		type: 'catch',
		value: v[7],
		identifier: v[4].value,
        line: v[0].line,
        col: v[0].col
	}
} %}
| "catch" statements_block {% v => {
	return {
		type: 'catch',
		value: v[1],
		identifier: 'err',
        line: v[0].line,
        col: v[0].col
	}
} %}
finally -> "finally" statements_block {% v => {
	return ({
		type: 'finally',
		value: v[1],
        line: v[0].line,
        col: v[0].col
	})
} %}

# value assignment
value_reassign -> Var _ "=" _ superValue {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4],
		offset: v[0].offset
	}
} %}
	| "SET" _ superValue _ "TO" _ (switch | superValue) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[2],
		line: v[0].line,
		col: v[0].col,
		value: v[6][0],
		offset: v[0].offset
	}
} %}
    | value_addition {% id %}

var_assign -> assign_type var_assign_list_w_destruction {% vars.assign %}
    #| assign_type var_assign_list {% vars.assign %}
	| "ASSIGN" _ (switch | superValue) _ "TO" _  identifier {% v => {
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
} %}

assign_type -> ("let" __ | "const" __ | "\\") {% v => v[0][0].value %}

var_assign_list -> var_reassign (_ "," _ var_reassign {% v => v[3] %}):* {% vars.var_assign_list %}

var_assign_list_w_destruction -> var_reassign_w_destruction (_ "," _ var_reassign_w_destruction {% v => v[3] %}):* {% vars.var_assign_list %}

var_reassign_w_destruction -> var_reassign {% id %}
    | "{" _ id_or_rest (_ "," _ id_or_rest):* _ "}" _ "=" _ superValue {% v => ({
        type: 'var_reassign_w_destruction',
        identifier: array.extract(v),
        line: v[0].line,
        col: v[0].col,
        value: v[9],
        offset: v[0].offset
    }) %}

id_or_rest -> identifier {% v => v[0] %}
    | "..." _ identifier {% v => {
        v[2].value = '...' + v[2].value
        return v[2]
    } %}

var_reassign -> identifier _ "=" _ superValue {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4],
		offset: v[0].offset
	}
} %}
    | identifier {% v => ({
        type: 'identifier',
        value: v[0],
        line: v[0].line,
        col: v[0].col,
    }) %}
	| "SET" _ identifier _ "TO" _ (switch | superValue) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4][0],
		offset: v[0].offset
	}
} %}

value_addition -> value _ ("+=" | "-=" | "*=" | "/=" | "%=" | "**=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=") _ superValue {% (v, l, reject) => ({
    type: 'expression_short_equation',
    left: v[0],
    right: v[4],
    operator: v[2][0].value
}) %}

# loops
while_block -> "while" statement_condition statements_block {%  v => {
	return assign(v[0], {
		type: 'while',
		condition: v[1],
		value: v[2],
        isEmpty: !!v[2].value.length
	});
} %}
for_block -> "for" __ identifier __ ("in" | "of") __ superValue statements_block {%  v => {
	return assign(v[0], {
		type: 'for_' + v[4][0],
		condition: v[1],
		identifier: v[2],
		iterable: v[6],
		value: v[7],
        isEmpty: !!v[7].value.length
	});
} %}
| "for" _ "(" _ identifier __ ("in" | "of") __ superValue _ ")" statements_block {%  v => {
	return assign(v[0], {
		type: 'for_' + v[6][0],
		//condition: v[4],
		identifier: v[4],
		iterable: v[8],
		value: v[11],
        isEmpty: !!v[11].value.length
	});
} %}
	| "for" __ identifier __ "from" __ superValue _ ("through" | "till") _ superValue statements_block {%  v => {
	return assign(v[0], {
		type: 'for_loop',
		identifier: v[2],
		from: v[6],
		through: v[10],
		include: v[8][0].text == 'till' ? false : true,
		value: v[11],
        isEmpty: !!v[11].value.length
	});
} %}
	| "for" _ "(" _ identifier __ "from" __ superValue _ ("through" | "till") _ superValue _ ")" statements_block {%  v => {
	return assign(v[0], {
		type: 'for_loop',
		identifier: v[4],
		from: v[8],
		through: v[12],
		include: v[10][0].text == 'till' ? false : true,
		value: v[15],
        isEmpty: !!v[15].value.length
	});
} %}
	| "for" __ (var_assign | var_assign_list) _ ";" statement_condition _ ";" _ superValue statements_block {%  v => {
	return assign(v[0], {
		type: 'for_loop_regular',
		condition: v[5],
		identifier: v[2][0],
		change: v[9],
		value: v[10],
        isEmpty: !!v[10].value.length
	});
} %}
| "for" _ "(" _ (var_assign | var_assign_list) _ ";" statement_condition _ ";" _ superValue _ ")" statements_block {%  v => {
	return assign(v[0], {
		type: 'for_loop_regular',
		condition: v[7],
		identifier: v[4][0],
		change: v[11],
		value: v[14],
        isEmpty: !!v[14].value.length
	});
} %}
| number __nbsp "times" statements_block {% v => {
    return assign(v[0], {
        type: 'times_loop',
        times: v[0].value,
        value: v[3],
        isEmpty: !!v[3].value.length
    });
} %}

anonymous_function ->
	("async" __):? value_type (__ identifier):? _ arguments_with_types statements_block {% functions.annonymous %}
	| ("async" __):? value_type (__ identifier):? statements_block {% functions.annonymous_with_no_args %}
    | ("async" __):? arguments_with_types __nbsp "=" ">" statements_block {% (v, l, r) => {
        if (v[5].inline) {
            console.error('Inline arrow functions are not supporte yet. Please use block level scopes instead using "{}" at ' + v[1].line + ', col ' + v[1].col)
            return r
        }
        return {
            type: 'arrow_function',
            arguments: v[1],
            async: !!v[0],
            value: v[5],
        }
    } %}

value_type -> _value_type {% id %}
    | ("void" | "def" | "function") {% v => ({
        type: 'value_type',
        value: [v[0][0].value],
        is_array: [false],
        line: v[0][0].line,
        col: v[0][0].col
    }) %}

_value_type -> (identifier) (_nbsp "[" _ "]"):? {% v => {
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
    } %}
    | value_type _nbsp "|" _ value_type {% v => ({
        type: 'value_type',
        value: v[0].value.concat(v[4].value),
        is_array: v[0].is_array.concat(v[4].is_array),
        line: v[0].line,
        col: v[0].col
    }) %}

return -> "return" __nbsp superValue {% returns.value %}
    | "return" {% returns.empty %}
    | "=>" _nbsp superValue {% returns.value %}
    | "return" ((__nbsp superValue):? __ ("when" | "when" __ "not") statement_condition) {% v => {
        let unless = !!v[1][2][2]
        return {
            type: 'return',
            condition: v[1] ? v[1][3] : null,
            value: v[1] ? v[1][0] ? v[1][0][1] : null : null,
            unless,
        }
    } %}

function_call -> base _nbsp arguments {% (v, l, reject) => {
    if (v[0].type == 'anonymous_function') return reject
    if (['string', 'number', 'boolean', 'null', 'undefined', 'object', 'array'].includes(v[0].type)) {
        //throw createError([v[0].type[0].toUpperCase() + v[0].type.slice(1), v[0], 'is not a function\n\tat ${v[0].line}:${v[0].col}'])

        //console.log(last.replace(process.cwd().replace(/\\/g, '/'), ''))
        throw new TypeError(`${v[0].type[0].toUpperCase() + v[0].type.slice(1)} is not a function\n\tat ${v[0].line}:${v[0].col} <${getLastStack()}>`)
    }
	return ({
		type: 'function_call',
		value: v[0],
		arguments: v[2],
	})
} %}
    | "::" arguments {% (v, l, reject) => {
	return ({
        type: 'namespace_retraction',
        retraction_type: 'function_call',
		arguments: v[1],
	})
} %}

# arguments
arguments -> "(" _ ")" {% args.empty %}
	| "(" _ argument (_ "," _ argument):* (_ ","):? _ ")" {% args.extract %}

argument -> value {% id %}
    | "." {% v => ({
        type: 'placeholder',
        value: null,
        line: v[0].line,
        col: v[0].col
    }) %}

arguments_with_types -> "(" _ ")" {% args.empty_arguments_with_types %}
	| "(" _ argument_identifier_and_value (_ "," _ argument_identifier_and_value):* (_ ","):? _ ")" {% args.arguments_with_types %}

argument_identifier_and_value -> (_value_type __):? identifier (_ "=" _ value):? {% v => {
    return {
        type: 'argument_identifier_and_value',
        argument_type: v[0] ? v[0][0] : null,
        can_be_null: false, //v[0] ? v[0][1] : false,
        identifier: v[1].value,
        value: v[2] ? v[2][3] : void 0
    }
} %}
    | "..." _ identifier {% v => ({
        type: 'spread_argument',
        identifier: '...' + v[2].value,
        can_be_null: false,
        argument_type: null,
    }) %}

argument_type -> _value_type __ {% id %}

debugging -> ("LOG" | "print") (__ "if"):? debugging_body {% v => ({
	type: 'debugging',
	method: 'log',
    conditional: v[1],
	value: v[2],
    line: v[0].line,
    col: v[0].col
}) %}

| "ERROR" (__ "if"):? debugging_body {% v => ({
	type: 'debugging',
	method: 'error',
    conditional: v[1],
	value: v[2],
    line: v[0].line,
    col: v[0].col
}) %}

debugging_body -> __ superValue {% v => v[1] %}
    | _nbsp arguments {% v => ({
        type: 'arguments',
        value: v[1],
        line: v[1].line,
        col: v[1].col
    }) %}
# html
html -> "#" "{" _ value _ "}" {% html.value_to_string %}
    | opening_tag (_ html_content {% v => v[1] %}):* _ closing_tag {% html.with_content %}
	| "<" identifier ("#" identifier):? ("." identifier):* "/" ">" {% html.self_closing_tag %}
	#| "@text" __ value {% html.value_to_string %}

# html
opening_tag -> "<" identifier (__ attrubutes {% v => v[1] %}):? _ ">" {% html.opening_tag %}
closing_tag -> "<" "/" identifier ">" {% html.closing_tag %}

html_content -> html_string {% v => ({
	type: 'html_string',
	value: v[0]
}) %}
    | html_string (__ html_string {% v => v[1] %}):+ {% v => ({
        type: 'html_string',
        value: v[0],
        additions: v[1]
    }) %}
	| html {% v => v[0] %}

html_string -> string {% v => {
	return v
} %}
attrubutes -> var_reassign (__ var_reassign):* {% html.attributes %}

# arrays
array -> "[" _ "]" {% array.empty %}
	| "[" _ value (_ "," _ value):* (_ ","):? _ "]" {% array.extract %}
	| "[" _ superValue _ "through" _ superValue _ "]" {% array.loop %}

# expressions

# presedence (most important to least important)
# 1. Grouping () n/a
# 2. Member access (.) left to right
    # | computed member access ([]) n/a
    # | function call (()) n/a
    # | new with argument list (new) n/a # unused
    # | optional chain (?.) left to right
# 3. new without argument list (new) n/a
# 4. postfix increment (++) n/a
    # | postfix decrement (--) n/a
# 5. logical not (!) n/a
    # | bitwise not (~) n/a
    # | unary plus (+) n/a
    # | unary negation (-) n/a
    # | prefix increment (++) n/a
    # | prefix decrement (--) n/a
    # | typeof n/a
    # | sizeof n/a
    # | defined n/a
    # | void n/a
    # | delete n/a
    # | await n/a
    # | declared prefixed operator n/a
# 6. exponentiation (**) right to left
# 7. multiplication (*) left to right
    # | division (/) left to right
    # | remainder (%) left to right
# 8. addition (+) left to right
    # | subtraction (-) left to right
# 9. left shift (<<) left to right
    # | right shift (>>) left to right
    # | unsigned right shift (>>>) left to right
# 10. less than (<) left to right
    # | greater than (>) left to right
    # | less than or equal (<=) left to right
    # | greater than or equal (>=) left to right
    # | in left to right
    # | instanceof left to right
# 11. equality (==) left to right
    # | inequality (!=) left to right
    # | strict equality (===) left to right
    # | strict inequality (!==) left to right
# 12. bitwise AND (&) left to right
# 13. bitwise XOR (^) left to right
# 14. bitwise OR (|) left to right
# 15. logical AND (&&) left to right
# 16. logical OR (||) left to right
    # | nullish coalescing (??) left to right
# 17. conditional (?:) right to left
# 18. arrow function (=>) n/a
    # | yield n/a
    # | yield* n/a
    # | spread (...) n/a
# 19. pipe forward (|>) left to right
# 20. pipe backward (<|) right to left
# 21. assignment(=) right to left
    # | assignment, any compound (+= || -= || *= || /= || %= || **= || <<= || >>= || >>>= || &= || ^= || |= || #customOperator=) right to left
    # | assignment, any compound (||= || &&= || ??=) right to left
# 22. comma (,) left to right # ? unused

new_statement2 -> "new" __ base {% (v, l, reject) => {
    if ('new' == v[2].type) return reject;
    return ({
        type: 'new',
        value: v[2]
    }) } %}
    | base {% id %}

postfix -> base _nbsp ("++" | "--") {% (v, l, reject) => {
    if (['function_call'].includes(v[0].type)) return reject;
    return ({
        type: 'postfix',
        value: v[0],
        operator: v[2][0].value
    }) } %}
    | new_statement2 {% id %}

unary2 -> "!" _ unary2 {% (v, l, reject) => ({
        type: 'reversed_unary',
        value: v[2],
        operator: '!',
        reject: v[0].value === 'not'
    }) %}
    | "~" _ unary2 {% (v, l, reject) => {
        return ({
            type: 'bitwise_not_unary',
            value: v[2],
            operator: '~'
        })
    } %}
    | ("++" | "--") _nbsp base {% (v, l, reject) => {
        //if (['item_retraction_last', 'item_retraction', 'dot_retraction_v2', 'namespace_retraction', 'function_call', 'identifier'].includes(v[2].type))
        //    throw new SyntaxError('Invalid left-hand side expression in prefix operation');
        return ({
            type: 'prefix',
            value: v[2],
            operator: v[0][0].value
        })
    } %}
    | ("+" | "-") _ unary2 {% (v, l, reject) => ({
        type: 'unary_plus_minus',
        value: v[2],
        operator: v[0][0].value
    }) %}
    | "typeof" _ unary2 {% (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'typeof',
            value: v[2],
        }) } %}
    | "sizeof" _ unary2 {% (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'sizeof',
            value: v[2],
        }) } %}
    | "void" _ unary2 {% (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'void_unary',
            value: v[2],
        }) } %}
    | "delete" _ unary2 {% (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'delete_unary',
            value: v[2],
        }) } %}
    | "await" _ unary2 {% (v, l, reject) => {
        if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
        return ({
            type: 'await_unary',
            value: v[2],
        }) } %}
    | postfix {% id %}

exponentiation -> unary2 _ "**" _ exponentiation {% (v, l, reject) => ({
        type: 'exponentiation',
        left: v[0],
        right: v[4]
    }) %}
    | unary2 _ operator _ exponentiation {% (v, l, reject) => {
        return ({
            type: 'custom_operator',
            left: v[0],
            right: v[4],
            operator: v[2]
        })
    } %}
    | unary2 {% id %}

multiplicative -> multiplicative _ ("*" | "/" | "%" | "~" "/") _ exponentiation {% v => ({
        type: 'multiplicative',
        left: v[0],
        right: v[4],
        operator: v[2][0].value
    }) %}
    | exponentiation {% id %}

additive -> additive _ ("+" | "-") _ multiplicative {% (v, l, reject) => ({
        type: 'additive',
        left: v[0],
        right: v[4],
        operator: v[2][0].value
    }) %}
    | multiplicative {% id %}

shift -> shift _ ("<<" | ">>" | ">>>") _ additive {% (v, l, reject) => ({
        type: 'shift',
        left: v[0],
        right: v[4],
        operator: v[2][0].value
    }) %}
    | additive {% id %}

relational -> relational _ ("<" | ">" | "<=" | ">=" | "in" | "instanceof"
        | ("not" _ "in" | "!" _ "in")
        | ("not" _ "instanceof" | "!" _ "instanceof")
    ) _ shift {% (v, l, reject) => {
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
    } %}
    | relational _ ("<" | ">" | "<=" | ">=" | "in" | "instanceof"
        | ("not" _ "in" | "!" _ "in")
        | ("not" _ "instanceof" | "!" _ "instanceof")
    ) _ arguments {% (v, l, reject) => {
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
    } %}
    | shift {% id %}

equality -> equality _ ("==" | "!=" | "===" | "!==" | "is" | "is" _ "not") _ relational {% (v, l, reject) => {
    let o = v[2][0].value;
    if (o == 'is' && v[2][2].value === 'not') o = '!==';
    else if (o == 'is') o = '===';
    return ({
        type: 'equality',
        left: v[0],
        right: v[4],
        operator: o
    }) } %}
    | equality _ ("==" | "!=" | "===" | "!==" | "is" | "is" _ "not") _ arguments {% (v, l, reject) => {
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
    } %}
    | relational {% id %}

bitwise_and -> bitwise_and _ "&" _ equality {% (v, l, reject) => ({
        type: 'bitwise_and',
        left: v[0],
        right: v[4]
    }) %}
    | equality {% id %}

bitwise_xor -> bitwise_xor _ "^" _ bitwise_and {% (v, l, reject) => ({
        type: 'bitwise_xor',
        left: v[0],
        right: v[4]
    }) %}
    | bitwise_and {% id %}

bitwise_or -> bitwise_or _ "|" _ bitwise_xor {% (v, l, reject) => ({
        type: 'bitwise_or',
        left: v[0],
        right: v[4]
    }) %}
    | bitwise_xor {% id %}

logical_and -> logical_and _ ("&&" | "and") _ bitwise_or {% (v, l, reject) => ({
        type: 'logical_and',
        left: v[0],
        right: v[4]
    }) %}
    | bitwise_or {% id %}

logical_or -> logical_or _ ("||" | "or") _ logical_and {% (v, l, reject) => ({
        type: 'logical_or',
        left: v[0],
        right: v[4]
    }) %}
    | logical_or _ "??" _ logical_and {% v => ({
        type: 'nullish_check',
        condition: v[0],
        value: v[4],
    }) %}
    | logical_and {% id %}

conditional -> logical_or _ "?" _ conditional (_ ":" _ conditional):? {% (v, l, reject) => {
    return {
        type: 'conditional',
        condition: v[0],
        true: v[4],
        false: v[5] ? v[5][3] : null
    }
    } %}
    | logical_or _nbsp "if" _ conditional _ "else" _ conditional {% (v, l, reject) => ({
        type: 'conditional',
        condition: v[4],
        true: v[0],
        false: v[8]
    }) %}
    # ! must be tested
    | logical_or _nbsp "if" _ conditional {% (v, l, reject) => ({
        type: 'conditional',
        condition: v[4],
        true: v[0],
        false: null
    }) %}
    | logical_or {% id %}

spread -> "..." _ conditional {% (v, l, reject) => ({
        type: 'spread',
        value: v[2]
    }) %}
    | conditional {% id %}
pipeback -> spread _ "<|" _ pipeback {% (v, l, reject) => ({
        type: 'pipeback',
        left: v[0],
        right: v[4]
    }) %}
    | spread {% id %}

pipeforward -> pipeforward _ "|>" _ pipeback {% (v, l, reject) => ({
        type: 'pipeforward',
        left: v[0],
        right: v[4]
    }) %}
    | pipeback {% id %}

statement_condition -> _ superValue {% v => v[1] %}

base -> parenthesized {% id %}
    | Var {% id %}
	| anonymous_function {% id %}
	| regexp {% id %}
	| boolean {% id %}
	| string_concat {% id %}
	| bigInt {% id %}
	| number {% id %}
	| array {% id %}
    | myNull {% id %}
    | convert {% id %}
	| object {% id %}
    | "new" "." "target" {% v => assign(v[0], {
        type: 'new.target',
        value: 'new.target'
    }) %}
    | "safeValue" _ arguments {% v => ({
        type: 'safeValue',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }) %}
	| switch {% id %}

superValue -> value {% id %}
    | html {% (v, l, reject) => {
        if (!HTML_ALLOWED) {
            throw new ReferenceError('HTML syntax is not imported. Use #include <HTML> first.')
        }
        return v[0];
    } %}

value -> pipeforward {% id %}

parenthesized -> "(" _ superValue _ ")" {% (v, l, reject) => {
    return {
        type: 'expression_with_parenthesis',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }
} %}

### whitespace ###
_ -> %space:* {% id %}

# mandatory whitespace
__ -> %space {% id %}

EOL -> __ {% (v, l, r) => {
    if (!/(\n|\r)/.test(v[0].value)) {
        return r
    }
    return 'EOL'
} %}
	| _nbsp ";" (_nbsp "/" "/" [^\n]:* _):? {% (v, l, r) => {
        if (v[2]) {
            if (v[2][5].value.length && !/(\n|\r)/.test(v[2][5].value)) {
                return r
            }
        }
        return v[1]
    } %}
    | _nbsp "/" "/" [^\n]:* _ {% v => {
        if (v[4].value.length && !/(\n|\r)/.test(v[4].value)) {
            return 'EOL'
        }
        return 'EOL'
    } %}

# Not breaking space
_nbsp -> (" " | [\t]):* {% (v, l, reject) => {
    let f = v[0].map(i => i.value).join('');
        return {type: 'nbsp', value: f}
} %}

__nbsp -> (" " | [\t]):+ {% (v, l, reject) => {
    let f = v[0].map(i => i.value).join('');
        return {type: 'nbsp', value: f}
} %}

### END whitespace ###

@%
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
    es6_key_value: v => {
        //console.log(v)
        return {
            type: 'es6_key_value',
            key: v[0][0],
            arguments: v[2],
            value: v[3],
        }
    },
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
        unless: v[1] ? v[1][1][2] : null,
        condition: v[1] ? v[1][2] : null
    }),
    echo: v => assign(v[0], {
        type: 'echo',
        value: v[2]
    }),
    eval: v => assign(v[0], {
        type: 'eval',
        value: v[2]
    }),
    import: v => {
        let from = v[3]
        let identifiers = []
        if (v[1]) {
            identifiers.push([v[1][1], v[1][2]])
            if (v[1][3]) {
                for (let i in v[1][3]) {
                    identifiers.push([v[1][3][i][0], v[1][3][i][1]])
                }
            }
        }
        return assign(v[0], {
            type: '@import',
            identifiers,
            from,
        })
    },
    importAll: v => {
        return {
            type: '@importAll',
            as: v[6].value,
            from: v[10]
        }
    },
    include: v => assign(v[0], {
        type: '@include',
        value: v[3]
    }),
    value: (v, l, reject) => {
        if (v[0].type === 'anonymous_function') {
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
    exportDefault: v => ({
        type: '@exportDefault',
        value: v[4]
    }),
    export: v => ({
        type: '@export',
        value: v[2]
    })
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

%