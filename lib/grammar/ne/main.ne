@lexer lexer
# ! builtin nearley include statement really
# ! works not the way expected
#@include  "./lib/grammar/ne/functions.ne"
#process -> (_ includes:*) statements {% id %}
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
| "#include" __nbsp string {% v => ({
    type: "include",
    value: v[2].value,
    line: v[0].line,
    col: v[0].col
}) %}

includes -> includes EOL single_include {% (v, l, reject) =>
    v[0].concat(v[2])
%}
| single_include {% v => [v[0]] %}

group_include -> (_ includes):? {% v => v[0] ? v[0][1] : [] %}

#_ "#include" _ "<" (identifier | keyword) ">" {% v => {
#    if (v[4][0].value == 'HTML') HTML_ALLOWED = true;
#    return {
#        type: 'built_in_include',
#        value: v[4][0].value,
#        line: v[1].line,
#        col: v[1].col
#    }
#} %}
#    | ((includes EOL):* | _) "#include" __nbsp string {% v => {
#        return {
#            type: 'include',
#            value: v[3].value,
#            line: v[1].line,
#            col: v[1].col,
#            addon: v[0][0] && v[0][0].lenght ? v[0][0].map(v => v[0]) : []
#        }
#    } %}

decorated_statements -> _ %decorator group_include statements {% v => ({
	type: 'decorator',
	line: v[3].line,
	col: v[3].col,
	offset: v[3].offset,
	decorator: v[1].value,
	includes: v[2],
	value: v[3],
}) %}
	| group_include statements {% v => {
        return ({
		type: 'decorator',
		includes: v[0],
		value: v[1],
        line: v[0] ? v[0].line : v[1].line,
        col: v[0] ? v[0].col : v[1].col
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
} %}

statement -> blocks {% id %}
	| debugging {% id %} # ! needs test
	| class_declaration {% id %}
	#| with {% id %} # ! deprecated
	| "debugger" {% statement.debugger %}
	#| "SAVE" __ value EOL {% v => ({
	#	type: 'SAVE',
	#	value: v[2]
	#}) %}
	#| "DELETE" __ "THAT" EOL {% v => ({
	#	type: 'DELETE',
	#}) %}
	#| "delete" __ value {% statement.delete %}
    | "delete" _nbsp value {% statement.delete %}
	| return {% id %}
	| "throw" __ value {% statement.throw %}
	| ("break" | "continue") {% statement.break_continue %}
    | "swap" __ value _ "," _ value {% statement.swap %}
	#| "echo" __ value EOL {% statement.echo %}
	#| %eval __ value EOL {% statement.eval %}
	#| "import" __ string {% statement.import %}
	#| "@" "include" __nbsp string {% statement.include %}
	| var_assign {% id %}
	| value_reassign {% statement.value_reassign %}
    #| value_addition {% statement.value_addition %}
	| value {% statement.value %}
    | "namespace" __ value {% statement.namespace %}

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
	| _ ":" _ statement {% v => ({
        type: 'scope',
        value: [v[3]],
        line: v[3].line,
        col: v[3].col
    }) %}
    #{% v => [v[3]] %}
	| _ "do" __ statement {% v => ({
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
        line: v[0].line,
        col: v[0].col
	})
} %}
operator -> "#" [A-Za-z0-9_\/*+-.&|$@!^#~]:+ {% v => ({
    type: 'operator',
    value: v[1],
    line: v[0].line,
    col: v[0].col
}) %}
operator_declaration -> "operator" __ operator _ arguments_with_types statements_block {% v => {
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
        line: v[0].line,
        col: v[0].col
    }
} %}

#with -> "with" __ value statements_block  {% v => assign(v[0], {
#	type: 'with',
#	obj: v[2],
#	value: v[3],
#    line: v[0].line,
#    col: v[0].col
#}) %}
#    | "with" _ "(" _ value _ ")" statements_block  {% v => assign(v[0], {
#	type: 'with',
#	obj: v[4],
#	value: v[7],
#    line: v[0].line,
#    col: v[0].col
#}) %}

global -> "@" "global" __ identifier {% v => ({
    type: 'global',
	value: v[3]
}) %}
