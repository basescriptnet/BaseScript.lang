## Bugs
1. Keyword Infinity doens't happen to work
2. Keywords must be added into regular
3. typeof(value) throws an error, unexpected (
4. in operator doesn't work the way it needs
5. typeof and sizeof (and maybe some more) return the value + ";"
    without the actual need of line termiantion and leave the code
    half broken
6. Same issue with any variable name + any value
7. regular for loop doesn't work at all, error unexpected "{"
8. HTML objects with more than 1 child Elements will throw a
    closing parenthesis error
9. HTML text is threated as space trimmed text
10. ✅ Array.prototype.last appears during the while loop
    Solution, use Array.prototype.at(-1) instead
11. ✅ Fixed the top one with partial changes in syntax, array[] returns the last element of the array, but now only works with dot notation: array[].toString(). array[] will throw an error.
12. Compiler takes too long to handle lines containing:
    LOG (sizeof(window.array) + 5 - 5 + 5 - 1 - 5 + 5 -7) // 0
    LOG (sizeof(window.array) + 5 - 5 + 5 - 1)
13. Condition comparision works not well with numbers +-