# functions
# function_declaration -> ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __ identifier _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
#function_declaration -> ("async" __):? ("function") __ identifier _ arguments_with_types statements_block {% functions.declaration %}
#	| ("async" __):? ("function") __ identifier statements_block {% functions.declaration_with_no_args %}

annonymous_function ->
    # | ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") (__ identifier):? _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	("async" __):? function_declarator (__ identifier):? _ arguments_with_types statements_block {% functions.annonymous %}
	| ("async" __):? function_declarator (__ identifier):? statements_block {% functions.annonymous_with_no_args %}
    # ! returns multiple results if assigned or if has pre-spacing
    #| lambda {% id %}

function_declarator -> ("function" | "def" | "void" | "Int" | "Float" | "Array" | "Object" | "Null" | "Boolean" | "Number" | "String") {% id %}

return -> "return" __nbsp value {% returns.value %}
    | "return" {% returns.empty %}
    | "=>" _nbsp value {% returns.value %}

function_call -> _base _nbsp arguments {% (v, l, reject) => {
    if (v[0].type == 'annonymous_function') return reject
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
	| "(" _ value (_ "," _ value):* (_ ","):? _ ")" {% args.extract %}

arguments_with_types -> "(" _ ")" {% args.empty_arguments_with_types %}
	| "(" _ argument_identifier_and_value (_ "," _ argument_identifier_and_value):* (_ ","):? _ ")" {% args.arguments_with_types %}

argument_identifier_and_value -> argument_type identifier (_ "=" _ value):? {% v => ({
	type: 'argument_identifier_and_value',
	argument_type: v[0] ? v[0][0] : 'none',
	can_be_null: v[0] ? v[0][1] : false,
	identifier: v[1],
	value: v[2] ? v[2][3] : null
}) %}

#argument_type_name -> identifier {% id %}
#    | %keyword {% id %}

argument_type -> (identifier "?":? __):? {% v => {
    if (!v[0]) return;
	v[0] = v[0][0];
    if (v[0] && v[0] instanceof Array) {
        v[0] = v[0][0]
    }
	let n = v[0].value[0];
	if (n.toUpperCase() != n) {
        return;
		throw new SyntaxError(`Argument type must be capitalized at line ${v[0].line}, col ${v[0].col}.`);
    }
	return [v[0], v[1]];
} %}

#lambda_arguments -> arguments_with_types {% id %}
#    | identifier {% id %}

#lambda -> ("async" __):? _ lambda_arguments _ "=>" statements_block {% v => {
#        return {
#            type: 'annonymous_function',
#            value: v[5],
#            arguments: v[2],
#            async: v[0] ? true : false
#        }
#    } %}
#    #| ("async" __):? _ lambda_arguments _ "=>" statement {% v => {
#    #    return {
#    #        type: 'lambda',
#    #        value: v[6],
#    #        arguments: v[2],
#    #        async: v[0] ? true : false
#    #    }
#    #} %}