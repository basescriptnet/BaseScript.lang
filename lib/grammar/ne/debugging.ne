debugging -> ("LOG" | "print") debugging_body {% v => ({
	type: 'debugging',
	method: 'log',
	value: v[1]
}) %}
| "ERROR" debugging_body {% v => ({
	type: 'debugging',
	method: 'error',
	value: v[1]
}) %}
| "WRITE" debugging_body {% v => ({
	type: 'debugging',
	method: 'write',
	value: v[1]
}) %}
debugging_body -> __ value {% v => v[1] %}
    | _ "(" _ value _ ")" {% v => v[3] %}