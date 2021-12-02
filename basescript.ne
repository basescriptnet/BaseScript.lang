@{%
	console.clear();
	const lexer = require('./lexer');
%}

@lexer lexer

process -> statements {% v => v[0] %}
# statements
statements -> (_ statement {% v => v[1] %}):* _ {% v => v[0] %}

statement -> var_assign _ ";" {% id %}
	# | var_reassign _ ";" {% id %}
	| function_declaration {% id %}
	| with {% id %}
	| if_block {% id %}
	| while_block {% id %}
	| for_block {% id %}
	| try_catch_finally {% id %}
	# | sleep _ ";" {% id %}
	| value_reassign _ ";" {% v => ({
		type: 'statement_value',
		value: v[0],
		line: v[0].line,
		col: v[0].col,
		lineBreak: v[0].lineBreak,
		offset: v[0].offset,
	}) %}
	| "debugger" _ ";" {% v => Object.assign(v[0], {type: 'debugger'}) %}
	| return {% id %}
	| "throw" __ value _ ";" {% v => assign(v[0], {
		type: 'throw',
		value: v[2]
	}) %}
	| ("break" | "continue") _ ";" {% v => assign(v[0][0], {
		type: 'break_continue',
	}) %}
	| "echo" __ value _ ";" {% v => assign(v[0], {
		type: 'echo',
		value: v[2]
	}) %}
	| %eval __ value _ ";" {% v => assign(v[0], {
		type: 'eval',
		value: v[2]
	}) %}
	| value _ ";" {% v => ({
		type: 'statement_value',
		value: v[0],
		line: v[0].line,
		col: v[0].col,
		lineBreak: v[0].lineBreak,
		offset: v[0].offset,
	}) %}
	| ";" {% id %}
	
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
# try catch finally
try_catch_finally -> try_catch (_ finally):? {% v => ({
	type: 'try_catch_finally',
	value: v[0],
	finally: v[1] ? v[1][1] : null
}) %}
try_catch -> try (_ catch):? {% v => ({
	type: 'try_catch',
	value: v[0],
	catch: v[1] ? v[1][1] : null
}) %}
	| try {% v => ({
		type: 'try_catch',
		value: v[0],
		catch: v[1] ? v[1][1] : null
	}) %}
try -> "try" __ statements_block {% v => ({
	type: 'try',
	value: v[2]
}) %}
	| "try" _ ":" _ statement {% v => ({
		type: 'try',
		value: v[4]
	}) %}
catch -> "catch" __ identifier statements_block {% v => {
	return {
		type: 'catch',
		value: v[3],
		identifier: v[2].value,

	}
} %}
| "catch" statements_block {% v => {
	return {
		type: 'catch',
		value: v[1],
		identifier: 'err',
	}
} %}
finally -> "finally" statements_block {% v => {
	//debugger
	return ({
		type: 'finally',
		value: v[1],
	})
} %}

with -> "with" __ value statements_block  {% v => assign(v[0], {
	type: 'with',
	obj: v[2],
	value: v[3]
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
for_block -> "for" __ identifier __ ("in" | "of") __ value statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'for_' + v[4][0],
		condition: v[1],
		identifier: v[2],
		iterable: v[6],
		value: v[7],
	});
} %}
	| "for" __ (var_assign | var_assign_list) _ ";" _ statement_condition _ ";" _ value_reassign statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'for_loop',
		condition: v[6],
		identifier: v[2][0],
		change: v[10],
		value: v[11],
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
	| value _ comparision_operators _ value {% v => {
		return {
			type: 'condition',
			left: v[0],
			right: v[4],
			value: v[2].value,
			line: v[0].line,
			lineBreaks: v[0].lineBreaks,
			offset: v[0].offset,
			col: v[0].col,
		}
	} %}
	| value {% v => ({
		type: 'condition',
		value: v[0],
		line: v[0].line,
		lineBreaks: v[0].lineBreaks,
		offset: v[0].offset,
		col: v[0].col,
	}) %}

comparision_operators -> "is greater than" {% v => assign(v[0], {type: 'comparision_operator', value: '>' }) %}
	| "is greater or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	| "is smaller than" {% v => assign(v[0], {type: 'comparision_operator', value: '<' }) %}
	| "is smaller or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	| "is equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	| "is not equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	| "is not" {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "is" {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "==" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	| "!=" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	| "===" {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "!==" {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| ">=" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	| "<=" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	| "<" {% v =>assign(v[0], {type: 'comparision_operator', value:  '<' }) %}
	| ">" {% v =>assign(v[0], {type: 'comparision_operator', value:  '>' }) %}
	# | "=" {% v => "==" %}
	# | "==" {% v => "==" %}

statement_condition -> __ condition {% v => v[1] %}
	| _ "(" _ condition _ ")" {% v => v[3] %}
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

var_assign -> ("let" __ | "const" __ | "\\"):? var_assign_list {% v => {
	let f = v[0] ? v[0][0] : v[1];
	return {
		type: 'var_assign',
		use_let: v[0] && (v[0][0].value == 'let' || v[0][0].value == '\\') ? true : false,
		use_const: v[0] && v[0][0].value == 'const' ? true : false,
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
expression ->  "(" _ expression _ ")" {% v => assign(v[2], {
		type: 'expression_with_parenthesis',
	}) %}
	| "(" _ expression _ ")" _ arguments_with_types {% v => assign(v[2], {
		type: 'expression_with_parenthesis',
	}) %}
	| expression _ ("**" | [.+-/*%]) _ expression {% v => ({
		type: 'expression',
		value: [v[0], v[2][0], v[4]]
	}) %}
	| regexp {% id %}
	| annonymous_function {% id %}
	| function_call {% id %}
	| identifier {% id %}
	| array {% id %}
	| string {% id %}
	| number {% id %}
	| "this" {% id %}
	| html {% id %}
	# | array {% id %}
	| object {% id %}
# base line
identifier -> %identifier {% v => v[0] %}
# /\/(?:\\[bfnrt.+*^$[\]{}|?:]|[^\/\\])*?\//
# regexp -> "/" ( ("\\" [bfnrt.+*^$[] | "\\" "]") [A-Za-z_]) "/" {% v => assign(v[0], {
# 	type: 'regexp',
# 	value: v.slice(1, -1) 
# }) %}
regexp -> %regexp (regexp_flags):* {% v => assign(v[0], {
	value: v[0] + (v[1] ? v[1].join('') : '')
}) %}

regexp_flags -> [gmi] {% v => v[0].value %}
dot_retraction -> dot_retraction _ "." _ (function_call | identifier | value) {% v => {
	return {
		type: 'dot_retraction',
		from: v[0],
		value: v[4][0],
		line: v[0].line,
		col: v[0].col,
		lineBreaks: v[0].lineBreaks,
		offset: v[0].offset,
	}
} %}
	| (function_call | identifier | "this") {% v => v[0] %}
	# | (function_call | identifier | value | "this") _ "." _ (function_call | identifier | value) {% v => {
	# 	return {
	# 		type: 'dot_retraction',
	# 		from: v[0][0],
	# 		value: v[4][0],
	# 		line: v[0][0].line,
	# 		col: v[0][0].col,
	# 		lineBreaks: v[0][0].lineBreaks,
	# 		offset: v[0][0].offset,
	# 	}
	# } %}

object_retraction -> dot_retraction {% id %}
	####### | (dot_retraction | function_call | identifier | value) _ "of" _ (dot_retraction | function_call | identifier | value) {% v => {
	# 	return {
	# 		type: 'dot_retraction',
	# 		from: v[4][0],
	# 		value: v[0][0],
	# 		line: v[0][0].line,
	# 		col: v[0][0].col,
	# 		lineBreaks: v[0][0].lineBreaks,
	# 		offset: v[0][0].offset,
	# 	}
	#### } %}
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

object_retraction_ -> (object_retraction | function_call | identifier | value | "this") _ "." _ (object_retraction | function_call | identifier | value)  {% v => {
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
	### | (object_retraction | function_call | identifier | value) _ "of" _ (object_retraction | function_call | identifier | value) {% v => {
	# 	return {
	# 		type: 'dot_retraction',
	# 		value: v[0][0],
	# 		from: v[4][0],
	# 		line: v[0][0].line,
	# 		col: v[0][0].col,
	# 		lineBreaks: v[0][0].lineBreaks,
	# 		offset: v[0][0].offset,
	# 	}
	### } %}
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

# obj_retract -> prefixExp (_ "." _ (function_call | identifier) {% v => v[3] %}):* {% v => {
# 	return {
# 		type: 'dot_retraction',
# 		value: v[1] ? v[1] : [],
# 		from: v[0],
# 		line: v[0].line,
# 		col: v[0].col,
# 		lineBreaks: v[0].lineBreaks,
# 		offset: v[0].offset,
# 	}
# } %}
	# | ("this" | identifier | html | object | number | function_call) {% id %}
	# | value

value -> value _ "[" _ value _ "]" _ arguments {% v => {
	//debugger
		return {
			type: 'item_retraction',
			arguments: v[8],
			from: v[0],
			value: v[4]
			//identifier: v[0].value
		}
	} %}
	| value _ "[" _ value _ "]" {% v => ({
		type: 'item_retraction',
		from: v[0],
		value: v[4]
	}) %}
	| "(" _ value _ ")" {% v => assign(v[2], {
		type: 'expression_with_parenthesis'
	}) %}
	| expression {% id %}
	| ("new" | "await" | "yield" | "typeof") __ value {% v => {
		return assign(v[0][0], {
			type: v[0][0].text,
			value: v[2]
		})
	} %}
	| value __ "instanceof" __ value {% v => ({
		type: 'instanceof',
		left: v[0],
		value: v[4]
	}) %}
	| boolean {% id %}
	# | "(" _ switch _ ")" {% v => v[2] %}
	# | number {% id %}
	# | string {% id %}
	# | obj_retract {% id %}
	# | ("this" | identifier | html | object | number | function_call) _ "." _ ("this" | identifier | html | object | number | function_call) {% v => v %}
	| myNull {% id %}
	# | function_call {% id %}
	| annonymous_function {% id %}
	# | identifier {% id %}

prefixExp -> identifier {% id %}
	| function_call {% id %}
	| "this" {% id %}
# html
opening_tag -> "<" identifier (__ attrubutes {% v => v[1] %}):? _ ">" {% v => [v[1], v[2] ? v[2] : []] %}
closing_tag -> "<" "/" identifier ">" {% v => v[2] %}
html_content -> string {% id %}
	| html {% id %}
html -> opening_tag (_ html_content):* _ closing_tag {% v => {
	if (!Array.isArray(v[0][0].value)) {
		if (v[0][0].value != v[3].value) {
			throw new Error(`Opening tag does not much the closing tag at ${v[0].line}:${v[0].col}`);
		}
	} else {
		debugger
		// add case, when attribute is not a string
	}
	//debugger

	return assign(v[0][0], {
		type: 'html_expression',
		opening_tag: v[0][0].value,
		closing_tag: v[3].value,
		value: v[1],
		attributes: v[0][1]
	})
} %}
	| html __ "with" __ "elements" __ value {% v => {
		return assign(v[0], {
			type: 'html',
			elements: v[6]
		})
	} %}
| "<" identifier ("#" identifier):? ("." identifier):* "/" ">" {% v => {
	return assign(v[0], {
		type: 'html',
		value: v[1],
		id: v[2] ? v[2][1] : null,
		classList: v[3].length ? v[3].map(i => i[1]) : null
	})
} %}
	| "text" __ value {% v => assign(v[0], {
		type: 'html_text',
		value: v[2]
	}) %}

attrubutes -> var_reassign (__ var_reassign):* {% v => {
	let output = [v[0]];
	for (let i in v[1]) {
		output.push(v[1][i][1])
	}
	// delete v[0].text
	//debugger
	return output;
	/*return Object.assign(v[0], {
		type: 'array',
		value: output
	});*/
} %}

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
	# | value (_ "," _ value):* {% v => {
	# 	//debugger
	# 	let output = [v[0]];
	# 	for (let i in v[1]) {
	# 		output.push(v[1][i][3])
	# 	}
	# 	// delete v[0].text
	# 	return {
	# 		type: 'array',
	# 		value: output
	# 	};
	# } %}

object -> "{" _ "}" {% v => {
	v[0].value = {}
	v[0].type = 'object'
	delete v[0].text;
	return v[0]
} %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% v => {
		let output = {};
		extractPair(v[2], output);
		for (let i in v[3]) {
			extractPair(v[3][i][3], output)
		}
		delete v[0].text
		return Object.assign(v[0], {
			type: 'object',
			value: output
		});
	} %}

pair -> key _ arguments _ statements_block {% v => assign(v[0], {
		type: 'annonymous_function',
		arguments: v[2],
		value: v[4],
		// .text is the key
	}) %}
	| key _ ":" _ value {% v => [v[0], v[4]] %}
# {% v => assign(v[0], {
# 	type: 'key_value',
# 	key: v[0].text,
# 	value: v[4]
# }) %}

key -> string {% id %}
	| identifier {% id %}

# functions
function_declaration -> ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __ identifier _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	// console.log(v[0][0].value)
	return assign(v[0][0], {
		type: 'function_declaration',
		identifier: v[2],
		arguments: v[4],
		value: v[7] ? v[7].map(i => i[1]) : [],
		// text is one of the options above: string; int...
	})
} %}

annonymous_function -> "(" _ annonymous_function _ ")" _ arguments {% v => {
	return assign(v[2], {
		type: 'iife',
		call_arguments: v[6]
	})
} %}
	| ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") (__ identifier):? _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	// console.log(v[0][0].value)
	return assign(v[0][0], {
		type: 'annonymous_function',
		identifier: v[1] ? v[1][1] : '',
		arguments: v[3],
		value: v[6] ? v[6].map(i => i[1]) : [],
		result: v[0][0].text
		// text is one of the options above: string; int...
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
	//debugger
	return Object.assign(v[0], {
		type: 'function_call',
		arguments: v[2],
		//identifier: v[0].value
	})
} %}
# 	identifier _ arguments {% v => {
# 	//debugger
# 	return Object.assign(v[0], {
# 		type: 'function_call',
# 		arguments: v[2],
# 		//identifier: v[0].value
# 	})
# } %}
# 	| expression _ arguments {% v => {
# 	//debugger
# 	return Object.assign(v[0], {
# 		type: 'function_call',
# 		arguments: v[2],
# 		//identifier: v[0].value
# 	})
# } %}
	# this has a bug. It repeats twice
	# | identifier __ value {% v => assign(v[0], {
	# 	type: 'function_call',
	# 	arguments: {
	# 		type: 'arguments',
	# 		value: [v[2]],
	# 	}
	# 	//identifier: v[0].value
	# }) %}

	# | value _ arguments {% v => {
	# 	return ({
	# 	type: 'function_call_from_value',
	# 	arguments: v[2],
	# 	value: v[0],
	# }) } %}

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
boolean -> "!" _ value {% v => ({
	type: 'boolean_reversed',
	value: v[2]
})%}
	| "true" {% v => ({type: 'boolean', value: true}) %}
	| "false" {% v => ({type: 'boolean', value: false}) %}
	
myNull -> "null" {% v => Object.assign(v[0], {
	type: 'null',
	value: null
}) %}
# whitespace
_ -> (%space %comment):* %space {% v => '' %}
	| null {% v => '' %}

__ -> (%space %comment):* %space {% v => ' ' %}

@{%
	function extractObject (v) {
		let output = {};
		extractPair(v[2], output);
		for (let i in v[3]) {
			extractPair(v[3][i][3], output);
		}
		return output;
	}
	function extractPair (kv, output) {
		if (kv[0]) {
			output[kv[0]] = kv[1];
		} else {
			// if it is es6 method declaration
			//debugger
			//let key = kv.text;
			//kv.text = 'function';
			output[kv.text] = kv;
		}
	}
	const global = {};
	const assign = Object.assign.bind(Object);
	Object.join = function (obj) {
		return {...this, ...obj};
	}
%}
