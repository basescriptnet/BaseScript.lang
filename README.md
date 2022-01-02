## BaseScript.lang
BaseScript is a programming language, which aims to translate your code to JavaScript.
It is very identical to JavaScript, and almost any valid JS code is also a valid BaseScript code. The major differences are:
1. Parenthesis:
    You don't actually need to place parenthesis anymore. If, for, while statements will accept the conditions without the need of parenthesis
2. Switch statements:
    Switch statements with switch* notation may be used to return a value, so you can shorten the tries of getting values in different cases
3. For, while, if, try, catch, finally:
    After the statement, you can put ":" sign to state, that you want to get a single statement in case if the condition is valid. For example: try: a(); // a is not defined/not a function
4. Try/catch/finally:
    Unlike JavaScript, BaseScript does not require argument for the catch block, and neither requires the catch block itself. 
5. For loops:
    Now for in and for of statements do not require let or const keywords. And there is a range function for the for of loop, which returns a generator like object with iterable values, that iterates through the number from accepted argument.
6. HTML:
    Now you can assign regular html tags to your variables. The content of the tag should be a string, and if you want to insert a value, use @text command to create a text node with the value of the object
7. Include, import:
    Now, you can require the code from a different file, execute or transpile it to regular javascript, and insert it into your final file

## This project is open source

It welcomes anybody, who desires to try out his own changes on the grammar 

## How to contact the creators

Email: basescriptnet@gmail.com
Telegram: @basescript

## The compilation
At any directory use
```sh
bs <file_name> options?
```

> To install you can use
```sh
npm install -g .
```

> Ensure you code and enjoy:)

## License

MIT

**Free Software, Hell Yeah!**
