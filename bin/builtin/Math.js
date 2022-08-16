function expect_number(value, name) {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new TypeError(`Unexpected type of argument for "${name}" function. "number" was expected`);
    }
    return value;
}
scopes.append_to_global({
    sin: function (value) {
        expect_number(value, 'sin');
        return Math.sin(value);
    },
    cos: function (value) {
        expect_number(value, 'cos');
        return Math.cos(value);
    },
    tan: function (value) {
        expect_number(value, 'tan');
        return Math.tan(value);
    },
    atan: function (value) {
        expect_number(value, 'atan');
        return Math.atan(value);
    },
    atan2: function (value) {
        expect_number(value, 'atan2');
        return Math.atan2(value);
    },
    abs: function (value) {
        expect_number(value, 'abs');
        return Math.abs(value);
    },
    sqrt: function (value) {
        expect_number(value, 'sqrt');
        return Math.sqrt(value);
    },
    PI: Math.PI,
    E: Math.E,
    ceil: function ceil(value) {
        expect_number(value, 'ceil');
        return Math.ceil(value)
    },
    floor: function floor(value) {
        expect_number(value, 'floor');
        return ~~(value)
    },
    min: function min() {
        for (let i = 0; i < arguments.length; i++) {
            expect_number(arguments[i], 'min');
        }
        return Math.min.apply(null, arguments);
    },
    max: function max() {
        for (let i = 0; i < arguments.length; i++) {
            expect_number(arguments[i], 'max');
        }
        return Math.max.apply(null, arguments);
    },
});