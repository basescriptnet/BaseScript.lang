// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	console.clear();
	const lexer = require('./lexer');


	function extractObject (v) {
		let output = {};
		extractPair(v[2], output);
		for (let i in v[3]) {
			extractPair(v[3][i][3], output);
		}
		return output;
	}
	function extractPair (kv, output) {
		if (kv[0]) {
			output[kv[0]] = kv[1];
		} else {
			// if it is es6 method declaration
			//debugger
			//let key = kv.text;
			//kv.text = 'function';
			output[kv.text] = kv;
		}
	}
	const global = {};
	const assign = Object.assign.bind(Object);
	Object.join = function (obj) {
		return {...this, ...obj};
	}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "process", "symbols": ["statements"], "postprocess": v => v[0]},
    {"name": "statements$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "statement"], "postprocess": v => v[1]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements", "symbols": ["statements$ebnf$1", "_"], "postprocess": v => v[0]},
    {"name": "statement", "symbols": ["var_assign", "_", {"literal":";"}], "postprocess": id},
    {"name": "statement", "symbols": ["function_declaration"], "postprocess": id},
    {"name": "statement", "symbols": ["with"], "postprocess": id},
    {"name": "statement", "symbols": ["if_block"], "postprocess": id},
    {"name": "statement", "symbols": ["while_block"], "postprocess": id},
    {"name": "statement", "symbols": ["for_block"], "postprocess": id},
    {"name": "statement", "symbols": ["try_catch_finally"], "postprocess": id},
    {"name": "statement", "symbols": ["value_reassign", "_", {"literal":";"}], "postprocess":  v => ({
        	type: 'statement_value',
        	value: v[0],
        	line: v[0].line,
        	col: v[0].col,
        	lineBreak: v[0].lineBreak,
        	offset: v[0].offset,
        }) },
    {"name": "statement", "symbols": [{"literal":"debugger"}, "_", {"literal":";"}], "postprocess": v => Object.assign(v[0], {type: 'debugger'})},
    {"name": "statement", "symbols": ["return"], "postprocess": id},
    {"name": "statement", "symbols": [{"literal":"throw"}, "__", "value", "_", {"literal":";"}], "postprocess":  v => assign(v[0], {
        	type: 'throw',
        	value: v[2]
        }) },
    {"name": "statement$subexpression$1", "symbols": [{"literal":"break"}]},
    {"name": "statement$subexpression$1", "symbols": [{"literal":"continue"}]},
    {"name": "statement", "symbols": ["statement$subexpression$1", "_", {"literal":";"}], "postprocess":  v => assign(v[0][0], {
        	type: 'break_continue',
        }) },
    {"name": "statement", "symbols": [{"literal":"echo"}, "__", "value", "_", {"literal":";"}], "postprocess":  v => assign(v[0], {
        	type: 'echo',
        	value: v[2]
        }) },
    {"name": "statement", "symbols": [(lexer.has("eval") ? {type: "eval"} : eval), "__", "value", "_", {"literal":";"}], "postprocess":  v => assign(v[0], {
        	type: 'eval',
        	value: v[2]
        }) },
    {"name": "statement", "symbols": ["value", "_", {"literal":";"}], "postprocess":  v => ({
        	type: 'statement_value',
        	value: v[0],
        	line: v[0].line,
        	col: v[0].col,
        	lineBreak: v[0].lineBreak,
        	offset: v[0].offset,
        }) },
    {"name": "statement", "symbols": [{"literal":";"}], "postprocess": id},
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
    {"name": "try_catch_finally$ebnf$1$subexpression$1", "symbols": ["_", "finally"]},
    {"name": "try_catch_finally$ebnf$1", "symbols": ["try_catch_finally$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "try_catch_finally$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "try_catch_finally", "symbols": ["try_catch", "try_catch_finally$ebnf$1"], "postprocess":  v => ({
        	type: 'try_catch_finally',
        	value: v[0],
        	finally: v[1] ? v[1][1] : null
        }) },
    {"name": "try_catch$ebnf$1$subexpression$1", "symbols": ["_", "catch"]},
    {"name": "try_catch$ebnf$1", "symbols": ["try_catch$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "try_catch$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "try_catch", "symbols": ["try", "try_catch$ebnf$1"], "postprocess":  v => ({
        	type: 'try_catch',
        	value: v[0],
        	catch: v[1] ? v[1][1] : null
        }) },
    {"name": "try_catch", "symbols": ["try"], "postprocess":  v => ({
        	type: 'try_catch',
        	value: v[0],
        	catch: v[1] ? v[1][1] : null
        }) },
    {"name": "try", "symbols": [{"literal":"try"}, "__", "statements_block"], "postprocess":  v => ({
        	type: 'try',
        	value: v[2]
        }) },
    {"name": "try", "symbols": [{"literal":"try"}, "_", {"literal":":"}, "_", "statement"], "postprocess":  v => ({
        	type: 'try',
        	value: v[4]
        }) },
    {"name": "catch", "symbols": [{"literal":"catch"}, "__", "identifier", "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[3],
        		identifier: v[2].value,
        
        	}
        } },
    {"name": "catch", "symbols": [{"literal":"catch"}, "statements_block"], "postprocess":  v => {
        	return {
        		type: 'catch',
        		value: v[1],
        		identifier: 'err',
        	}
        } },
    {"name": "finally", "symbols": [{"literal":"finally"}, "statements_block"], "postprocess":  v => {
        	//debugger
        	return ({
        		type: 'finally',
        		value: v[1],
        	})
        } },
    {"name": "with", "symbols": [{"literal":"with"}, "__", "value", "statements_block"], "postprocess":  v => assign(v[0], {
        	type: 'with',
        	obj: v[2],
        	value: v[3]
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
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"in"}]},
    {"name": "for_block$subexpression$1", "symbols": [{"literal":"of"}]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "identifier", "__", "for_block$subexpression$1", "__", "value", "statements_block"], "postprocess":   v => {
        	return Object.assign(v[0], {
        		type: 'for_' + v[4][0],
        		condition: v[1],
        		identifier: v[2],
        		iterable: v[6],
        		value: v[7],
        	});
        } },
    {"name": "for_block$subexpression$2", "symbols": ["var_assign"]},
    {"name": "for_block$subexpression$2", "symbols": ["var_assign_list"]},
    {"name": "for_block", "symbols": [{"literal":"for"}, "__", "for_block$subexpression$2", "_", {"literal":";"}, "_", "statement_condition", "_", {"literal":";"}, "_", "value_reassign", "statements_block"], "postprocess":   v => {
        	return Object.assign(v[0], {
        		type: 'for_loop',
        		condition: v[6],
        		identifier: v[2][0],
        		change: v[10],
        		value: v[11],
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
    {"name": "condition", "symbols": ["value", "_", "comparision_operators", "_", "value"], "postprocess":  v => {
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
        } },
    {"name": "condition", "symbols": ["value"], "postprocess":  v => ({
        	type: 'condition',
        	value: v[0],
        	line: v[0].line,
        	lineBreaks: v[0].lineBreaks,
        	offset: v[0].offset,
        	col: v[0].col,
        }) },
    {"name": "comparision_operators", "symbols": [{"literal":"is greater than"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is greater or equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is smaller than"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is smaller or equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is not equal to"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is not"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"is"}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '===' })},
    {"name": "comparision_operators", "symbols": [{"literal":"=="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '==' })},
    {"name": "comparision_operators", "symbols": [{"literal":"!="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"==="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '===' })},
    {"name": "comparision_operators", "symbols": [{"literal":"!=="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '!==' })},
    {"name": "comparision_operators", "symbols": [{"literal":">="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '>=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"<="}], "postprocess": v => assign(v[0], {type: 'comparision_operator', value: '<=' })},
    {"name": "comparision_operators", "symbols": [{"literal":"<"}], "postprocess": v =>assign(v[0], {type: 'comparision_operator', value:  '<' })},
    {"name": "comparision_operators", "symbols": [{"literal":">"}], "postprocess": v =>assign(v[0], {type: 'comparision_operator', value:  '>' })},
    {"name": "statement_condition", "symbols": ["__", "condition"], "postprocess": v => v[1]},
    {"name": "statement_condition", "symbols": ["_", {"literal":"("}, "_", "condition", "_", {"literal":")"}], "postprocess": v => v[3]},
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
    {"name": "var_assign$ebnf$1$subexpression$1", "symbols": [{"literal":"const"}, "__"]},
    {"name": "var_assign$ebnf$1$subexpression$1", "symbols": [{"literal":"\\"}]},
    {"name": "var_assign$ebnf$1", "symbols": ["var_assign$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "var_assign$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "var_assign", "symbols": ["var_assign$ebnf$1", "var_assign_list"], "postprocess":  v => {
        	let f = v[0] ? v[0][0] : v[1];
        	return {
        		type: 'var_assign',
        		use_let: v[0] && (v[0][0].value == 'let' || v[0][0].value == '\\') ? true : false,
        		use_const: v[0] && v[0][0].value == 'const' ? true : false,
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
    {"name": "expression", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'expression_with_parenthesis',
        	value: v[2]
        }) },
    {"name": "expression", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}, "_", "arguments_with_types"], "postprocess":  v => ({
        	type: 'expression_with_parenthesis',
        	value: v[2],
        	arguments: v[6]
        }) },
    {"name": "expression$subexpression$1", "symbols": [{"literal":"**"}]},
    {"name": "expression$subexpression$1", "symbols": [/[.+-/*%]/]},
    {"name": "expression", "symbols": ["expression", "_", "expression$subexpression$1", "_", "expression"], "postprocess":  v => ({
        	type: 'expression',
        	value: [v[0], v[2][0], v[4]]
        }) },
    {"name": "expression", "symbols": ["regexp"], "postprocess": id},
    {"name": "expression", "symbols": ["annonymous_function"], "postprocess": id},
    {"name": "expression", "symbols": ["function_call"], "postprocess": id},
    {"name": "expression", "symbols": ["identifier"], "postprocess": id},
    {"name": "expression", "symbols": ["array"], "postprocess": id},
    {"name": "expression", "symbols": ["string"], "postprocess": id},
    {"name": "expression", "symbols": ["number"], "postprocess": id},
    {"name": "expression", "symbols": [{"literal":"this"}], "postprocess": id},
    {"name": "expression", "symbols": ["html"], "postprocess": id},
    {"name": "expression", "symbols": ["object"], "postprocess": id},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": v => v[0]},
    {"name": "regexp$ebnf$1", "symbols": []},
    {"name": "regexp$ebnf$1$subexpression$1", "symbols": ["regexp_flags"]},
    {"name": "regexp$ebnf$1", "symbols": ["regexp$ebnf$1", "regexp$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "regexp", "symbols": [(lexer.has("regexp") ? {type: "regexp"} : regexp), "regexp$ebnf$1"], "postprocess":  v => assign(v[0], {
        	value: v[0] + (v[1] ? v[1].join('') : '')
        }) },
    {"name": "regexp_flags", "symbols": [/[gmi]/], "postprocess": v => v[0].value},
    {"name": "dot_retraction$subexpression$1", "symbols": ["function_call"]},
    {"name": "dot_retraction$subexpression$1", "symbols": ["identifier"]},
    {"name": "dot_retraction$subexpression$1", "symbols": ["value"]},
    {"name": "dot_retraction", "symbols": ["dot_retraction", "_", {"literal":"."}, "_", "dot_retraction$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		from: v[0],
        		value: v[4][0],
        		line: v[0].line,
        		col: v[0].col,
        		lineBreaks: v[0].lineBreaks,
        		offset: v[0].offset,
        	}
        } },
    {"name": "dot_retraction$subexpression$2", "symbols": ["function_call"]},
    {"name": "dot_retraction$subexpression$2", "symbols": ["identifier"]},
    {"name": "dot_retraction$subexpression$2", "symbols": [{"literal":"this"}]},
    {"name": "dot_retraction", "symbols": ["dot_retraction$subexpression$2"], "postprocess": v => v[0]},
    {"name": "object_retraction", "symbols": ["dot_retraction"], "postprocess": id},
    {"name": "object_retraction_$subexpression$1", "symbols": ["object_retraction"]},
    {"name": "object_retraction_$subexpression$1", "symbols": ["function_call"]},
    {"name": "object_retraction_$subexpression$1", "symbols": ["identifier"]},
    {"name": "object_retraction_$subexpression$1", "symbols": ["value"]},
    {"name": "object_retraction_$subexpression$1", "symbols": [{"literal":"this"}]},
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
    {"name": "value", "symbols": ["value", "_", {"literal":"["}, "_", "value", "_", {"literal":"]"}, "_", "arguments"], "postprocess":  v => {
        //debugger
        	return {
        		type: 'item_retraction',
        		arguments: v[8],
        		from: v[0],
        		value: v[4]
        		//identifier: v[0].value
        	}
        } },
    {"name": "value", "symbols": ["value", "_", {"literal":"["}, "_", "value", "_", {"literal":"]"}], "postprocess":  v => ({
        	type: 'item_retraction',
        	from: v[0],
        	value: v[4]
        }) },
    {"name": "value", "symbols": [{"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'expression_with_parenthesis',
        	value: v[2]
        }) },
    {"name": "value", "symbols": ["expression"], "postprocess": id},
    {"name": "value$subexpression$1", "symbols": [{"literal":"new"}]},
    {"name": "value$subexpression$1", "symbols": [{"literal":"await"}]},
    {"name": "value$subexpression$1", "symbols": [{"literal":"yield"}]},
    {"name": "value$subexpression$1", "symbols": [{"literal":"typeof"}]},
    {"name": "value", "symbols": ["value$subexpression$1", "__", "value"], "postprocess":  v => {
        	return assign(v[0][0], {
        		type: v[0][0].text,
        		value: v[2]
        	})
        } },
    {"name": "value", "symbols": ["value", "__", {"literal":"instanceof"}, "__", "value"], "postprocess":  v => ({
        	type: 'instanceof',
        	left: v[0],
        	value: v[4]
        }) },
    {"name": "value", "symbols": ["boolean"], "postprocess": id},
    {"name": "value", "symbols": ["myNull"], "postprocess": id},
    {"name": "value", "symbols": ["annonymous_function"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["identifier"], "postprocess": id},
    {"name": "prefixExp", "symbols": ["function_call"], "postprocess": id},
    {"name": "prefixExp", "symbols": [{"literal":"this"}], "postprocess": id},
    {"name": "opening_tag$ebnf$1$subexpression$1", "symbols": ["__", "attrubutes"], "postprocess": v => v[1]},
    {"name": "opening_tag$ebnf$1", "symbols": ["opening_tag$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "opening_tag$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "opening_tag", "symbols": [{"literal":"<"}, "identifier", "opening_tag$ebnf$1", "_", {"literal":">"}], "postprocess": v => [v[1], v[2] ? v[2] : []]},
    {"name": "closing_tag", "symbols": [{"literal":"<"}, {"literal":"/"}, "identifier", {"literal":">"}], "postprocess": v => v[2]},
    {"name": "html_content", "symbols": ["string"], "postprocess": id},
    {"name": "html_content", "symbols": ["html"], "postprocess": id},
    {"name": "html$ebnf$1", "symbols": []},
    {"name": "html$ebnf$1$subexpression$1", "symbols": ["_", "html_content"]},
    {"name": "html$ebnf$1", "symbols": ["html$ebnf$1", "html$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html", "symbols": ["opening_tag", "html$ebnf$1", "_", "closing_tag"], "postprocess":  v => {
        	if (!Array.isArray(v[0][0].value)) {
        		if (v[0][0].value != v[3].value) {
        			throw new Error(`Opening tag does not much the closing tag at ${v[0].line}:${v[0].col}`);
        		}
        	} else {
        		debugger
        		// add case, when attribute is not a string
        	}
        	//debugger
        
        	return assign(v[0][0], {
        		type: 'html_expression',
        		opening_tag: v[0][0].value,
        		closing_tag: v[3].value,
        		value: v[1],
        		attributes: v[0][1]
        	})
        } },
    {"name": "html$ebnf$2$subexpression$1", "symbols": [{"literal":"#"}, "identifier"]},
    {"name": "html$ebnf$2", "symbols": ["html$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "html$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "html$ebnf$3", "symbols": []},
    {"name": "html$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "identifier"]},
    {"name": "html$ebnf$3", "symbols": ["html$ebnf$3", "html$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "html", "symbols": [{"literal":"<"}, "identifier", "html$ebnf$2", "html$ebnf$3", {"literal":"/"}, {"literal":">"}], "postprocess":  v => {
        	return assign(v[0], {
        		type: 'html',
        		value: v[1],
        		id: v[2] ? v[2][1] : null,
        		classList: v[3].length ? v[3].map(i => i[1]) : null
        	})
        } },
    {"name": "html", "symbols": [{"literal":"@text"}, "__", "value"], "postprocess":  v => assign(v[0], {
        	type: 'html_text',
        	value: v[2]
        }) },
    {"name": "attrubutes$ebnf$1", "symbols": []},
    {"name": "attrubutes$ebnf$1$subexpression$1", "symbols": ["__", "var_reassign"]},
    {"name": "attrubutes$ebnf$1", "symbols": ["attrubutes$ebnf$1", "attrubutes$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attrubutes", "symbols": ["var_reassign", "attrubutes$ebnf$1"], "postprocess":  v => {
        	let output = [v[0]];
        	for (let i in v[1]) {
        		output.push(v[1][i][1])
        	}
        	// delete v[0].text
        	//debugger
        	return output;
        	/*return Object.assign(v[0], {
        		type: 'array',
        		value: output
        	});*/
        } },
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
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess":  v => {
        	v[0].value = {}
        	v[0].type = 'object'
        	delete v[0].text;
        	return v[0]
        } },
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "object$ebnf$2", "symbols": ["object$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "object$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "pair", "object$ebnf$1", "object$ebnf$2", "_", {"literal":"}"}], "postprocess":  v => {
        	let output = {};
        	extractPair(v[2], output);
        	for (let i in v[3]) {
        		extractPair(v[3][i][3], output)
        	}
        	delete v[0].text
        	return Object.assign(v[0], {
        		type: 'object',
        		value: output
        	});
        } },
    {"name": "pair$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "pair$ebnf$1", "symbols": ["pair$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "pair$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pair", "symbols": ["pair$ebnf$1", "key", "_", "arguments", "_", "statements_block"], "postprocess":  v => assign(v[1], {
        	type: 'annonymous_function',
        	arguments: v[3],
        	value: v[5],
        	async: v[0] ? true : false
        	// .text is the key
        }) },
    {"name": "pair", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": v => [v[0], v[4]]},
    {"name": "key", "symbols": ["string"], "postprocess": id},
    {"name": "key", "symbols": ["identifier"], "postprocess": id},
    {"name": "function_declaration$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "function_declaration$ebnf$1", "symbols": ["function_declaration$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function_declaration$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"string"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"int"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"float"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"array"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"object"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"symbol"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"null"}]},
    {"name": "function_declaration$subexpression$1", "symbols": [{"literal":"number"}]},
    {"name": "function_declaration$ebnf$2", "symbols": []},
    {"name": "function_declaration$ebnf$2$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "function_declaration$ebnf$2$subexpression$1", "symbols": ["_", "return"]},
    {"name": "function_declaration$ebnf$2", "symbols": ["function_declaration$ebnf$2", "function_declaration$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "function_declaration", "symbols": ["function_declaration$ebnf$1", "function_declaration$subexpression$1", "__", "identifier", "_", "arguments_with_types", "_", {"literal":"{"}, "function_declaration$ebnf$2", "_", {"literal":"}"}], "postprocess":  v => {
        	// console.log(v[0][0].value)
        	return assign(v[1][0], {
        		type: 'function_declaration',
        		identifier: v[3],
        		arguments: v[5],
        		value: v[8] ? v[8].map(i => i[1]) : [],
        		async: v[0] ? true : false
        		// text is one of the options above: string; int...
        	})
        } },
    {"name": "annonymous_function", "symbols": [{"literal":"("}, "_", "annonymous_function", "_", {"literal":")"}, "_", "arguments"], "postprocess":  v => {
        	return ({
        		type: 'iife',
        		value: v[2],
        		call_arguments: v[6],
        	})
        } },
    {"name": "annonymous_function$ebnf$1$subexpression$1", "symbols": [{"literal":"async"}, "__"]},
    {"name": "annonymous_function$ebnf$1", "symbols": ["annonymous_function$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"string"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"int"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"float"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"array"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"object"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"function"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"symbol"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"null"}]},
    {"name": "annonymous_function$subexpression$1", "symbols": [{"literal":"number"}]},
    {"name": "annonymous_function$ebnf$2$subexpression$1", "symbols": ["__", "identifier"]},
    {"name": "annonymous_function$ebnf$2", "symbols": ["annonymous_function$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "annonymous_function$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "annonymous_function$ebnf$3", "symbols": []},
    {"name": "annonymous_function$ebnf$3$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "annonymous_function$ebnf$3$subexpression$1", "symbols": ["_", "return"]},
    {"name": "annonymous_function$ebnf$3", "symbols": ["annonymous_function$ebnf$3", "annonymous_function$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "annonymous_function", "symbols": ["annonymous_function$ebnf$1", "annonymous_function$subexpression$1", "annonymous_function$ebnf$2", "_", "arguments_with_types", "_", {"literal":"{"}, "annonymous_function$ebnf$3", "_", {"literal":"}"}], "postprocess":  v => {
        	// console.log(v[0][0].value)
        	return assign(v[1][0], {
        		type: 'annonymous_function',
        		identifier: v[2] ? v[2][1] : '',
        		arguments: v[4],
        		value: v[7] ? v[7].map(i => i[1]) : [],
        		result: v[1][0].text,
        		async: v[0] ? true : false
        		// text is one of the options above: string; int...
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
        	//debugger
        	return Object.assign(v[0], {
        		type: 'function_call',
        		arguments: v[2],
        		//identifier: v[0].value
        	})
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
    {"name": "string", "symbols": ["number", {"literal":"px"}], "postprocess":  v => assign(v[0], {
        	type: 'string',
        	value: v[0].value + 'px'
        }) },
    {"name": "string_concat", "symbols": ["string_concat", "__", (lexer.has("string") ? {type: "string"} : string)], "postprocess":  v => {
        	return Object.assign(v[0], {
        	value: v[0].value + v[2].value
        })} },
    {"name": "string_concat", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "boolean", "symbols": [{"literal":"!"}, "_", "value"], "postprocess":  v => ({
        	type: 'boolean_reversed',
        	value: v[2]
        })},
    {"name": "boolean", "symbols": [{"literal":"true"}], "postprocess": v => ({type: 'boolean', value: true})},
    {"name": "boolean", "symbols": [{"literal":"false"}], "postprocess": v => ({type: 'boolean', value: false})},
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
