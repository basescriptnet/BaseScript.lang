# Variables
> Variable declaration
```sh
let identifier = value
let num, num1 = 1, num2
\num3 # equivalent to let num3
```

#### ***Note: any value becomes immutable***
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
# Arrays
> Array creation
```sh
new Array(length?)
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

# Objects
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

> The *instanceof* operator returns a class (object)
```sh
value instanceof value2
```

# Strings
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

> The *typeof* operator returns a string
```sh
# returns the type of the value
typeof value
typeof(value)
```

# Ternar operator
> Regular JS way
```sh
isNaN(value) ? 1 : 0
isNaN(value) ? isFinite(value) ? 1 : 0 : -1
```

> Shortened way
```sh
isNaN(value) ? 1
isNaN(value) ? 1 : 0
# not implemented yet
isNaN(value) ? isFinite(value) ? 1
```

> With if else
```sh
true if isNaN(value)
true if isNaN(value) else false
```

# Numbers
> Declaration
```sh
# All followings are examples
# of the same Integer 1000
1000
1000.00
1_000
1_000.00
```

> The *sizeof* operator returns a number
```sh
# this returns the length of the object keys
# or if not iterable - 0
sizeof value
sizeof(value)
```

# BigInt
> BigInts are threated as numbers, and return type of Int
```sh
1000n
1_000n
# 1000.00n will throw an error
# floating point numbers are not allowed
```

# LOG, print, WRITE and ERROR keywords
#### ***Note: optional parenthesis are accepted***
> print and LOG
```sh
# they do the same thing
# just a syntax sugar
print 10 # console.log(10)
print(10) # console.log(10)
LOG "hello world" # console.log("hello world")
```

> WRITE
```sh
# appends the message to the HTML body element
# equivalent to document.write() method
WRITE "Message" # document.write("Message")
```

> ERROR
```sh
# equivalent to console.error() method
ERROR "Something went wrong"
# console.error("Something went wrong")
```

# if else statements
> If statement without else
```sh
if num < 0:
    num = 0

if num < 0 {
    num = 0
    num1 = 10
}

if (num < 0):
    num = 0

if (num < 0) {
    num = 0
}
```

> If statement with *else*
```sh
if temperature > 25:
    print "It's hot!"
else print "It's cold!"
```

# Debugger
> Starting the debugger
```sh
if num < 0 {
    debugger
}
```

# try|catch|finally statement
> try without catch and finally
```sh
try: isWorking(1)
# same as:
try {
    isWorking(1)
}
# catch block is automatically inserted
# automatically outputs console.warn(err.message)
```

> try with catch
```sh
try: isWorking(1)
catch: console.error(err)
# variable err is automatically declared

# same as:
try {
    isWorking(1)
} catch err {
    console.error(err)
}
```

> try with finally
```sh
try: isWorking(1)
finally: doSomethingElse()
# same as:
try {
    isWorking()
} finally {
    doSomethingElse()
}
```

