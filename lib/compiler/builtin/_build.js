// read all files in directory
const fs = require('fs');
const path = require('path');
let content = '';
fs.readdirSync(__dirname).forEach((file, name) => {
    if (!file.endsWith('.js')) return;
    if (file === '_build.js') return;
    if (file === 'index.js') return;

    content += '// @@@ ' + file + '\n';
    content += fs.readFileSync(path.join(__dirname, file), 'utf8');
    content += '// @@@ END ' + file + '\n';
});

// write to index.js
fs.writeFileSync(path.join(__dirname, 'index.js'), content, 'utf8');

console.log('Builtins built successfully')
