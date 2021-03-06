module.exports = generate;
var FCC = Function.constructor;
var toArray = require('@timelaps/to/array');
var bindTo = require('@timelaps/fn/bind/to');
var noop = require('@timelaps/fn/noop');
var construktrString = k.toString().slice(10);

function k(args) {
    return _.constructor.call(this, _.bindTo(_.supr, this), args);
}

function generate(name, child, parent) {
    var n = name || '';
    var string = 'return function ' + n + construktrString;
    return new FCC('_', string)({
        toArray: toArray,
        bindTo: bindTo,
        supr: parent || noop,
        constructor: child
    });
}