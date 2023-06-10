BS.expect = function (var_name, value, type) {
    if (this.typeof(value) !== type) {
        if (type in this.customTypes) {
            if (this.customTypes[type](value)) {
                return value
            }
        } else if (type in this.types) {
            if (this.types[type](value)) {
                return value
            }
        }
        throw new TypeError(`"${type}" was expected for "${var_name}", got "${this.typeof(value)}"`);
    }
    return value;
}
