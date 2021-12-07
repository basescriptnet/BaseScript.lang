// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "main", "symbols": ["foo"]},
    {"name": "main", "symbols": ["bar_list"]},
    {"name": "foo$string$1", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "foo$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "foo$ebnf$1", "symbols": [/[0-9]/, "foo$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "foo", "symbols": ["foo$string$1", "foo$ebnf$1"]},
    {"name": "bar_list", "symbols": ["bar"]},
    {"name": "bar_list", "symbols": ["bar_list", {"literal":","}, "bar"]},
    {"name": "bar$string$1", "symbols": [{"literal":"b"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bar", "symbols": ["bar$string$1"]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
