(async function() {
    function sleep(ms) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + ms) {
            /* Do nothing */ }
    };
    let z = 1;
    let arr = [0, 1, 2, 3, 4];
    while (true) {
        if (false) {
            let g = 1;
            z = 10;
        } else {
            z = 30;
        }
    }
})()