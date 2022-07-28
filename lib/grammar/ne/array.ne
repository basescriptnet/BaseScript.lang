# arrays
array -> "[" _ "]" {% array.empty %}
	| "[" _ value (_ "," _ value):* (_ ","):? _ "]" {% array.extract %}
	| "[" _ value _ "through" _ value _ "]" {% array.loop %}

array_interactions -> ("PUSH" | "UNSHIFT") _ value _ "INTO" _ prefixExp {% v => ({
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
