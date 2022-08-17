class date {
    constructor() {
    }
    get now() {
        return Date.now()
    }
    // !TODO: implement
    //setDate(value) {
    //    if (typeof value != 'object' || value.constructor != Object) {
    //        throw TypeError('setDate() expects an object.')
    //    }
    //    for (let i in value) {
    //        if (typeof value[i] != 'number' || value[i] < 0 || isNaN(value[i])) {
    //            throw TypeError('setDate() expects an object with positive number values.')
    //        }
    //    }
    //    let _date = new Date();
    //    if (value.hasOwnProperty('year')) {
    //        _date.setFullYear(value.year);
    //    }
    //    if (value.hasOwnProperty('month')) {
    //        _date.setMonth(value.month);
    //    }
    //    if (value.hasOwnProperty('day')) {
    //        _date.setDate(value.day);
    //    }
    //    if (value.hasOwnProperty('hours')) {
    //        _date.setHours(value.hours);
    //    }
    //    if (value.hasOwnProperty('minutes')) {
    //        _date.setMinutes(value.minutes);
    //    }
    //    if (value.hasOwnProperty('seconds')) {
    //        _date.setSeconds(value.seconds);
    //    }
    //    if (value.hasOwnProperty('milliseconds')) {
    //        _date.setMilliseconds(value.milliseconds);
    //    }
    //    _date.prototype = date
    //    return _date;
    //}
    get ms() {
        return new Date().getMilliseconds()
    }
    get seconds() {
        return new Date().getSeconds()
    }
    get msInSecond() {
        return 1000
    }
    get minutes() {
        return new Date().getMinutes()
    }
    get msInMinute() {
        return 60000
    }
    get hours() {
        return new Date().getHours()
    }
    get msInHour() {
        return 3600000
    }
    get day() {
        return new Date().getDay()
    }
    get msInDay() {
        return 86400000
    }
    get month() {
        return new Date().getMonth()
    }
    get msInMonth() {
        return 2628000000
    }
    get year() {
        return new Date().getFullYear()
    }
    get msInYear() {
        return 31536000000
    }
};
scopes.append_to_global({
    Date: new date()
});