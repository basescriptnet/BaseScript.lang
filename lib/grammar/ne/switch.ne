switch -> "caseof" _ value _ "{" (_ case_single_valued):* _ "}" {% v => assign(v[0], {
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
    | "&" _ value _ ":" _ {% v => assign(v[0], {
        type: 'case_singular',
        value: v[2],
        statements: v[6] ? v[6][0] : []
    }) %}
    | "default" _ ":" _ (value EOL):? {% v => assign(v[0], {
    type: 'case_default_singular',
    value: v[4] ? v[4][0] : [null],
}) %}

switch_multiple -> "switch" __ value _ "{" (_ case_multiline):* (_ case_default):? _ "}" {% v => assign(v[0], {
	type: 'switch',
	value: v[2],
	cases: v[5] ? v[5].map(i => i[1]) : [],
    default: v[6] ? v[6][1] : null
}) %}
#switch_multiple -> "switch" __ value
#_ "{" statements _ (";" _):? "}"
case_multiline -> "case" __ value _ ":" statements (_ ";"):? {% v => assign(v[0], {
		type: 'case',
		value: v[2],
		statements: v[5]
	}) %}

case_default -> "default" _ ":" statements (_ ";"):? {% v => assign(v[0], {
		type: 'case_default',
		value: v[3]
	}) %}