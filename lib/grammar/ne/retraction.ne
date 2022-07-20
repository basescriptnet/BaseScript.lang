Var -> identifier {% id %}
    # ! needs more tests, though works
	| prefixExp _nbsp "[" _ "]" {% v => ({
        type: 'item_retraction_last',
        //arguments: v[7] ? v[7][1] : null,
        from: v[0],
        //value: v[4]
        //identifier: v[0].value
	}) %}
	| prefixExp _nbsp "[" _ value _ "]" {% v => ({
        type: 'item_retraction',
        //arguments: v[7] ? v[7][1] : null,
        from: v[0],
        value: v[4]
        //identifier: v[0].value
	}) %}
	| prefixExp _ "." _ identifier {% v => ({
        type: 'dot_retraction_v2',
        from: v[0],
        value: v[4],
    }) %}

# ! removed all for now, code above already replaces this
#object_retraction -> single_retraction (_ "." _ right_side_retraction {% v => v[3] %}):+ {% v => ({
#	type: 'dot_retraction',
#	from: v[0],
#	value: v[1],
#	//value: v[0].value + '.' + v[4].value
#}) %}
## 	| object_retraction (_ ".." _ value {% v => v[3] %}):+ {% v => ({
## 	type: 'double_dot_retraction',
## 	from: v[0],
## 	value: v[1],
## 	//value: v[0].value + '.' + v[4].value
## }) %}

## _object_retraction ->  object_retraction {% id %}
#	# | single_retraction {% id %}

#single_retraction -> left_side_retraction _ "." _ right_side_retraction {% v => ({
#	type: 'dot_retraction',
#	from: v[0],
#	value: v[4],
#	//value: v[0].value + '.' + v[4].value
#}) %}
## 	| left_side_retraction _ ".." _ right_side_retraction {% v => ({
## 		type: 'double_dot_retraction',
## 		from: v[0],
## 		value: v[4],
## 		//value: v[0].value + '.' + v[4].value
## 	})
## %}
#	| left_side_retraction {% id %}

#right_side_retraction -> %keyword {% id %}
#	| function_call {% id %}
#	| identifier {% id %}

#left_side_retraction -> function_call {% id %}
#	| "(" _ array_interactions _ ")" {% v => v[2] %}
#	| "(" _ convert _ ")" {% v => v[2] %}
#	| value _ "[" _ "]" (_ arguments):? {% v => {
#		return {
#			type: 'item_retraction_last',
#			arguments: v[5] ? v[5][1] : null,
#			from: v[0],
#			value: null
#			//identifier: v[0].value
#		}
#	} %}
#	| value _ "[" _ value _ "]" (_ arguments):? {% v => {
#		return {
#			type: 'item_retraction',
#			arguments: v[7] ? v[7][1] : null,
#			from: v[0],
#			value: v[4]
#			//identifier: v[0].value
#		}
#	} %}
#	| object {% id %}
#	| array {% id %}
#	| identifier {% id %}
#	| string {% id %}
#	| bigInt {% id %}
#	| number {% id %}
#	| "this" {% id %}
#	| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
#	| html {% id %}
#	| boolean {% id %}
#    | regexp {% id %}
