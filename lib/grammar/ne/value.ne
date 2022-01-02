# expressions
expression -> 
	# | "(" _ expression _ ")" _ arguments_with_types {% v => ({
	# 	type: 'expression_with_parenthesis',
	# 	value: v[2],
	# 	arguments: v[6]
	# }) %}
	expression _ ("+" "=" | "-" "=" | "*" "=" | "/" "=") _ expression {% v => ({
		type: 'expression',
		value: [v[0], assign(v[2][0], {value: v[2][0].value+'='}), v[4]]
	}) %}
	| expression _ ("**" | "*" | "+" | "-" | "/" | "%") _ expression {% v => ({
		type: 'expression',
		value: [v[0], v[2][0], v[4]]
	}) %}
	| annonymous_function {% id %}
	| "(" _ expression _ ")" (_ arguments):? {% v => ({
		type: 'expression_with_parenthesis',
		value: v[2],
		arguments: v[5] ? v[5][1] : null
	}) %}
	| object_retraction {% id %}
	| convert {% id %}
	| array_interactions {% id %}
	| regexp {% id %}
	| function_call {% id %}
	| identifier {% id %}
	| array {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| "this" {% id %}
	| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
	| html {% id %}
	| object {% id %}
	| boolean {% id %}
	| convert {% id %}
	| debugging {% id %}

value -> 
	"(" _ value _ ")" {% v => ({
		type: 'expression_with_parenthesis',
		value: v[2]
	}) %}
	# | 
	| "typeof" __ value {% v => ({
		type: 'typeof',
		value: v[2]
	}) %}
	| value _ "[" _ value _ "]" (_ arguments):? {% v => {
	//debugger
		return {
			type: 'item_retraction',
			arguments: v[7] ? v[7][1] : null,
			from: v[0],
			value: v[4]
			//identifier: v[0].value
		}
	} %}
	| expression {% id %}
	# | value _ arguments {% v => {
	# 	debugger
	# 	return ({
	# 	type: 'function_call',
	# 	value: v[0],
	# 	arguments: v[2]
	# })} %}
	| ("new" | "await" | "yield") __ value {% v => {
		return assign(v[0][0], {
			type: v[0][0].text,
			value: v[2]
		})
	} %}
	| "@text" __ value {% html.value_to_string %}
	| value __ "instanceof" __ value {% v => ({
		type: 'instanceof',
		left: v[0],
		value: v[4]
	}) %}
	# |
	| condition _ "?" _ value (_ ":" _ value):? {% condition.ternary %}
	# | "(" _ switch _ ")" {% v => v[2] %}
	| switch {% id %}
	# | number {% id %}
	# | string {% id %}
	# | obj_retract {% id %}
	# | ("this" | identifier | html | object | number | function_call) _ "." _ ("this" | identifier | html | object | number | function_call) {% v => v %}
	| myNull {% id %}
	# | function_call {% id %}
	# | annonymous_function {% id %}
	# | identifier {% id %}
	# | boolean {% id %}

prefixExp -> identifier {% id %}
	| function_call {% id %}
	| "this" {% id %}
