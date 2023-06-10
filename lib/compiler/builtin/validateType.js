BS.validateType = function (value, type, nullable) {
    // can be simplified. Return instantly.
    // may be issues with arrays[]
    let t = null;
    //debugger;
    if (Array.isArray(type)) {
        for (let i in type) {
            if (type[i].indexOf('[]', '') > -1) {
                if (Array.isArray(value)) {
                    let t = true;
                    for (let j in value) {
                        if (!this.validateType(value[j], type[i].replace('[]', ''))) {
                            t = false;
                            break;
                        }
                    }
                    if (t) return true;
                }
            }
            else if (this.customTypes[type[i].replace('[]', '')]) {
                try {
                    t = this.customTypes[type[i].replace('[]', '')](value);
                } finally { }
            }
            else if (this.types[type[i].replace('[]', '')]) t = this.types[type[i].replace('[]', '')](value);
            if (t) return true;
        }
    } else {
        if (this.customTypes[type]) t = this.customTypes[type](value);
        else if (this.types[type]) t = this.types[type](value);
    }
    if (t || nullable && value === null) return true;
    return false;
}

BS.ifTypeExists = function (type) {
    // may be issues with arrays[]
    if (Array.isArray(type)) {
        for (let i in type) {
            if (this.customTypes[type[i].replace('[]', '')]) continue;
            else if (this.types[type[i].replace('[]', '')]) continue;
            throw new TypeError(`Types ${type[i]} do not exist`);
        }
        return type;
    } else {
        if (this.customTypes[type.replace('[]', '')]) return type;
        if (this.types[type.replace('[]', '')]) return type;
    }
    throw new TypeError(`Type ${type} does not exist`);
}
