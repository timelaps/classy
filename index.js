var extendConstructor = require('./extend');
Extendable.prototype.destroy = destroy;
module.exports = extendConstructor.wrapper(Extendable, Object);

function destroy() {
    this.lifecycle('destroyed', arguments);
}

function Extendable(args) {
    // construction wrapper gathers arguments into args
    this.lifecycle('created', args);
}