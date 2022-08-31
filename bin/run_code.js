module.exports = function (content) {
    let module = { exports: {} };
    eval(content);
    return module.exports;
}