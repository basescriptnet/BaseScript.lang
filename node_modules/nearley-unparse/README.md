# nearley-unparse

[![build status](https://secure.travis-ci.org/smallhelm/nearley-unparse.svg)](https://travis-ci.org/smallhelm/nearley-unparse)

JavaScript API to "unparse" any nearley grammar. Also allows overrides for given grammar rules.

```js
var unparse = require("nearley-unparse");

//somehow import your compiled grammar
var grammar = require("./grammar");

var src = unparse(grammar);
//BAM! Now you have generated some src that will parse.
```

## API
### src = unparse(grammar[, options])
 * `options.start` which rule to start the unparser. (default: `grammar.ParserStart`)
 * `options.override_rule` a map where the keys are the rule name and the value is a function that returns a string for that rule.
 * `options.filterRule` a function that will take in a rule and return true if it should be selected. This is handy when you want to exclude rules like paren wrapping so it doesn't just output something like this: `(((((1)))))`
 * `options.max_stack_size` useful to limit how deeply nested rules are. (default: 25)
 * `options.max_loops` useful to keep it from running "forever". (default: 500)

## License
MIT
