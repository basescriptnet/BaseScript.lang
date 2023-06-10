BS.delete = function (value, index) {
    // if (typeof value === 'string') {
    //     return value.substring(0, index) + value.substring(index+1, value.length);
    // }
    Array.prototype.splice.call(value, index, 1);
    return value;
}
