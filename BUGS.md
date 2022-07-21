## Bugs
* regular for loop (for i = 0; i < n; i++) doesn't work at all, error unexpected "{"
* ✅ Compiler takes too long to handle lines containing:
    LOG (sizeof(window.array) + 5 - 5 + 5 - 1 - 5 + 5 -7) // 0
    LOG (sizeof(window.array) + 5 - 5 + 5 - 1)
    Solution: replacing exp "+" exp by exp "+" prefixExp