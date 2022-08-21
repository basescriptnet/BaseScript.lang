# expressions

base -> parenthesized {% id %}
	#| annonymous_function {% id %}
	#| regexp {% id %}
    | Var {% id %}
	#| function_call {% id %}
    #| allowed_keywords {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| array {% id %}
    | convert {% id %}
	| object {% id %}
    | "safeValue" _ arguments {% v => ({
        type: 'safeValue',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }) %}

	#| boolean {% id %}

sum -> sum _nbsp ("+" | "-") _ product {% v => ({
    type: 'sum',
    left: v[0],
    right: v[4],
    operator: v[2][0].value,
    value: (function (v) {
        if (v[0].type == 'number' && v[4].type == 'number') {
            if (v[2][0].value == '+') {
                return v[0].value + v[4].value
            } else {
                return v[0].value - v[4].value
            }
        } else {
            return null
        }
    })(v),
    line: v[0].line,
    col: v[0].col
}) %}
    | product {% id %}

product -> product _nbsp ("*" | "/") _ unary {% v => ({
    type: 'product',
    left: v[0],
    right: v[4],
    operator: v[2][0].value,
    value: (function (v) {
        if (v[0].type == 'number' && v[4].type == 'number') {
            if (v[2][0].value == '*') {
                return v[0].value * v[4].value
            } else {
                return v[0].value / v[4].value
            }
        } else {
            return null
        }
    })(v),
    line: v[0].line,
    col: v[0].col
}) %}
    | unary {% id %}

unary -> "-" _nbsp unary {% v => {
    return {
    type: 'number_negative',
    value: v[2],
    line: v[0].line,
    col: v[0].col
}} %}
    | pow {% id %}

pow -> pow _nbsp ("**" | "%") _ unary {% v => ({
    type: 'pow',
    left: v[0],
    right: v[4],
    operator: v[2][0].value,
    value: (function (v) {
        if (v[0].type == 'number' && v[4].type == 'number') {
            if (v[2][0].value == '**') {
                return v[0].value ** v[4].value
            } else {
                return v[0].value % v[4].value
            }
        } else {
            return null
        }
    })(v),
    line: v[0].line,
    col: v[0].col
}) %}
| pow _nbsp operator _ unary {% v => ({
    type: 'pow',
    left: v[0],
    right: v[4],
    operator: v[2].value,
    value: null,
    line: v[0].line,
    col: v[0].col
}) %}
    | base {% id %}

expression ->
	#| expression _nbsp ("**" | "*" | "+" | "-" | "/" | "%") _ prefixExp {% (v, l, reject) => {
    #    if (v[0].type == 'annonymous_function') return reject;
    #    return ({
    #        type: 'expression',
    #        value: [v[0], v[2][0], v[4]]
    #    })
    #} %}
    prefixExp {% id %}
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

value -> condition {% id %}
    #| _value {% id %}
_value ->
	expression {% id %}
    |
    "!" _ prefixExp {% v => {
        return {
            type: 'boolean_reversed',
            value: v[2],
            line: v[0].line,
            col: v[0].col
        }
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
		value: v[4],
        line: v[0].line,
        col: v[0].col
	}) %}
	# |
	#| condition {% id %}
	# | "(" _ switch _ ")" {% v => v[2] %}
	#| switch_multiple {% id %}
	# | obj_retract {% id %}
	# | ("this" | identifier | html | object | number | function_call) _ "." _ ("this" | identifier | html | object | number | function_call) {% v => v %}
	| myNull {% id %}
    | "new" _ "." _ "target" {% v => ({
        type: 'new.target',
        line: v[0].line,
        col: v[0].col
    }) %}
    | "void" _nbsp arguments {% v => ({
        type: 'void',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }) %}
    | ternary {% id %}
    #| "private" statements_block {% v => {
    #    return {
    #        type: 'private',
    #        value: v[1],
    #        line: v[0].line,
    #        col: v[0].col
    #    }
    #} %}
	# | annonymous_function {% id %}

prefixExp ->
#parenthesized {% id %}
    sum {% id %}
    #| Var {% id %}
	| annonymous_function {% id %}
	#| function_call {% id %}
	| regexp {% id %}
    #| allowed_keywords {% id %}
	#| array {% id %}
	#| string {% id %}
	#| bigInt {% id %}
	#| number {% id %}
	#| object {% id %}
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
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }
} %}