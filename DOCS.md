## Variables
> Variable declaration
```sh
let identifier = value
let num, num1 = 1, num2
\num3 # equivalent to let num3
```

> Const declaration
```sh
const identifier = value
```

> Variable or value reassignment
```sh
identifier = value
array[0] = value
```

> Variable or value reassignment
```sh
identifier = value
Object.doSomething = value
```

## Arrays
> Array creation
```sh
new Array()
[0, 1, 2]
```

> Getting an item from an array
```sh
array[index]
```

> Getting a slice of an array
```sh
# @params start:end[:direction(1 or -1)]
# direction is optional
array[start:end:direction]
```

> Getting the last element of the array
```sh
array[]
```

> Reassigning to the last element of the array
```sh
array[] = value
```

## Objects
> Object creation
```sh
new Object() # not recomended
{ x: 1 }
```

> Accessing items of the object
```sh
object.x
object['x']
```

## Strings
> String creation
```sh
new String() # not recomended
"Hello world"
'Programming is awesome'
`I am a
multiline string!`
```

> String item retraction
```sh
"Hello world"[4] # outputs 'o'
```

> String last item retraction
```sh
"Hello world"[] # outputs 'd'
```

> String slice
```sh
# @params start:end[:direction(1 or -1)]
"Hello world"[0:5:-1] # outputs 'olleH'
```

## Ternar operator
> Regular JS way
```sh
isNaN(value) ? 1 : 0
isNaN(value) ? isFinite(value) ? 1 : 0 : -1
```

> Shortened way
```sh
isNaN(value) ? 1
# not implemented yet
isNaN(value) ? isFinite(value) ? 1
```

> With if else
```sh
true if isNaN(value)
true if isNaN(value) else false
```
