let unparse = require("nearley-unparse");

//somehow import your compiled grammar
let grammar = require("../grammar/grammar.js");

for (let i = 0; i < 1; i++) {
    let src = unparse(grammar);

    console.log(src);
}