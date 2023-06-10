globalThis.BS = {
    isArrayOfType(value, type) {
        if (!Array.isArray(value)) return false;
        for (let i in value) {
            if (!this.validateType(value[i], [type.replace('[]')])) return false;
        }
        return true;
    },
    deepFreeze(object) {
        // Retrieve the property names defined on object
        const propNames = Object.getOwnPropertyNames(object);
        // Freeze properties before freezing self
        for (const name of propNames) {
            const value = object[name];

            if (value && typeof value === "object") {
                globalThis.BS.deepFreeze(value);
            }
        }
        return Object.freeze(object);
    },
};
