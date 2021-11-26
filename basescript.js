// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	console.clear();
	const lexer = require('./lexer');


	const global = {};
	const assign = Object.assign.bind(Object);
	Object.join = function (obj) {
		return {...this, ...obj};
	}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "process", "symbols": ["statements"], "postprocess": id},
    {"name": "statements$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements", "symbols": ["statements$ebnf$1", "_"], "postprocess": v => v[0].map(i => i[1])},
    {"name": "statement", "symbols": ["var_assign", "_", {"literal":";"}], "postprocess": id},
    {"name": "statement", "symbols": ["function_declaration"], "postprocess": id},
    {"name": "statement", "symbols": ["if_block"], "postprocess": id},
    {"name": "statement", "symbols": ["while_block"], "postprocess": id},
    {"name": "statement", "symbols": ["sleep", "_", {"literal":";"}], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":";"}], "postprocess": id},
    {"name": "statement$subexpression$1", "symbols": ["value_reassign"]},
    {"name": "statement$subexpression$1", "symbols": ["value"]},
    {"name": "statement", "symbols": ["statement$subexpression$1", "_", {"literal":";"}], "postprocess":  v => ({
        	type: 'statement_value',
        	value: v[0][0],
        	line: v[0][0].line,
        	col: v[0][0].col,
        	lineBreak: v[0][0].lineBreak,
        	offset: v[0][0].offset,
        }) },
    {"name": "statement", "symbols": [{"literal":"debugger"}, "_", {"literal":";"}], "postprocess": v => Object.assign(v[0], {type: 'debugger'})},
    {"name": "sleep", "symbols": [{"literal":"sleep"}, "_", {"literal":"("}, "_", "number", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'sleep',
        	value: v[4],
        	offset: v[0].offset,
        	line: v[0].line,
        	col: v[0].col
        }) },
    {"name": "switch$ebnf$1", "symbols": []},
    {"name": "switch$ebnf$1$subexpression$1", "symbols": ["_", "case_single_valued"]},
    {"name": "switch$ebnf$1", "symbols": ["switch$ebnf$1", "switch$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "switch", "symbols": [{"literal":"switch*"}, "_", "value", "_", {"literal":"{"}, "switch$ebnf$1", "_", {"literal":"}"}], "postprocess":  v => Object.assign(v[0], {
        	type: 'switch*',
        	value: v[2],
        	cases: v[5] ? v[5].map(i => i[1]) : []
        }) },
    {"name": "statements_block", "symbols": ["_", {"literal":"{"}, "statements", {"literal":"}"}], "postprocess": v => v[2]},
    {"name": "statements_block", "symbols": ["_", {"literal":":"}, "_", "statement"], "postprocess": v => [v[3]]},
    {"name": "while_block", "symbols": [{"literal":"while"}, "statement_condition", "statements_block"], "postprocess":   v => {
        	return Object.assign(v[0], {
        		type: 'while',
        		condition: v[1],
        		value: v[2],
        	});
        } },
    {"name": "if_block", "symbols": [{"literal":"if"}, "statement_condition", "statements_block"], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'if',
        		condition: v[1],
        		value: v[2],
        	});
        } },
    {"name": "if_block", "symbols": ["if_block", "_", "else_block"], "postprocess":  v => {
        	return {
        		type: 'if_else',
        		if: v[0],
        		//elifs: v[1] ? v[1].map(i => i[1]) : null,
        		else: v[2],
        		offset: v[0].offset,
        		lineBreaks: v[0].lineBreaks,
        		line: v[0].line,
        		col: v[0].col
        	}
        } },
    {"name": "else_block", "symbols": [{"literal":"else"}, "__", "statement"], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'else',
        		value: [v[2]],
        	});
        } },
    {"name": "else_block", "symbols": [{"literal":"else"}, "_", {"literal":"{"}, "statements", {"literal":"}"}], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'else',
        		value: v[2],
        	});
        } },
    {"name": "condition$subexpression$1", "symbols": [{"literal":"and"}]},
    {"name": "condition$subexpression$1", "symbols": [{"literal":"or"}]},
    {"name": "condition", "symbols": ["condition", "__", "condition$subexpression$1", "__", "condition"], "postprocess":  v => {
        	return {
        		type: 'condition_group',
        		value: [v[0], v[4]],
        		separator: ' ' + v[2][0] + ' ',
        		line: v[0].line,
        		lineBreaks: v[0].lineBreaks,
        		offset: v[0].offset,
        		col: v[0].col,
        	}
        } },
    {"name": "condition", "symbols": ["value", "__", {"literal":"is greater than"}, "__", "value"]},
    {"name": "condition", "symbols": ["value"], "postprocess": id},
    {"name": "statement_condition", "symbols": ["__", "condition"], "postprocess": v => v[1]},
    {"name": "statement_condition", "symbols": ["_", {"literal":"("}, "_", "condition", "_", {"literal":")"}], "postprocess": v => v[2]},
    {"name": "value_reassign$subexpression$1", "symbols": ["switch"]},
    {"name": "value_reassign$subexpression$1", "symbols": ["value"]},
    {"name": "value_reassign", "symbols": ["value", "_", {"literal":"="}, "_", "value_reassign$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_assign$ebnf$1$subexpression$1", "symbols": [{"literal":"let"}, "__"]},
    {"name": "var_assign$ebnf$1", "symbols": ["var_assign$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "var_assign$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "var_assign", "symbols": ["var_assign$ebnf$1", "var_assign_list"], "postprocess":  v => {
        	let f = v[0] ? v[0][0] : v[1];
        	return {
        		type: 'var_assign',
        		use_let: v[0] ? true : false,
        		line: f.line,
        		col: f.col,
        		value: v[1],
        		offset: f.offset
        	}
        } },
    {"name": "var_assign_list$ebnf$1", "symbols": []},
    {"name": "var_assign_list$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "var_reassign"]},
    {"name": "var_assign_list$ebnf$1", "symbols": ["var_assign_list$ebnf$1", "var_assign_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "var_assign_list", "symbols": ["var_reassign", "var_assign_list$ebnf$1"], "postprocess":  v => {
        	v[1] = v[1].map(i => Object.assign(i[3], {type: 'var_reassign'}));
        	return {
        		type: 'var_assign_group',
        		line: v[0].line,
        		col: v[0].col,
        		value: v[1] ? [v[0], ...v[1]] : [v[0]],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_reassign$subexpression$1", "symbols": ["switch"]},
    {"name": "var_reassign$subexpression$1", "symbols": ["value"]},
    {"name": "var_reassign", "symbols": ["identifier", "_", {"literal":"="}, "_", "var_reassign$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4][0],
        		offset: v[0].offset
        	}
        } },
    {"name": "expression", "symbols": ["expression", "_", /[+-/*]/, "_", "expression"], "postprocess":  v => ({
        	type: 'expression',
        	value: [v[0], v[2], v[4]]
        }) },
    {"name": "expression", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess":  v => assign(v[2], {
        	type: 'expression_with_parenthesis'
        }) },
    {"name": "expression", "symbols": ["identifier"], "postprocess": id},
    {"name": "expression", "symbols": ["string"], "postprocess": id},
    {"name": "expression", "symbols": ["array"], "postprocess": id},
    {"name": "expression", "symbols": ["number"], "postprocess": id},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": v => v[0]},
    {"name": "dot_retraction", "symbols": ["dot_retraction", "_", {"literal":"."}, "_", "dot_retraction"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		from: v[0],
        		value: v[4],
        		line: v[0].line,
        		col: v[0].col,
        		lineBreaks: v[0].lineBreaks,
        		offset: v[0].offset,
        	}
        } },
    {"name": "dot_retraction$subexpression$1", "symbols": ["function_call"]},
    {"name": "dot_retraction$subexpression$1", "symbols": ["identifier"]},
    {"name": "dot_retraction$subexpression$1", "symbols": ["value"]},
    {"name": "dot_retraction$subexpression$2", "symbols": ["function_call"]},
    {"name": "dot_retraction$subexpression$2", "symbols": ["identifier"]},
    {"name": "dot_retraction$subexpression$2", "symbols": ["value"]},
    {"name": "dot_retraction", "symbols": ["dot_retraction$subexpression$1", "_", {"literal":"."}, "_", "dot_retraction$subexpression$2"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		from: v[0][0],
        		value: v[4][0],
        		line: v[0][0].line,
        		col: v[0][0].col,
        		lineBreaks: v[0][0].lineBreaks,
        		offset: v[0][0].offset,
        	}
        } },
    {"name": "object_retraction", "symbols": ["dot_retraction"], "postprocess": id},
    {"name": "object_retraction$subexpression$1", "symbols": ["dot_retraction"]},
    {"name": "object_retraction$subexpression$1", "symbols": ["function_call"]},
    {"name": "object_retraction$subexpression$1", "symbols": ["identifier"]},
    {"name": "object_retraction$subexpression$1", "symbols": ["value"]},
    {"name": "object_retraction$subexpression$2", "symbols": ["dot_retraction"]},
    {"name": "object_retraction$subexpression$2", "symbols": ["function_call"]},
    {"name": "object_retraction$subexpression$2", "symbols": ["identifier"]},
    {"name": "object_retraction$subexpression$2", "symbols": ["value"]},
    {"name": "object_retraction", "symbols": ["object_retraction$subexpression$1", "_", {"literal":"of"}, "_", "object_retraction$subexpression$2"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		from: v[4][0],
        		value: v[0][0],
        		line: v[0][0].line,
        		col: v[0][0].col,
        		lineBreaks: v[0][0].lineBreaks,
        		offset: v[0][0].offset,
        	}
        } },
    {"name": "object_retraction_$subexpression$1", "symbols": ["object_retraction"]},
    {"name": "object_retraction_$subexpression$1", "symbols": ["function_call"]},
    {"name": "object_retraction_$subexpression$1", "symbols": ["identifier"]},
    {"name": "object_retraction_$subexpression$1", "symbols": ["value"]},
    {"name": "object_retraction_$subexpression$2", "symbols": ["object_retraction"]},
    {"name": "object_retraction_$subexpression$2", "symbols": ["function_call"]},
    {"name": "object_retraction_$subexpression$2", "symbols": ["identifier"]},
    {"name": "object_retraction_$subexpression$2", "symbols": ["value"]},
    {"name": "object_retraction_", "symbols": ["object_retraction_$subexpression$1", "_", {"literal":"."}, "_", "object_retraction_$subexpression$2"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		value: v[4][0],
        		from: v[0][0],
        		line: v[0][0].line,
        		col: v[0][0].col,
        		lineBreaks: v[0][0].lineBreaks,
        		offset: v[0][0].offset,
        	}
        } },
    {"name": "object_retraction_$subexpression$3", "symbols": ["object_retraction"]},
    {"name": "object_retraction_$subexpression$3", "symbols": ["function_call"]},
    {"name": "object_retraction_$subexpression$3", "symbols": ["identifier"]},
    {"name": "object_retraction_$subexpression$3", "symbols": ["value"]},
    {"name": "object_retraction_$subexpression$4", "symbols": ["object_retraction"]},
    {"name": "object_retraction_$subexpression$4", "symbols": ["function_call"]},
    {"name": "object_retraction_$subexpression$4", "symbols": ["identifier"]},
    {"name": "object_retraction_$subexpression$4", "symbols": ["value"]},
    {"name": "object_retraction_", "symbols": ["object_retraction_$subexpression$3", "_", {"literal":"of"}, "_", "object_retraction_$subexpression$4"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		value: v[0][0],
        		from: v[4][0],
        		line: v[0][0].line,
        		col: v[0][0].col,
        		lineBreaks: v[0][0].lineBreaks,
        		offset: v[0][0].offset,
        	}
        } },
    {"name": "value", "symbols": ["object_retraction"], "postprocess": id},
    {"name": "value", "symbols": [{"literal":"new"}, "__", "value"], "postprocess":  v => {
        	return assign(v[0], {
        		type: 'new',
        		value: v[2]
        	})
        } },
    {"name": "value", "symbols": ["expression"], "postprocess": id},
    {"name": "value", "symbols": [{"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess": id},
    {"name": "value", "symbols": ["boolean"], "postprocess": id},
    {"name": "value", "symbols": ["myNull"], "postprocess": id},
    {"name": "value", "symbols": ["function_call"], "postprocess": id},
    {"name": "case_single_valued$ebnf$1$subexpression$1", "symbols": ["value", "_", {"literal":";"}]},
    {"name": "case_single_valued$ebnf$1", "symbols": ["case_single_valued$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "case_single_valued$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_single_valued", "symbols": [{"literal":"|"}, "_", "value", "_", {"literal":":"}, "_", "case_single_valued$ebnf$1"], "postprocess":  v => Object.assign(v[0], {
        	type: 'case_with_break',
        	value: v[2],
        	statements: v[6] ? v[6][0] : []
        }) },
    {"name": "case_single_valued", "symbols": [{"literal":"&"}, "_", "value", "_", {"literal":":"}, "_"], "postprocess":  v => Object.assign(v[0], {
        	type: 'case',
        	value: v[2],
        	statements: v[6] ? v[6][0] : []
        }) },
    {"name": "case_single_valued$ebnf$2$subexpression$1", "symbols": ["value", "_", {"literal":";"}]},
    {"name": "case_single_valued$ebnf$2", "symbols": ["case_single_valued$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case_single_valued$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_single_valued", "symbols": [{"literal":"default"}, "_", {"literal":":"}, "_", "case_single_valued$ebnf$2"], "postprocess":  v => Object.assign(v[0], {
        	type: 'case_default',
        	value: v[4] ? v[4][0] : [null],
        }) },
    {"name": "array$ebnf$1", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "array$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array", "symbols": ["array", "_", {"literal":"["}, "_", "number", "_", {"literal":":"}, "array$ebnf$1", "_", "number", "_", {"literal":"]"}], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'array_slice',
        		start: v[4],
        		end: v[9],
        		reversed: v[7] ? true : false
        	});
        } },
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess":  v => {
        	v[0].value = []
        	v[0].type = 'array'
        	delete v[0].text;
        	return v[0]
        } },
    {"name": "array$ebnf$2", "symbols": []},
    {"name": "array$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$2", "symbols": ["array$ebnf$2", "array$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array$ebnf$3$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "array$ebnf$3", "symbols": ["array$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "array$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$2", "array$ebnf$3", "_", {"literal":"]"}], "postprocess":  v => {
        	let output = [v[2]];
        	for (let i in v[3]) {
        		output.push(v[3][i][3])
        	}
        	delete v[0].text
        	return Object.assign(v[0], {
        		type: 'array',
        		value: output
        	});
        } },
    {"name": "array", "symbols": [{"literal":"["}, "_", "number", {"literal":".."}, "number", "_", {"literal":"]"}], "postprocess":  v => {
        	let output = [];
        	let min = Math.min(v[2], v[4]);
        	let max = Math.max(v[2], v[4]);
        	for (let i = min; i <= max; i++) {
        		output.push({
        			type: 'number',
        			value: i
        		});
        	}
        	if (v[2] != min) 
        		output = output.reverse()
        	return Object.assign(v[0], {
        		type: 'array',
        		value: output
        	});
        } },
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"string"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"int"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"float"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"array"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"object"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"symbol"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"null"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"number"}]},
    {"name": "function_declaration$ebnf$1", "symbols": []},
    {"name": "function_declaration$ebnf$1$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "function_declaration$ebnf$1$subexpression$1", "symbols": ["_", "return"]},
    {"name": "function_declaration$ebnf$1", "symbols": ["function_declaration$ebnf$1", "function_declaration$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "function_declaration", "symbols": ["function_declaration$subexpression$1", "__", "identifier", "_", "arguments_with_types", "_", {"literal":"{"}, "function_declaration$ebnf$1", "_", {"literal":"}"}], "postprocess":  v => {
        	// console.log(v[0][0].value)
        	return assign(v[0][0], {
        		type: 'function_declaration',
        		identifier: v[2],
        		arguments: v[4],
        		value: v[7] ? v[7].map(i => i[1]) : [],
        		// text is one of the options above
        	})
        } },
    {"name": "return", "symbols": [{"literal":"return"}, "__", "value", "_", {"literal":";"}], "postprocess":  v => {
        	return assign(v[0], {
        		type: 'return',
        		value: v[2]
        	})
        } },
    {"name": "return", "symbols": [{"literal":"return"}, "_", {"literal":";"}], "postprocess":  v => {
        	return assign(v[0], {
        		type: 'return',
        		value: undefined
        	})
        } },
    {"name": "function_call", "symbols": ["identifier", "_", "arguments"], "postprocess":  v => {
        return Object.assign(v[0], {
        	type: 'function_call',
        	arguments: v[2]
        })
        	/*if (v[0] in functions) {
        		return functions[v[0]](...v[2])
        	} else {
        		throw new Error('Function does not exist')
        	}*/
        } },
    {"name": "arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess":  v => Object.assign(v[0], {
        	type: 'arguments',
        	value: []
        }) },
    {"name": "arguments$ebnf$1", "symbols": []},
    {"name": "arguments$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "arguments$ebnf$1", "symbols": ["arguments$ebnf$1", "arguments$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments$ebnf$2", "symbols": ["arguments$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "arguments$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments", "symbols": [{"literal":"("}, "_", "value", "arguments$ebnf$1", "arguments$ebnf$2", "_", {"literal":")"}], "postprocess":  v => {
        	let output = [v[2]];
        	for (let i in v[3]) {
        		output.push(v[3][i][3])
        	}
        	delete v[0].text
        	return Object.assign(v[0], {
        		type: 'arguments',
        		value: output
        	});
        } },
    {"name": "arguments_with_types", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess":  v => Object.assign(v[0], {
        	type: 'arguments_with_types',
        	value: []
        }) },
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"string"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"int"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"float"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"array"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"object"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"symbol"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"null"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"number"}]},
    {"name": "arguments_with_types$ebnf$1$subexpression$1", "symbols": ["arguments_with_types$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "arguments_with_types$ebnf$1", "symbols": ["arguments_with_types$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "arguments_with_types$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments_with_types$ebnf$2", "symbols": []},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"string"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"int"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"float"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"array"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"object"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"symbol"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"null"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"number"}]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1", "symbols": ["arguments_with_types$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "arguments_with_types$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments_with_types$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}, "_", "arguments_with_types$ebnf$2$subexpression$1$ebnf$1", "value"]},
    {"name": "arguments_with_types$ebnf$2", "symbols": ["arguments_with_types$ebnf$2", "arguments_with_types$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments_with_types$ebnf$3$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "arguments_with_types$ebnf$3", "symbols": ["arguments_with_types$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "arguments_with_types$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments_with_types", "symbols": [{"literal":"("}, "_", "arguments_with_types$ebnf$1", "value", "arguments_with_types$ebnf$2", "arguments_with_types$ebnf$3", "_", {"literal":")"}], "postprocess":  v => {
        	let output = [v[3]];
        	let types = [v[2] ? v[2][0][0].value : 'none'];
        	for (let i in v[4]) {
        		output.push(v[4][i][4]);
        		types.push(v[4][i][3] ? v[4][i][3][0][0].value : 'none');
        	}
        	delete v[0].text
        	return Object.assign(v[0], {
        		type: 'arguments_with_types',
        		value: output,
        		types: types
        	});
        } },
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess":  v => {
        	return Object.assign(v[0], {
        		value: v[0].value
        	})
        	//v[0].value
        } },
    {"name": "string$ebnf$1", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "string", "symbols": ["string", "_", {"literal":"["}, "_", "number", "_", {"literal":":"}, "string$ebnf$1", "_", "number", "_", {"literal":"]"}], "postprocess":  v => {
        	return Object.assign(v[0], {
        		type: 'string_slice',
        		start: v[4],
        		end: v[9],
        		reversed: v[7] ? true : false
        	});
        } },
    {"name": "string", "symbols": ["string_concat"], "postprocess": id},
    {"name": "string_concat", "symbols": ["string_concat", "__", (lexer.has("string") ? {type: "string"} : string)], "postprocess":  v => {
        	return Object.assign(v[0], {
        	value: v[0].value + v[2].value
        })} },
    {"name": "string_concat", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "boolean", "symbols": [{"literal":"true"}], "postprocess": v => true},
    {"name": "boolean", "symbols": [{"literal":"false"}], "postprocess": v => false},
    {"name": "myNull", "symbols": [{"literal":"null"}], "postprocess":  v => Object.assign(v[0], {
        	type: 'null',
        	value: null
        }) },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("space") ? {type: "space"} : space), (lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "_$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": v => ''},
    {"name": "_", "symbols": [], "postprocess": v => ''},
    {"name": "__$ebnf$1", "symbols": []},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("space") ? {type: "space"} : space), (lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "__$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1", (lexer.has("space") ? {type: "space"} : space)], "postprocess": v => ' '}
]
  , ParserStart: "process"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
