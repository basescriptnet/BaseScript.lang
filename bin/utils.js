const fs = require('fs');
const path_join = require('path').join;
const BS = require('../lib/compiler');
const beautify = require('js-beautify').js;
const path_applied = process.cwd();

let writeFile = (path, fileName, content) => {
    let ast = '';
    try {
        ast = JSON.stringify(content, null, 4)
        // console.clear();
        console.log('[File System]: Writing to: '+fileName+'.js');
        let parse = require('../lib/compiler/ast_to_js');
        var contentJS = parse(JSON.parse(ast));
        let built_in = fs.readFileSync(`${__dirname}/../lib/compiler/built_in.js`, { recursive: true , encoding: 'utf-8'});
        // fs.mkdirSync('./build/');
        // let p = fileName.split('\\').slice(0, -1);
        // console.log(p.join('/'))
        // if (!fs.existsSync(p.join('/'))) {
        //     fs.mkdirSync(`${path_applied}/${p.join('/')}`, {recursive: true})
        // }
        let prepend = `if (!globalThis) {
            globalThis = window || global || this || {};
        }
        // try {
        //     globalThis.require = require;
        // } catch (err) {
        //     globalThis.require = () => undefined;
        // }
        `.replace(/\s*\/\/.*/g, '\n').replace(/\s+/g, ' ');
        // console.log(path_join(path_applied, `/${fileName}.js`).replace(/\\/g, '/'))
        fs.writeFileSync(
            `${path_join(path_applied, `/${fileName}.js`).replace(/\\/g, '/')}`,
            `${prepend}
            ${built_in
                .replace(/\s*\/\/.*/g, ' ')
                .replace(/\s+/g, ' ')}`
                +`\n\n// your code below this line\n\n`
            +`//(async function () {\n`
                +`${beautify(contentJS)}
            //})();`
            // beautify(`
            //     ${contentJS}
            // \n`)
            );
        // # sourceMappingURL=${fileName}.bs.map\n` // add later
        // fs.writeFileSync(fileName+'.bs.map', content)
        // ----- new end
        return ast;
    } catch (err) {
        console.log(err);
        return void console.error('[Error]: Can\'t compile. Unexpected input.')
    }
};

module.exports = {
    parse (path) {
        console.clear()
        let date = Date.now();
        let fileName = path.substr(0, path.length-('.bs'.length));
        try {
            let content = BS(`${path_applied}/${path}`);
            if (content === void 0) {
                console.log(']')
                return;
            }
            let result = writeFile(path, fileName, content);
            // result !== void 0 && console.log(`[Output]: ${result}`);
            console.log('Compiled in ' + (Date.now() - date) + 'ms');
        } catch (err) {
            console.warn(new Error('Can\'t compile. Unexpected input.'));
            console.warn(new Error(err.message));
        }
        console.log(']')
    }
}
