const nearley = require("nearley");
module.exports = function (str) {
    const grammar = require("./basescript.js"); // keep here, otherwise if grammar is changed, watch needs to be restarted
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // if (str.trim().length == 0) return '';
    try {
        let result = (parser.feed(str)).results[0]
        if (!result) {
            console.log('[Log]: Grammar doesn\'t match.')
            return [];
        };
        return result
    } catch (err) {
        let message = err.message.split(/\nA /);
        try {
            let filtered = new Set(message
                .slice(1)
                .map(i => i.split(/based on:\n/)[0].trim()));
                console.error([message[0], [...filtered].join(', ')].join(''))
        } catch (error) {
            console.error(err.message);
        }
        // debugger
    }
    return [];
}