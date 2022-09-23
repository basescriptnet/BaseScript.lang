
module.exports = {
    read() {
        // for production only compiled grammar is used
        // development code is removed by basescript builder
        // to avoid unnecessary file size increase
        return require('./grammar.js');
    }
}
