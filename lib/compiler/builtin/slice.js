BS.slice = function (value, start, end, step = 1, line, col) {
    if (!Array.isArray(value) && typeof value != 'string') {
        throw new TypeError(`Array or string was expected at line ${line}, col ${col}`);
    }
    if (typeof start != 'number') {
        throw new TypeError(`Number was expected at line ${line}, col ${col}`);
    }
    if (end === null && step === null) {
        return value.slice(start);
    }
    step = step|0;
    if (step >= 0) step = 1;
    else step = -1;
        // throw new Error(`Step argument on slicing must not be zero at line ${line}, col ${col}`);
    // if (step !== 1 && step !== -1)
    //     throw new Error(`Step must be 1 or -1 at ${line}, col ${col}`);
    let result = value.slice(start, end);
    if (step === -1) {
        if (typeof value === 'string')
            return Array.from(result).reverse().join('');
        return result.reverse();
    }
    return result;
}
