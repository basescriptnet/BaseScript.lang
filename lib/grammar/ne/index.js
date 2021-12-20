const fs = require('fs');
const readFile = function (path) {
    try {
        return fs.readFileSync(path, 'utf-8');
    } catch (err) {
        console.error(err.message)
        return '';
    }
}
const structure = [
    'basescript',
    // 'statements',
    // 'whitespace'
].map(i => readFile(`${__dirname}/${i}.ne`));
// console.log(readFile(`@/basescript.ne`))
module.exports = structure.join('\n');
