var extend = require('../extend');
var factory = require('.');
var b = require('@timelaps/batterie');
b.describe('factory', function () {
    b.it('is a function', b.curry(factory, 'toBeFunction'));
    b.it('extends classes with only a function', function (t) {
        var Clas = extend.wrapper(Class);
        var array = [];
        var NuClass = Clas.factory(function (arg) {
            t.expect(arg).toBe(array);
        });
        var instance = NuClass(array);
        t.expect(instance).toBeInstance(Class);
        t.expect(instance).toBeInstance(Clas.constructor);
        t.expect(instance).toBeInstance(NuClass.constructor);

        function Class(args) {
            t.expect(args[0]).toBe(array);
            this.lifecycle('created', args);
        }
    }, 5);
});