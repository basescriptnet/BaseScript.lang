module.exports = function (content, path) {
    const vm = require('vm');
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
        //__dirname: path,
        //__filename: fileName,
    };

    let script = '';
    try {
        script = new vm.createScript(`(function () {${content}})();`);
        //vm.createContext(sandbox);
        //vm.runInContext(script, sandbox);
        script.runInNewContext(sandbox);
        console.log('Success!')
    } catch (err) {
        console.error(err.message);
        console.trace(err);
    }
    return sandbox.module.exports;
}