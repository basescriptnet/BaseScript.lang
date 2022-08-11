const fs = require('fs');
const parser = require('./parser.js');
function readFile (fileName) {
    let content = null;
    content = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });
    return content;
}
module.exports = (string) => {
    // if string is provided
    if (!/\.bs$/.test(string)) {
        try {
            let result = parser(string);
            return result;
        } catch (err) {
            console.warn(err)
            return;
        }
    }
    // if file path is provided
    let file = readFile(string);
    try {
        let result = parser(file);
        return result;
    } catch (err) {
        console.warn(err)
    }
}