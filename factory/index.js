module.exports = factory;
var toArray = require('@timelaps/to/array');

function factory(construktr) {
    return function (name, func_) {
        var func = func_ ? func_ : name;
        var extensor = {
            lifecycle: {
                created: func
            }
        };
        var args = func === func_ ? [name, extensor] : [extensor];
        return this.extend.apply(this, args);
    };
}