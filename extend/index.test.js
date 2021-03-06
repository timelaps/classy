var extend = require('.');
var b = require('@timelaps/batterie');
b.describe('extend', function () {
    b.expect(extend).toBeFunction();
    b.it('extends constructors', function (t) {
        var Clas = extend.wrapper(Class);
        var NuClass = Class.extend({});
        var instance = NuClass();
        t.expect(instance).toBeInstance(Class);
        t.expect(instance).toBeInstance(NuClass.constructor);
        t.expect(instance.fn).toBe(NuClass.fn);

        function Class() {
            t.expect(this).toBeInstance(Class);
        }
    }, 4);
    b.it('passes a bound super in the constructor', function (t) {
        var Clas = extend.wrapper(Class);
        var NuClass = Class.extend({
            lifecycle: {
                created: function () {}
            }
        });
        var NuClass2 = NuClass.extend({
            lifecycle: {
                created: function () {}
            }
        });
        var array = [1];
        var instance = NuClass2(array);
        t.expect(instance).toBeInstance(Clas.constructor);

        function Class(args) {
            t.expect(this).toBeInstance(Clas.constructor);
            t.expect(args[0]).toBe(array);
            this.lifecycle('created', args);
        }
    }, 3);
    b.it('passes a bound super in the constructor', function (t) {
        var Clas = extend.wrapper(Class);
        var counter = 0;
        var array = [];
        var NuClass = Clas.extend('NuClass', {
            lifecycle: {
                created: function (arg) {
                    t.expect(arg).toBe(array);
                    t.expect(++counter).toBe(3);
                }
            },
            constructor: function (supr, args) {
                t.expect(++counter).toBe(1);
                supr(args);
                t.expect(++counter).toBe(4);
            }
        });
        var instance = NuClass([1]);
        t.expect(instance).toBeInstance(Class);

        function Class(arg) {
            t.expect(this).toBeInstance(Clas.constructor);
            t.expect(arg).toBeArray();
            t.expect(++counter).toBe(2);
            this.lifecycle('created', [array]);
        }
    }, 8);
    b.it('passed arguments are respected at the lifecycle level only', function (t) {
        var One = extend.wrapper(One_, {
            created: function (args) {
                t.expect(args).toBe(3);
            }
        });
        var Two = One.extend('Two', {
            lifecycle: {
                created: function (arg) {
                    t.expect(arg).toBe(3);
                }
            },
            constructor: function (supr, args) {
                t.expect(args[0]).toBe(1);
                supr([args[0] + 1]);
            }
        });
        var Three = Two.extend('Three', {
            lifecycle: {
                created: function (arg) {
                    t.expect(arg).toBe(3);
                }
            },
            constructor: function (supr, args) {
                t.expect(args[0]).toBe(0);
                supr([args[0] + 1]);
            }
        });
        var result = Three(0);
        t.expect(result).toBeInstance(One.constructor);
        t.expect(result).toBeInstance(Two.constructor);
        t.expect(result).toBeInstance(Three.constructor);

        function One_(args) {
            var val = args[0] + 1;
            t.expect(val).toBe(3);
            this.lifecycle('created', [val]);
        }
    }, 9);
    b.it('also stacks the destroy lifecycle function', function (t) {
        var array = [];
        One_.prototype.destroy = function () {
            this.lifecycle('destroyed', [array]);
        };
        var One = extend.wrapper(One_);
        var Two = One.extend({
            lifecycle: {
                destroyed: function (arg) {
                    t.expect(arg).toBe(array);
                }
            }
        });
        var instance = Two();
        instance.destroy();

        function One_() {}
    });
});