### Release Notes:

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
