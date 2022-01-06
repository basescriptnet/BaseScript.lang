object_retraction -> single_retraction (_ "." _ right_side_retraction {% v => v[3] %}):+ {% v => ({
	type: 'dot_retraction',
	from: v[0],
	value: v[1],
	//value: v[0].value + '.' + v[4].value
}) %}
# 	| object_retraction (_ ".." _ value {% v => v[3] %}):+ {% v => ({
# 	type: 'double_dot_retraction',
# 	from: v[0],
# 	value: v[1],
# 	//value: v[0].value + '.' + v[4].value
# }) %}

# _object_retraction ->  object_retraction {% id %}
	# | single_retraction {% id %}

single_retraction -> left_side_retraction _ "." _ right_side_retraction {% v => ({
	type: 'dot_retraction',
	from: v[0],
	value: v[4],
	//value: v[0].value + '.' + v[4].value
}) %}
# 	| left_side_retraction _ ".." _ right_side_retraction {% v => ({
# 		type: 'double_dot_retraction',
# 		from: v[0],
# 		value: v[4],
# 		//value: v[0].value + '.' + v[4].value
# 	})
# %}
	| left_side_retraction {% id %}

right_side_retraction -> %keyword {% id %}
	| function_call {% id %}
	| identifier {% id %}

left_side_retraction -> function_call {% id %}
	| "(" _ array_interactions _ ")" {% v => v[2] %}
	| "(" _ convert _ ")" {% v => v[2] %}
	| object {% id %}
	| array {% id %}
	| identifier {% id %}
	| string {% id %}
	| bigInt {% id %}
	| number {% id %}
	| "this" {% id %}
	| "THAT" {% v => ({type: 'USE', line: v[0].line, col: v[0].col}) %}
	| html {% id %}
	| boolean {% id %}
