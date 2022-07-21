# value assignment
value_reassign -> prefixExp _ "=" _ (value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4][0],
		offset: v[0].offset
	}
} %}
	| "SET" _ value _ "TO" _ (switch | value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[2],
		line: v[0].line,
		col: v[0].col,
		value: v[6][0],
		offset: v[0].offset
	}
} %}

var_assign -> ("let" __ | "const" __ | "\\") var_assign_list {% vars.assign %}
	| "ASSIGN" _ (switch | value) _ "TO" _  identifier {% v => {
	return {
		type: 'var_assign',
		use_let: true,
		identifier: v[6],
		line: v[0].line,
		col: v[0].col,
		value: {
			type: 'var_assign_group',
			identifier: v[6],
			value: [v[2][0]]
		},
		offset: v[0].offset
	}
} %}

var_assign_list -> var_reassign (_ "," _ var_reassign):* {% vars.var_assign_list %}

var_reassign -> nameList _ "=" _ (value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4][0],
		offset: v[0].offset
	}
} %}
    | nameList {% v => {
        return {
            type: 'var_reassign',
            identifier: v[0],
            line: v[0].line,
            col: v[0].col,
            //value: v[0][0],
            offset: v[0].offset
        }
    } %}
	| "SET" _ identifier _ "TO" _ (switch | value) {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4][0],
		offset: v[0].offset
	}
} %}
