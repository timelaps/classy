var intendedObject = require('..');
var bindTo = require('@timelaps/fn/bind/to');
module.exports = function intendedApi(fn) {
    return function (one, two) {
        intendedObject(one, two, bindTo(fn, this));
        return this;
    };
};