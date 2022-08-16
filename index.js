const path_applied = process.cwd();
const fs = require('fs');
// fs.rmdirSync(`${path_applied}/build`, { recursive: true });
const utils = require('./bin/utils');
let lastChange = 0;
let lastFile = '';

fs.watch(path_applied, { recursive: true }, function(event, path) {
    if (event != 'change') return;
    if (!/\.b(s|m)$/i.test(path)) return;
    if (path == lastFile && lastChange + 10 > Date.now()) return;
    lastChange = Date.now();
    lastFile = path;

    console.log(path, 'has', 'changed');
    utils.parse(path)
});

console.log('Watching', path_applied);
console.log('Press Ctrl+C to exit');
