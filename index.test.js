var b = require('@timelaps/batterie');
var Classy = require('.');
b.describe('Classy', function () {
    b.expect(Classy).toBeFunction();
    b.expect(Classy.extend).toBeFunction();
    b.it('can extend prototypes automatically', function (t) {
        t.expect(Classy.extend()).toBeFunction();
    });
});