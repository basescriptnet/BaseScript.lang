const fs = require('fs');
const readFile = function (path) {
    try {
        return fs.readFileSync(path, 'utf-8');
    } catch (err) {
        return '';
    }
};
if (!global.production) {
    const nearley = require("nearley");
    const compile = require("nearley/lib/compile");
    const generate = require("nearley/lib/generate");
    const nearleyGrammar = require("nearley/lib/nearley-language-bootstrapped");

    function compileGrammar(sourceCode) {
        // Parse the grammar source into an AST
        const grammarParser = new nearley.Parser(nearleyGrammar);
        grammarParser.feed(sourceCode);
        const grammarAst = grammarParser.results[0]; // TODO check for errors
    
        // Compile the AST into a set of rules
        const grammarInfoObject = compile(grammarAst, {});
        // Generate JavaScript code from the rules
        const grammarJs = generate(grammarInfoObject, "grammar");
    
        return grammarJs;
    }

    const grammarSource = require('./ne');

    const header = readFile(`${__dirname}/src/header.js`);
    const lexer = readFile(`${__dirname}/src/lexer.js`);
    const footer = readFile(`${__dirname}/src/footer.js`);

    let source =
`@{%
    ${header}
    ${lexer}
%}
${grammarSource}
@{%
    ${footer}
%}`;
    const grammar = compileGrammar(source);

    fs.writeFileSync(`${__dirname}/grammar.js`, grammar);
    module.exports = require('./grammar.js');
} else {
    module.exports = require('./grammar.js');
}
