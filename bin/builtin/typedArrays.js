
// Your code below this line

if (BS.libs.includes("typedArrays")) {
    return null;
}
BS.libs.push("typedArrays");
var types = ["Int", "Float", "String", "Boolean", "Function", "Array", "Object"];
BS.defineProperty(Array.prototype, "isTypeof", function isTypeOf(value) {
    const args = Array.from(arguments);
    BS.checkArgType("String", "value", arguments[0] ?? null, 7, 65);
    if (BS.customTypes[value] != void(0)) {
        return BS.customTypes[value](this);
    }
    return false;
});
for (let i of range(0, types.length, false)) {
    let t = types[i];
    BS.customTypes[BS.sum(t, "Array")] = (function(value) {
        const args = Array.from(arguments);
        if (BS.typeof(value) !== "Array") {
            return false;
        }
        for (let j of range(0, value.length, false)) {
            if (BS.typeof(value[j]) !== t) {
                return false;
            }
        }
        return true;
    });
}