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
 - [BigInts](#bigint)
 - [LOG, print, WRITE and ERROR keywords](#log-print-write-and-error-keywords)
 - [Conditions](#conditions)
 - [if else statements](#if-else-statements)
 - [Debugger](#debugger)
 - [try|catch|finally statement](#trycatchfinally-statement)
 - [Switch cases](#switch-cases)

## Getting started

> Install via npm

```sh
npm i basescript.js -g
```

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

```javascript
let identifier = value
let num, num1 = 1, num2
\num3 // equivalent to let num3
```

#### ***Note: any value becomes immutable***

> Const declaration

```javascript
const identifier = value
```

> Variable or value reassignment

```javascript
identifier = value
array[0] = value
```

> Variable or value reassignment

```javascript
identifier = value
Object.doSomething = value
```

## Arrays

> Array creation

```javascript
new Array(length?)
[0, 1, 2]
```

> Getting an item from an array

```javascript
array[index]
```

> Getting a slice of an array

```javascript
// @params start:end[:direction(1 or -1)]
// direction is optional
array[start:end:direction]
```

> Getting the last element of the array

```javascript
array[]
```

> Reassigning to the last element of the array

```javascript
array[] = value
```

## Objects

> Object creation

```javascript
new Object() // not recomended
{ x: 1 }
```

> Accessing items of the object

```javascript
object.x
object['x']
```

> The *instanceof* operator returns a boolean, if value is instance of value2

```javascript
value instanceof value2
```

## Strings

> String creation

```javascript
new String() // not recomended
"Hello world"
'Programming is awesome'
`I am a
multiline string!`
```

> String item retraction

```javascript
"Hello world"[4] // outputs 'o'
```

> String last item retraction

```javascript
"Hello world"[] // outputs 'd'
```

> String slice

```javascript
// @params start:end[:direction(1 or -1)]
"Hello world"[0:5:-1] // outputs 'olleH'
```

> The *typeof* operator returns a string

```javascript
// returns the type of the value
typeof value
typeof(value)
```

## Ternar operator

> Regular JS way

```javascript
isNaN(value) ? 1 : 0
isNaN(value) ? isFinite(value) ? 1 : 0 : -1
```

> Shortened way

```javascript
isNaN(value) ? 1
isNaN(value) ? 1 : 0
// not implemented yet
// use isNaN(value) and isFinite(value) ? 1 instead
isNaN(value) ? isFinite(value) ? 1
```

> With if else

```javascript
true if isNaN(value)
true if isNaN(value) else false
```

## Numbers

> Declaration

```javascript
// All followings are examples
// of the same Integer 1000
1000
1000.00
1_000
1_000.00
```

> The *sizeof* operator returns a number

```javascript
// this returns the length of the object keys
// or if not iterable - 0
sizeof value
sizeof(value)
```

## BigInt

> BigInts are threated as numbers, but return typeof BigInt

```javascript
1000n
1_000n
// 1000.00n will throw an error
// floating point numbers are not allowed
```

## LOG, print, WRITE and ERROR keywords

#### ***Note: optional parenthesis are accepted***

> print and LOG

```javascript
// they do the same thing
// just a syntax sugar
print 10 // console.log(10)
print(10) // console.log(10)
LOG "hello world" // console.log("hello world")
```

> WRITE

```javascript
// appends the message to the HTML body element
// equivalent to document.write() method
WRITE "Message" // document.write("Message")
```

> ERROR

```javascript
// equivalent to console.error() method
ERROR "Something went wrong"
// console.error("Something went wrong")
```

## Conditions

> Comparision operators

```javascript
==, !=, ===, !==, >, <, >=, <=, is, is not
// is transforms into ===
// is not transforms into !==
```

> Multivalue comparision

```javascript
// Note: list of values always must be righthand
name == ('John', 'Danny', 'Charlie')
// automatically transforms into
name == 'John' || name == 'Danny' || name == 'Charlie'

random > (some_number, other_number, 20)
// same as
random > some_number && random > other_number && random > 20
// basically said, you have a callback result for your expression
// whatever the first two arguments are,
// it needs to be at least more, than 20
```

> If statement without else

```javascript
num > 0
num > 0 and num < 5 or num == undefined
```

## if else statements

> If statement without else

```javascript
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

```javascript
if temperature > 25:
    print "It's hot!"
else print "It's cold!"
```

> **Unless** statement

```javascript
unless isAdmin:
    print "You don't have access."
// same as
if (!isAdmin) {
    console.log("You don't have access");
}
```

## Debugger

> Starting the debugger

```javascript
if num < 0 {
    debugger
}
```

## try|catch|finally statement

> try without catch and finally

```javascript
try: isWorking(1)
// same as:
try {
    isWorking(1)
}
// catch block is automatically inserted
// automatically outputs console.warn(err.message)
```

> try with catch

```javascript
try: isWorking(1)
catch: console.error(err)
// variable err is automatically declared

// same as:
try {
    isWorking(1)
} catch err {
    console.error(err)
}
```

> try with finally

```javascript
try: isWorking(1)
finally: doSomethingElse()
// same as:
try {
    isWorking()
} finally {
    doSomethingElse()
}
```

## switch cases

> Declaration, cases?, default?

```javascript
switch typeof value {
    case 'String':
        return value
    case 'Number':
    case 'Null':
    case 'Undefined':
    case 'NaN':
        return value + '';
    default: return '';
}
```

## while loop

> Declaration

```javascript
while isTrue {
    print true
}
// or
while (isTrue):
    print true
```

## strict mode

> Declaration

```javascript
'use strict'
// learn more at https://www.w3schools.com/js/js_strict.asp
```

## Even more is coming soon!

> The documentation is not final, and more examples and syntax sugar tricks will be added

> We are constantly updating, fixing and adding new features!

## License

MIT

**Free Software, Hell Yeah!**
