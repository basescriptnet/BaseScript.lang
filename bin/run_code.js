module.exports = async function run_code (content, path) {
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
    require.main.children = [];

    let Module = require('module');
    //create a new module
    let m = new Module();
    m.filename = path;
    m.paths = module.paths;

    // make the require relative to path
    let _require = Module.createRequire(require.resolve(path));
    //require the module
    _require.main = m;
    _require.paths = m.paths;
    _require.cache = m.children;
    _require.main.filename = path;
    _require.main.paths = m.paths;
    _require.main.children = [];
    _require.main.exports = {};
    _require.main.loaded = false;
    _require.main.id = path;

    let _setTimeout = function (cb, ms) {
        let timeout = setTimeout.apply(this, arguments);
        intervals.push(timeout);
        setTimeout(() => {
            let index = intervals.indexOf(timeout);
            if (index > -1)
                intervals.splice(index, 1);
        }, ms);
        return timeout;
    },
    _clearTimeout = function () {
        let timeout = clearTimeout.apply(this, arguments);
        intervals.splice(intervals.indexOf(timeout), 1);
        return timeout;
    },
    _setInterval = function (cb, ms) {
        let interval = setInterval(...arguments);
        intervals.push(interval);
        return interval;
    },
    _clearInterval = function (interval) {
        let timeout = clearInterval(interval);
        intervals.splice(intervals.indexOf(interval), 1);
        return timeout;
    },
    _setImmediate = function () {
        let timeout = setImmediate.apply(this, arguments);
        intervals.push(timeout);
        return timeout;
    },
    _clearImmediate = function () {
        let timeout = clearImmediate.apply(this, arguments);
        intervals.splice(intervals.indexOf(timeout), 1);
        return timeout;
    };

    let intervals = [];
    let sandbox = {
        module: m,
        require: _require,
        console: console,
        process: process,
        Buffer: Buffer,
        setTimeout: _setTimeout,
        clearTimeout: _clearTimeout,
        setInterval: _setInterval,
        clearInterval: _clearInterval,
        setImmediate: _setImmediate,
        clearImmediate: _clearImmediate,
        global: global,
        globalThis: global,
        exports: m.exports,
        //__dirname: path,
        //__filename: fileName,
    };
    let script = '';
    // make the code wait for the promise to resolve

    return await new Promise(async resolve => {
        script = new vm.createScript((`(function () {${content}; return 0;})();`));
        // run in new context
        let result = script.runInNewContext(sandbox);

        // wait for the intervals to finish
        async function wait() {
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        async function check() {
            if (intervals.length) {
                await wait(500)
                check();
            } else {
                return resolve(result);
            }
        }
        check();

        return sandbox.module.exports;
    })
}