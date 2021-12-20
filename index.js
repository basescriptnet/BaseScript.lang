
const beautify = require('js-beautify').js;
const fs = require('fs');
const BS = require('./lib/compiler');
// const watch = require('./src/watch/watch');
// watch.call(this, './test');
let lastChange = 0;
let lastFile = '';
let writeFile = (path, fileName, content) => {
    let date = Date.now();
    let ast = '';
    try {
        ast = JSON.stringify(content, null, 4)//.replace(/^\\#([A-Za-z0-9]{3}|[A-Za-z0-9]{6})$/g, '#')
        // console.clear();
        console.log('[File System]: Writing to: '+fileName+'.js')
        // writing as ast file
        // fs.writeFileSync(
        //     `${fileName}.ast`,
        //     ast
        // );
        // ----- new
        let parse = require('./lib/compiler/ast_to_js')
        var content = parse(JSON.parse(ast));
        let built_in = fs.readFileSync('./lib/compiler/built_in.js', { recursive: true , encoding: 'utf-8'});
        // fs.rmdirSync('./build', { recursive: true });
        // fs.mkdirSync('./build/');
        let p = fileName.split('\\').slice(0, -1);
        if (!fs.existsSync(p.join('/'))) {
            fs.mkdirSync('./build/'+p.join('/'), {recursive: true})
        }

        fs.writeFileSync(
            `./build/${fileName.replace('\\', '/')}.js`,
            beautify(`
            if (!globalThis) {
                globalThis = window || global || this || {};
            }
            try {
                globalThis.require = require;
            } catch (err) {
                globalThis.require = () => undefined;
            }
            //(async function () {
                ${built_in}
                ${content}
            //})();\n`)
            // beautify(`
            //     ${content}
            // \n`)
        );
        console.log('Compiled in ' + (Date.now() - date) + 'ms');
        // ----- new end
        return ast;
    } catch (err) {
        console.log(err);
        return void console.error('[Error]: Can\'t compile. Unexpected input.')
    }
};

fs.watch("./src/", { recursive: true }, function(event, path) {
    if (event != 'change') return;
    if (!/\.bs$/i.test(path)) return;
    if (path == lastFile && lastChange + 10 > Date.now()) return;
    lastChange = Date.now();
    lastFile = path;

    console.log(path, 'is', event);
    console.clear()
    let fileName = path.substr(0, path.length-('.bs'.length));
    try {
        let content = BS(`./src/${path}`);
        if (content === void 0) {
            console.log(']')
            return;
        }
        let result = writeFile(path, fileName, content);
        // result !== void 0 && console.log(`[Output]: ${result}`);
    } catch (err) {
        console.warn(new Error('Can\'t compile. Unexpected input.'));
        console.warn(new Error(err.message));
    }
    console.log(']')
});
// console.log(parse('\\a = 10'));