# if else
if_block -> "if" statement_condition statements_block {% v => {
	return assign(v[0], {
		type: 'if',
		condition: v[1],
		value: v[2]
	});
} %}
    | "unless" statement_condition statements_block {% v => {
	return assign(v[0], {
		type: 'if',
		condition: v[1],
		value: v[2],
        unless: true
	});
} %}
	| if_block
	#(_ elif_block):*
	_ else_block {% v => {
	return {
		type: 'if_else',
		if: v[0],
		//elifs: v[1] ? v[1].map(i => i[1]) : null,
		else: v[2],
		offset: v[0].offset,
		lineBreaks: v[0].lineBreaks,
		line: v[0].line,
		col: v[0].col
	}
} %}
# 	| if_block (_ elif_block):+ {% v => {
# 	return {
# 		type: 'if_elif',
# 		if: v[0],
# 		elifs: v[1].map(i => i[1]),
# 		offset: v[0].offset,
# 		lineBreaks: v[0].lineBreaks,
# 		line: v[0].line,
# 		col: v[0].col
# 	}
# } %}

# elif_block -> "elif" statement_condition statements_block {% v => {
# 	return Object.assign(v[0], {
# 		type: 'elif',
# 		condition: v[1],
# 		value: v[2],
# 	});
# } %}

else_block -> "else" __ statement {% (v, l, reject) => {
    //if (v[2].type == 'if') return reject;
    if (v[2].type == 'statement_value' && v[2].value.type == 'value' && v[2].value.value.type == 'object') return reject
    //if (v[2].type == 'value' && v[2].value.type == 'object') debugger
	return assign(v[0], {
		type: 'else',
		value: [v[2]],
	});
} %}
	| "else" statements_block {% v => {
    //if (v[1].type == 'value' && v[1].value.type == 'object') debugger
    return assign(v[0], {
		type: 'else',
		value: v[1],
	});
} %}

ternary -> condition _ "?" _ value (_ ":" _ value):? {% condition.ternary %}
    | value __nbsp "if" _ condition (_ "else" _ value):? {% condition.ternary_with_if %}