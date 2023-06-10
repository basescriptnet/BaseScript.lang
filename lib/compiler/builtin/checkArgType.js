BS.checkArgType = function (type, name, value, line, col) {
    label:
    for (let i = 0; i < type.length; i++) {
        let is_array = type[i].slice(-2) === '[]';
        let clearType = type[i];
        if (is_array) {
            clearType = clearType.slice(0, -2);
        }
        BS.ifTypeExists(clearType);
        if (is_array) {
            if (!this.types['Array'](value)) {
                continue;
            }
            for (let j = 0; j < value.length; j++) {
                if (!this.validateType(value[j], clearType)) {
                    continue label;
                }
            }
            return value;
        }
        if (this.validateType(value, type[i])) {
            return value;
        }
    }
    //if (type in this.customTypes) {
    //    let r = BS.customTypes[type];
    //    if (r && r(value))
    //        return true;
    //}
    //if (type in this.types) {
    //    let r = BS.types[type];
    //    if (r && r(value))
    //        return true;
    //}
    throw new TypeError(`Argument "${name}" is not type of "${type.join(' | ')}" at line ${line}, col ${col}.`);
}
