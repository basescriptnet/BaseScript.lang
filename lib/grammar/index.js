const fs = require('fs');
const nearley = require("nearley");
const compile = require("nearley/lib/compile.min.js");
const generate = require("nearley/lib/generate.min.js");
const nearleyGrammar = require("nearley/lib/nearley-language-bootstrapped.min.js");
//const closureCompiler = require('google-closure-compiler').closureCompiler;
//const { compiler } = closureCompiler;


const readFile = function (path) {
    try {
        return fs.readFileSync(path, 'utf-8');
    } catch (err) {
        return '';
    }
};

function updateGrammarFiles() {
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

    const header = readFile(`${__dirname}/lexer/header.js`);
    const lexer = readFile(`${__dirname}/lexer/lexer.js`);
    const footer = readFile(`${__dirname}/lexer/footer.js`);

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
    //let comp = new compiler({
    //    js: `${__dirname}/grammar.js`,
    //    compilation_level: 'ADVANCED'
    //});
    //console.log(comp);
}
//updateGrammarFiles();

module.exports = {
    read() {
        //updateGrammarFiles();
        //return require('./grammar.js');
        return require('./grammar.min.js');
    },
    update() {
        updateGrammarFiles();
        return require('./grammar.js');
    }
}
