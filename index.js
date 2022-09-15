const path_applied = process.cwd();
const fs = require('fs');
// fs.rmdirSync(`${path_applied}/build`, { recursive: true });
const utils = require('./bin/utils');
let lastChange = 0;
let lastFile = '';
let actionDone = {};
global.baseUrl = {
    path: path_applied.replace(/\\/g, '/'),
    from_indexJS: true,
    relative: ''
};

const pathLib = require('path');
global.pathJS = function (pathString = '') {
    return {
        resolve: pathLib.resolve(pathString),
        path: pathString.replace(/\\/g, '/'),
        dir: pathLib.dirname(pathString).replace(/\\/g, '/'),
        name: pathLib.basename(pathString).replace(/\\/g, '/'),
        ext: pathLib.extname(pathString).replace(/\\/g, '/'),
        filename: (function (str) {
            return str.split('\\').pop();
        })(pathString),
        add: function (...args) {
            return pathLib.join(pathString, ...args).replace(/\\/g, '/');
        },
        relative: function () {
            return pathJS(baseUrl.path).add(baseUrl.relative);
        }
    }
};

fs.watch(path_applied, { recursive: true }, function(event, path) {
    if (event != 'change') return;
    if (!/\.b(s|m)$/i.test(path)) return;
    if (path == lastFile && lastChange + 30 > Date.now()) return;
    let stats = fs.statSync(path);
    let mtime = +stats.mtimeMs;
    // sometimes the file is changed twice in a row, so we need to wait a bit
    if (actionDone[path] | 0 == mtime | 0) {
        return void setTimeout(() => {
            //actionDone[path] = 0
            delete actionDone[path];
        }, 30);
    };
    actionDone[path] = mtime|0;
    lastChange = Date.now();
    lastFile = path;

    //console.log(path, 'has', 'changed');
    baseUrl.relative = pathJS(path).dir;
    baseUrl.ext = pathJS(path).ext;
    baseUrl.filename = pathJS(path).filename;
    utils.parse(path);
    baseUrl.relative = '';
    baseUrl.ext = '';
    baseUrl.filename = '';
});
