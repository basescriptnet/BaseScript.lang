const fs = require('fs');
const path_join = require('path').join;
const BS = require('../lib/compiler');
const beautify = require('js-beautify').js;
// const beautify = require('@wmhilton/beautify')
const path_applied = process.cwd();
let minify = function (code) {
    return code.replace(/[ \t]*\/\/[^\n]*/g, ' ')
        .replace(/(\r\n?)+\s*/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\{\s+/g, '{')
        .replace(/\s+\}/g, '}')
        //.replace(/,\s+/g, ', ')
        .replace(/(?:\s*)(==?=?|<=?|>=?|!==?|\|\||&&)(?:\s*)/g, '$1');
}
let writeFile = (path, fileName, content) => {
    // TODO change the line below
    let ast = '';
    try {
        ast = JSON.parse(JSON.stringify(content, null, 4))
        // console.clear();
        // later on for php files
        if (ast && ast.type && ast.type === 'decorator' && ast.decorator === '@php') {
            console.log('[File System]: Writing to: '+fileName+'.php');
            let ast_to_php = require('../lib/compiler/ast_to_php');
            var contentPHP = ast_to_php(ast);
            let built_in = fs.readFileSync(`${__dirname}/../lib/compiler/built_in.php`, { encoding: 'utf-8'});
            // beautify.php(`<?php ${contentPHP} ?>`, options).then(php => {
                fs.writeFileSync(
                    `${path_join(path_applied, `/${fileName}.php`).replace(/\\/g, '/')}`,
                    `${built_in}\n`+
                    `<?php\n// your code below this line\n${contentPHP.replace(/[ ]{20}/g, '')}\n?>`, 'utf8'
                );
                // fs.writeFileSync(php, 'index.php')
            // })
        } else {
            // for js files
            if (!fileName) return
            console.log('[File System]: Writing to: '+fileName+'.js');
            let ast_to_js = require('../lib/compiler/ast_to_js');
            var tmp = ast_to_js(ast);
            let preIndex = tmp.indexOf('\n\n// Your code below this line\n\n');
            let includes = tmp.slice(0, preIndex);
            let contentJS = tmp.slice(preIndex + 1);
            if (preIndex == -1) {
                includes = '';
            }
            //contentJS = contentJS.slice(0, contentJS.length-6)
            contentJS += '\n';
            let built_in = fs.readFileSync(`${__dirname}/../lib/compiler/built_in.js`, { encoding: 'utf-8'});
            // fs.mkdirSync('./build/');
            // let p = fileName.split('\\').slice(0, -1);
            // console.log(p.join('/'))
            // if (!fs.existsSync(p.join('/'))) {
            //     fs.mkdirSync(`${path_applied}/${p.join('/')}`, {recursive: true})
            // }
            let prepend = `if (!globalThis) {
                globalThis = window || global || this || {};
            }
            try {
                globalThis.require = require;
            } catch (err) {
                globalThis.require = () => undefined;
            }
            `.replace(/\s*\/\/.*/g, '\n').replace(/\s+/g, ' ');
            // console.log(path_join(path_applied, `/${fileName}.js`).replace(/\\/g, '/'))
            fs.writeFileSync(
                `${(`${fileName}.js`).replace(/\\/g, '/')}`,
                //`${path_join(path_applied, `/${fileName}.js`).replace(/\\/g, '/')}`,
                `${prepend}
                ${minify(built_in)}\n${minify(includes)}\n\n${beautify(contentJS)}`, 'utf8'
            );
                // # sourceMappingURL=${fileName}.bs.map\n` // add later
                // fs.writeFileSync(fileName+'.bs.map', content)
        }
        // ----- new end
        return ast;
    } catch (err) {
        console.log(err);
        return void console.error('[Error]: Can\'t compile. Unexpected input.')
    }
};

module.exports = {
    parse (dir, arg0 = '', path, watch = false) {
        console.clear()
        let date = Date.now();
        //console.log(path_applied)
        if (!watch) {
            //path = path_join(dir, arg0)
            path = dir
            if (!/\.bs$/i.test(path)) {
                console.error(new Error('Provided file doesn\'t have .bs extension'));
                process.exit()
            }
        } else {
            path = path_join(dir, path)
            //console.log(path)
        }
        let fileName = path.substr(0, path.length - ('.bs'.length));
        //console.dir(fs.promises)
        //console.log(fs.existsSync(`${path}`))
        //console.log(`${path_applied}${watch ? '/' + path : ''}`)
        //process.exit()
        try {
            let content = '';
            if (!watch && fs.existsSync(`${path}`)) {
                content = BS(`${path}`);
            } else {
                if (!fs.existsSync(`${path}`))
                    path = `${path_applied}${watch ? '\\' + path : ''}`;
                //console.log(path)
                //process.exit()
                content = BS(path);
            }
            if (content === void 0) {
                //console.log(']')
                return;
            }
            let result = writeFile(path, fileName, content);
            // result !== void 0 && console.log(`[Output]: ${result}`);
            console.log('Compiled in ' + (Date.now() - date) + 'ms');
        } catch (err) {
            console.warn(new Error('Can\'t compile. Unexpected input.'));
            console.warn(new Error(err.message));
        }
        //console.log(']')
    }
}
