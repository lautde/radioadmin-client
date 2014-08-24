'use strict';

window.lt = {
    /**
    * TODO: docs
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
    * TODO: docs
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
