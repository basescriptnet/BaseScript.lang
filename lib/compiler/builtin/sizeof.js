BS.sizeof = function (object) {
    if (object === void 0 || object === null)
        return 0;
    if (object instanceof Set || object instanceof Map)
        return object.size;
    if (object instanceof Array || object instanceof String)
        return object.length;
    return Object.keys(object).length;
}
