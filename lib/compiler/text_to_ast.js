const nearley = require("nearley");
module.exports = function (str) {
    // place the grammar here, if you want to change it dynamically
    const grammar = require('../grammar');
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
        let parsed = parser.feed(str);
        let result = parsed.results[0];
        if (!result) {
            console.error(`[Parsing Error]: Incomplete expression at ${parsed.lexerState.line}:${parsed.lexerState.col}`);
            return [];
        };
        if (parsed.results.length > 1) {
            console.log('Results: ' + parsed.results.length);
        }
        return result
    } catch (err) {
        try {
            let message = err
            if (message && message.split && message.split.call) {
                message = err.split(/\nA /);
                console.error('[Parser]: Bad grammar');
                let filtered = new Set(message
                    .slice(1)
                    .map(i => i.split(/based on:\n/)[0].trim()));
                console.error([message ? message[0] : '', [...filtered].join(', ')].join(''));
            } else {
                console.error('[Parser]: Possible internal error');
                console.error(err);
            }
        } catch (error) {
            console.error('[Parser]: Bad grammar');
            console.error(error.message);
        }
        // debugger
    }
    return [];
}