// ! This file writes the result of parsing to the final file
const fs = require('fs');
const path_join = require('path').join;
const BS = require('../lib/compiler');
const beautify = require('js-beautify').js;
const path_applied = process.cwd();

let writeFile = (path, fileName, content, builtins = false) => {
    // TODO change the line below
    let ast = '';
    try {
        ast = JSON.parse(JSON.stringify(content, null, 4))
        // later on for php files
        if (ast && ast.type && ast.type === 'decorator' && ast.decorator === '@php') {
            console.log('[File System]: Writing to: '+fileName+'.php');
            let ast_to_php = require('../lib/compiler/ast_to_php');
            var contentPHP = ast_to_php(ast);
            let built_in = fs.readFileSync(`${__dirname}/../lib/compiler/built_in/php/built_in.php`, { encoding: 'utf-8'});
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
            var contentJS = ast_to_js(ast);
            //contentJS = contentJS.slice(0, contentJS.length-6)
            contentJS += '\n';
            let built_in = '';
            let prepend = '';
            if (builtins) {
                built_in = fs.readFileSync(`${__dirname}/../lib/compiler/built_in/js/built_in.js`, { encoding: 'utf-8'});
                built_in += fs.readFileSync(`${__dirname}/../lib/compiler/built_in/js/scope.js`, { encoding: 'utf-8' });
                prepend = `if (!globalThis) {
                    globalThis = window || global || this || {};
                }
                try {
                    globalThis.require = require;
                } catch (err) {
                    globalThis.require = () => undefined;
                }
                `.replace(/\s*\/\/.*/g, '\n').replace(/\s+/g, ' ');
            }
            // fs.mkdirSync('./build/');
            // let p = fileName.split('\\').slice(0, -1);
            // console.log(p.join('/'))
            // if (!fs.existsSync(p.join('/'))) {
            //     fs.mkdirSync(`${path_applied}/${p.join('/')}`, {recursive: true})
            // }
            // console.log(path_join(path_applied, `/${fileName}.js`).replace(/\\/g, '/'))
            fs.writeFileSync(
                `${(`${fileName}.js`).replace(/\\/g, '/')}`,
                //`${path_join(path_applied, `/${fileName}.js`).replace(/\\/g, '/')}`,
                `${prepend}
                ${built_in
                    //.replace(/;\s+(if|else\s|for|while|do|return(\s)|try|catch)\s*/g, ';$1$2')
                    //.replace(/else\s+if/g, 'else if')
                    //.replace(/[ \t]*\/\/[^\n]*/g, ' ')
                    //.replace(/\n+/g, '\n')
                    //.replace(/[ \t]+/g, ' ')
                    //.replace(/\{\s+/g, '{')
                    //.replace(/\s+\}/g, '}')
                    //.replace(/,\s+/g, ', ')
                    //.replace(/(?:\s*)(==?=?|<=?|>=?|!==?|\|\||&&)(?:\s*)/g, '$1')
                }`
                    +`\n\n// your code below this line\n\n`
                    +`${beautify(contentJS)}`
                // beautify(`
                //     ${contentJS}
                // \n`)
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
        try {
            let content = '';
            if (!watch && fs.existsSync(`${path}`)) {
                content = BS(`${path}`);
            } else {
                if (!fs.existsSync(`${path}`))
                    path = `${path_applied}${watch ? '\\' + path : ''}`;
                content = BS(path);
            }
            if (content === void 0) {
                //console.log(']')
                return;
            }
            writeFile(path, fileName, content, true);
            console.log('Compiled in ' + (Date.now() - date) + 'ms');
        } catch (err) {
            console.warn(new Error('Can\'t compile. Unexpected input.'));
            console.warn(new Error(err.message));
        }
        //console.log(']')
    }
}
