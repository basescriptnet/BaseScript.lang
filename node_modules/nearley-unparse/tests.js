var _ = require("lodash");
var test = require("tape");
var nearley = require("nearley");
var grammar = require("./test-grammar");
var unparse = require("./");

var parse = function(src, start){
  start = start || grammar.ParserStart;

  var p = new nearley.Parser(grammar.ParserRules, start);
  p.feed(src);
  if(p.results.length !== 1){
    throw new Error(
      "Parsing Ambiguity: " + p.results.length + " parsings found"
    );
  }
  return p.results[0];
};

var reparseNTimes = function(t, n_runs, opts){
  opts = opts || {};
};

test("it", function(t){
  t.equals(unparse(grammar, {
    start: "bar"
  }), "bar");

  t.equals(unparse(grammar, {
    start: "bar",
    override_rule: {bar: function(){return "baz";}}
  }), "baz");

  _.each(_.range(0, 1000), function(){
    var src = unparse(grammar);
    try{
      parse(src);
      t.ok(true);
    }catch(e){
      t.fail(e + '');
    }
  });

  var max_len = 0;
  _.each(_.range(0, 1000), function(){
    var src = unparse(grammar, {start: "foo"});
    t.ok(/^foo[0-9]+/.test(src));
    max_len = Math.max(max_len, src.length);
  });
  t.ok(max_len > 4, "regex is not recursing");

  t.end();
});
