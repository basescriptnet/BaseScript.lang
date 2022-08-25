// Your code below this line

var $this = globalThis || window || global || this;
if ($this.random && $this.random.getRandom) {
    return null;
}
if (BS.libs.includes["random"]) {
    return null;
}
BS.libs.push("random");

function expect_array_or_string(value, name) {
    const args = Array.from(arguments);
    if ((!Array.isArray(value) && BS.typeof(value) !== "String")) {
        throw new TypeError("Unexpected type of argument for \"random.${name}\" function. \"array\" or \"string\" was expected");
    } else {
        if ((value.length == 0)) {
            throw new Error("Unexpected empty array or string for \"random.${name}\" function");
        }
    }
    return value;
};
$this.random = ({
    ALPHABET: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    getRandom() {
        return Math.random();
    },
    int(min, max) {
        BS.checkArgType("Float", "min", arguments[0] ?? null, 23, 8);
        BS.checkArgType("Float", "max", arguments[1] ?? null, 23, 8);
        return Math.floor(BS.sum(BS.mul(random.getRandom(), (BS.sub(Math.round(max), Math.round(min)))), Math.round(min)));
    },
    intInclusive(min, max) {
        BS.checkArgType("Float", "min", arguments[0] ?? null, 29, 17);
        BS.checkArgType("Float", "max", arguments[1] ?? null, 29, 17);
        return random.int(min, BS.sum(max, 1));
    },
    float(min, max) {
        BS.checkArgType("Float", "min", arguments[0] ?? null, 35, 10);
        BS.checkArgType("Float", "max", arguments[1] ?? null, 35, 10);
        return BS.sum(BS.mul(random.getRandom(), (BS.sub(max, min))), min);
    },
    floatInclusive(min, max) {
        BS.checkArgType("Float", "min", arguments[0] ?? null, 41, 19);
        BS.checkArgType("Float", "max", arguments[1] ?? null, 41, 19);
        return random.float(min, BS.sum(max, 1));
    },
    boolean() {
        return random.getRandom() > 0.5;
    },
    element(array) {
        expect_array_or_string(array, "element");
        return array[random.int(0, array.length)];
    },
    string(length) {
        BS.checkArgType("Int", "length", arguments[0] ?? null, 54, 11);
        let result = "";
        for (let i of range(0, length, false)) {
            result += random.element(random.ALPHABET);
        }
        return result;
    },
    stringFromSample(sample, length) {
        BS.checkArgType("String", "sample", arguments[0] ?? null, 63, 21);
        BS.checkArgType("Int", "length", arguments[1] ?? null, 63, 21);
        if ((sample.length == 0)) {
            throw new TypeError("Unexpected type of argument for \"random.stringFromSample\" function. \"string\" was expected");
        }
        let result = "";
        for (let i of range(0, length, false)) {
            result += random.element(sample);
        }
        return result;
    },
    shuffle(array) {
        expect_array_or_string(array, "shuffle");
        let curId = array.length;
        let copy = [];
        if (BS.typeof(array) == "String") {
            copy = array.split("");
        } else {
            copy = array.slice();
        }
        while (0 !== curId) {
            let randId = Math.floor(BS.mul(Math.random(), curId));
            curId -= 1;
            let tmp = copy[curId];
            copy[curId] = copy[randId];
            copy[randId] = tmp;
        }
        if (BS.typeof(array) == "String") {
            return copy.join("");
        }
        return copy;
    },
});