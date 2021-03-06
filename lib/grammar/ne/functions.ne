# functions
# function_declaration -> ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __ identifier _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
function_declaration -> ("async" __):? ("function") __ identifier _ arguments_with_types statements_block {% functions.declaration %}
	| ("async" __):? ("function") __ identifier statements_block {% functions.declaration_with_no_args %}

annonymous_function ->
    # | ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") (__ identifier):? _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	# ! must be fixed: replace { statements | return }  by statements_block
	("async" __):? ("function") (__ identifier):? _ arguments_with_types statements_block {% functions.annonymous %}
	| ("async" __):? ("function") (__ identifier):? statements_block {% functions.annonymous_with_no_args %}
	| iife {% id %}
	# | ("async" __):? _ arguments_with_types _ "=>" _ statements_block {% v => {
	# 	return {
	# 		type: 'annonymous_function',
	# 		value: v[6],
	# 		arguments: v[2],
	# 		async: v[0] ? true : false
	# 	}
	# } %}

iife -> "(" _ annonymous_function _ ")" _ arguments {% functions.iife %}

return -> "return" __ value {% returns.value %}
    | "return"  {% returns.empty %}

function_call -> prefixExp _nbsp arguments {% v => {
    if (v[0].type == 'string') throw new Error('String is not collable')
	return ({
		type: 'function_call',
		value: v[0],
		arguments: v[2],
		//identifier: v[0].value
	})
} %}

# arguments
arguments -> "(" _ ")" {% args.empty %}
	| "(" _ value (_ "," _ value):* (_ ","):? _ ")" {% args.extract %}

arguments_with_types -> "(" _ ")" {% args.empty_arguments_with_types %}
	| "(" _ argument_identifier_and_value (_ "," _ argument_identifier_and_value):* (_ ","):? _ ")" {% args.arguments_with_types %}

argument_type -> (identifier | %keyword) "?":? __ {% v => {
	v[0] = v[0][0]
	let n = v[0].value[0];
	if (n.toUpperCase() != n) {
		throw new SyntaxError(`Argument type must be capitalized at line ${v[0].line}, col ${v[0].col}.`);
	}
	return [v[0], v[1]];
} %}

argument_identifier_and_value -> argument_type:? identifier (_ "=" _ value):? {% v => ({
	type: 'argument_identifier_and_value',
	argument_type: v[0] ? v[0][0] : 'none',
	can_be_null: v[0] ? v[0][1] : false,
	identifier: v[1],
	value: v[2] ? v[2][3] : undefined
}) %}
