@lexer lexer
# ! builtin nearley include statement really
# ! works not the way expected
#@include  "./lib/grammar/ne/functions.ne"
#process -> (_ includes:*) statements {% id %}
process -> decorated_statements (_ | EOL) {% id %}

includes -> "#include" _ "<" identifier ">" EOL {% v => ({
	type: 'built_in_include',
	value: v[3].value
}) %}

# ? removed _ at the end. Works fine
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
#(statement EOL):* (statement EOL:?):?
# statements -> (_ statement {% v => v[1] %}):* _ {% id %}
statements -> (_ global EOL {% v => v[1] %}):* (_ statement EOL):* (_ statement):? {% (v, l, reject) => {
	let result = []
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
	| with {% id %}
	| "debugger" {% statement.debugger %}
	#| "SAVE" __ value EOL {% v => ({
	#	type: 'SAVE',
	#	value: v[2]
	#}) %}
	#| "DELETE" __ "THAT" EOL {% v => ({
	#	type: 'DELETE',
	#}) %}
	| "delete" __ value {% statement.delete %}
	| return {% id %}
	| "throw" __ value {% statement.throw %}
	| ("break" | "continue") {% statement.break_continue %}
	#| "echo" __ value EOL {% statement.echo %}
	#| %eval __ value EOL {% statement.eval %}
	#| "@import" __ value EOL {% statement.import %}
	#| "@include" __ string EOL {% statement.include %}
	| var_assign {% id %}
	| value_reassign {% statement.value_reassign %}
	| value {% statement.value %}
    #| Exp EOL {% id %}
    # ! needs to be moved to values
	# | (value {% statement.value %} | value_reassign {% statement.value_reassign %} | var_assign {% id %}) EOL {% id %}
	#| ";" {% id %}

blocks -> function_declaration {% id %}
	| type_declaration {% id %}
	| if_block {% id %}
	| while_block {% id %}
	| for_block {% id %}
	| try_catch_finally {% id %}
	| switch_multiple {% id %}
    #| "switch" __ value

statements_block -> _ "{" statements _ (";" _):? "}" {% v => v[2] %}
	| _ "BEGIN" __ statements _ (";" _):? "END" {% v => v[3] %}
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
