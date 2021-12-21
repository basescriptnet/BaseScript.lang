@lexer lexer

process -> statements {% id %}
### statements ###
statements -> (_ statement {% v => v[1] %}):* _ {% v => v[0] %}

statement -> blocks {% id %}
	| class_declaration {% id %}
	| with {% id %}
	| "debugger" EOL {% statement.debugger %}
	| "SAVE" __ value EOL {% v => ({
		type: 'SAVE',
		value: v[2]
	}) %}
	| "DELETE" __ "THAT" EOL {% v => ({
		type: 'DELETE',
	}) %}
	| "delete" __ value EOL {% statement.delete %}
	| return {% id %}
	| "throw" __ value EOL {% statement.throw %}
	| ("break" | "continue") EOL {% statement.break_continue %}
	| "echo" __ value EOL {% statement.echo %}
	| %eval __ value EOL {% statement.eval %}
	| "@import" __ value EOL {% statement.import %}
	| "@include" __ string EOL {% statement.include %}
	# | value _ "=" _ value {% v => %}
	| var_assign EOL {% id %}
	| value_reassign EOL {% statement.value_reassign %}
	| value EOL {% statement.value %}
	# | (value {% statement.value %} | value_reassign {% statement.value_reassign %} | var_assign {% id %}) EOL {% id %}
	| ";" {% id %}

blocks -> function_declaration {% id %}
	| type_declaration {% id %}
	| if_block {% id %}
	| while_block {% id %}
	| for_block {% id %}
	| try_catch_finally {% id %}
### END statements ###

type_declaration -> "type" __ identifier _ arguments_with_types statements_block {% v => {
	if (v[2].value[0].toUpperCase() != v[2].value[0]) {
		throw new SyntaxError(`Type name must be capitalized.`)
	}
	//debugger
	if (v[4].value.length == 0) {
	//	throw new Error(`Type declaration requires at least one argument.`)
	}
	return assign(v[0], {
		type: 'type_declaration',
		identifier: v[2],
		arguments: v[4],
		value: v[5]
	})
} %}

switch -> "switch*" _ value _ "{" (_ case_single_valued):* _ "}" {% v => assign(v[0], {
	type: 'switch*',
	value: v[2],
	cases: v[5] ? v[5].map(i => i[1]) : []
}) %}
# classes
class_declaration -> "class" _ identifier _ "{" _ construct (_ es6_key_value {% v => v[1] %}):* _ "}" {% classes.parse %}
construct -> "constructor" _ arguments_with_types statements_block {% classes.construct %}
# add async
es6_key_value -> identifier _ arguments_with_types statements_block {% classes.es6_key_value %}
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
	| _ "BEGIN" __ statements _ "END" {% v => v[3] %}
	| _ ":" _ statement {% v => [v[3]] %}
	| _ "do" _ statement {% v => [v[3]] %}

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
	# | "(" _ condition _ ")" {% v => ({
	# 		type: 'condition',
	# 		value: v[2].value,
	# 		line: v[0].line,
	# 		lineBreaks: v[0].lineBreaks,
	# 		offset: v[0].offset,
	# 		col: v[0].col,
	# 	}) %}
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
	| value {% condition.value %}

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
	| "SET" _ value _ "TO" _ (switch | value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[2],
		line: v[0].line,
		col: v[0].col,
		value: v[6][0],
		offset: v[0].offset
	}
} %} 

var_assign -> ("let" __ | "const" __ | "\\") var_assign_list {% vars.assign %}
	| "ASSIGN" _ (switch | value) _ "TO" _  identifier {% v => {
	return {
		type: 'var_assign',
		use_let: true,
		identifier: v[6],
		line: v[0].line,
		col: v[0].col,
		value: {
			type: 'var_assign_group',
			identifier: v[6],
			value: [v[2][0]]
		},
		offset: v[0].offset
	}
} %}

var_assign_list -> var_reassign (_ "," _ var_reassign):* {% vars.var_assign_list %}

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
	| "SET" _ identifier _ "TO" _ (switch | value) {% v => {
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
	| "(" _ expression _ ")" (_ arguments):? {% v => ({
		type: 'expression_with_parenthesis',
		value: v[2],
		arguments: v[5] ? v[5][1] : null
	}) %}
	| object_retraction {% id %}
	| convert {% id %}
	| array_interactions {% id %}
	| regexp {% id %}
	| annonymous_function {% id %}
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
# base line
identifier -> %identifier {% v => v[0] %}

object_retraction -> single_retraction (_ "." _ right_side_retraction {% v => v[3] %}):+ {% v => ({
	type: 'dot_retraction',
	from: v[0],
	value: v[1],
	//value: v[0].value + '.' + v[4].value
}) %}

# _object_retraction ->  object_retraction {% id %}
	# | single_retraction {% id %}

single_retraction -> left_side_retraction _ "." _ right_side_retraction {% v => ({
	type: 'dot_retraction',
	from: v[0],
	value: v[4],
	//value: v[0].value + '.' + v[4].value
})
%}
	| left_side_retraction {% id %}

right_side_retraction -> %keyword {% id %}
	| function_call {% id %}
	| identifier {% id %}

left_side_retraction -> function_call {% id %}
	| "(" _ array_interactions _ ")" {% v => v[2] %}
	| "(" _ convert _ ")" {% v => v[2] %}
	| object {% id %}
	| array {% id %}
	| identifier {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| "this" {% id %}
	| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
	| html {% id %}
	| boolean {% id %}

convert -> value __ "as" __ convert_type {% v => {
		return {
			type: 'convert',
			value: v[0],
			convert_type: v[4]
		}
	} %}

convert_type -> ("List" | "JSON" | "String" | "Number" | "Boolean" | "Object" | "Float" | "Int") {% v => v[0][0] %}
	| "Array" "[" convert_type "]" {% v => {
		return {
			type: 'array_of_type',
			value: v[2],
			line: v[0].line,
			col: v[0].col
		}
	} %}
	| "Array" {% id %}

array_interactions -> ("PUSH" | "UNSHIFT") _ value _ "INTO" _ value {% v => ({
		type: 'array_interactions',
		method: v[0][0],
		into: v[6],
		value: v[2],
		line: v[0].line,
		col: v[0].col
	}) %}
	| ("POP" | "SHIFT") _ value {% v => ({
		type: 'array_interactions',
		method: v[0][0],
		value: v[2],
		line: v[0].line,
		col: v[0].col
	}) %}
	| "..." value {% v => ({
		type: 'array_interactions',
		method: 'spread',
		value: v[1],
		line: v[0].line,
		col: v[0].col
	}) %}

debugging -> "LOG" _ value {% v => ({
	type: 'debugging',
	method: 'log',
	value: v[2]
}) %}
| "ERROR" _ value {% v => ({
	type: 'debugging',
	method: 'error',
	value: v[2]
}) %}
| "WRITE" _ value {% v => ({
	type: 'debugging',
	method: 'write',
	value: v[2]
}) %}

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

# switch case addons
case_single_valued -> "|" _ value _ ":" _ (value EOL):? {% v => assign(v[0], {
		type: 'case_with_break',
		value: v[2],
		statements: v[6] ? v[6][0] : []
	}) %}
	| "&" _ value _ ":" _ {% v => Object.assign(v[0], {
		type: 'case',
		value: v[2],
		statements: v[6] ? v[6][0] : []
	}) %}
	| "default" _ ":" _ (value EOL):? {% v => Object.assign(v[0], {
		type: 'case_default',
		value: v[4] ? v[4][0] : [null],
	}) %}

# functions
# function_declaration -> ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") __ identifier _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
function_declaration -> ("async" __):? ("function") __ identifier _ arguments_with_types statements_block {% functions.declaration %}

annonymous_function -> "(" _ annonymous_function _ ")" _ arguments {% functions.iife %}
	# | ("async" __):? ("string" | "int" | "float" | "array" | "object" | "function" | "symbol" | "null" | "number") (__ identifier):? _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% v => {
	| ("async" __):? ("function") (__ identifier):? _ arguments_with_types _ "{" (_ statement | _ return):* _ "}" {% functions.annonymous %}
	# | ("async" __):? _ arguments_with_types _ "=>" _ statements_block {% v => {
	# 	return {
	# 		type: 'annonymous_function',
	# 		value: v[6],
	# 		arguments: v[2],
	# 		async: v[0] ? true : false
	# 	}
	# } %}

return -> "return" __ value EOL {% returns.value %}
	# | "return" EOL  {% returns.empty %}

function_call -> callable _ arguments {% v => {
	return ({
		type: 'function_call',
		value: v[0],
		arguments: v[2],
		//identifier: v[0].value
	})
} %}

callable -> function_call {% id %}
	| identifier {% id %}

arguments -> "(" _ ")" {% args.empty %}
	| "(" _ value (_ "," _ value):* (_ ","):? _ ")" {% args.extract %}
arguments_with_types -> "(" _ ")" {% args.empty_arguments_with_types %}
	| "(" _ argument_type:? identifier (_ "," _ argument_type:? identifier):* (_ ","):? _ ")" {% args.arguments_with_types %}

argument_type -> (identifier | %keyword) __ {% v => {
	v[0] = v[0][0]
	let n = v[0].value[0];
	if (n.toUpperCase() != n) {
		throw new SyntaxError(`Argument type must be capitalized at line ${v[0].line}, col ${v[0].col}.`);
	}
	return v[0];
} %}
	# | %keywords __ {% id %}
# typed_argument -> identifier identifier
### primitives' essentials ###
# objects
pair -> ("async" __):? key _ arguments_with_types _ statements_block {% object.es6_key_value %}
	| key _ ":" _ value {% v => [v[0], v[4]] %}

key -> string {% id %}
	| identifier {% id %}
	| %keyword {% id %}

# strings
string_concat -> string_concat __ %string {% string_concat %}
	| %string {% id %}

# html
opening_tag -> "<" identifier (__ attrubutes {% v => v[1] %}):? _ ">" {% html.opening_tag %}
closing_tag -> "<" "/" identifier ">" {% html.closing_tag %}
html_content -> string {% id %}
	| html {% id %}
attrubutes -> var_reassign (__ var_reassign):* {% html.attributes %}

# regexp
regexp_flags -> [gmi] {% regexp.flag %}
### END primitives' essentials ###

### primitives ###
# null
myNull -> "null" {% Null %}

# booleans
boolean -> (%boolean | "!" _ value) {% boolean %}

# strings
string -> string_concat {% id %}
	| string _ "[" _ number _ ":" ":":? _ number _ "]" {% string.slice %}
	| number "px" {% string.px %}

# numbers
bigInt -> %number "n" {% number.bigInt %}

number -> %number {% number.float %}

# html
html -> opening_tag (_ html_content):* _ closing_tag {% html.with_content %}
	| "<" identifier ("#" identifier):? ("." identifier):* "/" ">" {% html.self_closing_tag %}
	| "@text" __ value {% html.value_to_string %}

# objects
object -> "{" _ "}" {% object.empty %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% object.extractObject %}

# arrays
array -> array _ "[" _ number _ ":" ":":? _ number _ "]" {% array.slice %}
	| "[" _ "]" {% array.empty %}
	| "[" _ value (_ "," _ value):* (_ ","):? _ "]" {% array.extract %}
	| "[" _ number ".." number _ "]" {% array.loop %}

# regexp
regexp -> %regexp (regexp_flags):* {% regexp.parse %}

### END primitives ###

### whitespace ###
# comments
# comment -> %space %comment
# space -> %space
# # not mandatory whitespace
# _ -> comment:* %space {% v => '' %}
# 	| null {% v => '' %}
# # mandatory whitespace
# __ -> comment:* %space {% v => ' ' %}

_ -> %space {% v => '' %}
	| null {% v => '' %}
# mandatory whitespace
__ -> %space {% v => ' ' %}

# wschar -> [ \t\n\v\f] {% id %}
# s -> [ \t] | null
# end of line token
# WS_NO_LINE_BREAKS -> s (%comment [ \t]):*
# 	# | [ \t]
# 	# | %comment
# 	# | null
# WS_WITH_LINE_BREAKS -> [\s] (%comment [\s]):*
# 	# | %comment
# 	| null
# End of line
EOL -> %space {% v => 'EOL' %}
	# | WS_NO_LINE_BREAKS [\n] WS_WITH_LINE_BREAKS
	| _ ";" {% v => v[1] %}

### END whitespace ###
