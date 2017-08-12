module.exports = constructorExtend;
var isString = require('@timelaps/is/string');
var assign = require('@timelaps/object/assign');
var has = require('@timelaps/n/has/shallow');
var factory = require('../factory');
var bind = require('@timelaps/fn/bind');
var PROTOTYPE = 'prototype';
var CONSTRUCTOR = 'constructor';
var EXTEND = 'extend';
var noop = require('@timelaps/fn/noop');
var bindWith = require('@timelaps/fn/bind/with');
var DOUBLE_UNDERSCORE = '__';
var COLON = ':';
var isOf = require('@timelaps/is/instance');
var toArray = require('@timelaps/to/array');
var fromArrayLike = require('@timelaps/to/array/from/array-like');
var reduce = require('@timelaps/array/reduce');
var namedChain = require('../chain-rename');
var CONSTRUCTOR_KEY = DOUBLE_UNDERSCORE + CONSTRUCTOR + DOUBLE_UNDERSCORE;
var createFrom = require('@timelaps/object/create/from');
var bindTo = require('@timelaps/fn/bind/to');
constructorExtend.wrapper = constructorWrapper;

function isInstance(instance, constructor_) {
    var constructor = constructor_;
    if (has(constructor, CONSTRUCTOR)) {
        constructor = constructor[CONSTRUCTOR];
    }
    return isOf(instance, constructor);
}

function constructorWrapper(Constructor, life_, notOriginal) {
    var life = life_ || {};
    __.isInstance = Constructor.isInstance = function (instance) {
        return isInstance(instance, Constructor);
    };
    Constructor.lifecycle = life;
    __.factory = Constructor.factory = factory(Constructor);
    var fn = __.fn = Constructor.fn = Constructor[PROTOTYPE].fn = Constructor[PROTOTYPE];
    if (!fn.lifecycle) {
        fn.lifecycle = lifecycle;
    }
    __.constructor = Constructor.constructor = Constructor;
    __[EXTEND] = Constructor[EXTEND] = bind(constructorExtend, Constructor);
    __.origin = Constructor.origin = !notOriginal;
    return __;

    function __(one) {
        return isOf(one, Constructor) ? one : new Constructor(fromArrayLike(arguments));
    }
}

function constructorExtend(name_, options_) {
    var nameString, extendedLifecycle, constructorKeyName, child, passedParent, hasConstructor, constructor, methods, lifecycle, parent = this,
        name = name_,
        nameIsStr = isString(name),
        options = options_ || {};
    if (!nameIsStr) {
        options = name;
        name = null;
    }
    options = options || {};
    lifecycle = options.lifecycle || {};
    methods = options.methods || {};
    child = has(options, CONSTRUCTOR) ? options.constructor : construcktr;
    child = child ? namedChain(name || this.name, child, this) : this;
    Surrogate[PROTOTYPE] = parent ? parent[PROTOTYPE] : {};
    child[PROTOTYPE] = assign(createFrom(Surrogate), methods);
    // don't call the function if nothing exists
    constructor = child;
    extendedLifecycle = reduce(lifecycle, function (copy, value, key) {
        var previous = copy[key] || noop;
        copy[key] = function (args_) {
            var args = bindWith(previous, [this].concat(args_));
            return value.apply(this, [args].concat(args_));
        };
    }, assign({}, parent ? parent.lifecycle : {}));
    child = constructorWrapper(constructor, extendedLifecycle, 1);
    child.extensionOptions = constructor.extensionOptions = options;
    constructor[PROTOTYPE][CONSTRUCTOR_KEY] = child;
    return child;

    function Surrogate() {
        this[CONSTRUCTOR] = child;
    }
}

function construcktr(supr, args) {
    supr(args);
}

function lifecycle(key, args) {
    var parent = this.constructor;
    var life = parent.lifecycle;
    return life[key] && life[key].call(this, toArray(args));
}