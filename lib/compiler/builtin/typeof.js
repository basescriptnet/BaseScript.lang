BS.types = {
    RegExp(value) {
        return value instanceof RegExp;
    },
    Array(value) {
        return Array.isArray(value);
    },
    Null(value) {
        return value === null;
    },
    Undefined (value) {
        return value === void 0;
    },
    Int(value) {
        return parseInt(value) === value && !Number.isNaN(value);
    },
    Float(value) {
        return typeof value === 'number' && !Number.isNaN(value);
    },
    Number(value) {
        return typeof value === 'number' && !Number.isNaN(value);
    },
    BigInt(value) {
        return typeof value === 'bigint';
    },
    NaN(value) {
        return Number.isNaN(value);
    },
    String(value) {
        return typeof value === 'string';
    },
    Function(value) {
        return typeof value === 'function';
    },
    Symbol(value) {
        return typeof value === 'symbol';
    },
    Boolean(value) {
        return typeof value === 'boolean';
    },
    Object(value) {
        if (BS.types.HTML && BS.types.HTML(value)) {
            return false;
        }
        if (BS.types.Array(value)) return false;
        return typeof value === 'object' && value !== null;
    },
}
BS.curstomTypes = {Any: () => true};
BS.typeof = function (value) {
    for (let i in this.types) {
        try {
            if (this.types[i](value)) return i;
            //if (this.curstomTypes[i](value)) return i;
        } catch (err) {continue}
    }
}
