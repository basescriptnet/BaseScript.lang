module.exports = function (content, path) {
    const {NodeVM, VMScript} = require('vm2');
    //var m = require('module')
    //var src = 'module.exports = 42'
    //var res = vm.runInThisContext(m.wrap(src))(exports, require, module, __filename, __dirname)
    //console.log(module.exports)
    console.log(path);
    process.argv[0] = 'BaseScript';
    process.argv[1] = path;
    process.argv = process.argv.slice(0, 2);
    if (global.CLIArguments.length)
        process.argv.push(global.CLIArguments.join(' '));

    module.paths.push(path.replace(/\//g, '\\'));

    delete global.CLIArguments;
    delete global.internalPaths;
    delete global.extension;
    delete global.pathJS;
    delete global.baseUrl;
    delete global.development;
    require.main.children = [];
    //console.dir(require.main)
    //require.context(path.replace(/\//g, '\\'));

    const sandbox = {
        //module: { exports: {} },
        module: module,
        require: require,
        console: console,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        process: process,
        Buffer: Buffer,
        exports: {},
        global: global,
        globalThis: global,
        //__dirname: path,
        //__filename: fileName,
    };
    const vm = new NodeVM({
        console: 'inherit',
        //sandbox: {},
        // allow require of node modules

        require: {
            external: true,
            builtin: ['*'],
            root: [path.replace(/\//g, '\\') + '\\'],
        },
        wrapper: 'none',
    });

    let script = '';
    try {
        script = new VMScript(content);
        vm.run(script, path.replace(/\//g, '\\'));
        //script = new vm.createScript((`(function () {${content}})();`));
        //script.runInNewContext(sandbox);
    } catch (err) {
        console.error(err);
    }
    return sandbox.module.exports;
}