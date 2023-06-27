const fs = require('fs')
const parser = require(internalPaths.text_to_ast)
global.pathStack = []
function readFile (fileName) {
    return fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });
}
// string and path are the same, if non code string is provided
module.exports = (string, path, isString) => {
    // if string is provided
    if (isString) {
        try {
            let result = parser(string, path);
            return {
                result: result
            }
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
        pathStack.push(path)
        let result = parser(file, path);
        pathStack.pop()
        return {
            result: result,
            extension: string.substr(string.length - ('.bs'.length))
        }
    } catch (err) {
        console.warn(err)
    }
}
