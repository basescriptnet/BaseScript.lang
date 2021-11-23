function sleep(ms){
    var now = new Date().getTime();
    while(new Date().getTime() < now + ms){ /* Do nothing */ }
}

module.exports = sleep.toString()