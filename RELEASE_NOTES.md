### Release Notes:

### [0.2.71]

## Fixed builtin files associated with typed arguments

### [0.2.7]

## Builtin files load error fixed

> On the previous version, the default file was not being loaded correctly. Now, it is fixed

## `times` keyword is added

> Followed by a number, this keyword allowes you to repeat an action several times

```js
3 times {
    print 'hello world!'
}
```

> Note: floating point numbers are instantly floored; `times` is not a reserved keyword

### [0.2.6]

## Chained `->` function executions

> `->` operator can be used to execute a function multiple times, and return an array with results

```js
let elementsToWatch = document.querySelector->(
    '#item1',
    '#item2',
    '#item6'
)
// ... do something with the array
```

> To call the function with multiple arguments, use `&` prefix with `()`

```js
// read files, and join them with a new line
let code = fs.readFileSync->(
    &(path1, 'utf8'),
    &(path2, 'utf8'),
    &(path3, 'utf8')
).join('\n')
```

## `~/` operator is added

> `~/` is used to do division values with floating part drop

```js
5 / 2 // 2.5
5 ~/ 2 // 2
```

## `when` keyword now is accessible on multiline

```js
while true {
    x += 1
    break
        when x > 1_000
}
```

### [0.2.5]

## End Of Line token fixed

> EOL token had a bug, that could accidentally match strings. Now, it is fixed

## JavaScript Import Statements

> JavaScript module imports are now available to use
> Note: you don't have to use `{}` to import multiple items from the import

```js
// import everything
import * as lib from 'lib'
// import specific items
import min, max from 'math'
// solly import
import 'addon'
// import with aliases
import sin as s, cos as c from 'math'
```

## JavaScript-like exports

```js
export function doSomething() {
    //...your code here
}
export mainValue // automatically converted to export { mainValue }
export const someConst = 10
export let a = 10
```

### [0.2.4]

## Multiline strings fixed

> `\n` and `\r` now are replaced with `\x0A` and `\x0D` respectively

## Template Strings fix

> You can use JavaScript like template literals, and use `${}` to insert a BaseScript syntax

```js
`Hello, ${clients[].name}` //get the last client's name
```

## Arrow functions

> Now, arrow functions supported

```js
let func = (Int a, Int b) => {a + b} // automatically returns

// Not supported
let func = (Int a, Int b) =>: a + b
let func = (Int a, Int b) => do a + b
```

> Note: inline arrow functions are not implemented yet. Use block level scopes instead, as a single statemented scope will automatically return the result, if possible

## Return, break, continue statement syntax addition

> You can use this statements with a condition usigng `when` and `when not` keywords

```js
while i < sizeof array {
    break when not array[i] == true
    i++
}

let result = ''
for i in object {
    continue when typeof object[i] != 'String'
    result += object[i]
}

function someFunction(a, b) {
    return false when not a instanceof b
    return when a instanceof SomeClass
}
```

## If Else Block fix

> Now you can use the `else if` block with more ease

```js
if a: 10
else if b: 20
else if c: 30
else: 40
```

## Support for keywords as class method names

```js
class Country {
    constructor() {}
    import() {}
    export() {}
}
```

## Code execution with improved global variable access

```js
global.a = 10
// before
print global.a
// now
print a // 10
```

## Rest operator for function arguments

```js
function values(...all_args) {
    print all_args
}
```

## Variable destructuring assignment

> Note: rest operator will be added in upcoming releases for this syntax

```js
let {a, b, c} = object
// same as
let a = object.a
let b = object.b
let c = object.c
```

## Removal of mandatory `__dirname` and `__filename` variables

> If you want to get the basescript file or directory, use:
```sh
@dirname
```
and
```sh
@filename
```

## Dot property addition

```js
let z = {message: 'hello', type: 'string'}
let object = {}
// later on in your code
object.{
    formal: true,
    ...z
}
print object
// output: { message: 'hello', type: 'string', formal: true }
```

> This is a quicker way to add properties or methods to your object.

## Arrow operator

> Arrow operator returns an array of values, which derive from the original object/array. It can be used to call methods, retract an item, get a value of the property, or simply to store some data

```js
let builder = {
    prepare() {
        return doSomePreparation()
    },
    isOK() {
        return true
    },
    isDone() {
        return false
    }
}
// using the arrow operator
let project = builder->[
    prepare(),
    isOK(),
    isDone()
]
// we can retract data as folows
project[1] // true
```

> BaseScript projects builder already uses this operator

```js
builder->[
    //emptyDir(),
    closurify(),
    git(),
    packageJSON(),
    //npm(),
    copyFolders(),
    waitForCli()
]
```

## @ignore closure

> `@ignore` is a block level element, that can be used to exclude the content of the block body inside the final file

> Note: key difference between a comment and an `@ignore` block is that your code still needs to be valid

```js
// uncomment if not in production
@ignore:
getDeveloperTools() // this will not appear in the final file

// neither will this
@ignore {
    getDeveloperTools(@dirname)
}
```

## Switch statement as a value

> Now, you can use the `switch*` statement as a value

```js
let number = switch* typeof n {
    case 'Number': n
    default: 0
}
```

> Note: `case`s automatically return value and may contain only one statement

## Swtich case with breaks

> You can use `case*` to automatically break the case

```js
switch n {
    case 1:
        console.log(1)
        break
    // same as
    case* 2:
        console.log(2)
}
```
