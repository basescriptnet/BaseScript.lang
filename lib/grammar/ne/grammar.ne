@{%
    const assign = Object.assign.bind(Object)
    let HTML_ALLOWED = false
    const moo = require('moo');
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
    keyword: ['interface', 'void', 'defined', 'safeValue', 'swap', 'namespace', 'Boolean', 'Number', 'String', 'Array', 'Object', 'unless', 'than', 'constructor', 'null', 'const', 'print', 'var',
        'sizeof', 'Infinity', 'NaN', 'undefined', 'globalThis', 'through', 'delete', 'THAT', 'DELETE', 'SAVE', 'LOG', 'ERROR', 'WRITE', 'INTO', 'PUSH',
        'POP', 'SHIFT', 'UNSHIFT', 'FROM', 'Int', 'Float', 'BEGIN', 'END', 'SET', 'TO', 'typeof', 'instanceof', 'in', 'of', 'type', 'super',
        'extends', 'function', 'def', 'this', 'echo', 'export', 'as', 'JSON', 'yield', 'async', 'try', 'catch', 'finally', 'static', 'while',
        'if', 'else', 'import', 'from', 'let', 'const', 'null', 'of', 'default', 'caseof', 'switch', 'with', 'for', 'case', 'default', 'elif',
        'debugger', 'or', 'and', 'return', 'new', 'is', 'not', 'throw', 'break', 'continue', 'when'].map(i => new RegExp(`\\b${i}\\b`)),
    //regexp: /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/,
    regexp: /\/(?:\\[ \/><bBfFnNrRtTvVxXuUsSwWdD.+\-!@#&()*^$[\]{}|?:\\]|[^><\n\/\\])*?\//,
    operator: ['++', '--', /*'+', '-', '/', '**', '*', '%'*/],
    // ! is not tested
    bigInt: /(?:\+|-)?(?:[0-9]+(?:_?[0-9]+)*)n/,
    number: /(?:\+|-)?(?:[0-9]+(?:_?[0-9]+)*)(?:\.[0-9]+)?/,
    boolean: ['true', 'false'],
    //fat_arrow: '=>',
    //constant: 'const',
    identifier: [
        {
            match: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
        },
        {
            match: /(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
            value: x => 'emoji_' + x.codePointAt(),
        }
    ],
    eval: '@eval',
    //at: '@',
    '@include': '@include',
    '#include': '#include',
    import: '@import',
    '@text': '@text',
    decorator: [/*'@php', */'@js'],
    literal: ['|>', '<|', '#', '@', '~', '>>>', '>>', '<<', '^', '[', ']', '{', '}', '(', ')', '...', '..', '.', '\\', ',', ';', '::', ':', '??', '?.', '?', '!', '!=', '!==', '==', '===', '>=', '<=', '>', '<', '&&', '&', '||', '|', '+=', '-=', '*=', '/=', '%=', '**=', '=', '+', '-', '/', '*', '%'],
});
%}
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
        //line: v[0].length ? v[0].line : v[1].length ? v[1][0].line : 1,
        //col: v[0].length ? v[0].col : v[1].length ? v[1][0].col : 0
	})} %}

### statements ###
#(statement EOL):* (statement EOL:?):?
# statements -> (_ statement {% v => v[1] %}):* _ {% id %}
statements -> (_ global EOL {% v => v[1] %}):* (_ statement EOL):* (_ statement):? {% (v, l, reject) => {
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
	for (let i = 0/*, indent = 0*/; i < v[1].length; i++) {
		/*if (i == 0) indent = (v[0][i][0].text)
		if (indent !== (v[0][i][0].text)) {
			throw new Error('Invalid indentation.')
		}*/
		result.push(v[1][i][1])
	}
    //debugger
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
	| ("break" | "continue") {% statement.break_continue %}
    | "swap" __ superValue _ "," _ superValue {% statement.swap %}
	| var_assign {% id %}
	| value_reassign {% statement.value_reassign %}
    #| value_addition {% statement.value_addition %}
	| superValue {% statement.value %}
    | "namespace" __ superValue {% statement.namespace %}

blocks ->
	if_block {% id %}
	| while_block {% id %}
	| for_block {% id %}
	| try_catch_finally {% id %}
	| switch_multiple {% id %}
	| type_declaration {% id %}
    | operator_declaration {% id %}
    | interface {% id %}
    #| "test" statements_block _ "expect" _ value {% v => ({
    #    type: 'test',
    #    value: v[1],
    #    expect: v[5]
    #}) %}

statements_block -> _ "{" statements _ (";" _):? "}" {% v => ({
    type: 'scope',
    value: v[2],
    line: v[2].line,
    col: v[2].col
}) %}
	| _ "BEGIN" __ statements _ (";" _):? "END" {% v => ({
    type: 'scope',
    value: v[3],
    line: v[3].line,
    col: v[3].col
}) %}
	#| _ ":" _ statement {% v => ({
    #    @t scope
    #    value: [v[3]],
    #    line: v[3].line, col: v[3].col, offset: v[3].offset,
    #}) %}
	| _ ":" _ statement {% v => ({
        type: 'scope',
        value: [v[3]],
        line: v[3].line, col: v[3].col, offset: v[3].offset,
        mustEndWithEOL: true
    }) %}
    #{% v => [v[3]] %}
	| _nbsp "do" __ statement {% v => ({
        type: 'scope',
        value: [v[3]],
        line: v[3].line,
        col: v[3].col
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
    value: v[1],
    line: v[0].line, col: v[0].col, offset: v[0].offset,
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
        line: v[0].line, col: v[0].col, offset: v[0].offset,
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
    | "undefined" {% v => assign(v[0], {
        type: 'keyword',
        value: 'void(0)'
    }) %}

convert -> prefixExp __ "as" __ convert_type {% (v, l, reject) => {
    //if (v[0] && !v[6] || !v[0] && v[6]) return reject
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
    #| string_concat _ "+" _ %string {% string_concat %}

# regexp
regexp_flags -> [gmi] {% regexp.flag %}
### END primitives' essentials ###

### primitives ###
# null
myNull -> "null" {% Null %}

# booleans
boolean -> (%boolean) {% boolean %}
    | "defined" _nbsp identifier {% v => ({
        type: 'defined',
        value: v[2],
        line: v[0].line, col: v[0].col, offset: v[0].offset,
    }) %}
    | "defined" _nbsp "(" _ identifier _ ")" {% v => ({
        type: 'defined',
        value: v[4],
        line: v[0].line, col: v[0].col, offset: v[0].offset,
    }) %}
	# | condition {% condition.value %}

# strings
string -> string_concat {% id %}
	#| "typeof" _ "(" _ value _ ")" {% v => ({
	#	type: 'typeof',
	#	value: v[4],
    #    line: v[0].line,
    #    col: v[0].col
	#}) %}
# numbers
# ! is not tested
bigInt -> %bigInt {% number.bigInt %}

number -> %number {% number.float %}
    #| "sizeof" _ "(" _ value _ ")" {% v => ({
	#	type: 'sizeof',
	#	value: v[4],
    #    line: v[0].line,
    #    col: v[0].col
	#}) %}

# objects
object -> "{" _ "}" {% object.empty %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% object.extractObject %}

# regexp
regexp -> %regexp (regexp_flags):* {% regexp.parse %}

### END primitives ###

#_base -> base {% id %}
#    #| array {% id %}
#	| regexp {% id %}
#    #| object {% id %}

Var ->
    # ! needs more tests, though works
	base _nbsp "[" _ "]" {% (v, l, reject) => assure(v, l, reject, {
        type: 'item_retraction_last',
        from: v[0],
        line: v[0].line,
        col: v[0].col
	}) %}
	| base _ "[" (_ superValue) _ ":" (_ superValue):? (_ ":" _ superValue):? _ "]" {% array.slice %}
	| base _nbsp "[" _ superValue _ "]" {% v => ({
        type: 'item_retraction',
        from: v[0],
        value: v[4],
        line: v[0].line,
        col: v[0].col
	}) %}
	| base _ "." _ (%keyword | identifier) {% (v, l, reject) => {
        if (v[0].type == 'annonymous_function') return reject
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
        //identifier: v[0].value
	}) %}
    | "::" "[" _ "]" {% v => ({
        type: 'namespace_retraction',
        retraction_type: 'item_retraction_last',
        line: v[0].line,
        col: v[0].col
	}) %}
    | function_call {% id %}
    | identifier {% id %}

switch -> "caseof" _ superValue _ "{" (_ case_single_valued):* _ "}" {% v => assign(v[0], {
	type: 'switch*',
	value: v[2],
	cases: v[5] ? v[5].map(i => i[1]) : []
}) %}

# switch case addons
case_single_valued -> "|" _ superValue _ ":" _ (superValue EOL):? {% v => assign(v[0], {
    type: 'case_with_break',
    value: v[2],
    statements: v[6] ? v[6][0] : []
    }) %}
    | "&" _ value _ ":" _ {% v => assign(v[0], {
        type: 'case_singular',
        value: v[2],
        statements: v[6] ? v[6][0] : []
    }) %}
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

case_default -> "default" _ ":" statements (_ ";"):? {% v => assign(v[0], {
		type: 'case_default',
		value: v[3]
	}) %}
# classes
class_declaration -> "class" _ identifier _ "{" _ construct (_ es6_key_value {% v => v[1] %}):* _ "}" {% classes.parse %}
construct -> "constructor" _ arguments_with_types statements_block {% classes.construct %}
# add async
es6_key_value -> identifier _ arguments_with_types statements_block {% classes.es6_key_value %}
# if else
if_block -> "if" statement_condition statements_block {% v => {
	return assign(v[0], {
		type: 'if',
		condition: v[1],
		value: v[2]
	});
} %}
    | "unless" statement_condition statements_block {% v => {
	return assign(v[0], {
		type: 'if',
		condition: v[1],
		value: v[2],
        unless: true
	});
} %}
	| if_block _ else_block {% v => {
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
} %}
else_block ->
    "else" statements_block {% v => {
    //if (v[1].type == 'value' && v[1].value.type == 'object') debugger
    return assign(v[0], {
		type: 'else',
		value: v[1],
	});
} %}# try catch finally
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
	//debugger
	return ({
		type: 'finally',
		value: v[1],
        line: v[0].line,
        col: v[0].col
	})
} %}

left_assign -> Var {% id %}
    | function_call {% id %}
# value assignment
value_reassign -> left_assign _ "=" _ superValue {% v => {
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

var_assign -> assign_type var_assign_list {% vars.assign %}
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

assign_type ->
    ("let" __ | "const" __ | "\\") {% v => v[0][0].value %}

var_assign_list -> var_reassign (_ "," _ var_reassign {% v => v[3] %}):* {% vars.var_assign_list %}

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
    }) %}# loops
while_block -> "while" statement_condition statements_block {%  v => {
	return assign(v[0], {
		type: 'while',
		condition: v[1],
		value: v[2],
	});
} %}
for_block -> "for" __ identifier __ ("in" | "of") __ superValue statements_block {%  v => {
	return assign(v[0], {
		type: 'for_' + v[4][0],
		condition: v[1],
		identifier: v[2],
		iterable: v[6],
		value: v[7],
	});
} %}
for_block -> "for" _ "(" _ identifier __ ("in" | "of") __ superValue _ ")" statements_block {%  v => {
	return assign(v[0], {
		type: 'for_' + v[6][0],
		//condition: v[4],
		identifier: v[4],
		iterable: v[8],
		value: v[11],
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
	});
} %}# functions
annonymous_function ->
    # | ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") (__ identifier):? _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	("async" __):? value_type (__ identifier):? _ arguments_with_types statements_block {% functions.annonymous %}
	| ("async" __):? value_type (__ identifier):? statements_block {% functions.annonymous_with_no_args %}

#value_type -> ("function" | "def" | "void" | "Int" | "Float" | "Array" | "Object" | "Null" | "Boolean" | "Number" | "String") {% id %}
value_type -> _value_type {% id %}
    | ("void" | "def" | "function") {% v => ({
        type: 'value_type',
        value: [v[0][0].value],
        is_array: [false],
        line: v[0][0].line,
        col: v[0][0].col
    }) %}

_value_type -> (identifier) (_nbsp "[" _ "]"):? {% v => ({
        type: 'value_type',
        value: [v[0][0].value],
        is_array: [v[1] !== null],
        line: v[0][0].line,
        col: v[0][0].col
    }) %}
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

function_call -> base _nbsp arguments {% (v, l, reject) => {
    if (v[0].type == 'annonymous_function') return reject
    //console.log(v[2].type)
	return ({
		type: 'function_call',
        //check: v[1] ? true : false,
		value: v[0],
		arguments: v[2],
	})
} %}
    | "::" arguments {% (v, l, reject) => {
    // if (v[0].type == 'annonymous_function') return reject
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
    #| "..." {% v => ({
    #    type: 'argument',
    #    value: v[0][0].value,
    #    line: v[0][0].line,
    #    col: v[0][0].col
    #}) %}

arguments_with_types -> "(" _ ")" {% args.empty_arguments_with_types %}
	| "(" _ argument_identifier_and_value (_ "," _ argument_identifier_and_value):* (_ ","):? _ ")" {% args.arguments_with_types %}

argument_identifier_and_value -> (_value_type __):? identifier (_ "=" _ value):? {% v => {
    //debugger
    return {
	type: 'argument_identifier_and_value',
	argument_type: v[0] ? v[0][0] : null,
	can_be_null: false, //v[0] ? v[0][1] : false,
	identifier: v[1].value,
	value: v[2] ? v[2][3] : void 0
}
} %}
argument_type -> _value_type __ {% v => {
	return v[0];
} %}debugging -> ("LOG" | "print") (__ "if"):? debugging_body {% v => ({
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

array_interactions ->
#("PUSH" | "UNSHIFT") _ value _ "INTO" _ prefixExp {% v => ({
#		type: 'array_interactions',
#		method: v[0][0],
#		into: v[6],
#		value: v[2],
#		line: v[0].line,
#		col: v[0].col
#	}) %}
#	| ("POP" | "SHIFT") _ value {% v => ({
#		type: 'array_interactions',
#		method: v[0][0],
#		value: v[2],
#		line: v[0].line,
#		col: v[0].col
#	}) %}
#	|
    "..." _ base {% v => ({
		type: 'array_interactions',
		method: 'spread',
		value: v[2],
		line: v[0].line,
		col: v[0].col
	}) %}

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
# 22. comma (,) left to right # unused

new_statement2 -> "new" __ base {% (v, l, reject) => {
    if ('new' == v[2].type) return reject;
    return ({
        type: 'new',
        value: v[2]
    }) } %}
    | base {% id %}

postfix -> base _nbsp ("++" | "--") {% (v, l, reject) => {
    if (['function_call'].includes(v[0].type)) return reject;
    //if (['item_retraction_last', 'item_retraction', 'dot_retraction_v2', 'namespace_retraction', 'function_call', 'identifier'].includes(v[0].type))
    //    throw new SyntaxError('Invalid left-hand side expression in postfix operation');
    return ({
        type: 'postfix',
        value: v[0],
        operator: v[2][0].value
    }) } %}
    | new_statement2 {% id %}

unary2 -> ("!" _ #| "not" __
) unary2 {% (v, l, reject) => ({
        type: 'reversed_unary',
        value: v[1],
        operator: '!',
        reject: v[0][0].value === 'not'
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
    #| "defined" _ unary2 {% (v, l, reject) => {
    #    if (v[2].type != 'expression_with_parenthesis' && v[1].length == 0) return reject;
    #    return ({
    #        type: 'defined',
    #        value: v[2],
    #    }) } %}
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
    | unary2 {% id %}

multiplicative -> multiplicative _ ("*" | "/" | "%") _ exponentiation {% (v, l, reject) => ({
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
    | shift {% id %}

equality -> equality _ ("==" | "!=" | "===" | "!==" | "is" | "is" _ "not") _ relational {% (v, l, reject) => {
    //console.log(v[4])
    //if (v[4].type == 'reversed_unary' && v[4].reject) return reject;
    let operator = v[2][0].value;
    if (operator == 'is' && v[2][3] === 'not') operator = '!==';
    else if (operator == 'is') operator = '===';
    return ({
        type: 'equality',
        left: v[0],
        right: v[4],
        operator: operator
    }) } %}
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
    #! ?? operator
    | logical_or _ "??" _ logical_and {% v => ({
        type: 'nullish_check',
        condition: v[0],
        value: v[4],
    }) %}
    | logical_and {% id %}

conditional -> logical_or _ "?" _ conditional _ ":" _ conditional {% (v, l, reject) => ({
        type: 'conditional',
        condition: v[0],
        true: v[4],
        false: v[6]
    }) %}
    | logical_or _ "?" _ conditional {% (v, l, reject) => ({
        type: 'conditional',
        condition: v[0],
        true: v[4],
        false: null
    }) %}
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
	#| _ "(" _ condition _ ")" {% v => v[3] %}
base -> parenthesized {% id %}
    | Var {% id %}
	| annonymous_function {% id %}
	| regexp {% id %}
	| boolean {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| array {% id %}
    | myNull {% id %}
    | convert {% id %}
	| object {% id %}
    | "safeValue" _ arguments {% v => ({
        type: 'safeValue',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }) %}
superValue -> value {% id %}
    | base __nbsp spread (_ "," _ spread):* {% (v, l, reject) => {
        let rejectables = ['expression_with_parenthesis'];

        if (v[0].type == 'annonymous_function') return reject
        if (rejectables.includes(v[2].type)) return reject
        //if (done.includes(l)) return reject;
        //done.push(l);
        for (let i in v[3]) {
            if (rejectables.includes(v[3][i][3].type)) {
                return reject
            }
        }
        return ({
            type: 'function_call',
            value: v[0],
            arguments: args.extract_with_no_parenthesis([v[2], v[3]])
        })
    } %}
    | html {% (v, l, reject) => {
        if (!HTML_ALLOWED) {
            throw new ReferenceError('HTML syntax is not imported. Use #include <HTML> first.')
        }
        return v[0];
    } %}

value -> pipeforward {% id %}
	| myNull {% id %}
    | "new" _ "." _ "target" {% v => ({
        type: 'new.target',
        line: v[0].line,
        col: v[0].col
    }) %}
    #| "void" _nbsp arguments {% v => ({
    #    type: 'void',
    #    value: v[2],
    #    line: v[0].line,
    #    col: v[0].col
    #}) %}

pipeline -> value (_ "|>" _ value):+ {% v => ({
    type: 'pipeline',
    left: v[0],
    right: v[4],
    line: v[0].line,
    col: v[0].col
}) %}
#@out
parenthesized -> "(" _ superValue _ ")" {% (v, l, reject) => {
    //if (v[2].type == 'convert') return reject;
    return {
        type: 'expression_with_parenthesis',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }
} %}
### whitespace ###
_ -> %space:* {% id %}
	#| null {% v => '' %}
# mandatory whitespace
__ -> %space {% id %}
EOL -> [\n]:+ {% v => 'EOL' %}
	| _nbsp ";" (_nbsp "/" "/" [^\n]:* [\n]:*):? {% v => v[1] %}
    | _nbsp "/" "/" [^\n]:* [\n]:*  {% v => 'EOL' %}
# Not breaking space
_nbsp -> (" " | [\t]):* {% (v, l, reject) => {
    let f = v[0].map(i => i.value).join('');
    //if (f.length) {
      //  if (/\n|\r/g.test(f)) {
        //    return reject
        //}
        return {type: 'nbsp', value: f}
    //}
    //return {type: 'nbsp', value: ''}
} %}

__nbsp -> (" " | [\t]):+ {% (v, l, reject) => {
    let f = v[0].map(i => i.value).join('');
    //if (f.length) {
      //  if (/\n|\r/g.test(f)) {
        //    return reject
        //}
        return {type: 'nbsp', value: f}
    //}
} %}

### END whitespace ###

@{%
    const parsed = new Map();
const functions = {
    annonymous: v => {
        // console.log(v[0][0].value)
        //debugger
        return {
            type: 'annonymous_function',
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
    annonymous_with_no_args: v => {
        // console.log(v[0][0].value)
        return {
            type: 'annonymous_function',
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
        if (v[0].value && v[0].value.type === 'annonymous_function')
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
        if (v[0].value && v[0].value.type === 'annonymous_function')
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
    value: v => {
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
function extractPair (kv, output) {
    //debugger
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
%}