const fs = require('fs');
const BS = require(internalPaths.compiler);
const p = require('path');
let beautify = function (code) { return code };
if (globalThis.development) {
    beautify = require('js-beautify').js;
}
const path_applied = process.cwd();
const run_code = require('./run_code.js');

const ast_to_js = require(internalPaths.ast_to_js);

let read = (path) => {
    return fs.readFileSync(path, 'utf8');
}
//console.log(p.join(__dirname, '../', '/lib/compiler/builtin/index.js'))
//console.log(p.resolve('./src/lib/compiler/builtin/index.js'))

let builtin = (() => {
    if (!development) {
        return read(p.join(__dirname, '../', '/lib/compiler/builtin/index.js'))
    }
    return read(p.resolve('./src/lib/compiler/builtin/index.js'))
})();

let getBuiltin = (name) => {
    let regex = new RegExp(`// @@@ ${name}.js[ \\t]*\\n([\\s\\S]*?)// @@@ END ${name}.js[ \\t]*`, 'g');
    let match = regex.exec(builtin);
    if (!match) {
        console.error('Builtin not found: ' + name);
        return '';
    }
    // remove first and last line
    match[1] = match[1].replace(/.*\n/, '').replace(/\n.*$/, '');
    // remove content from builtin
    //builtin = builtin.replace(regex, '');
    return match[1];
    //return read('src/lib/compiler/builtin/' + name + '.js');
}

let getRequiredBuiltins = () => {
    let builtins = `if (!globalThis) {
    globalThis = window || global || this || {};
}
if (globalThis.BS) {
    try {
        return
    } finally { }
}
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
globalThis.BS = {
    placeholder: null,
    customOperators: {},
    customTypes: {},
    libs: [],
};
BS = globalThis.BS;
`.replace(/\s+/g, '');

        builtins +=
`BS.defineProperty = function (prototype, propertyName, valueCallback, options) {
    options = options || {
        writable: true,
        enumerable: false,
        configurable: true
    };
    options.value = valueCallback;
    Object.defineProperty(prototype, propertyName, options);
}
`
    for (let i in usedFeatures) {
        if (!usedFeatures[i]) continue;
        builtins += '\n'
        builtins += getBuiltin(i);
        //builtins += ';';
    }
    return `(function () {${builtins}}).call(this);`
}

let writeFile = (path, fileName, content, silent = false, env) => {
    if (!fileName) {
        return console.warn('Filename cannot be empty');
    }
    try {
        // this is pretty fast. Max was 3ms for regular file
        var tmp = ast_to_js(content, pathJS(path).dir);
        if (!tmp) return // null when error occurs

        //console.log(tmp)
        //console.log(tmp.usedFeatures)

        let builtins = getRequiredBuiltins();
        if (tmp.result === void 0) {
            return;
        }
        silent || console.log('\x1b[36m%s\x1b[0m', '[File System]:', 'Writing to: '+fileName+'.js');

        let includes = tmp.includes;
        let contentJS = tmp.result;
        contentJS += '\n';
        fs.writeFileSync(
            `${(`${fileName}.js`).replace(/\\/g, '/')}`,
            (env ? '#!/usr/bin/env node\n' : '') +
            '// Autogenerated by BaseScript v' + require('../package.json').version +
            '\n\n' + builtins + '\n\n' +
            (includes ? '\n\n' + includes + '\n\n' : '\n\n') +
            '// Your code below this line\n\n'+
            beautify(contentJS), 'utf8'
        )
        // # sourceMappingURL=${fileName}.bs.map\n` // add later
        // fs.writeFileSync(fileName+'.bs.map', content)
        return content;
    } catch (err) {
        console.log(err);
        return void console.error('[Error]: Can\'t compile. Unexpected input.')
    }
};

module.exports = {
    parse(dir, arg0 = '', path, watch = false, run = false, to = '', args = [], env = false) {
        //console.clear()
        let date = Date.now();
        if (!watch) {
            path = dir
            if (!/\.b(s|m)$/i.test(path)) {
                console.log(path)
                console.error(new Error('Provided file doesn\'t have .bs or .bm extension'));
                process.exit()
            }
        } else {
            path = path(dir).add(path)
        }
        let fileName = path.substr(0, path.length - 3); // .bs  or .bm
        if (to) {
            fileName = to.substr(0, to.length - 3);
        }
        try {
            let content = '';
            // ! text_to_ast is really time consuming
            // ! so we use it only when we need to parse a file
            if (!watch && fs.existsSync(path)) {
                content = BS(path, path, false);
            } else {
                if (!fs.existsSync(path))
                    path = `${path_applied}${watch ? '\\' + path : ''}`;
                content = BS(path, path, false);
            }
            if (content === void 0) {
                return;
            }
            if (content.extension == '.bm') {
                console.info('[Module Check]: Module status OK for "' + fileName + '.bm".');
                console.log('Process time: ' + (Date.now() - date) + 'ms');
                return;
            }

            if (run) {
                let tmp = ast_to_js(content.result, pathJS(path).dir);
                if (!tmp) return // null when error occurs

                if (tmp.result && tmp.result.length === 0 || !tmp.result) return;
                let includes = tmp.includes;
                let contentJS = beautify(tmp.result);
                let builtins = getRequiredBuiltins();
                //if (!tmp.builtins) {
                    //    builtins = `(function () {${fs.readFileSync(pathJS(__dirname).add(internalPaths.built_in_from_utils), 'utf8')}})();`;
                //}
                let final = builtins + includes + '\n' + contentJS;
                try {
                    let result = run_code(final, pathJS(path).full()/*, path.split('\\').pop()*/);
                    //console.log('Returned: ' + result);
                    return result
                } catch (err) {
                    console.error(err);
                    console.log('exit')
                    process.exit(1);
                }
            }
            let wrote = writeFile(path, fileName, content.result, run ? true : false, env);
            if (wrote !== void 0 && wrote !== false && wrote !== null) {
                if (!run) {
                    console.log('\x1b[36m%s\x1b[0m', '[Compilation]:', (Date.now() - date) + 'ms');
                }
            }
        } catch (err) {
            console.warn('Can\'t compile. Unexpected input.');
            console.warn(err);
        }
    },
    fromString(string) {
        try {
            let content = BS(string, '', true);
            if (content === void 0) {
                return;
            }

            let tmp = ast_to_js(content.result);
            if (!tmp) return // null when error occurs

            if (tmp.result && tmp.result.length === 0 || !tmp.result) return;
            let includes = tmp.includes;
            let contentJS = beautify(tmp.result);
            let builtins = '';
            let final = builtins + includes + '\n' + contentJS;
            return final
        } catch (err) {
            console.warn('Can\'t compile. Unexpected input.');
            console.warn(err);
        }
    }
}
