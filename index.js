const path_applied = process.cwd();
const pathLib = require('path');

global.internalPaths = {
    utils: './bin/utils.js',
    ast_to_js: '../lib/compiler/ast_to_js.js',
    text_to_ast: './text_to_ast.js',
    compiler: '../lib/compiler/index.js',
    built_in: './built_in.js',
    built_in_from_utils: '../lib/compiler/built_in.js',
    grammar: './lib/grammar',
    bin: '../../bin/',
    nearley: '../../nearley/lib/nearley.js',
    nearleyCompile: "../../nearley/lib/compile.js",
    nearleyGenerate: "../../nearley/lib/generate.js",
    nearleyGrammar: "../../nearley/lib/nearley-language-bootstrapped.js",
};

global.baseUrl = {
    path: path_applied.replace(/\\/g, '/'),
    from_indexJS: true,
    relative: '',
    ext: '',
};
global.pathJS = function (pathString = '') {
    let r = /\\/g;
    return {
        resolve: pathLib.resolve(pathString),
        path: pathString.replace(r, '/'),
        dir: pathLib.dirname(pathString).replace(r, '/'),
        name: pathLib.basename(pathString).replace(r, '/'),
        ext: pathLib.extname(pathString).replace(r, '/'),
        filename: (function (str) {
            return str.split('\\').join('/').split('/').pop();
        })(pathString),
        add: function (...args) {
            return pathLib.join(pathString, ...args).replace(r, '/');
        },
        relative: function () {
            return pathJS(baseUrl.path).add(baseUrl.relative);
        },
        full: function () {
            return pathJS(baseUrl.path).add(baseUrl.relative, baseUrl.filename);
        }
    }
};

baseUrl.filename = '';
const utils = require("./bin/utils");

module.exports = {
    compile: utils.fromString,
}
