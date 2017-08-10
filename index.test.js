var b = require('@timelaps/batterie');
var Classy = require('.');
b.describe('Classy', function () {
    b.expect(Classy).toBeFunction();
    b.expect(Classy.extend).toBeFunction();
    b.it('can extend prototypes automatically', function (t) {
        var TwoClassy = Classy.extend();
        t.expect(TwoClassy).toBeFunction();
        var instance = TwoClassy();
        t.expect(instance).toBeInstance(Classy.constructor);
        t.expect(instance).toBeInstance(TwoClassy.constructor);
    }, 3);
    b.it('has methods option which attaches properties directly to prototype', function (t) {
        var TwoClassy = Classy.extend({
            methods: {
                methodName: method
            }
        });
        t.expect(TwoClassy().methodName).toBe(method);

        function method() {}
    });
    b.it('has lifecycle methods which are called in a chain', function (t) {
        var counter = 0;
        var TwoClassy = Classy.extend({
            lifecycle: {
                created: function (supr, arg) {
                    t.expect(arg).toBe(1);
                    supr();
                }
            }
        });
        var ThreesCompany = TwoClassy.extend({
            lifecycle: {
                created: function (supr, opts) {
                    supr(counter + 1);
                    t.expect(opts).toBe(options);
                }
            }
        });
        var options = {};
        t.expect(ThreesCompany(options).created).toBeUndefined();

        function method() {}
    }, 3);
});