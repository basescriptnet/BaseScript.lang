const nearley = require("nearley");
module.exports = function (str) {
    const grammar = require("./basescript.js"); // keep here, otherwise if grammar is changed, watch needs to be restarted
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // if (str.trim().length == 0) return '';
    try {
        let result = (parser.feed(str)).results[0]
        if (!result) {
            return '';
        };
        return result
    } catch (err) {
        console.error(err)
    }
    return '';
}