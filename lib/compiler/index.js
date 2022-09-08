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
// string and path are the same, if non code string is provided
module.exports = (string, extension, path) => {
    // if string is provided
    if (!/\.b(s|m)$/.test(string)) {
        try {
            let result = parser(string, path);
            return {
                result: result
            };
        } catch (err) {
            console.log(err)
            return;
        }
    }
    // if file path is provided
    // sometimes, but not often, fs.readFileSync returns '' instead of the text content
    let file, secureNumber = 10;
    do {
        file = readFile(string);
    } while (file === '' && secureNumber-- > 0); // to make sure we do not get an infinite loop

    try {
        let result = parser(file, path);
        return {
            result: result,
            extension: string.substr(string.length - ('.bs'.length))
        };
    } catch (err) {
        console.warn(err)
    }
}