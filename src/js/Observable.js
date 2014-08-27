'use strict';

/**
* TODO: docs
*/
lt.Observable = {
    /**
    * TODO: docs
    */
    on: function (evtName, handler, scope) {
        if (!evtName) {
            throw new Error('Empty event name');
        }
        if (!handler) {
            throw new Error('Empty handler function');
        }
        if (!this.handlers) {
            this.handlers = {};
        }
        if (!this.handlers[evtName]) {
            this.handlers[evtName] = [];
        }
        this.handlers[evtName].push({
            handler: handler,
            scope: scope
        });
    },

    /**
    * TODO: docs
    */
    un: function (evtName, handler) {
        if (!evtName) {
            this.handlers = {};
            return;
        }
        var handlers = this.handlers[evtName];
        if (!handlers) {
            return;
        }
        if (handler) {
            this.handlers[evtName] = handlers.filter(function (cfg) {
                return cfg.handler !== handler;
            });
        } else {
            this.handlers[evtName] = [];
        }
    },

    /**
    * TODO: docs
    */
    fire: function (evtName) {
        if (!this.handlers) {
            this.handlers = {};
        }
        var handlers = this.handlers[evtName];
        if (!handlers) {
            return;
        }
        var args = [].slice.call(arguments);
        args.shift(); // -evtName
        handlers.forEach(function (cfg) {
            cfg.handler.apply(cfg.scope || this, args);
        }, this);
    }
}
