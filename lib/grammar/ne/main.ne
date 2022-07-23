@lexer lexer
# ! builtin nearley include statement really
# ! works not the way expected
#@include  "./lib/grammar/ne/functions.ne"
#process -> (_ includes:*) statements {% id %}
process -> decorated_statements {% id %}

includes -> "#include" _ "<" identifier ">" EOL {% v => ({
	type: 'built_in_include',
	value: v[3].value
}) %}

decorated_statements -> _ %decorator EOL includes:* statements {% v => ({
	type: 'decorator',
	line: v[1].line,
	col: v[1].col,
	offset: v[1].offset,
	decorator: v[1].value,
	includes: v[3],
	value: v[4],
}) %}
	| includes:* statements {% v => ({
		type: 'decorator',
		includes: v[0],
		value: v[1],
	}) %}

### statements ###
# statements -> (_ statement {% v => v[1] %}):* _ {% id %}
statements -> (_ global EOL {% v => v[1] %}):* (_ statement):* _ {% v => {
	let result = []
    if (v[0] && v[0].length) {
        //debugger
        for (let i = 0; i < v[0].length; i++) {
            result.push(v[0][i])
        }
    }
	// let removeComments = text => text.replace(/\/\/.*\n?/, '');
	for (let i = 0, indent = 0; i < v[1].length; i++) {
		/*if (i == 0) indent = (v[0][i][0].text)
		if (indent !== (v[0][i][0].text)) {
			throw new Error('Invalid indentation.')
		}*/
		result.push(v[1][i][1])
	}
	return result
} %}

statement -> blocks {% id %}
	| debugging {% id %} # ! needs test
	| class_declaration {% id %}
	| with {% id %}
	| "debugger" EOL {% statement.debugger %}
	#| "SAVE" __ value EOL {% v => ({
	#	type: 'SAVE',
	#	value: v[2]
	#}) %}
	#| "DELETE" __ "THAT" EOL {% v => ({
	#	type: 'DELETE',
	#}) %}
	| "delete" __ value EOL {% statement.delete %}
	| return {% id %}
	| "throw" __ value EOL {% statement.throw %}
	| ("break" | "continue") EOL {% statement.break_continue %}
	#| "echo" __ value EOL {% statement.echo %}
	#| %eval __ value EOL {% statement.eval %}
	#| "@import" __ value EOL {% statement.import %}
	#| "@include" __ string EOL {% statement.include %}
	| var_assign EOL {% id %}
	| value_reassign EOL {% statement.value_reassign %}
	| value EOL {% statement.value %}
    #| Exp EOL {% id %}
    # ! needs to be moved to values
	| switch_multiple EOL {% id %}
	# | (value {% statement.value %} | value_reassign {% statement.value_reassign %} | var_assign {% id %}) EOL {% id %}
	| ";" {% id %}

blocks -> function_declaration {% id %}
	| type_declaration {% id %}
	| if_block {% id %}
	| while_block {% id %}
	| for_block {% id %}
	| try_catch_finally {% id %}

statements_block -> _ "{" statements "}" {% v => v[2] %}
	| _ "BEGIN" __ statements _ "END" {% v => v[3] %}
	| _ ":" _ statement {% v => [v[3]] %}
	| _ "do" _ statement {% v => [v[3]] %}
### END statements ###

type_declaration -> "type" __ identifier _ arguments_with_types statements_block {% v => {
	if (v[2].value[0].toUpperCase() != v[2].value[0]) {
		throw new SyntaxError(`Type name must be capitalized.`)
	}
	//debugger
	if (v[4].value.length == 0) {
	//	throw new Error(`Type declaration requires at least one argument.`)
	}
	return assign(v[0], {
		type: 'type_declaration',
		identifier: v[2],
		arguments: v[4],
		value: v[5]
	})
} %}

with -> "with" __ value statements_block  {% v => assign(v[0], {
	type: 'with',
	obj: v[2],
	value: v[3]
}) %}
    | "with" _ "(" _ value _ ")" statements_block  {% v => assign(v[0], {
	type: 'with',
	obj: v[4],
	value: v[7]
}) %}

global -> "@" "global" __ identifier {% v => ({
    type: 'global',
	value: v[3]
}) %}
