const nearley = require("nearley");
module.exports = function (str) {
    const grammar = require('../grammar');
    // const grammar = require("./basescript.js"); // keep here, otherwise if grammar is changed, watch needs to be restarted
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // if (str.trim().length == 0) return '';
    try {
        let parsed = parser.feed(str);
        // console.log(`Parsing result count: ${parsed.results.length}`)
        // console.log(parsed.results);
        let result = parsed.results[0]
        if (!result) {
            console.log('[Log]: Grammar doesn\'t match.')
            return [];
        };
        console.log('Results: ' + parsed.results.length)
        return result
    } catch (err) {
        try {
            let message = err
            if (message && message.split && message.split.call) {
                message = err.split(/\nA /);
                console.error('[Parser]: Bad grammar')
                let filtered = new Set(message
                    .slice(1)
                    .map(i => i.split(/based on:\n/)[0].trim()));
                    console.error([message ? message[0] : '', [...filtered].join(', ')].join(''))
            } else {
                console.error('[Parser]: Possible internal error')
                console.error(err)
            }
        } catch (error) {
            console.error('[Parser]: Bad grammar')
            console.error(error.message);
        }
        // debugger
    }
    return [];
}