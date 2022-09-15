const nearley = require("nearley");
const grammarObj = require('../grammar');
let grammar = grammarObj.read();
let nearleyGrammar = nearley.Grammar.fromCompiled(grammar);
module.exports = function (str) {
    // This will update the files from nearley
    // ! Turn off, if production
    //grammar = grammarObj.update();
    //nearleyGrammar = nearley.Grammar.fromCompiled(grammar)
    const parser = new nearley.Parser(nearleyGrammar);
    parser.reportError = function(token) {
        var message = this.lexer.formatError(token, 'invalid syntax') + '\n';
        message += 'Invalid or unexpected ' + (token.type ? 'token: ' : '');
        message += JSON.stringify(token.value !== undefined ? token.value : token) + '\n';
        return message;
    };
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