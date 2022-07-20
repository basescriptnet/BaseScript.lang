# loops
while_block -> "while" statement_condition statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'while',
		condition: v[1],
		value: v[2],
	});
} %}
for_block -> "for" __ identifier __ ("in" | "of") __ value statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'for_' + v[4][0],
		condition: v[1],
		identifier: v[2],
		iterable: v[6],
		value: v[7],
	});
} %}
for_block -> "for" _ "(" _ identifier __ ("in" | "of") __ value _ ")" statements_block {%  v => {
	return Object.assign(v[0], {
		type: 'for_' + v[6][0],
		//condition: v[4],
		identifier: v[4],
		iterable: v[8],
		value: v[11],
	});
} %}
	| "for" __ identifier __ "from" __ value _ ("through" | "till") _ value statements_block {%  v => {
	return assign(v[0], {
		type: 'for_loop',
		identifier: v[2],
		from: v[6],
		through: v[10],
		include: v[8][0].text == 'till' ? false : true,
		value: v[11],
	});
} %}
	| "for" _ "(" _ identifier __ "from" __ value _ ("through" | "till") _ value _ ")" statements_block {%  v => {
	return assign(v[0], {
		type: 'for_loop',
		identifier: v[4],
		from: v[8],
		through: v[12],
		include: v[10][0].text == 'till' ? false : true,
		value: v[15],
	});
} %}
# ! This doesn't work properly
# ? Throws an error on "{" sing
#	| "for" __ (var_assign | var_assign_list) _ ";" _ statement_condition _ ";" _ value_reassign statements_block {%  v => {
#	return assign(v[0], {
#		type: 'for_loop',
#		condition: v[6],
#		identifier: v[2][0],
#		change: v[10],
#		value: v[11],
#	});
#} %}
#    | "for" _ "(" _ (var_assign | var_assign_list) _ ";" _ statement_condition _ ";" _ value_reassign _ ")" statements_block {%  v => {
#	return assign(v[0], {
#		type: 'for_loop',
#		condition: v[9],
#		identifier: v[5][0],
#		change: v[13],
#		value: v[16],
#	});
#} %}
