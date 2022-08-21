debugging -> ("LOG" | "print") (__ "if"):? debugging_body {% v => ({
	type: 'debugging',
	method: 'log',
    conditional: v[1],
	value: v[2],
    line: v[0].line,
    col: v[0].col
}) %}
| "ERROR" (__ "if"):? debugging_body {% v => ({
	type: 'debugging',
	method: 'error',
    conditional: v[1],
	value: v[2],
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