@{%
	console.clear();
	const lexer = require('./lexer');
%}

@lexer lexer

process -> statements {% id %}
# statements
statements -> (_ statement):* _ {% v => v[0].map(i => i[1]) %}

statement -> var_assign _ ";" {% id %}
	# | var_reassign _ ";" {d% id %}
	| function_declaration {% id %}
	| if_block {% id %}
	| while_block {% id %}
	| sleep _ ";" {% id %}
	| ";" {% id %}
	| (value_reassign | value) _ ";" {% v => ({
		type: 'statement_value',
		value: v[0][0],
		line: v[0][0].line,
		col: v[0][0].col,
		lineBreak: v[0][0].lineBreak,
		offset: v[0][0].offset,
	}) %}
	| "debugger" _ ";" {% v => Object.assign(v[0], {type: 'debugger'}) %}
	# | switch {% id %}

sleep -> "sleep" _ "(" _ number _ ")" {% v => ({
	type: 'sleep',
	value: v[4],
	offset: v[0].offset,
	line: v[0].line,
	col: v[0].col
}) %}

switch -> "switch*" _ value _ "{" (_ case_single_valued):* _ "}" {% v => Object.assign(v[0], {
	type: 'switch*',
	value: v[2],
	cases: v[5] ? v[5].map(i => i[1]) : []
}) %}

statements_block -> _ "{" statements "}" {% v => v[2] %}
	| _ ":" _ statement {% v => [v[3]] %}

# loops
while_block -> "while" statement_condition statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'while',
		condition: v[1],
		value: v[2],
	});
} %}
# if else
if_block -> "if" statement_condition statements_block {% v => {
	return Object.assign(v[0], {
		type: 'if',
		condition: v[1],
		value: v[2],
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

else_block -> "else" __ statement {% v => {
	return Object.assign(v[0], {
		type: 'else',
		value: [v[2]],
	});
} %}
	| "else" _ "{" statements "}" {% v => {
	return Object.assign(v[0], {
		type: 'else',
		value: v[2],
	});
} %}

# conditions
condition -> condition __ ("and" | "or") __ condition {% v => {
	return {
		type: 'condition_group',
		value: [v[0], v[4]],
		separator: ' ' + v[2][0] + ' ',
		line: v[0].line,
		lineBreaks: v[0].lineBreaks,
		offset: v[0].offset,
		col: v[0].col,
	}
} %}
	| value __ "is greater than" __ value
	| value {% id %}

statement_condition -> __ condition {% v => v[1] %}
	| _ "(" _ condition _ ")" {% v => v[2] %}
# value assignment
value_reassign -> value _ "=" _ (switch | value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4][0],
		offset: v[0].offset
	}
} %} 

var_assign -> ("let" __):? var_assign_list {% v => {
	let f = v[0] ? v[0][0] : v[1];
	return {
		type: 'var_assign',
		use_let: v[0] ? true : false,
		line: f.line,
		col: f.col,
		value: v[1],
		offset: f.offset
	}
} %}

var_assign_list -> var_reassign (_ "," _ var_reassign):* {% v => {
	v[1] = v[1].map(i => Object.assign(i[3], {type: 'var_reassign'}));
	return {
		type: 'var_assign_group',
		line: v[0].line,
		col: v[0].col,
		value: v[1] ? [v[0], ...v[1]] : [v[0]],
		offset: v[0].offset
	}
} %}

var_reassign -> identifier _ "=" _ (switch | value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4][0],
		offset: v[0].offset
	}
} %}
# expressions
expression -> expression _ [+-/*] _ expression {% v => ({
	type: 'expression',
	value: [v[0], v[2], v[4]]
}) %}
	| "(" _ expression _ ")" {% v => assign(v[2], {
		type: 'expression_with_parenthesis'
	}) %}
	| identifier {% id %}
	| string {% id %}
	| array {% id %}
	| number {% id %}
# base line
identifier -> %identifier {% v => v[0] %}

dot_retraction -> dot_retraction _ "." _ dot_retraction {% v => {
	return {
		type: 'dot_retraction',
		from: v[0],
		value: v[4],
		line: v[0].line,
		col: v[0].col,
		lineBreaks: v[0].lineBreaks,
		offset: v[0].offset,
	}
} %}
	| (function_call | identifier | value) _ "." _ (function_call | identifier | value) {% v => {
		return {
			type: 'dot_retraction',
			from: v[0][0],
			value: v[4][0],
			line: v[0][0].line,
			col: v[0][0].col,
			lineBreaks: v[0][0].lineBreaks,
			offset: v[0][0].offset,
		}
	} %}

object_retraction -> dot_retraction {% id %}
	| (dot_retraction | function_call | identifier | value) _ "of" _ (dot_retraction | function_call | identifier | value) {% v => {
		return {
			type: 'dot_retraction',
			from: v[4][0],
			value: v[0][0],
			line: v[0][0].line,
			col: v[0][0].col,
			lineBreaks: v[0][0].lineBreaks,
			offset: v[0][0].offset,
		}
	} %}
	# | (dot_retraction | function_call | identifier | value) _ "of" _ (dot_retraction | function_call | identifier | value) {% v => {
	# 	return {
	# 		type: 'dot_retraction',
	# 		from: v[4][0],
	# 		value: v[0][0],
	# 		line: v[0][0].line,
	# 		col: v[0][0].col,
	# 		lineBreaks: v[0][0].lineBreaks,
	# 		offset: v[0][0].offset,
	# 	}
	# } %}

object_retraction_ -> (object_retraction | function_call | identifier | value) _ "." _ (object_retraction | function_call | identifier | value)  {% v => {
		return {
			type: 'dot_retraction',
			value: v[4][0],
			from: v[0][0],
			line: v[0][0].line,
			col: v[0][0].col,
			lineBreaks: v[0][0].lineBreaks,
			offset: v[0][0].offset,
		}
	} %}
	# | (object_retraction | function_call | identifier | value) _ "." _ (object_retraction | function_call | identifier | value) {% v => {
	# 	return {
	# 		type: 'dot_retraction',
	# 		value: v[4][0],
	# 		from: v[0][0],
	# 		line: v[0][0].line,
	# 		col: v[0][0].col,
	# 		lineBreaks: v[0][0].lineBreaks,
	# 		offset: v[0][0].offset,
	# 	}
	# } %}
	| (object_retraction | function_call | identifier | value) _ "of" _ (object_retraction | function_call | identifier | value) {% v => {
		return {
			type: 'dot_retraction',
			value: v[0][0],
			from: v[4][0],
			line: v[0][0].line,
			col: v[0][0].col,
			lineBreaks: v[0][0].lineBreaks,
			offset: v[0][0].offset,
		}
	} %}
	# | (function_call | identifier | value) _ "of" _ (value) {% v => {
	# 	return {
	# 		type: 'dot_retraction',
	# 		value: v[0][0],
	# 		from: v[4][0],
	# 		line: v[0][0].line,
	# 		col: v[0][0].col,
	# 		lineBreaks: v[0][0].lineBreaks,
	# 		offset: v[0][0].offset,
	# 	}
	# } %}

value -> object_retraction {% id %}
	| "new" __ value {% v => {
		return assign(v[0], {
			type: 'new',
			value: v[2]
		})
	} %}
	| expression {% id %}
	| "(" _ value _ ")" {% id %}
	# | "(" _ switch _ ")" {% v => v[2] %}
	# | number {% id %}
	# | string {% id %}
	| boolean {% id %}
	| myNull {% id %}
	# | array {% id %}
	# | identifier {% id %}
	| function_call {% id %}

# switch case addons
case_single_valued -> "|" _ value _ ":" _ (value _ ";"):? {% v => Object.assign(v[0], {
		type: 'case_with_break',
		value: v[2],
		statements: v[6] ? v[6][0] : []
	}) %}
	| "&" _ value _ ":" _ {% v => Object.assign(v[0], {
		type: 'case',
		value: v[2],
		statements: v[6] ? v[6][0] : []
	}) %}
	| "default" _ ":" _ (value _ ";"):? {% v => Object.assign(v[0], {
		type: 'case_default',
		value: v[4] ? v[4][0] : [null],
	}) %}
# arrays
array -> array _ "[" _ number _ ":" ":":? _ number _ "]" {% v => {
		return Object.assign(v[0], {
			type: 'array_slice',
			start: v[4],
			end: v[9],
			reversed: v[7] ? true : false
		});
	} %}
	| "[" _ "]" {% v => {
	v[0].value = []
	v[0].type = 'array'
	delete v[0].text;
	return v[0]
} %}
	| "[" _ value (_ "," _ value):* (_ ","):? _ "]" {% v => {
		let output = [v[2]];
		for (let i in v[3]) {
			output.push(v[3][i][3])
		}
		delete v[0].text
		return Object.assign(v[0], {
			type: 'array',
			value: output
		});
	} %}
	| "[" _ number ".." number _ "]" {% v => {
		let output = [];
		let min = Math.min(v[2], v[4]);
		let max = Math.max(v[2], v[4]);
		for (let i = min; i <= max; i++) {
			output.push({
				type: 'number',
				value: i
			});
		}
		if (v[2] != min) 
			output = output.reverse()
		return Object.assign(v[0], {
			type: 'array',
			value: output
		});
	} %}
	# | value (__ value):*
	#  {% v => {
	# 	let output = [v[0]];
	# 	for (let i in v[1]) {
	# 		output.push(v[1][i][1])
	# 	}
	# 	delete v[0].text
	# 	return Object.assign(v[0], {
	# 		type: 'array',
	# 		value: output
	# 	});
	# } %}

# functions
function_declaration -> ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __ identifier _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	// console.log(v[0][0].value)
	return assign(v[0][0], {
		type: 'function_declaration',
		identifier: v[2],
		arguments: v[4],
		value: v[7] ? v[7].map(i => i[1]) : [],
		// text is one of the options above
	})
} %}

return -> "return" __ value _ ";" {% v => {
	return assign(v[0], {
		type: 'return',
		value: v[2]
	})
} %}
	| "return" _ ";"  {% v => {
	return assign(v[0], {
		type: 'return',
		value: undefined
	})
} %}

function_call -> identifier _ arguments {% v => {
	return Object.assign(v[0], {
		type: 'function_call',
		arguments: v[2]
	})
		/*if (v[0] in functions) {
			return functions[v[0]](...v[2])
		} else {
			throw new Error('Function does not exist')
		}*/
	} %}

arguments -> "(" _ ")" {% v => Object.assign(v[0], {
	type: 'arguments',
	value: []
}) %}
	| "(" _ value (_ "," _ value):* (_ ","):? _ ")" {% v => {
		let output = [v[2]];
		for (let i in v[3]) {
			output.push(v[3][i][3])
		}
		delete v[0].text
		return Object.assign(v[0], {
			type: 'arguments',
			value: output
		});
	} %}
	# | value {% v => [v[0]] %}
arguments_with_types -> "(" _ ")" {% v => Object.assign(v[0], {
	type: 'arguments_with_types',
	value: []
}) %}
	| "(" _ (("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __):? value (_ "," _ (("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __):? value):* (_ ","):? _ ")" {% v => {
		let output = [v[3]];
		let types = [v[2] ? v[2][0][0].value : 'none'];
		for (let i in v[4]) {
			output.push(v[4][i][4]);
			types.push(v[4][i][3] ? v[4][i][3][0][0].value : 'none');
		}
		delete v[0].text
		return Object.assign(v[0], {
			type: 'arguments_with_types',
			value: output,
			types: types
		});
	} %}
# unused math
# additive -> multiplicative _ [+-] _ additive {% v => {
# 	switch (v[2].value) {
# 		case '+':
# 			return v[0] + v[4];
# 		case '-':
# 			return v[0] - v[4];
# 	}
# } %}
# 	| multiplicative {% id %}

# multiplicative -> unary_expression _ [*/] _ multiplicative {% v => {
# 	switch (v[2].value) {
# 		case '*':
# 			return v[0] * v[4];
# 		case '/':
# 			return v[0] / v[4];
# 	}
# } %}
# 	| unary_expression {% id %}
	
# unary_expression -> number {% id %}
# 	| "(" _ additive _ ")" {% v => v[2] %}

#numbers
number -> %number {% v => {
	return Object.assign(v[0], {
		value: v[0].value
	})
	//v[0].value
} %}
# strings
string -> string _ "[" _ number _ ":" ":":? _ number _ "]" {% v => {
		return Object.assign(v[0], {
			type: 'string_slice',
			start: v[4],
			end: v[9],
			reversed: v[7] ? true : false
		});
	} %}
	| string_concat {% id %}
	
string_concat -> string_concat __ %string {% v => {
	return Object.assign(v[0], {
	value: v[0].value + v[2].value
})} %}
	| %string {% id %}
# booleans
boolean -> "true" {% v => true %}
	| "false" {% v => false %}
	
myNull -> "null" {% v => Object.assign(v[0], {
	type: 'null',
	value: null
}) %}
# whitespace
_ -> (%space %comment):* %space {% v => '' %}
	| null {% v => '' %}

__ -> (%space %comment):* %space {% v => ' ' %}


@{%
	const global = {};
	const assign = Object.assign.bind(Object);
	Object.join = function (obj) {
		return {...this, ...obj};
	}
%}
