module.exports = constructorExtend;
var isString = require('@timelaps/is/string');
var assign = require('@timelaps/object/assign');
var has = require('@timelaps/n/has/shallow');
var factory = require('../factory');
var bind = require('@timelaps/fn/bind');
var PROTOTYPE = 'prototype';
var CONSTRUCTOR = 'constructor';
var EXTEND = 'extend';
var get = require('@timelaps/n/get/deep');
var noop = require('@timelaps/fn/noop');
var bindWith = require('@timelaps/fn/bind/with');
var DOUBLE_UNDERSCORE = '__';
var COLON = ':';
var isInstance = require('@timelaps/is/instance');
var toArray = require('@timelaps/to/array');
var fromArrayLike = require('@timelaps/to/array/from/array-like');
var reduce = require('@timelaps/array/reduce');
var namedChain = require('../chain-rename');
var CONSTRUCTOR_KEY = DOUBLE_UNDERSCORE + CONSTRUCTOR + DOUBLE_UNDERSCORE;
var createFrom = require('@timelaps/object/create/from');
var bindTo = require('@timelaps/fn/bind/to');
var EXTENSION_OPTIONS = 'extensionOptions';
var MEMBERS = 'members';
constructorExtend.wrapper = constructorWrapper;

function constructorWrapper(Constructor, life_, members_, notOriginal) {
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
    var members = assign(members_ ? assign({}, members_) : {}, {
        constructor: Constructor,
        extend: bind(constructorExtend, Constructor),
        origin: !notOriginal
    });
    assign(__, members);
    assign(Constructor, members);
    return __;

    function __(one) {
        return isInstance(one, Constructor) ? one : new Constructor(fromArrayLike(arguments));
    }
}

function constructorExtend(name_, options_) {
    var nameString, extendedLifecycle, constructorKeyName, child, passedParent, hasConstructor, constructor, methods, members, lifecycle, parent = this,
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
    child[PROTOTYPE] = createAndExtend(Surrogate, methods);
    // don't call the function if nothing exists
    constructor = child;
    extendedLifecycle = reduce(lifecycle, function (copy, value, key) {
        var previous = copy[key] || noop;
        copy[key] = function (args_) {
            var args = bindWith(previous, [this].concat(args_));
            return value.apply(this, [args].concat(args_));
        };
    }, assign({}, parent ? parent.lifecycle : {}));
    currentmembers = get(parent, [EXTENSION_OPTIONS, MEMBERS]) || {};
    child = constructorWrapper(constructor, extendedLifecycle, createAndExtend(currentmembers, options[MEMBERS]), 1);
    child.extensionOptions = constructor.extensionOptions = options;
    constructor[PROTOTYPE][CONSTRUCTOR_KEY] = child;
    return child;

    function Surrogate() {
        this[CONSTRUCTOR] = child;
    }
}

function createAndExtend(baseline, extension) {
    return assign(createFrom(baseline), extension);
}

function construcktr(supr, args) {
    supr(args);
}

function lifecycle(key, args) {
    var parent = this.constructor;
    var life = parent.lifecycle;
    return life[key] && life[key].call(this, toArray(args));
}