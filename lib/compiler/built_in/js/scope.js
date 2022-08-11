const range = function range(start, stop, include = false) {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    if (include) {
        if (start > stop) {
            stop--;
        } else {
            stop++
        }
    }
    let i = start; // start
    return { // iterator protocol
        [Symbol.iterator]: () => { // @@iterator
            return { // object with the next function
                next() {
                    while (i !== stop) {
                        let temp = i;
                        if (start > stop) i--;
                        else i++;
                        return {
                            value: temp,
                            done: false,
                        }
                    }
                    return { done: true }
                }
            }
        }
    }
};
const isNaN = function isNaN(number) {
    return typeof number == 'number' && number !== number;
}
class Variable {
    constructor(name, type, value, constant = false, ignoreError = false) {
        this.name = name;
        this.type = type;
        this.value = value === void 0 ? null : value;
        this.constant = constant;
        this.ignoreError = ignoreError
    }
    set realValue(value) {
        if (this.constant && !this.ignoreError) {
            throw new Error(`Attempt to change value of constant "${this.name}"`)
        } else if (this.constant) {
            return this.value;
        }
        if (this.type == 'let' || this.type == '\\'
            //|| this.type === null
        ) return this.value;
        if (this.type !== null && BS.getType(value) != this.type) {
            throw new TypeError(`Assignment of a different type to variable "${this.name}" rather than "${this.type}" is prohibited`)
        }
        this.value = value;
    }
    get realValue () {
        return get_clear_value(this.value);
    }
}

class Scopes {
    constructor() {
        this.scopes = []
    }
    new(level, parent = this) {
        let scope = new Scope(level, parent);
        parent.scopes.push(scope);
        return scope
    }
    global() {
        let scope0 = this.new(0);
        scope0.set('PI', Math.PI, true, true);
        scope0.set('E', Math.E, true, true);
        scope0.set('range', range, true, true);
        scope0.set('this', scope0.variables, true, true, true);
        scope0.set('Infinity', Infinity, true, true);
        scope0.set('NaN', NaN, true, true);
        scope0.set('isNaN', isNaN, true, true);
        scope0.set('empty', function empty(object) {
            if (['array', 'string', 'object'].includes(typeof object)) {
                return Object.keys(object).length == 0;
            }
            throw new TypeError(`Unexpected type of argument for "empty" function. "array", "string" or "object" was expected`)
        }, true, true);
        scope0.set('round', function round(object) {
            return Math.round(object)
        }, true, true);
        scope0.set('ceil', function ceil(object) {
            return Math.ceil(object)
        }, true, true);
        scope0.set('floor', function floor(object) {
            return Math.floor(object)
        }, true, true);
        //scope0.set('Object', BS.Object.bind(BS, true, true);
        //scope0.set('Array', BS.Array.bind(BS, true, true);
        return scope0;
    }
}

class Scope {
    constructor(level, parent) {
        this.level = level
        this.variables = {}
        this.scopes = []
        this.parent = parent
    }
    get(propertyName) {
        if (this.variables[propertyName] !== void 0) {
            return this.variables[propertyName].realValue
        }
        let level = this.level
        if (level == 0 || !this.parent) {
            console.warn(`Variable "${propertyName}" has never been declared. "null" is returned instead.`)
            return null
            //throw ReferenceError(`Variable "${propertyName}" has never been declared.`)
        }
        return this.parent.get(propertyName);
    }
    getScope(propertyName) {
        if (this.variables[propertyName]) {
            return this
        }
        let level = this.level
        if (level == 0 || !this.parent) return null
        return this.parent.getScope(propertyName)
    }
    set(propertyName, value, local = false, constant = false, ignoreError = false) {
        if (local || constant) {
            let v = this.variables[propertyName]
            if (!v) {
                this.variables[propertyName] = new Variable(propertyName, null, value, constant, ignoreError)
            }
            else {
                this.variables[propertyName].realValue = value;
            }
            return null;
        }
        let scope = this.getScope(propertyName)
        // not found
        if (scope == null) {
            scope = this;
        }
        let v = scope.variables[propertyName]
        if (!v) {
            scope.variables[propertyName] = new Variable(propertyName, null, value, constant)
        }
        else {
            scope.variables[propertyName].realValue = value;
        }
        return null;
    }
}

const scopes = new Scopes();
const scope0 = scopes.global();

