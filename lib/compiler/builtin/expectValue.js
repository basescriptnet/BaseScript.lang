// TODO: expectValue and checkArgType are the same
BS.expectValue = function (value, type) {
    //let found = false;
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
    //if (this.validateType(value, type)) {
    //    return value;
    //}
    throw new TypeError(`Value type of "${type.join(' | ')}" was expected, got "${this.typeof(value)}"`);
}
