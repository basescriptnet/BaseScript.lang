(async function() {
    let isRegistered = require("red.js"),
        hasAccess = require("hasAcess.js");
    if (isRegistered || hasAccess) {
        console.log("welcome!");
        document.write("You have full access!");
        debugger;

        function sum(num1, num2) {
            if (parseInt(num1) !== num1) {
                throw new TypeError('"num1" should be type of int')
            }
            if (parseInt(num2) !== num2) {
                throw new TypeError('"num2" should be type of int')
            }
            console.log(`Result of ${num1}+${num2} is ${num1 + num2}`);
            if (parseInt(num1 * (num2 + num2)) !== num1 * (num2 + num2)) {
                throw new TypeError('Returned value should be type of int')
            } else return num1 * (num2 + num2);
        }
        let z = new sayHello();
        z = 10;
        [1, 2, 3, 4].hello().world;
        document.body.innerHTML = "dlrow";
    }
})()