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
    'block_level',
    'basescript',
    'retraction',
    'switch',
    'classes',
    'if_else',
    'try_catch',
    'variables',
    'loops',
    'functions',
    'condition',
    'debugging',
    'html',
    'array',
    'value',
    'whitespace',
].map(i => readFile(`${__dirname}/${i}.ne`));

module.exports = structure.join('\n');
