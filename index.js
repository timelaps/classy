var extendConstructor = require('./extend');
Extendable.prototype = {
    destroy: function destroy(args) {
        this.lifecycle('destroyed', args);
    },
    member: function member(key) {
        return this.__constructor__[key];
    }
};
module.exports = extendConstructor.wrapper(Extendable, Object);

function Extendable(args) {
    // construction wrapper gathers arguments into args
    this.lifecycle('created', args);
}