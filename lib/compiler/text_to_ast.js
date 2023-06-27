const nearley = require(internalPaths.nearley)
const grammarObj = require('../grammar');
let grammar = grammarObj.read();
let nearleyGrammar = nearley.Grammar.fromCompiled(grammar);
let parser;// = new nearley.Parser(nearleyGrammar);
function text_to_ast (str) {
    // should be automatically changed each time
    parser = new nearley.Parser(nearleyGrammar)
    parser.reportError = function(token) {
        var message = this.lexer.formatError(token, 'invalid syntax') + '\n';
        message += 'Invalid or unexpected ' + (token.type ? 'token: ' : '');
        message += JSON.stringify(token.value !== undefined ? token.value : token) + '\n';
        return message;
    }
    try {
        let parsed = parser.feed(str);
        let result = parsed.results[0];
        if (!result) {
            console.error(`[Parsing Error]: Incomplete expression at ${parsed.lexerState.line}:${parsed.lexerState.col}`);
            return [];
        };
        if (parsed.results.length > 1) {
            if (parsed.results.length > 256) {
                throw new Error("Ambiguous grammar. Please check your syntax. If you are sure that your syntax is correct, please report this issue to the developers. Thank you!\nPS: You can also try to use ';' to separate your expressions.");
            }
            console.log('Results: ' + parsed.results.length);
            if (parsed.results.length > 16)
                console.log('[Hint]: To avoid ambiguous grammar, use parenthesis or semicolons in places, where you find them proper.')
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
                //console.error('[Parser]: Possible internal error');
                let type = err.constructor.name;
                console.error('\x1b[91m', `[${type}]:`, '\x1b[0m', err.message);
            }
        } catch (error) {
            console.error('[Parser]: Bad grammar');
            console.error(error.message);
        }
    }
    return [];
}

module.exports = text_to_ast;
