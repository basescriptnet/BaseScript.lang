BS.operation = function (operationSign) {
    switch (operationSign) {
        case '+':
            return this.sum;
        case '-':
            return this.sub;
        case '*':
            return this.mul;
        case '/':
            return this.div;
        case '%':
            return this.mod;
        case '**':
            return this.pow;
        default:
            throw new TypeError(`Unknown operation ${operationSign}`);
    }
}
BS.sum = function (value1, value2) {
    if (typeof value1 === 'string') {
        if (typeof value2 !== 'string') {
            throw new TypeError('String was expected for concatination, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1.concat(value2);
    }
    if (BS.types.Number(value1)) {
        if (!BS.types.Number(value2)) {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 + value2;
    }
    if (Array.isArray(value1)) {
        return [].concat(value1, value2);
    }
    if (BS.types.Object(value1) && BS.types.Object(value2)) {
        return Object.assign({}, value1, value2);
    }
    //if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
    //    throw new TypeError('"null" or "undefined" cannot be used in math expressions');
    //}
    throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.sub = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 - value2;
    }
    throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.pow = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return Math.pow(value1, value2);
    }
    throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.div = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 / value2;
    }
    throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.mod = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 % value2;
    }
    throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
BS.mul = function (value1, value2) {
    if (value1 === null || value1 === void 0 || value2 === null || value2 === void 0) {
        throw  new TypeError('"null" or "undefined" cannot be used in math expressions');
    }
    if (typeof value1 === 'string') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for repeated concatination, got "'+BS.typeof(value2)+'" insetead');
        }
        let result = '';
        for (let i = 0; i < value2; i++) {
            result += value1;
        }
        return result;
    }
    if (typeof value1 === 'number') {
        if (typeof value2 !== 'number') {
            throw new TypeError('Number was expected for math expression, got "'+BS.typeof(value2)+'" insetead');
        }
        return value1 * value2;
    }
    throw new TypeError('Number or String was expected for math expression, got "'+BS.typeof(value1)+'" insetead');
}
