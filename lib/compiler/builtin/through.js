BS.through = function (value0, value1, line, col) {
    if (typeof value0 != 'number' || typeof value1 != 'number') {
        throw new TypeError(`Number is expected on the line ${line}, col ${col}.`);
    }
    let output = [];
    let min = Math.min(value0, value1);
    let max = Math.max(value0, value1);
    for (let i = min; i <= max; i++) {
        output.push(i);
    }
    if (value0 != min)
        output = output.reverse();
    return output;
}
