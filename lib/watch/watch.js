const beautify = require('js-beautify').js;
const chokidar = require('chokidar');
const BS = require('../compiler');
const fs = require('fs');
const arg = process.argv[2];
let spaces = +process.argv[3];
// if (arg) {
    // console.log(arg)
    watch();
// }
function watch (space = 4) {
    // try {
        // console.log(dir)
        space = +space;
        if (!space && space !== 0) space = 0;
        // if (!dir) throw new Error('Destination must be provided. Terminating Watch...')
        const watcher = chokidar.watch('/test', {
            ignored: 'node_modules',
            ignoreInitial: false,
            // cwd: __dirname
        });
        // console.log(watcher)
        console.log('Watching test')
        watcher.on('change', (path) => {
            if (!/\.bs$/i.test(path)) return;
            console.clear()
            let fileName = path.substr(0, path.length-('.bs'.length));
            
            console.log(path+': [')
            try {
                let content = BS(path);
                if (content === void 0) {
                    console.log(']')
                    return;
                }
                let result = writeFile(path, fileName, content);
                // result !== void 0 && console.log(`[Output]: ${result}`);
            } catch (err) {
                console.warn(new Error('Can\'t compile. Unexpected input.'));
                console.warn(new Error(err));
            }
            console.log(']')
        });
        let writeFile = (path, fileName, content) => {
            let date = Date.now();
            let ast = '';
            try {
                ast = JSON.stringify(content, null, space || spaces)//.replace(/^\\#([A-Za-z0-9]{3}|[A-Za-z0-9]{6})$/g, '#')
                // console.clear();
                console.log('[File System]: Writing to: '+fileName+'.js')
                // writing as ast file
                // fs.writeFileSync(
                //     `${fileName}.ast`,
                //     ast
                // );
                // ----- new
                let parse = require('../compiler/ast_to_js')
                var content = parse(JSON.parse(ast));
                console.log('Compiled in ' + (Date.now() - date) + 'ms');
                let built_in = fs.readFileSync(__dirname + '/../compiler/built_in.js');
                fs.writeFileSync(
                    `${fileName}.js`,
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
                // ----- new end
                return ast;
            } catch (err) {
                console.log(err);
                return void console.error('[Error]: Can\'t compile. Unexpected input.')
            }
        };
    // } catch (err) {
    //     console.log(err);
    // }
}
module.exports = watch;