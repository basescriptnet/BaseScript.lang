# expressions
expression ->
    #object_retraction {% id %}
    # ! removed for now
	prefixExp _ "[" (_ value) _ ":" (_ value):? (_ ":" _ value):? _ "]" {% array.slice %}
	#|
    | expression _ ("+" "=" | "-" "=" | "*" "=" | "/" "=") _ expression {% v => ({
		type: 'expression',
		value: [v[0], assign(v[2][0], {value: v[2][0].value+'='}), v[4]]
	}) %}
	| expression _ ("**" | "*" | "+" | "-" | "/" | "%") _ expression {% v => ({
		type: 'expression',
		value: [v[0], v[2][0], v[4]]
	}) %}
    | prefixExp {% id %}
	| annonymous_function {% id %}
    # ! removed for now
	#| "(" _ expression _ ")" (_ arguments):? {% v => ({
	#	type: 'expression_with_parenthesis',
	#	value: v[2],
	#	arguments: v[5] ? v[5][1] : null
	#}) %}
	#| "typeof" __ (left_side_retraction | object_retraction | expression) {% v => ({
	#	type: 'typeof',
	#	value: v[2][0]
	#}) %}
    # ! removed for now
	#| "typeof" _ "(" _ (object_retraction | left_side_retraction | expression) _ ")" {% v => ({
	#	type: 'typeof',
	#	value: v[4][0]
	#}) %}
    #| "sizeof" _ "(" _ (object_retraction | left_side_retraction | expression) _ ")" {% v => ({
	#	type: 'sizeof',
	#	value: v[4][0]
	#}) %}
    # ! removed for now
	#| array_interactions {% id %}
    # ! seems unnecessary, exists at Var/prefix
	#| function_call {% id %}
	#| identifier {% id %}
    # ! no need, exists in prefix
    #| allowed_keywords {% id %}
    # ! removed for now
	#| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
    # ! removed for now
	#| html {% id %}
    # ! removed for now
	#| convert {% id %}

value ->
	#"(" _ value _ ")" {% v => ({
	#	type: 'expression_with_parenthesis',
	#	value: v[2]
	#}) %}
	# |
    # ! removed for now, works in Var
	#value _ "[" _ "]" (_ arguments):? {% v => {
	#	return {
	#		type: 'item_retraction_last',
	#		arguments: v[5] ? v[5][1] : null,
	#		from: v[0],
	#		value: null
	#		//identifier: v[0].value
	#	}
	#} %}
    # ! moved to retraction.ne
	#| value _ "[" _ value _ "]" (_ arguments):? {% v => {
	#	return {
	#		type: 'item_retraction',
	#		arguments: v[7] ? v[7][1] : null,
	#		from: v[0],
	#		value: v[4]
	#		//identifier: v[0].value
	#	}
	#} %}
    #|
	expression {% id %}
	# | value _ arguments {% v => {
	# 	debugger
	# 	return ({
	# 	type: 'function_call',
	# 	value: v[0],
	# 	arguments: v[2]
	# })} %}
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
	| condition_as_value {% id %}
	# | "(" _ switch _ ")" {% v => v[2] %}
	| switch_multiple {% id %}
	# | number {% id %}
	# | string {% id %}
	# | obj_retract {% id %}
	# | ("this" | identifier | html | object | number | function_call) _ "." _ ("this" | identifier | html | object | number | function_call) {% v => v %}
	| myNull {% id %}
	# | function_call {% id %}
	# | annonymous_function {% id %}
	# | identifier {% id %}
	# | boolean {% id %}

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
    | condition _ "?" _ value (_ ":" _ value):? {% condition.ternary %}
	| value _ "if" _ condition (_ "else" _ value):? {% condition.ternary_with_if %}

parenthesized -> "(" _ value _ ")" {% v => ({
    type: 'expression_with_parenthesis',
    value: v[2]
}) %}
