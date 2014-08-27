'use strict';

window.lt = {
    /**
    * Create a namespace-like object hierarchy
    * @param {String} namespace A dot-separated namespace, e.g. "lt.foo.bar"
    */
    namespace: function (namespace) {
        var target = window;
        var parts = namespace.split('.');
        var part;
        do {
            part = parts.shift();
            if (!target.hasOwnProperty(part)) {
                target[part] = {};
            }
            target = target[part];
        } while (parts.length);
        return target;
    },

    /**
    * Create a subclass of an already defined class
    * @param {function} Super The constructor of the parent class
    * @param {function=} constructor The subclass constructor function. Omit this to use the default constructor.
    * @param {Object} proto An object containing properties to add to the subclass
    */
    extend: function (Super, constructor, proto) {
        if (typeof constructor == 'object') {
            proto = constructor;
            constructor = Super;
        }
        if (typeof constructor == 'undefined') {
            constructor = Super;
        }

        var result = function () {
            constructor.apply(this, arguments);
        };

        result.prototype = Object.create(Super.prototype);
        result.prototype.constructor = result;

        if (proto) {
            Object.keys(proto).forEach(function (prop) {
                result.prototype[prop] = proto[prop];
            });
        }

        return result;
    },

    /**
    * Copy properties from one object to another
    * @param {Object|Function} target The object to augment.
    *     If this is a function, its prototype will be targeted
    * @param {Object} mixin The object to copy the properties from.
    *     All properties of the same name in the target object will be overwritten.
    */
    mix: function (target, mixin) {
        if (typeof target == 'function') {
            target = target.prototype;
        }
        Object.keys(mixin).forEach(function (key) {
            if (target.hasOwnProperty(key)) {
                console.warn('Mixin overwrites property "', key, '" of', taget);
            }
            target[key] = mixin[key];
        });
        return target;
    }
};
