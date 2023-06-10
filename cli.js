#!/usr/bin/env node
const path_applied = process.cwd();
const pathLib = require('path');
const fs = require("fs");

class CLI {
    constructor() {
        this.commands = [
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
        this.usage = "\nUsage:\n* bsc --from <file_name> --to <file_name>"; //\n* bsc -f <file_name> -r";
        this.options = require("yargs")
            .usage(this.usage)
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
    }
    initGlobals() {
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
        }

        global.development = require('./package.json').isDevelopment;
        global.extension = '.js';
        global.baseUrl = {
            path: path_applied.replace(/\\/g, '/'),
            from_indexJS: true,
            relative: '',
            ext: '',
        }

        global.pathJS = function(pathString = '') {
            let r = /\\/g;
            return {
                resolve: pathLib.resolve(pathString),
                path: pathString.replace(r, '/'),
                dir: pathLib.dirname(pathString).replace(r, '/'),
                name: pathLib.basename(pathString).replace(r, '/'),
                ext: pathLib.extname(pathString).replace(r, '/'),
                filename: (str => {
                    return str.split('\\').join('/').split('/').pop();
                })(pathString),
                add(...args) {
                    return pathLib.join(pathString, ...args).replace(r, '/');
                },
                relative() {
                    return pathJS(baseUrl.path).add(baseUrl.relative);
                },
                full() {
                    return pathJS(baseUrl.path).add(baseUrl.relative, baseUrl.filename);
                }
            }
        }
        return this
    }
    showCommands() {
        console.log(this.usage);
        for (let i = 0; i < this.commands.length; i++) {
            console.log(this.commands[i]);
        }
    }
    getUtils() {
        this.utils = require(internalPaths.utils);
        this._export = this.utils
        return this
    }
    checkForOptions() {
        let options = this.options;
        if (options.help || !options.file) {
            this.showCommands();
            process.exit(0);
        } else if (options.version) {
            console.log(require('./package.json').version);
            process.exit(0);
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
        return this
    }
    checkIfExists() {
        let dir = pathJS(path_applied).add(this.options.file);
        this.dir = dir

        baseUrl.filename = pathJS(dir).filename;
        baseUrl.ext = pathJS(dir).ext;
        baseUrl.relative = pathJS(this.options.file).dir;
        if (!fs.existsSync(dir)) {
            console.error(dir);
            console.error(new Error('Provided location doesn\'t exist'))
            process.exit()
        }
        return this
    }
    configureOptions() {
        let { utils, options, dir } = this
        let arg0 = ''
        if (options.js) {
            this.export = utils.fromString(dir, arg0, '', true, false, options.out, CLIArguments, options.env);
            //process.exit();
        } else if (options.run) {
            utils.parse(dir, arg0, '', false, true, options.out, CLIArguments, options.env);
            //process.exit();
        } else if (!options.watch) {
            baseUrl.filename = options.file;
            utils.parse(dir, arg0, '', false, false, options.out, CLIArguments, options.env);
            //process.exit();
        }
        return this
    }
    handleWatch() {
        if (!this.options.watch) return this

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
            console.clear();
            execute(`bsc -f=${options.file} -o=${options.out} ${options._.join(' ')}`);
            //utils.parse(path);
            baseUrl.relative = '';
            baseUrl.ext = '';
            baseUrl.filename = '';
        });
        return this
    }
    export() {
        return this._export
    }
}

module.exports = new CLI()
    .checkForOptions()
    .initGlobals()
    .getUtils()
    .checkIfExists()
    .configureOptions()
    .handleWatch()
    .export()
