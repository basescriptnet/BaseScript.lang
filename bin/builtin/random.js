function expect_array_or_string(value, name) {
    if (!Array.isArray(value) && typeof value !== 'string') {
        throw new TypeError(`Unexpected type of argument for "random.${name}" function. "array" or "string" was expected`);
    } else if (value.length == 0) {
        throw new Error(`Unexpected empty array or string for "random.${name}" function`);
    }
    return value;
}
const random = {
    ALPHABET: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    getRandom() {
        return Math.random();
    },
    int(min, max) {
        if (typeof min != 'number' || isNaN(min) || typeof max != 'number' || isNaN(max)) {
            throw new TypeError(`Unexpected type of argument for "random.int" function. "number" was expected`);
        }
        return ~~(random.getRandom() * (max|0 - min|0) + min|0);
    },
    intInclusive(min, max) {
        if (typeof min != 'number' || isNaN(min) || typeof max != 'number' || isNaN(max)) {
            throw new TypeError(`Unexpected type of argument for "random.intInclusive" function. "number" was expected`);
        }
        return random.int(min, max + 1);
    },
    float(min, max) {
        if (typeof min != 'number' || isNaN(min) || typeof max != 'number' || isNaN(max)) {
            throw new TypeError(`Unexpected type of argument for "random.float" function. "number" was expected`);
        }
        return random.getRandom() * (max - min) + min;
    },
    floatInclusive(min, max) {
        if (typeof min != 'number' || isNaN(min) || typeof max != 'number' || isNaN(max)) {
            throw new TypeError(`Unexpected type of argument for "random.floatInclusive" function. "number" was expected`);
        }
        return random.float(min, max + 1);
    },
    boolean() {
        return random.getRandom() > 0.5;
    },
    element(array) {
        expect_array_or_string(array, 'element');
        return array[random.int(0, array.length)];
    },
    string(length) {
        if (typeof length !== 'number' || isNaN(length)) {
            throw new TypeError(`Unexpected type of argument for "random.string" function. "number" was expected`);
        }
        let result = '';
        for (let i = 0; i < length; i++) {
            result += random.element(random.ALPHABET);
        }
        return result;
    },
    stringFromSample(sample, length) {
        if (typeof sample != 'string' || sample.length == 0) {
            throw new TypeError(`Unexpected type of argument for "random.stringFromSample" function. "string" was expected`);
        }
        if (typeof length !== 'number' || isNaN(length)) {
            throw new TypeError(`Unexpected type of argument for "random.stringFromSample" function. "number" was expected`);
        }
        let result = '';
        for (let i = 0; i < length; i++) {
            result += random.element(sample);
        }
        return result;
    }
}
scopes.append_to_global({
    random: random
});