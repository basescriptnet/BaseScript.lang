@lexer lexer

process -> statements {% id %}

### statements ###
statements -> (_ statement {% v => v[1] %}):* _ {% v => v[0] %}

statement -> blocks {% id %}
	| class_declaration {% id %}
	| with {% id %}
	| "debugger" EOL {% statement.debugger %}
	| "SAVE" __ value EOL {% v => ({
		type: 'SAVE',
		value: v[2]
	}) %}
	| "DELETE" __ "THAT" EOL {% v => ({
		type: 'DELETE',
	}) %}
	| "delete" __ value EOL {% statement.delete %}
	| return {% id %}
	| "throw" __ value EOL {% statement.throw %}
	| ("break" | "continue") EOL {% statement.break_continue %}
	| "echo" __ value EOL {% statement.echo %}
	| %eval __ value EOL {% statement.eval %}
	| "@import" __ value EOL {% statement.import %}
	| "@include" __ string EOL {% statement.include %}
	# | value _ "=" _ value {% v => %}
	| var_assign EOL {% id %}
	| value_reassign EOL {% statement.value_reassign %}
	| value EOL {% statement.value %}
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
