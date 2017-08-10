var isObject = require('@timelaps/is/object');
var isArray = require('@timelaps/is/array');
var forEach = require('@timelaps/n/for/each');
var reverseParams = require('@timelaps/fn/reverse-params');
var forOwn = require('@timelaps/n/for/own');
module.exports = function (key, value, fn) {
    var obj;
    if (isArray(key)) {
        forEach(key, function (first) {
            fn(first, value);
        });
    } else {
        if ((obj = isObject(key) ? key : false)) {
            forOwn(obj, reverseParams(fn));
        } else {
            fn(key, value);
        }
    }
};