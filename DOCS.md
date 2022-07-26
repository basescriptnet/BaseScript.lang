# BaseScript Language
BaseScript is a programming language, which aims to compile your code to JavaScript.

This page represents the simple to follow documentation of the language.

[How to contact the creators](#how-to-contact-the-creators)<br>
[Contents](#contents)

## How to contact the creators

Email: [basescriptnet<wbr>@gmail.com](mailto://basescriptnet@gmail.com)<br>
Telegram: @basescript<br>
Website: [BaseScript.net](https://basescript.net/)<br>
GitHub: [BaseScript.lang](https://github.com/basescriptnet/BaseScript.lang)<br>
YouTube: [BaseScript Channel](https://www.youtube.com/channel/UCmNoL3N13lRHbcGYT8vr6lA)

## Contents
 - [Getting started](#getting-started)
 - [How to contact the creators](#how-to-contact-the-creators)
 - [Variables](#variables)
 - [Arrays](#arrays)
 - [Objects](#objects)
 - [Strings](#strings)
 - [Ternar operator](#ternar-operator)
 - [Numbers](#numbers)
 - [BigInts](#bigInts)
 - [LOG, print, WRITE and ERROR keywords](#log-print-WRITE-and-ERROR-keywords)
 - [Conditions](#conditions)
 - [if else statements](#if-else-statements)
 - [Debugger](#debugger)
 - [try|catch|finally statement](#try-catch-finally-statement)

## Getting started
> At any directory use

```sh
bs <file_name> options?
```
> For help use

```sh
bs -help
```

> To install globally after downloading, you can use

```sh
npm install -g ./
```

## Variables

> Variable declaration

```
let identifier = value
let num, num1 = 1, num2
\num3 # equivalent to let num3
```

#### ***Note: any value becomes immutable***

> Const declaration

```
const identifier = value
```

> Variable or value reassignment

```
identifier = value
array[0] = value
```

> Variable or value reassignment

```
identifier = value
Object.doSomething = value
```

## Arrays

> Array creation

```
new Array(length?)
[0, 1, 2]
```

> Getting an item from an array

```
array[index]
```

> Getting a slice of an array

```
# @params start:end[:direction(1 or -1)]
# direction is optional
array[start:end:direction]
```

> Getting the last element of the array

```
array[]
```

> Reassigning to the last element of the array

```
array[] = value
```

## Objects

> Object creation

```
new Object() # not recomended
{ x: 1 }
```

> Accessing items of the object

```
object.x
object['x']
```

> The *instanceof* operator returns a class (object)

```
value instanceof value2
```

## Strings

> String creation

```
new String() # not recomended
"Hello world"
'Programming is awesome'
`I am a
multiline string!`
```

> String item retraction

```
"Hello world"[4] # outputs 'o'
```

> String last item retraction

```
"Hello world"[] # outputs 'd'
```

> String slice

```
# @params start:end[:direction(1 or -1)]
"Hello world"[0:5:-1] # outputs 'olleH'
```

> The *typeof* operator returns a string

```
# returns the type of the value
typeof value
typeof(value)
```

## Ternar operator

> Regular JS way

```
isNaN(value) ? 1 : 0
isNaN(value) ? isFinite(value) ? 1 : 0 : -1
```

> Shortened way

```
isNaN(value) ? 1
isNaN(value) ? 1 : 0
# not implemented yet
# use isNaN(value) and isFinite(value) ? 1 instead
isNaN(value) ? isFinite(value) ? 1
```

> With if else

```
true if isNaN(value)
true if isNaN(value) else false
```

## Numbers

> Declaration

```
# All followings are examples
# of the same Integer 1000
1000
1000.00
1_000
1_000.00
```

> The *sizeof* operator returns a number

```
# this returns the length of the object keys
# or if not iterable - 0
sizeof value
sizeof(value)
```

## BigInt

> BigInts are threated as numbers, and return type of Int

```
1000n
1_000n
# 1000.00n will throw an error
# floating point numbers are not allowed
```

## LOG, print, WRITE and ERROR keywords

#### ***Note: optional parenthesis are accepted***

> print and LOG

```
# they do the same thing
# just a syntax sugar
print 10 # console.log(10)
print(10) # console.log(10)
LOG "hello world" # console.log("hello world")
```

> WRITE

```
# appends the message to the HTML body element
# equivalent to document.write() method
WRITE "Message" # document.write("Message")
```

> ERROR

```
# equivalent to console.error() method
ERROR "Something went wrong"
# console.error("Something went wrong")
```

## Conditions

> If statement without else

```
num > 0
num > 0 and num < 5 or num == undefined
```

## if else statements

> If statement without else

```
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

```
if temperature > 25:
    print "It's hot!"
else print "It's cold!"
```

## Debugger

> Starting the debugger

```
if num < 0 {
    debugger
}
```

## try|catch|finally statement

> try without catch and finally

```
try: isWorking(1)
# same as:
try {
    isWorking(1)
}
# catch block is automatically inserted
# automatically outputs console.warn(err.message)
```

> try with catch

```
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

```
try: isWorking(1)
finally: doSomethingElse()
# same as:
try {
    isWorking()
} finally {
    doSomethingElse()
}
```

## Even more is coming soon!

> The documentation is not final, and more examples and syntax sugar tricks will be added

> We are constantly updating, fixing and adding new features!