debugging -> "LOG" _ "(" _ value _ ")" {% v => ({
	type: 'debugging',
	method: 'log',
	value: v[5]
}) %}
| "ERROR" _ "(" _ value _ ")" {% v => ({
	type: 'debugging',
	method: 'error',
	value: v[5]
}) %}
| "WRITE" _ "(" _ value _ ")" {% v => ({
	type: 'debugging',
	method: 'write',
	value: v[5]
}) %}