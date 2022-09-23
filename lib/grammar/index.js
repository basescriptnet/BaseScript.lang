let fs, nearley, compile, generate, nearleyGrammar, init, readFile, updateGrammarFiles;

if (global.development) {
    init = function () {
        fs = require('fs');
        nearley = require(internalPaths.nearley);
        compile = require(internalPaths.nearleyCompile);
        generate = require(internalPaths.nearleyGenerate);
        nearleyGrammar = require(internalPaths.nearleyGrammar);
    };
    readFile = function (path) {
        try {
            return fs.readFileSync(path, 'utf-8');
        } catch (err) {
            return '';
        }
    };
    updateGrammarFiles = function () {
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

        //const header = readFile(`${__dirname}/lexer/header.js`);
        const lexer = readFile(`${__dirname}/lexer/lexer.js`);
        const footer = readFile(`${__dirname}/lexer/footer.js`);

        let source =
            `@{%
        const assign = Object.assign.bind(Object);
        let HTML_ALLOWED = false;
        ${lexer}
    %}
    ${grammarSource}
    @{%
        ${footer}
    %}`;
        const grammar = compileGrammar(source);

        fs.writeFileSync(`${__dirname}/grammar.js`, grammar);
    };
}

module.exports = {
    read() {
        // for production only compiled grammar is used
        if (!global.development) {
            return require('./grammar.js');
        }
        // load dynamically
        if (!fs) {
            init();
        }
        updateGrammarFiles();
        return require('./grammar.js');
    }
}
