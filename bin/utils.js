const fs = require('fs');
const path_join = require('path').join;
const path_dirname = require('path').dirname;
const BS = require('../lib/compiler');
const beautify = require('js-beautify').js;
const path_applied = process.cwd();
const run_code = require('./run_code.js');
let ast_to_js = require('../lib/compiler/ast_to_js');
let minify = function (code) {
    return code.replace(/[ \t]*\/\/[^\n]*\n*/g, '') // remove comments
        .replace(/(\r\n?|[ \t])+/g, ' ') // remove spaces
        //.replace(/[ \t]+/g, ' ')
        //.replace(/\{\s+/g, '{')
        //.replace(/\s+\}/g, '}')
        //.replace(/\}\s+/g, '}')
        .replace(/\s*(,|;|\}|\{)\s+/g, '$1 ') // remove spaces around separators
        .replace(/(?:\s*)(==?=?|<=?|>=?|!==?|\|\||&&)(?:\s*)/g, '$1'); // remove spaces around operators
}
let writeFile = (path, fileName, content, extension = '.bs') => {
    if (!fileName) {
        return console.warn('Filename cannot be empty');
    }
    try {
        // content = JSON.parse(JSON.stringify(content, null, 4));
        //console.time('ast_to_js');
        var tmp = ast_to_js(content, path_dirname(path).replace('\\', '/'));
        //console.timeEnd('ast_to_js');

        if (tmp.result === void 0) {
            return;
        }
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
        return content;
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
        let fileName = path.substr(0, path.length - 3); // .bs  or .bm
        let extension = path.substr(path.length - 3); // .bs or .bm

        try {
            let content = '';
            // ! text_to_ast is really time consuming
            // ! so we use it only when we need to parse a file
            if (!watch && fs.existsSync(path)) {
                //console.time('text_to_ast');
                content = BS(path, extension, path);
                //console.timeEnd('text_to_ast');
            } else {
                if (!fs.existsSync(path))
                    path = `${path_applied}${watch ? '\\' + path : ''}`;
                //console.time('text_to_ast');
                content = BS(path, extension, path);
                //console.timeEnd('text_to_ast');
            }
            if (content === void 0) {
                return;
            }
            if (run) {
                let tmp = ast_to_js(content.result, path_dirname(path).replace('\\', '/'));

                if (tmp.result && tmp.result.length === 0 || !tmp.result) return;
                let includes = tmp.includes;
                let contentJS = tmp.result;
                let final = includes + '\n' + contentJS;
                run_code(final, path_dirname(path).replace('\\', '/'), path.split('\\').pop());
                process.exit();
            }
            if (content.extension == '.bm') {
                console.info('[Module Check]: Module status OK for "' + fileName + '.bm".');
                console.log('Process time: ' + (Date.now() - date) + 'ms');
                return;
            }

            let wrote = writeFile(path, fileName, content.result, content.extension);
            if (wrote !== void 0 || wrote !== false || wrote !== null) {
                console.log('Compiled in ' + (Date.now() - date) + 'ms');
            }
        } catch (err) {
            console.warn('Can\'t compile. Unexpected input.');
            console.warn(err);
        }
    }
}
