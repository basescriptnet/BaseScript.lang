switch -> "switch*" _ value _ "{" (_ case_single_valued):* _ "}" {% v => assign(v[0], {
	type: 'switch*',
	value: v[2],
	cases: v[5] ? v[5].map(i => i[1]) : []
}) %}

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