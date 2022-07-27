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

try -> "try" statements_block {% v => ({
	type: 'try',
	value: v[1]
}) %}
catch -> "catch" __ identifier statements_block {% v => {
	return {
		type: 'catch',
		value: v[3],
		identifier: v[2].value,

	}
} %}
    | "catch" _ "(" _ identifier _ ")" statements_block {% v => {
	return {
		type: 'catch',
		value: v[7],
		identifier: v[4].value,
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
