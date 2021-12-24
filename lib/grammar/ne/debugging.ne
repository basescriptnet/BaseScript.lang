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