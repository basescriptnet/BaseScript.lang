comparision_operators ->
    #"is greater than" {% v => assign(v[0], {type: 'comparision_operator', value: '>' }) %}
	#| "is greater or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	#| "is smaller than" {% v => assign(v[0], {type: 'comparision_operator', value: '<' }) %}
	#| "is smaller or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	#| "is equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	#| "is not equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	"is" _ "not" {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "is" {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "===" {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "!==" {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "==" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	| "!=" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	| ">=" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	| "<=" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	| "<" {% v => assign(v[0], {type: 'comparision_operator', value:  '<' }) %}
	| ">" {% v => assign(v[0], {type: 'comparision_operator', value:  '>' }) %}

condition -> condition __ ("and" | "or" | "&&" | "||") __ _value {% v => {
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
|
condition _ comparision_operators _ _value {% v => {
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
    | _value _ "in" _ _value {% v => {
		return {
			type: 'in',
			from: v[4],
			value: v[0]
		}
	} %}
    | _value {% condition.value %}

statement_condition -> _ condition {% v => v[1] %}
	#| _ "(" _ condition _ ")" {% v => v[3] %}
