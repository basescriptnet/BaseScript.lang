@lexer lexer
# ! builtin nearley include statement really
# ! works not the way expected
#@include  "./lib/grammar/ne/functions.ne"
#process -> (_ includes:*) statements {% id %}
process -> decorated_statements _ (";" _):? {% (v, l, reject) => {
    return v[0];
} %}

includes -> _ "#include" _ "<" (identifier | keyword) ">" {% v => {
    if (v[4][0].value == 'HTML') HTML_ALLOWED = true;
    return {
        type: 'built_in_include',
        value: v[4][0].value,
        line: v[1].line,
        col: v[1].col
    }
} %}

# ? removed _ at the end. Works fine
decorated_statements -> _ %decorator includes:* statements {% v => ({
	type: 'decorator',
	line: v[1].line,
	col: v[1].col,
	offset: v[1].offset,
	decorator: v[1].value,
	includes: v[2],
	value: v[3],
}) %}
	| includes:* statements {% v => ({
		type: 'decorator',
		includes: v[0],
		value: v[1],
        line: v[0] ? v[0].line : v[1].line,
        col: v[0] ? v[0].col : v[1].col
	}) %}

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
	| with {% id %}
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
    #| "free" arguments {% statement.free %}
    #| "sleep" arguments {% statement.sleep %}
	| return {% id %}
	| "throw" __ value {% statement.throw %}
	| ("break" | "continue") {% statement.break_continue %}
    | "swap" __ value _ "," _ value {% statement.swap %}
	#| "echo" __ value EOL {% statement.echo %}
	#| %eval __ value EOL {% statement.eval %}
	#| "import" __ value {% statement.import %}
	#| "@include" __ string EOL {% statement.include %}
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
    col: v[3].colva
}) %}
	| _ ":" _ statement {% v => ({
        type: 'scope',
        value: [v[3]],
        line: v[3].line,
        col: v[3].colva
    }) %}
    #{% v => [v[3]] %}
	| _ "do" __ statement {% v => ({
        type: 'scope',
        value: [v[3]],
        line: v[3].line,
        col: v[3].colva
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

with -> "with" __ value statements_block  {% v => assign(v[0], {
	type: 'with',
	obj: v[2],
	value: v[3],
    line: v[0].line,
    col: v[0].col
}) %}
    | "with" _ "(" _ value _ ")" statements_block  {% v => assign(v[0], {
	type: 'with',
	obj: v[4],
	value: v[7],
    line: v[0].line,
    col: v[0].col
}) %}

global -> "@" "global" __ identifier {% v => ({
    type: 'global',
	value: v[3]
}) %}
