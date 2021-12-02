const beautify = require('js-beautify').js;
const chokidar = require('chokidar');
const BS = require('./index');
const fs = require('fs');
const { debug } = require('console');
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
        const watcher = chokidar.watch('.', {
            ignored: 'node_modules',
            ignoreInitial: true,
            cwd: __dirname
        });
        // console.log(watcher)
        console.log('Watching '+__dirname)
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
            let ast = '';
            try {
                ast = JSON.stringify(content, null, space || spaces)//.replace(/^\\#([A-Za-z0-9]{3}|[A-Za-z0-9]{6})$/g, '#')
                // console.clear();
                console.log('[File System]: Writing to: '+fileName+'.js')
                // console.log(ast)
                fs.writeFileSync(
                    `${fileName}.ast`,
                    ast
                );
                // ----- new
                let parse = require('./ast_to_js.js')
                // let built_in = `
                // Element.prototype._append = Element.prototype.append;
                // Element.prototype.append = function (children) {
                //     if (Array.isArray(children)) {
                //         for (let i = 0, l = children.length; i < l; i++) {
                //             this._append(children[i]);
                //         }
                //     } else {
                //         this._append(children);
                //     }
                //     return this;
                // }
                // Element.prototype.text = function (content) {
                //     if (content === void 0) {
                //         return this.textContent;
                //     }
                //     this.textContent = content;
                //     return this;
                // }
                // Element.prototype.css = function (obj) {
                //     for (let i in obj) {
                //         this.style[i] = obj[i];
                //     }
                //     return this;
                // }
                // Element.prototype.events = function (obj) {
                //     for (let i in obj) {
                //         this.addEventListener(i, obj[i]);
                //     }
                //     return this;
                // }
                // function list (amount, callback) {
                //     let array = [];
                //     for (let i = 0; i < amount; i++) {
                //         if (typeof callback === 'function') {
                //             console.log(i);
                //             array.push(callback(i));
                //         } else {
                //             array.push(callback);
                //         }
                //     }
                //     return array;
                // }
                // `; //require('./built_in.js');
                let date = Date.now();
                var content = parse(JSON.parse(ast));
                console.log(Date.now() - date);
                let built_in = fs.readFileSync('./built_in.js');
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
                    // finally {
                    //     globalThis.require = () => undefined;
                    // }
                    (async function () {${built_in}\n${content}})();\n`)
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