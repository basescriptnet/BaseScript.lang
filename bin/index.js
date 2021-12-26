#! /usr/bin/env node
// console.log(process.argv)
const path_applied = process.cwd();
const yargs = require("yargs");
const fs = require("fs");
const utils = require("./utils");
const path_join = require("path").join;
const usage = "\nUsage: bs <file_name>";
const options = yargs
.usage(usage)
.option("w", {
    alias: "watch",
    describe: "Watch directory.",
    type: "boolean",
    demandOption: false 
})
.help(true)
.argv;
// if no file name is provided
let lastChange = 0;
let lastFile = '';
const arg0 = yargs.argv._[0];
if (arg0 == null) {
    // utils.showHelp();
    console.log(usage);
    console.log('\nOptions:\r');
    console.log('\t--version\t      ' + 'Show version number.' + '\t\t' + '[boolean]\r');
    console.log('    -w, --watch\t        ' + '      ' + 'Watch directory.' + '\t\t\t' + '[boolean]\r');
    console.log('\t--help\t\t      ' + 'Show help.' + '\t\t\t' + '[boolean]\n');
    process.exit();
}
let dir = path_applied;
if (arg0 != '.') {
    dir = path_join(path_applied, arg0)
}
let watch = yargs.argv.watch;
if (!fs.existsSync(dir)) {
    process.exit()
    // fs.mkdirSync(`${path_applied}/${p.join('/')}`, {recursive: true})
}
if (watch) {
    fs.watch(dir, { recursive: true }, function(event, path) {
        if (event != 'change') return;
        if (!/\.bs$/i.test(path)) return;
        if (path == lastFile && lastChange + 10 > Date.now()) return;
        lastChange = Date.now();
        lastFile = path;
    
        console.log(path, 'has', event + 'ed');
        utils.parse(path)
    });
} else {
    utils.parse(arg0)
}
