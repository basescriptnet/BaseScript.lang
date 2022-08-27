const fs = require('fs');
const path_join = require('path').join;
const BS = require('../lib/compiler');
const beautify = require('js-beautify').js;
const path_applied = process.cwd();
const run_code = require('./run_code.js');
let ast_to_js = require('../lib/compiler/ast_to_js');
let minify = function (code) {
    return code.replace(/[ \t]*\/\/[^\n]*\n*/g, '')
        .replace(/(\r\n?)+\s*/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\{\s+/g, '{')
        .replace(/\s+\}/g, '}')
        .replace(/\}\s+/g, '}')
        .replace(/(,|;)\s+/g, '$1 ')
        .replace(/(?:\s*)(==?=?|<=?|>=?|!==?|\|\||&&)(?:\s*)/g, '$1');
}
let writeFile = (path, fileName, content, extension = '.bs') => {
    if (!fileName) return
    // TODO change the line below
    let ast = content;
    //let ast = '';
    try {
        //ast = JSON.parse(JSON.stringify(content, null, 4));
        var tmp = ast_to_js(ast);

        if (tmp.result === void 0) return;
        console.log('[File System]: Writing to: '+fileName+'.js');

        let includes = minify(tmp.includes);
        let contentJS = tmp.result;
        contentJS += '\n';
        fs.writeFileSync(
            `${(`${fileName}.js`).replace(/\\/g, '/')}`,
            (includes ? includes + '\n\n' : '') +
            '// Your code below this line\n\n'+
            beautify(contentJS), 'utf8'
        );
        // # sourceMappingURL=${fileName}.bs.map\n` // add later
        // fs.writeFileSync(fileName+'.bs.map', content)
        return ast;
    } catch (err) {
        console.log(err);
        return void console.error('[Error]: Can\'t compile. Unexpected input.')
    }
};

module.exports = {
    parse(dir, arg0 = '', path, watch = false, run = false) {
        console.clear()
        let date = Date.now();
        if (!watch) {
            path = dir
            if (!/\.b(s|m)$/i.test(path)) {
                console.error(new Error('Provided file doesn\'t have .bs or .bm extension'));
                process.exit()
            }
        } else {
            path = path_join(dir, path)
        }
        let fileName = path.substr(0, path.length - 3);
        let extension = path.substr(path.length - 3);

        try {
            let content = '';
            if (!watch && fs.existsSync(path)) {
                content = BS(path, extension);
            } else {
                if (!fs.existsSync(path))
                    path = `${path_applied}${watch ? '\\' + path : ''}`;
                content = BS(path, extension);
            }
            if (content === void 0) {
                return;
            }
            if (run) {
                let tmp = ast_to_js(content.result);

                if (tmp.result && tmp.result.length === 0 || !tmp.result) return
                let includes = tmp.includes;
                let contentJS = tmp.result;
                let final = includes + '\n' + contentJS;
                run_code(final);
                process.exit();
            }
            if (content.extension == '.bm') {
                console.info('[Module Check]: Module status OK for "' + fileName + '.bm".');
                console.log('Process time: ' + (Date.now() - date) + 'ms');
                return;
            }

            let wrote = writeFile(path, fileName, content.result, content.extension);
            if (wrote !== void 0 || wrote !== false || wrote !== null)
                console.log('Compiled in ' + (Date.now() - date) + 'ms');
        } catch (err) {
            console.warn('Can\'t compile. Unexpected input.');
            console.warn(err);
            //console.warn(new Error(err.message));
        }
    }
}
