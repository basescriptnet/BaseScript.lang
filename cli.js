const path_applied = process.cwd();
const pathLib = require('path');

global.internalPaths = {
    utils: './bin/utils.js',
    ast_to_js: '../lib/compiler/ast_to_js.js',
    text_to_ast: './text_to_ast.js',
    compiler: '../lib/compiler/index.js',
    built_in: './built_in.js',
    built_in_from_utils: '../lib/compiler/built_in.js',
    grammar: './lib/grammar',
    bin: '../../bin/',
    nearley: '../../nearley/lib/nearley.js',
    nearleyCompile: "../../nearley/lib/compile.js",
    nearleyGenerate: "../../nearley/lib/generate.js",
    nearleyGrammar: "../../nearley/lib/nearley-language-bootstrapped.js",
};

global.development = require('./package.json').isDevelopment;
global.extension = '.js';
global.baseUrl = {
    path: path_applied.replace(/\\/g, '/'),
    from_indexJS: true,
    relative: '',
    ext: '',
};
global.pathJS = function (pathString = '') {
    let r = /\\/g;
    return {
        resolve: pathLib.resolve(pathString),
        path: pathString.replace(r, '/'),
        dir: pathLib.dirname(pathString).replace(r, '/'),
        name: pathLib.basename(pathString).replace(r, '/'),
        ext: pathLib.extname(pathString).replace(r, '/'),
        filename: (function (str) {
            return str.split('\\').join('/').split('/').pop();
        })(pathString),
        add: function (...args) {
            return pathLib.join(pathString, ...args).replace(r, '/');
        },
        relative: function () {
            return pathJS(baseUrl.path).add(baseUrl.relative);
        },
        full: function () {
            return pathJS(baseUrl.path).add(baseUrl.relative, baseUrl.filename);
        }
    }
};
// Read CLI arguments, watch files and run them
const yargs = require("yargs");
const fs = require("fs");
const utils = require(internalPaths.utils);
const commands = [
    '\nOptions:\r',
    '    -v, --version\t      ' + 'Show version number.' + '\t\t' + '[boolean]\r',
    '    -w, --watch\t        ' + '      ' + 'Watch directory.' + '\t\t\t' + '[boolean]\r',
    '    -h, --help\t\t      ' + 'Show help.' + '\t\t\t' + '[boolean]\r',
    '\t--run \t\t      ' + 'Save and run file.' + '\t\t' + '[boolean]\r',
    '\t--env\t\t      ' + 'Node env directive.' + '\t\t' + '[boolean]\r',
    '\t--file\t\t      ' + 'File to compile.' + '\t\t\t' + '[string]\r',
    '\t--out\t\t      ' + 'Output file.' + '\t\t\t' + '[string]\r',
    '\t--js\t\t      ' + 'Parse JS.' + '\t\t\t' + '[boolean]\r',
    //'\t--args\t\t      ' + 'Node arguments' + '\t\t\t' + '[string]\n',
];

module.exports = {
    utils
}

function showCommands () {
    console.log(usage);
    for (let i = 0; i < commands.length; i++) {
        console.log(commands[i]);
    }
}
//const utils = require("./utils");
//const path_join = require("path").join;
const usage = "\nUsage:\n* bsc --from <file_name> --to <file_name>"; //\n* bs run <file_name>";
const options = yargs
    .usage(usage)
    .option("w", {
        alias: "watch",
        describe: "Watch directory.",
        type: "boolean",
        demandOption: false
    })
    .option("file", {
        alias: "file",
        describe: "File to compile from.",
        type: "string",
        demandOption: false
    })
    .option("out", {
        alias: "out",
        describe: "Output file.",
        type: "string",
        demandOption: false
    })
    .option("run", {
        alias: "run",
        describe: "Run file.",
        type: "boolean",
        demandOption: false
    })
    .option("args", {
        alias: "args",
        describe: "Node arguments",
        type: "string",
        demandOption: false
    })
    .option("js", {
        alias: "js",
        describe: "Parse and print as JS",
        type: "boolean",
        demandOption: false
    })
    .alias('env', 'e')
    .alias('file', 'f')
    .alias('out', 'o')
    .alias('run', 'r')
    .alias("help", "h")
    .alias("version", "v")
    .help(true)
    .argv;

if (options.help) {
    showCommands();
    process.exit(0);
}

if (options.version) {
    console.log(require('./package.json').version);
    process.exit(0);
}

// if no file name is provided, show usage
if (!options.file) {
    showCommands();
    process.exit();
}

if (!options.args) {
    options.args = '';
}

global.CLIArguments = options._.concat(options.args.split(' '));
// if no output file is provided, use the same name as the input file
if (!options.out && !options.run && !options.watch) {
    if (options.file.endsWith(".bs") || options.file.endsWith(".bm")) {
        options.out = options.file.slice(0, -3) + ".js";
    } else {
        throw new Error("Input file must be a .bs or .bm file.");
    }
} else if (options.out) {
    if (!options.out.endsWith(".js")) {
        console.error("Output file must be a .js file.");
        process.exit();
    }
}
let dir = pathJS(path_applied).add(options.file);
baseUrl.filename = pathJS(dir).filename;
baseUrl.ext = pathJS(dir).ext;
baseUrl.relative = pathJS(options.file).dir;
let arg0 = '';
if (!fs.existsSync(dir)) {
    console.error(dir);
    console.error(new Error('Provided location doesn\'t exist'))
    process.exit()
}
if (options.js) {
    module.exports = utils.fromString(dir, arg0, '', true, false, options.out, CLIArguments, options.env);
    process.exit();
} else if (options.run) {
    utils.parse(dir, arg0, '', false, true, options.out, CLIArguments, options.env);
    process.exit();
} else if (!options.watch) {
    baseUrl.filename = options.file;
    utils.parse(dir, arg0, '', false, false, options.out, CLIArguments, options.env);
    process.exit();
}
const exec = require("child_process").execSync;
function execute(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        if (stdout)
            console.log(`stdout: ${stdout}`);
    });
}

// Watch directory
if (options.watch) {
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
            return void setTimeout(() => {
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
        execute(`bsc -f=${options.file} -o=${options.out} ${options._.join(' ')}`);
        //utils.parse(path);
        baseUrl.relative = '';
        baseUrl.ext = '';
        baseUrl.filename = '';
    });
}
