// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	console.clear();
	const moo = require('moo');
	const lexer = moo.compile({
		keyword: ['while', 'if', 'else', 'import', 'from', 'let', 'const', 'true', 'false', 'null', 'of', 'default', 'switch', 'switch*'],
		number: /(?:\+|-)?[0-9]+(?:\.[0-9]+)?/,
		'true': 'true',
		'false': 'false',
		'null': 'null',
		space: {
			match: /\s+/, lineBreaks: true
		},
		string: [
			{
				match: /"(?:\\["nrt]|[^"\\])*"/, value: x => x.slice(1, -1)
			},
			{
				match: /'(?:\\['nrt]|[^'\\])*'/, value: x => x.slice(1, -1)
			},
			{
				match: /`(?:\\[`nrt]|[^`\\])*`/, value: x => JSON.stringify(x).slice(2, -2), lineBreaks: true
			},
		],
		multiplicative_operator: /\*|\//,
		additive_operator: /\+|-/,
		comment: /\/\/.*/,
		opening_parentesis: '(',
		closing_parentesis: ')',
		int: 'int',
		float: 'float',
		equal: '=',
		semicolon: ';',
		constant: 'const',
		//variable_name: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
		identifier: /[A-Za-z_$]+[A-Za-z0-9_$]*/,
		hex: /#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\b/,
		comment: /\/\/.*/,
		'[': '[',
		']': ']',
		'(': '(',
		')': ')',
		'{': '{',
		'}': '}',
		',': ',',
		';': ';',
		':': ':',
		'..': '..',
		'.': '.',
		'|': '|',
		'&': '&',
		'*': '*',
		function_name: /[A-Za-z]+/,
	})


	const global = {};
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "process", "symbols": ["statements"], "postprocess": v => v[0]},
    {"name": "statements$ebnf$1", "symbols": []},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements", "symbols": ["statements$ebnf$1", "_"], "postprocess": v => v[0].map(i => i[1])},
    {"name": "statement", "symbols": ["value"], "postprocess": id},
    {"name": "statement", "symbols": ["var_assign", "_", {"literal":";"}], "postprocess": id},
    {"name": "statement", "symbols": ["var_reassign", "_", {"literal":";"}], "postprocess": id},
    {"name": "statement", "symbols": ["if_block"], "postprocess": id},
    {"name": "statement", "symbols": ["while_block"], "postprocess": id},
    {"name": "statement", "symbols": ["sleep"], "postprocess": id},
    {"name": "sleep", "symbols": [{"literal":"sleep"}, "_", {"literal":"("}, "_", "number", "_", {"literal":")"}], "postprocess":  v => ({
        	type: 'sleep',
        	value: v[4],
        	offset: v[0].offset,
        	line: v[0].line,
        	col: v[0].col
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
    {"name": "condition", "symbols": ["boolean"], "postprocess": id},
    {"name": "statement_condition", "symbols": ["__", "condition"], "postprocess": v => v[1]},
    {"name": "statement_condition", "symbols": [{"literal":"("}, "_", "condition", "_", {"literal":")"}], "postprocess": v => v[2]},
    {"name": "var_assign", "symbols": ["is_const", "type", "__", "identifier", "_", {"literal":"="}, "_", "additive"], "postprocess":  v => {
        	//if (v[7] !== parseInt(v[7])) throw new Error(`${v[7]} is not assignable to type int on line ${v[3].line}, column ${v[3].col}`);
        	return {type: 'var_assign', vartype: v[1], identifier: v[3], constant: v[0], line: v[1].line, col: v[0][0] ? v[0][0].col : v[1].col, value: v[7]}// value: global[v[2].value] = v[7]|0}
        } },
    {"name": "var_assign", "symbols": [{"literal":"let"}, "__", "identifier", "_", {"literal":"="}, "_", "switch"], "postprocess":  v => {
        		console.log({
        		type: 'var_assign',
        		identifier: v[2],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[6],
        		offset: v[0].offset
        	})
        	return {
        		type: 'var_assign',
        		identifier: v[2],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[6],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_assign", "symbols": [{"literal":"let"}, "__", "identifier", "_", {"literal":"="}, "_", "value"], "postprocess":  v => {
        	return {
        		type: 'var_assign',
        		identifier: v[2],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[6],
        		offset: v[0].offset
        	}
        } },
    {"name": "var_assign$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "var_reassign"]},
    {"name": "var_assign$ebnf$1", "symbols": ["var_assign$ebnf$1$subexpression$1"]},
    {"name": "var_assign$ebnf$1$subexpression$2", "symbols": ["_", {"literal":","}, "_", "var_reassign"]},
    {"name": "var_assign$ebnf$1", "symbols": ["var_assign$ebnf$1", "var_assign$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "var_assign", "symbols": ["var_assign", "var_assign$ebnf$1"], "postprocess":  v => {
        	v[1] = v[1].map(i => Object.assign(i[3], {type: 'var_assign'}));
        	return {
        		type: 'var_assign_group',
        		line: v[0].line,
        		col: v[0].col,
        		value: [v[0], ...v[1]],
        		offset: v[0].offset
        	}
        } },
    {"name": "is_const$subexpression$1", "symbols": [{"literal":"const"}, "__"]},
    {"name": "is_const$subexpression$1", "symbols": []},
    {"name": "is_const", "symbols": ["is_const$subexpression$1"], "postprocess": v => v[0][0] ? true : false},
    {"name": "type$subexpression$1", "symbols": [{"literal":"float"}]},
    {"name": "type$subexpression$1", "symbols": [{"literal":"int"}]},
    {"name": "type$subexpression$1", "symbols": [{"literal":"array"}]},
    {"name": "type$subexpression$1", "symbols": [{"literal":"string"}]},
    {"name": "type", "symbols": ["type$subexpression$1"], "postprocess": v => v[0]},
    {"name": "var_reassign", "symbols": ["identifier", "_", {"literal":"="}, "_", "value"], "postprocess":  v => {
        	return {
        		type: 'var_reassign',
        		identifier: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		value: v[4],
        		offset: v[0].offset
        	}
        } },
    {"name": "expression", "symbols": ["identifier", "_", /[+-/*]/, "_", "identifier"], "postprocess":  v => ({
        	type: 'expression',
        	value: [v[0], v[2], v[4]]
        }) },
    {"name": "expression", "symbols": ["string"], "postprocess": id},
    {"name": "expression", "symbols": ["array"], "postprocess": id},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": v => v[0]},
    {"name": "value$subexpression$1", "symbols": ["function_call"]},
    {"name": "value$subexpression$1", "symbols": ["identifier"]},
    {"name": "value", "symbols": ["value", "_", {"literal":"."}, "_", "value$subexpression$1"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		value: v[4][0],
        		from: v[0],
        		line: v[0].line,
        		col: v[0].col,
        		lineBreaks: v[0].lineBreaks,
        		offset: v[0].offset,
        	}
        } },
    {"name": "value$subexpression$2", "symbols": ["function_call"]},
    {"name": "value$subexpression$2", "symbols": ["identifier"]},
    {"name": "value", "symbols": ["value$subexpression$2", "_", {"literal":"of"}, "_", "value"], "postprocess":  v => {
        	return {
        		type: 'dot_retraction',
        		value: v[0][0],
        		from: v[4],
        		line: v[0][0].line,
        		col: v[0][0].col,
        		lineBreaks: v[0][0].lineBreaks,
        		offset: v[0][0].offset,
        	}
        } },
    {"name": "value", "symbols": [{"literal":"("}, "_", "value", "_", {"literal":")"}], "postprocess": id},
    {"name": "value", "symbols": ["number"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value", "symbols": ["boolean"], "postprocess": id},
    {"name": "value", "symbols": ["myNull"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": ["identifier"], "postprocess": id},
    {"name": "switch$ebnf$1", "symbols": []},
    {"name": "switch$ebnf$1$subexpression$1", "symbols": ["_", "case_single_valued"]},
    {"name": "switch$ebnf$1", "symbols": ["switch$ebnf$1", "switch$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "switch", "symbols": [{"literal":"switch*"}, "_", "value", "_", {"literal":"{"}, "switch$ebnf$1", "_", {"literal":"}"}], "postprocess":  v => Object.assign(v[0], {
        	type: 'switch*',
        	value: v[2],
        	cases: v[5] ? v[5].map(i => i[1]) : []
        }) },
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
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess":  v => {
        	v[0].value = []
        	v[0].type = 'array'
        	delete v[0].text;
        	return v[0]
        } },
    {"name": "array$ebnf$1", "symbols": []},
    {"name": "array$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array$ebnf$2$subexpression$1", "symbols": ["_", {"literal":","}]},
    {"name": "array$ebnf$2", "symbols": ["array$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "array$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$1", "array$ebnf$2", "_", {"literal":"]"}], "postprocess":  v => {
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
    {"name": "additive", "symbols": ["multiplicative", "_", /[+-]/, "_", "additive"], "postprocess":  v => {
        	switch (v[2].value) {
        		case '+':
        			return v[0] + v[4];
        		case '-':
        			return v[0] - v[4];
        	}
        } },
    {"name": "additive", "symbols": ["multiplicative"], "postprocess": id},
    {"name": "multiplicative", "symbols": ["unary_expression", "_", /[*/]/, "_", "multiplicative"], "postprocess":  v => {
        	switch (v[2].value) {
        		case '*':
        			return v[0] * v[4];
        		case '/':
        			return v[0] / v[4];
        	}
        } },
    {"name": "multiplicative", "symbols": ["unary_expression"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["number"], "postprocess": id},
    {"name": "unary_expression", "symbols": [{"literal":"("}, "_", "additive", "_", {"literal":")"}], "postprocess": v => v[2]},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess":  v => {
        	return Object.assign(v[0], {
        		value: v[0].value
        	})
        	//v[0].value
        } },
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
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
