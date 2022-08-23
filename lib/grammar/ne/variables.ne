left_assign -> Var {% id %}
    | function_call {% id %}
# value assignment
value_reassign -> left_assign _ "=" _ (value) {% v => {
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
    | value_addition {% id %}

var_assign -> assign_type var_assign_list {% vars.assign %}
    #| assign_type var_assign_list {% vars.assign %}
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
			value: [v[2][0]],
            line: v[2][0].line,
            col: v[2][0].col
		},
		offset: v[0].offset
	}
} %}

assign_type ->
#(identifier | %keyword) __ {% (v, l, reject) => {
#    if (['let', 'const', '\\'].includes(v[0][0].value)) return reject;
#    if (v[0][0].value[0].toUpperCase() != v[0][0].value[0]) {
#        return reject;
#    }
#    return v[0][0];
#} %}
#    |
    ("let" __ | "const" __ | "\\") {% v => v[0][0].value %}

var_assign_list -> var_reassign (_ "," _ var_reassign {% v => v[3] %}):* {% vars.var_assign_list %}

var_reassign -> identifier _ "=" _ value {% v => {
	return {
		type: 'var_reassign',
		identifier: v[0],
		line: v[0].line,
		col: v[0].col,
		value: v[4],
		offset: v[0].offset
	}
} %}
    | identifier {% v => ({
        type: 'identifier',
        value: v[0],
        line: v[0].line,
        col: v[0].col,
    }) %}
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

value_addition ->
    prefixExp _nbsp ("+" "=" | "-" "=" | "*" "=" | "/" "=") _ sum {% (v, l, reject) => {
        if (v[0].type == 'string' || v[0].type == 'number' || v[0].type == 'boolean' || v[0].type == 'null') {
            throw new Error(`Unexpected assignment at line ${v[2][0].line}, col ${v[2][0].col}`)
        }
        // console.log(v[4])
        return ({
            type: 'expression_short_equation',
            value: [v[0], assign(v[2][0], {value: v[2][0].value}), v[4]]
        })
    } %}