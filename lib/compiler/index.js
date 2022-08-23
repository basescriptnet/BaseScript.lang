const fs = require('fs');
const parser = require('./text_to_ast.js');
function readFile (fileName) {
    let content = null;
    // try {
        content = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });
    // } catch (err) {
    //     throw err;
    // }
    return content;
}
module.exports = (string, extension) => {
    // if string is provided
    if (!/\.b(s|m)$/.test(string)) {
        try {
            let result = parser(string);
            return {
                result: result
            };
        } catch (err) {
            console.log(err)
            return;
        }
    }
    // if file path is provided
    let file = readFile(string);
    try {
        let result = parser(file);
        return {
            result: result,
            extension: string.substr(string.length - ('.bs'.length))
        };
    } catch (err) {
        console.warn(err)
    }
}