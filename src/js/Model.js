(function () {
    'use strict';

    /**
    * TODO: docs
    */
    lt.Model = lt.extend(Object, function (data) {
        this.data = {};
        if (Array.isArray(data)) {
            this.fields = data.slice();
            this.fields.forEach(function (field) {
                this.data[field] = undefined;
            }, this);
        } else if (typeof data == 'object') {
            this.fields = Object.keys(data);
            this.fields.forEach(function (field) {
                this.data[field] = data[field];
            }, this);
        } else {
            throw new Error('Cannot create empty model');
        }
        this.handlers = {};
    }, {

        getters: {},

        /**
        * TODO: docs
        */
        set: function (cfg, val) {
            if (typeof cfg == 'string') {
                var fullCfg = {};
                fullCfg[cfg] = val;
                return this.set(fullCfg);
            }
            var oldData = this.getData();
            this.fields.forEach(function (field) {
                if (!cfg.hasOwnProperty(field)) {
                    return;
                }
                this.data[field] = cfg[field];
            }, this);
            var newData = this.getData();
            var changed = [];
            Object.keys(oldData).forEach(function (key) {
                if (oldData[key] !== newData[key]) {
                    changed.push(key);
                }
            });
            if (changed.length) {
                this.fire('change', changed, newData, oldData, this);
            }
        },

        /**
        * TODO: docs
        */
        get: function (key) {
            if (this.getters.hasOwnProperty(key)) {
                return this.getters[key].call(this, this.data[key], key);
            }
            return this.data[key];
        },

        /**
        * TODO: docs
        */
        getData: function () {
            return lt.mix({}, this.data);
        },

        /**
        * TODO: docs
        */
        destroy: function () {
            if (this.destroyed) {
                return;
            }
            this.fire('destroy', this);
            this.data = null;
            this.fields = null;
            this.un();
            this.destroyed = true;
        }
    });
    lt.mix(lt.Model, lt.Observable);
})();
