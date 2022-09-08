// __dirname and __filename work only with single files
const vm = require('vm');
module.exports = function (content, path, fileName) {
    const sandbox = {
        module: { exports: {} },
        require: require,
        console: console,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        __dirname: path,
        __filename: fileName,
    };
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    return sandbox.module.exports;
}