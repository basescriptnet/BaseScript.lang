const path_applied = process.cwd();
const fs = require('fs');
// fs.rmdirSync(`${path_applied}/build`, { recursive: true });
const utils = require('./bin/utils');
let lastChange = 0;
let lastFile = '';
let actionDone = {};

fs.watch(path_applied, { recursive: true }, function(event, path) {
    if (event != 'change') return;
    if (!/\.b(s|m)$/i.test(path)) return;
    if (path == lastFile && lastChange + 30 > Date.now()) return;
    let stats = fs.statSync(path);
    let mtime = +stats.mtimeMs;
    // sometimes the file is changed twice in a row, so we need to wait a bit
    if (actionDone[path] | 0 == mtime | 0) {
        return void setTimeout(() => actionDone[path] = 0, 30);
    };
    actionDone[path] = mtime|0;
    lastChange = Date.now();
    lastFile = path;

    //console.log(path, 'has', 'changed');
    utils.parse(path)
});
