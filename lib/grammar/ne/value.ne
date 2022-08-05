# expressions
expression ->
    expression _nbsp ("+" "=" | "-" "=" | "*" "=" | "/" "=") _ prefixExp {% (v, l, reject) => {
        //if (v[0].type == 'annonymous_function') return reject;
        return ({
            type: 'expression',
            value: [v[0], assign(v[2][0], {value: v[2][0].value+'='}), v[4]]
        })
    } %}
	| expression _nbsp ("**" | "*" | "+" | "-" | "/" | "%") _ prefixExp {% (v, l, reject) => {
        if (v[0].type == 'annonymous_function') return reject;
        return ({
            type: 'expression',
            value: [v[0], v[2][0], v[4]]
        })
    } %}
    | prefixExp {% id %}
    # ! removed for now
	#| "(" _ expression _ ")" (_ arguments):? {% v => ({
	#	type: 'expression_with_parenthesis',
	#	value: v[2],
	#	arguments: v[5] ? v[5][1] : null
	#}) %}
    # ! removed for now
    # ? BUG: spread operator works out of array|argument context
	#| array_interactions {% id %}
    # ! removed for now
	#| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
	| convert {% id %}

value -> condition {% id %}
    #| _value {% id %}
_value ->
	expression {% id %}
    | "!" _ prefixExp {% v => {
        return {type: 'boolean_reversed', value: v[2] }
    } %}
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
	#| switch_multiple {% id %}
	# | obj_retract {% id %}
	# | ("this" | identifier | html | object | number | function_call) _ "." _ ("this" | identifier | html | object | number | function_call) {% v => v %}
	| myNull {% id %}
    | ternary {% id %}
	# | annonymous_function {% id %}

prefixExp -> parenthesized {% id %}
    | Var {% id %}
	| annonymous_function {% id %}
	| function_call {% id %}
	| regexp {% id %}
    | allowed_keywords {% id %}
	| array {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| object {% id %}
	| boolean {% id %}
    #| "+" _ prefixExp {% v => ({
    #    type: 'number',
    #    value: v[2]
    #}) %}
	| html {% (v, l, reject) => {
        if (!HTML_ALLOWED) {
            throw new ReferenceError('HTML syntax is not imported. Use #include <HTML> first.')
        }
        return v[0];
    } %}

parenthesized -> "(" _ value _ ")" {% (v, l, reject) => {
    //if (v[2].type == 'convert') return reject;
    return {
        type: 'expression_with_parenthesis',
        value: v[2]
    }
} %}
