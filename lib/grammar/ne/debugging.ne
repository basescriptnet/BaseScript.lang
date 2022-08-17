debugging -> ("LOG" | "print") debugging_body {% v => ({
	type: 'debugging',
	method: 'log',
	value: v[1],
    line: v[0].line,
    col: v[0].col
}) %}
| "ERROR" debugging_body {% v => ({
	type: 'debugging',
	method: 'error',
	value: v[1],
    line: v[0].line,
    col: v[0].col
}) %}
#| "WRITE" debugging_body {% v => ({
#	type: 'debugging',
#	method: 'write',
#	value: v[1],
#    line: v[0].line,
#    col: v[0].col
#}) %}
debugging_body -> __ value {% v => v[1] %}
    | _nbsp arguments {% v => ({
        type: 'arguments',
        value: v[1],
        line: v[1].line,
        col: v[1].col
    }) %}