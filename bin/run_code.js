const vm = require('vm');

class Executor {
    constructor(content, path) {
        this.path = path
        this.intervals = []
        this.sandbox = {}
        this.script = ''
        this.content = content
    }
    fixArguments() {
        process.argv[0] = 'BaseScript';
        process.argv[1] = this.path;
        process.argv = process.argv.slice(0, 2);
        if (global.CLIArguments.length)
            process.argv.push(global.CLIArguments.join(' '));

        module.paths.push(this.path.replace(/\//g, '\\'));
        return this
    }
    removeGlobals() {
        delete global.CLIArguments;
        delete global.internalPaths;
        delete global.extension;
        delete global.pathJS;
        delete global.baseUrl;
        delete global.development;
        require.main.children = [];
        return this
    }
    initModuleAndRequire() {
        let Module = require('module');
        //create a new module
        this.m = new Module()
        const path = this.path,
            m = this.m
        m.filename = path
        m.paths = module.paths
        // make the require relative to path
        this._require = Module.createRequire(require.resolve(path))
        let _require = this._require
        //require the module
        _require.main = this.m
        _require.paths = m.paths
        _require.cache = m.children
        _require.main.filename = path
        _require.main.paths = m.paths
        _require.main.children = []
        _require.main.exports = void (0)
        _require.main.loaded = false
        _require.main.id = path
        return this
    }
    isolateIntervals() {
        let intervals = this.intervals;
        this._setTimeout = function (cb, ms) {
            let timeout = setTimeout.apply(this, arguments);
            intervals.push(timeout);
            setTimeout(() => {
                let index = intervals.indexOf(timeout);
                if (index > -1)
                    intervals.splice(index, 1);
            }, ms);
            return timeout;
        }
        this._clearTimeout = function () {
            let timeout = clearTimeout.apply(this, arguments);
            intervals.splice(intervals.indexOf(timeout), 1);
            return timeout;
        }
        this._setInterval = function (cb, ms) {
            let interval = setInterval(...arguments);
            intervals.push(interval);
            return interval;
        }
        this._clearInterval = function (interval) {
            let timeout = clearInterval(interval);
            intervals.splice(intervals.indexOf(interval), 1);
            return timeout;
        }
        this._setImmediate = function () {
            let timeout = setImmediate.apply(this, arguments);
            intervals.push(timeout);
            return timeout;
        }
        this._clearImmediate = function () {
            let timeout = clearImmediate.apply(this, arguments);
            intervals.splice(intervals.indexOf(timeout), 1);
            return timeout;
        }
        return this
    }
    createSandBox() {
        this.sandbox = {
            module: this.m,
            require: this._require,
            console: console,
            process: process,
            Buffer: Buffer,
            setTimeout: this._setTimeout,
            clearTimeout: this._clearTimeout,
            setInterval: this._setInterval,
            clearInterval: this._clearInterval,
            setImmediate: this._setImmediate,
            clearImmediate: this._clearImmediate,
            global: global,
            globalThis: global,
            exports: this.m.exports,
            //__dirname: path,
            //__filename: fileName,
        }
        return this
    }
    handleIntervals() {
        this.script = new vm.createScript((

`(function () {
    try{
${this.content};
} catch (err) {
    console.error('Execution failed');
    console.error(err);
} finally {
    return 0;
}})();`

        ), this.path);
        // run in new context
        this.script.runInNewContext(this.sandbox)
        async function wait() {
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        let intervals = this.intervals;
        async function check() {
            if (intervals.length) {
                await wait(500)
                check();
            }
        }
        check();
        return this
    }
    export() {
        return this.sandbox.module.exports;
    }
}

module.exports = function run_code(content, path) {
    return new Executor(content, path)
        .fixArguments()
        .removeGlobals()
        .initModuleAndRequire()
        .isolateIntervals()
        .createSandBox()
        .handleIntervals()
        .export()
}
