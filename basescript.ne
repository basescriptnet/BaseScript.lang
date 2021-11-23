@{%
	console.clear();
	const moo = require('moo');
	const lexer = moo.compile({
		keyword: ['while', 'if', 'else', 'import', 'from', 'let', 'const', 'true', 'false', 'null'],
		number: /(?:\+|-)?[0-9]+(?:\.[0-9]+)?/,
		'true': 'true',
		'false': 'false',
		'null': 'null',
		space: {
			match: /\s+/, lineBreaks: true
		},
		string: [
			{
				match: /"(?:\\["nrt]|[^"\\])*"/, value: x => x.slice(1, -1)
			},
			{
				match: /'(?:\\['nrt]|[^'\\])*'/, value: x => x.slice(1, -1)
			},
			{
				match: /`(?:\\[`nrt]|[^`\\])*`/, value: x => JSON.stringify(x).slice(2, -2), lineBreaks: true
			},
		],
		multiplicative_operator: /\*|\//,
		additive_operator: /\+|-/,
		comment: /\/\/.*/,
		opening_parentesis: '(',
		closing_parentesis: ')',
		int: 'int',
		float: 'float',
		equal: '=',
		semicolon: ';',
		constant: 'const',
		//variable_name: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
		identifier: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
		hex: /#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\b/,
		comment: /\/\/.*/,
		'[': '[',
		']': ']',
		'(': '(',
		')': ')',
		'{': '{',
		'}': '}',
		',': ',',
		';': ';',
		':': ':',
		'..': '..',
		'.': '.',
		function_name: /[A-Za-z]+/,
	})
%}

@lexer lexer

process -> statements {% v => v[0] %}

# main -> string
statements -> (_ statement):* _ {% v => v[0].map(i => i[1]) %}

statement -> value {% id %}
	| var_assign _ ";" {% id %}
	| var_reassign _ ";" {% id %}
	| if_block {% id %}
	| while_block {% id %}
	| sleep {% id %}

sleep -> "sleep" _ "(" _ number _ ")" {% v => ({
	type: 'sleep',
	value: v[4],
	offset: v[0].offset,
	line: v[0].line,
	col: v[0].col
}) %}

statements_block -> _ "{" statements "}" {% v => v[2] %}
	| _ ":" _ statement {% v => [v[3]] %}

while_block -> "while" statement_condition statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'while',
		condition: v[1],
		value: v[2],
	});
} %}

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

condition -> boolean {% id %}

statement_condition -> __ condition {% v => v[1] %}
	| "(" _ condition _ ")" {% v => v[2] %}

var_assign -> is_const type __ identifier _ "=" _ additive {% v => {
		//if (v[7] !== parseInt(v[7])) throw new Error(`${v[7]} is not assignable to type int on line ${v[3].line}, column ${v[3].col}`);
		return {type: 'var_assign', vartype: v[1], identifier: v[3], constant: v[0], line: v[1].line, col: v[0][0] ? v[0][0].col : v[1].col, value: v[7]}// value: global[v[2].value] = v[7]|0}
	} %}
	| "float" __ identifier _ "=" _ additive {% v => 
		({type: 'var_assign', vartype: 'float', identifier: v[3], value: global[v[2].value] = v[6]}) %}
	| is_const type __ identifier _ "=" _ expression  {% v => {
		//if (v[7] !== parseInt(v[7])) throw new Error(`${v[7]} is not assignable to type int on line ${v[3].line}, column ${v[3].col}`);
		return {type: 'var_assign', vartype: v[1], identifier: v[3], constant: v[0][0] ? true : false, line: v[1].line, col: v[0][0] ? v[0][0].col : v[1].col, value: v[7]}// value: global[v[2].value] = v[7]|0}
	} %}
	| "let" __ identifier _ "=" _ value {% v => {
	return {
		type: 'var_assign',
		identifier: v[2],
		line: v[0].line,
		col: v[0].col,
		value: v[6],
		offset: v[0].offset
	}
} %}

is_const -> ("const" __ | null) {% v => v[0][0] ? true : false %}

type -> ("float" | "int" | "array" | "string") {% v => v[0] %}

var_reassign -> identifier _ "=" _ value {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4],
		offset: v[0].offset
	}
} %}

expression -> identifier _ [+-/*] _ identifier {% v => ({
	type: 'expression',
	value: [v[0], v[2], v[4]]
}) %}
	| string {% id %}
	| array {% id %}

identifier -> %identifier {% v => v[0] %}

value -> number {% id %}
	| string {% id %}
	| boolean {% id %}
	| myNull {% id %}
# 	| hex {% id %}
	| array {% id %}

array -> "[" _ "]" {% v => {
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
		debugger
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

function_call -> %function_name _ arguments {% v => {
		if (v[0] in functions) {
			return functions[v[0]](...v[2])
		} else {
			throw new Error('Function does not exist')
		}
	} %}

arguments -> "(" _ ")" {% v => [] %}
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
	| value {% v => [v[0]] %}

additive -> multiplicative _ [+-] _ additive {% v => {
	switch (v[2].value) {
		case '+':
			return v[0] + v[4];
		case '-':
			return v[0] - v[4];
	}
} %}
	| multiplicative {% id %}

multiplicative -> unary_expression _ [*/] _ multiplicative {% v => {
	switch (v[2].value) {
		case '*':
			return v[0] * v[4];
		case '/':
			return v[0] / v[4];
	}
} %}
	| unary_expression {% id %}
	
unary_expression -> number {% id %}
	| "(" _ additive _ ")" {% v => v[2] %}

number -> %number {% v => {
	return Object.assign(v[0], {
		value: v[0].value
	})
	//v[0].value
} %} 
# number -> %number {% v => +v[0].value %}
# 	| function {% id %}

string -> %string {% id %}
	# | string_concat {% id %}
	
# string_concat -> %string _ "+" _ %string {% v => ({
# 	v[0].value + v[4].value
# }) %}
# 	| string_concat _ "+" _ %string {% v => v[0] + v[4].value
#  %}

# string_concat -> %string _ "+" _ %string {% v => v[0].value + v[4].value %}
# 	| string_concat _ "+" _ %string {% v => v[0] + v[4].value %}

# hex -> %hex {% v => v[0].value %}

boolean -> "true" {% v => true %}
	| "false" {% v => false %}
	
myNull -> "null" {% v => null %}

_ -> (%space %comment):* %space {% v => '' %}
	| null {% v => '' %}

__ -> (%space %comment):* %space {% v => ' ' %}


@{%
	const global = {};
%}
