const fs = require('fs');
const parser = require('./parser.js');
function readFile (fileName) {
    let content = null;
    // try {
        content = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });
    // } catch (err) {
    //     throw err;
    // }
    return content;
}
module.exports = (string) => {
    // if string is provided
    console.log(1)
    if (!/\.bs$/.test(string)) { 
        try {
            let result = parser(string);
            return result;
        } catch (err) {
            console.log(err)
            return;
        }
    }
    // if file path is provided
    let file = readFile(string);
    try {
        let result = parser(file);
        return result;
    } catch (err) {
        console.log(err)
    }
}