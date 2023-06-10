BS.last = function (number) {
    return number > 0 ? number - 1 : 0;
}

const TypedArrays = Reflect.getPrototypeOf(Int8Array);
for (const C of [Array, String, TypedArrays]) {
    BS.defineProperty(C.prototype, "at", function at(n) {
        // ToInteger() abstract op
        n = Math.trunc(n) || 0;
        // Allow negative indexing from the end
        if (n < 0) n += this.length;
        // OOB access is guaranteed to return undefined
        if (n < 0 || n >= this.length) return undefined;
        // Otherwise, this is just normal property access
        return this[n];
    });
    BS.defineProperty(C.prototype, "last", function last() {
        return this[this.length-1];
    });
}
