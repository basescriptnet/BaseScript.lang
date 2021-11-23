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
            // console.clear()
            let fileName = path.substr(0, path.length-('.bs'.length));
            
            console.log(path+': [')
            try {
                let content = BS(path);
                if (content === void 0) {
                    console.log(']')
                    return;
                }
                let result = writeFile(path, fileName, content);
                result !== void 0 && console.log(`[Output]: ${result}`);
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
                    function parse (statements) {
                        let result = '';
                        // debugger
                        for (let i = 0; i < statements.length; i++) {
                            let statement = statements[i];
                            let value = statement.value;
                            switch (statement.type) {
                                case 'var_assign':
                                    result += `let ${statement.identifier.value} = ${parse([value])};`;
                                    break;
                                case 'var_reassign':
                                    result += `${statement.identifier.value} = ${parse([value])};`;
                                    break;
                                case 'array':
                                    result += '[';
                                    for (let i = 0; i < value.length; i++) {
                                        result += parse([value[i]]);
                                        if (i !== value.length -1)
                                            result += ',';
                                    }
                                    result += ']';
                                    break;
                                case 'number':
                                    result += value;
                                    break;
                                case 'if_else':
                                    result += `if (${statement.if.condition}) {${parse(statement.if.value)}}`;
                                    result += ` else {${parse(statement.else.value)}}`;
                                    break;
                                case 'if':
                                    result += `if (${statement.condition}) {${parse(value)}}`;
                                    break;
                                case 'else':
                                    result += `else {${parse(value)}}`;
                                    break;
                                case 'while':
                                    result += `while (${statement.condition}) {${parse(value)}}`;
                                    break;
                                case 'sleep':
                                    result += `sleep(${value});`;
                                    break;
                            }
                        }
                        return result.trim();
                    }
                    let built_in = require('./built_in.js');
                    fs.writeFileSync(
                        `${fileName}.js`,
                        beautify(`(async function () {${built_in.toString()};${parse(JSON.parse(ast))}})()`)
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