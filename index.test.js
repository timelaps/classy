var b = require('@timelaps/batterie');
var Classy = require('.');
b.describe('Classy', function () {
    b.expect(Classy).toBeFunction();
    b.expect(Classy.extend).toBeFunction();
    b.it('can extend prototypes automatically', function (t) {
        var TwoClassy = Classy.extend();
        t.expect(TwoClassy).toBeFunction();
        t.expect(TwoClassy()).toBeInstance(Classy.constructor);
    });
});