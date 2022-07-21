# conditions
Exp -> Binop {% v => {
    debugger
} %}

Binop -> ExpOr {% id %}

ExpOr -> ExpOr __ "or" __ ExpAnd
    | ExpOr __ "||" __ ExpAnd
	| ExpAnd {% id %}

ExpAnd -> ExpAnd __ "and" __ ExpComparison
    | ExpAnd __ "&&" __ ExpComparison
	| ExpComparison {% id %}

ExpComparison ->
    ExpComparison _ "<"  _ ExpConcatenation
	| ExpComparison _ ">"  _ ExpConcatenation
	| ExpComparison _ "<=" _ ExpConcatenation
	| ExpComparison _ ">=" _ ExpConcatenation
	| ExpComparison _ "!=" _ ExpConcatenation
	| ExpComparison _ "==" _ ExpConcatenation
	| ExpComparison _ "!==" _ ExpConcatenation
	| ExpComparison _ "===" _ ExpConcatenation
	| ExpConcatenation

ExpConcatenation -> ExpSum
	#  ExpSum _ ".." _ ExpConcatenation
	#| ExpSum

ExpSum ->
    ExpSum _ "+" _ ExpProduct
	| ExpSum _ "-" _ ExpProduct
	| ExpProduct

ExpProduct ->
    ExpProduct _ "*" _ ExpUnary
	| ExpProduct _ "/" _ ExpUnary
	| ExpProduct _ "%" _ ExpUnary
	| ExpUnary

ExpUnary ->
    "not" __ ExpPow
    | "!" _ ExpPow
	#| "#" _ ExpPow
	| "-" _ ExpPow
	| ExpPow

ExpPow ->
    Atom {% id %}
	| Atom _ "^" _ ExpPow

comparision_operators ->
    #"is greater than" {% v => assign(v[0], {type: 'comparision_operator', value: '>' }) %}
	#| "is greater or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	#| "is smaller than" {% v => assign(v[0], {type: 'comparision_operator', value: '<' }) %}
	#| "is smaller or equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	#| "is equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	#| "is not equal to" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	"is not" {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "is" {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "===" {% v => assign(v[0], {type: 'comparision_operator', value: '===' }) %}
	| "!==" {% v => assign(v[0], {type: 'comparision_operator', value: '!==' }) %}
	| "==" {% v => assign(v[0], {type: 'comparision_operator', value: '==' }) %}
	| "!=" {% v => assign(v[0], {type: 'comparision_operator', value: '!=' }) %}
	| ">=" {% v => assign(v[0], {type: 'comparision_operator', value: '>=' }) %}
	| "<=" {% v => assign(v[0], {type: 'comparision_operator', value: '<=' }) %}
	| "<" {% v => assign(v[0], {type: 'comparision_operator', value:  '<' }) %}
	| ">" {% v => assign(v[0], {type: 'comparision_operator', value:  '>' }) %}
	# | "=" {% v => "==" %}
	# | "==" {% v => "==" %}

condition -> condition __ ("and" | "or" | "&&" | "||") __ condition {% v => {
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
	| value _ comparision_operators _ value {% v => {
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
	| value {% condition.value %}

condition_as_value -> condition __ ("and" | "or") __ condition {% v => {
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
	| value _ comparision_operators _ value {% v => {
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
    | value _ "in" _ value {% v => {
		return {
			type: 'in',
			from: v[4],
			value: v[0]
		}
	} %}

statement_condition -> _ condition {% v => v[1] %}
	| _ "(" _ condition _ ")" {% v => v[3] %}
