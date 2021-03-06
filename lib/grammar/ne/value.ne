# expressions
expression ->
    expression _ ("+" "=" | "-" "=" | "*" "=" | "/" "=") _ prefixExp {% v => ({
		type: 'expression',
		value: [v[0], assign(v[2][0], {value: v[2][0].value+'='}), v[4]]
	}) %}
	| expression _ ("**" | "*" | "+" | "-" | "/" | "%") _ prefixExp {% v => ({
		type: 'expression',
		value: [v[0], v[2][0], v[4]]
	}) %}
    | prefixExp {% id %}
    # ! removed for now
	#| "(" _ expression _ ")" (_ arguments):? {% v => ({
	#	type: 'expression_with_parenthesis',
	#	value: v[2],
	#	arguments: v[5] ? v[5][1] : null
	#}) %}
    # ! removed for now
	#| array_interactions {% id %}
    # ! removed for now
	#| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
    # ! removed for now
	#| convert {% id %}

value -> condition {% id %}
    #| _value {% id %}
_value ->
	expression {% id %}
	| ("new" | "await" | "yield") __ prefixExp {% v => {
		return assign(v[0][0], {
			type: v[0][0].text,
			value: v[2]
		})
	} %}
	#| "@text" __ value {% html.value_to_string %}
	| prefixExp __ "instanceof" __ prefixExp {% v => ({
		type: 'instanceof',
		left: v[0],
		value: v[4]
	}) %}
	# |
	#| condition {% id %}
	# | "(" _ switch _ ")" {% v => v[2] %}
	| switch_multiple {% id %}
	# | obj_retract {% id %}
	# | ("this" | identifier | html | object | number | function_call) _ "." _ ("this" | identifier | html | object | number | function_call) {% v => v %}
	| myNull {% id %}
    | ternary {% id %}
	# | annonymous_function {% id %}

prefixExp -> Var {% id %}
	| function_call {% id %}
    | parenthesized {% id %}
    | allowed_keywords {% id %}
	| array {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| object {% id %}
	| boolean {% id %}
    | "+" _ prefixExp {% v => ({
        type: 'number',
        value: v[2]
    }) %}
	| regexp {% id %}
	| annonymous_function {% id %}
	| html {% id %}

parenthesized -> "(" _ value _ ")" {% v => ({
    type: 'expression_with_parenthesis',
    value: v[2]
}) %}
