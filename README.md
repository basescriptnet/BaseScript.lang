<div align="center">
<p>
    <!--<img width="200" src="https://github.com/basescriptnet/BaseScript.lang/blob/master/logo.jpg?sanitize=true">-->
    <img width="200" src="https://avatars.githubusercontent.com/u/88979822?s=400&u=eb99cb7c07a14d8a61d1724095b689cb260bccfa&v=4">
</p>
<h1>🏗️ BaseScript</h1>

[BaseScript.net](https://BaseScript.net)

[About](#%E2%84%B9%EF%B8%8F-about) | [docs](#-docs) | [bugs](https://github.com/basescriptnet/BaseScript.lang/issues) | [license](#-license)

<b><img src="https://img.shields.io/badge/version-#git{version}-yellow" alt="version"></b>
</div>

## ℹ️ About

🏗️ BaseScript is a programming language, which aims to compile your code to JavaScript.

> Why to choose BaseScript?

* It is in the phase of active development, so more and more features are being added constantly. Also, check out [RELEASE_NOTES.md](https://github.com/basescriptnet/BaseScript.lang/blob/master/RELEASE_NOTES.md), as well as [Syntax Highlighter](https://github.com/basescriptnet/VSCode_highlighter/) (updated) for the language
* Your ideas are also being reviewed and added, as the language is welcoming collaborations
* It provides you things, that JavaScript lacks:
    + Custom operator declaration
    + Pipe forward and pipe backward operators
    + Emoji variables and operators
    + Interfaces
    + Typed functions and arguments
    + Ability to get compile time errors to prevent runtime errors
    + Syntax sugar from other languages, that are so excess
    + Ability to customize your code the way you want it, and much more!
    + Easy to switch and learn
    + Code with ease
    + Readable and efficient
    + Boilerplate minimization

This page represents the simple to follow documentation of the language.

## 🔗 How to contact the creators

📬 Email: [basescriptnet<wbr>@gmail.com](mailto://basescriptnet@gmail.com)<br>
✈️ Telegram: [@basescript](t.me/basescript)<br>
📹 YouTube: [BaseScript Channel](https://www.youtube.com/channel/UCmNoL3N13lRHbcGYT8vr6lA)

## 📁 Docs
<b>• Content: <b>
 - [Getting started](#%EF%B8%8F-getting-started)
 - [How to contact the creators](#-how-to-contact-the-creators)
 - [Variables](#%EF%B8%8F-variables)
 - [Arrays](#%EF%B8%8F-arrays)
 - [Objects](#-objects) (New Features)
 - [Strings](#-strings)
 - [Ternar operator](#-ternar-operator)
 - [Numbers](#%EF%B8%8F%E2%83%A3-numbers)
 - [BigInts](#-bigint)
 - [Statement block scope](#-statement-block-scope)
 - [LOG, print, WRITE and ERROR keywords](#-log-print-write-and-error-keywords)
 - [Conditions](#-conditions)
 - [if else statements](#-if-else-statements)
 - [Functions](#-functions) (New Features)
 - [Custom types](#-custom-types)
 - [Debugger](#-debugger)
 - [try|catch|finally statement](#-trycatchfinally-statement)
 - [Switch cases](#-switch-cases)
 - [Loops](#🔛-loops) (New Features)
 - [Strict mode](#%EF%B8%8F-strict-mode)
 - [Interfaces](#interfaces)
 - [Operators](#operators) (New Features)
 - [Custom Operators](#custom-operators)

## ▶️ Getting started

> Learn more about [CLI usage](./CLI.md).

> Install via npm

```sh
npm i basescript.js -g
```

> At any directory use

```sh
bsc -f <file_name> [options?]
```

> For help use

```sh
bsc -help
```

> To install globally after git clone, you can use

```sh
npm install -g ./
```

> [Deprecated]: Include built-in functionality in .bs files

> If you already have it in the main file, connected files won't need it (as well as with -r flag)

```cpp
#include <builtins>
```

<!--** Note: .bs files are compiled to .js files. .bm files are modular files, that will
be compiled during the runtime as dependencies to .bs files. **-->

> Run from CLI without an output file

```sh
bsc -f <file_name> -r
```

## 🗄️ Variables

> Variable declaration

```javascript
let identifier = value
let num, num1 = 1, num2
\num3 // equivalent to let num3
```

<!--#### ***📝 Note: any value becomes immutable***-->

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

## 🗃️ Arrays

> Array creation

```javascript
new Array(length) // length is optional
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

## 🧱 Objects

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

> Assigning multiple items at once using `.{}` operator

```javascript
let object = {a: 'a'}
object.{
    b: 'b',
    c: 'c'
}
// object is {a: 'a', b: 'b', c: 'c'}
```

## 💬 Strings

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

## ❓ Ternar operator

> Regular JS way

```javascript
isNaN(value) ? 1 : 0
isNaN(value) ? isFinite(value) ? 1 : 0 : -1
```

> Shortened way

<!--```javascript
isNaN(value) ? 1
isNaN(value) ? 1 : 0
// not implemented yet
// use isNaN(value) and isFinite(value) ? 1 instead
isNaN(value) ? isFinite(value) ? 1
```-->

> With if else

<!--//true if isNaN(value)-->
```javascript
true if isNaN(value) else false
```

## #️⃣ Numbers

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

## 🔢 BigInt

> BigInts are threated as numbers, but return typeof BigInt

```javascript
1000n
1_000n
// 1000.00n will throw an error
// floating point numbers are not allowed
```

## 📑 Statement block scope

> Example with if block

```javascript
if value {
    ...statements
}
if value BEGIN
    ...statements
END
if value do
    statement
if value:
    statement
```

## 🚪 LOG, print, WRITE and ERROR keywords

#### ***📝 Note: optional parenthesis are accepted***

> print and LOG

```javascript
// they do the same thing
// just a syntax sugar
print 10 // console.log(10)
print(10) // console.log(10)
print if defined I_dont_exist // will not print anything unless the condition is truthy!
LOG "hello world" // console.log("hello world")
```

<!--> WRITE

```javascript
// appends the message to the HTML body element
// equivalent to document.write() method
WRITE "Message" // document.write("Message")
```-->

> ERROR

```javascript
// equivalent to console.error() method
ERROR "Something went wrong"
// console.error("Something went wrong")
ERROR if errorMessage // shows an error if errorMessage is not falsy
```

## 🔄 Conditions

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

> ↔️ Ternary if

```javascript
num if num > 0
num if num > 0 and num < 5 else num == undefined

num ? num > 0
num ? num > 0 and num < 5 : num == undefined
```

## 🚸 If else statements

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
    console.log("You don't have access.");
}
```
## 🚄 Functions

> Declaration

```javascript
function a () {
    // ...statements
    return value
}
// if no arguments are carried,
// no parenthesis are required
function a {
    // ...statements
    return value
}
// same as
def a () {
    // ...statements
    return value
}
// or
def a {
    // ...statements
    return value
}
```

> Shortcut for return

```javascript
return value
// same as
=> value
function add(a, b):=> a + b
```

> Calling functions

```javascript
add(10, 20)
```

> If a function needs to be called multiple times, use the `->()` operator

```javascript
let elementsToWatch = document.querySelector->(
    '#login',
    '#password',
    '#submitBtn',
) // returns an array of elements

let content = readFile->(
    &('header', 'utf8'),
    &('content', 'utf8'),
    &('footer', 'utf8'),
).join('\n')
// returns an array, then uses the join method
```

> For object properties, use `->[]` operator to return an array with multiple property calls

```javascript
let game = new Game()
game->[
    player,
    getEnemies(),
    getEntities()
] // returns an array of the property call results
// Note: all of those are methods and properties of game
// but you won't need to specify `game.player`. Simple:)
// This, in fact, uses the javascript `with` statement under the hood for now, which might be updated for safety purposes in the future
```

> Typed arguments and args constant

### 📝 NOTE: every function contains **args** constant, which is an array representation of **arguments** object

```javascript
// this ensures that a and b are integers
// anything else will throw an error
function add(Int a, Int b) {
    return a + b
}
// only strings are allowed
function say(String text) {
    WRITE text // deprecated
}
```

## 🧩 Custom types

> Declaration

```javascript
type NotEmptyArray (Array value) {
    if value.length !== 0: => true
}
```

> Notes: type name must start with uppercase letter<br>
> Exactly one argument is required

## 🚧 Debugger

> Starting the debugger

```javascript
if num < 0 {
    debugger
}
```

## 🙌 try|catch|finally statement

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
    isWorking(1)
} finally {
    doSomethingElse()
}
```

## 👏 Switch cases

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

> To instantly break the case, use `case*` feature

```javascript
let error = ''
switch errorNumber {
    case* 403: error = 'Forbidden'
    case* 404: error = 'Not Found'
    case* 500: error = 'Internal Server Error'
}
```

> Use `switch*` clause as a value

```javascript
let error = switch errorNumber {
    case 403: 'Forbidden'
    case 404: 'Not Found'
    case 500: 'Internal Server Error'
}
```

## 🔛 Loops

> Declaration using `times` keyword (not a reserved one)

```javascript
8 times {
    print 'Yes!'
}
// Note: For now, only a numeric value is allowed before `times` keyword
```

> Declaration of while loop

```javascript
while isTrue {
    print true
}
// or
while (isTrue):
    print true
```

> Declaration of for loop

```javascript
for key in object {
    print object[key]
}
for value of object {
    print value
}
for i of range(0, 10) {
    print i
}
for i from 0 till 10 {
    print i
}
for i from 0 through 10 {
    print i
}
// notice, const or let are alowed here, but not necessary
for i = 0; i < 10; i++ {
    print i
}
```

## ☝️ Strict mode

> Declaration

```javascript
'use strict'
// learn more at https://www.w3schools.com/js/js_strict.asp
```

## Interfaces

> Declaration

```javascript
interface Person {
    name: String,
    age: Int,
    children: Person[] | Null
}
```

> Usage

```javascript
let people = []
function addToArray(Person person) {
    people.push(person)
}
addToArray({
    name: 'John',
    age: 19,
    children: null
})
```

##  Operators

> Arrow and dot operators, `->[]`, `->()`, `.{}` (see [Functions](#-functions), [Objects](#-objects))

```javascript
->() // Calls a function if used on functions multiple times, depending on argument length
->[] // Calls an object property/properties multiple times, without the need to refer to the object each time

.{} // assigns or reassigns multiple properties and methods to an object at once, and returns the result
```

> Arithmetic Operators

```javascript
+ Plus
- Minus
* Multiply
/ Divide
~/ Divide and drop the floating part
% Modulus
** Exponentiation
++ Increment
-- Decrement
```

> Logical Operators

```javascript
&& Logical and
|| Logical or
!  Logical not
```

> Bitwise operators

```javascript
&   AND
|   OR
~   NOT
^   XOR
<<  Left shift
>>  Right shift
>>> Unsigned right shift
```

> Type And Size Operators

```javascript
typeof // describes the type of the object
sizeof // describes the size of the object, or returns null
```

> The *instanceof* operator

```javascript
value instanceof Array
// as well as
value not instanceof Array
// or
value !instanceof Array
```

> The *in* operator

```javascript
value in object
// as well as
value not in object
// or
value !in object
```

> Pipe Forward And Pipe Back Operators

```javascript
|> Pipe forward
<| Pipe back
// example
// pipe forward
num + 5 |> Array // Same as Array(num + 5)
num + 5 |> Array(0, 1) // Same as Array(num + 5, 0, 1)
num + 5 |> Array(0, 1, .) // Same as Array(0, 1, num + 5)

'  How\'s it going?   '
    |> escape
    |> trim
    |> write('file.txt', .)

// pipe back

write('file.txt', .)
    <| trim
    <| escape
    <| '  How\'s it going?   '

```

## 📏 Custom operators

> Declaration

```javascript
// operator "#" [A-Za-z0-9_\/*+-.&|$@!^#~]:+ ...
operator #/ (Number left, Number right) {
    if isNaN(left / right): return 0
    return left / right;
}
```

> Usage

```javascript
// outputs 0 instead of NaN
print Infinity #/ Infinity
```

## 🤫 More and more is coming soon!

> The documentation is not final, and more examples and syntax sugar tricks will be added

> We are constantly updating, fixing and adding new features!

## 📃 License

**😉 Free Software, Hell Yeah!**

This project is open-sourced software licensed under the MIT License.

See the [LICENSE](https://github.com/basescriptnet/BaseScript.lang/blob/master/LICENSE) file for more information.
