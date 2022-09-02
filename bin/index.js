// Read CLI arguments, watch files and run them
const path_applied = process.cwd();
const yargs = require("yargs");
const fs = require("fs");
const utils = require("./utils");
const path_join = require("path").join;
const usage = "\nUsage:\n* bs <file_name>\n* bs run <file_name>";
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
let arg0 = yargs.argv._[0];
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
let run = false;
if (arg0 == 'run') {
    run = true;
    arg0 = yargs.argv._[1];
}
if (arg0 != './') {
    if (/^\.\//.test(arg0)) {
        arg0 = arg0.slice(1)
    }
    dir = path_join(path_applied, arg0)
}
if (!fs.existsSync(dir)) {
    console.error(new Error('Provided location doesn\'t exist'))
    process.exit()
    // fs.mkdirSync(`${path_applied}/${p.join('/')}`, {recursive: true})
}
if (run) {
    utils.parse(dir, arg0, '', false, true);
    process.exit();
}

let watch = yargs.argv.watch;
if (watch) {
    fs.watch(dir, { recursive: true }, function(event, path) {
        if (event != 'change') return;
        if (!/\.b(s|m)$/i.test(path)) return;
        if (path == lastFile && lastChange + 20 > Date.now()) return;
        lastChange = Date.now();
        lastFile = path;

        console.log(path, 'has changed');
        utils.parse(dir, arg0, path, true)
    });
}
