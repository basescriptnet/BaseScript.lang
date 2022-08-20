comparision_operators ->
    #"is greater than" {% v => assign(v[0], {type: 'comparision_operator', value: '>' }) %}
	#| "is greater or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	#| "is smaller than" {% v => assign(v[0], {type: 'comparision_operator', value: '<' }) %}
	#| "is smaller or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	#| "is equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	#| "is not equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	"is" _ "not" __ {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "is" __ {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "===" _ {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "!==" _ {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "==" _ {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	| "!=" _ {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	| ">=" _ {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	| "<=" _ {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	| "<" _ {% v => assign(v[0], {type: 'comparision_operator', value:  '<' }) %}
	| ">" _ {% v => assign(v[0], {type: 'comparision_operator', value:  '>' }) %}

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
| condition _ comparision_operators _value {% v => {
    return {
        type: 'value',
        left: v[0],
        right: v[3],
        value: v[2].value,
        line: v[0].line,
        lineBreaks: v[0].lineBreaks,
        offset: v[0].offset,
        col: v[0].col,
    }
} %}
| condition _ comparision_operators arguments {% (v, l, reject) => {
    if (v[3].value.length < 2) return reject;
    return {
        type: 'condition_destructive',
        left: v[0],
        right: v[3],
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
    | _value _ "??" _ _value {% v => ({
        type: 'nullish_check',
        condition: v[0],
        value: v[4],
    }) %}
    | _value {% condition.value %}

statement_condition -> _ condition {% v => v[1] %}
	#| _ "(" _ condition _ ")" {% v => v[3] %}
