'use strict';

/**
* TODO: docs
*/
lt.View = lt.extend(Object, function (tplId, model, target, position) {
    if (!/^tpl-/.test(tplId)) {
        tplId = 'tpl-' + tplId;
    }
    this.getHtml = template(tplId);
    this.el = null
    this.model = null;
    if (model instanceof lt.Model) {
        this.setModel(model);
    }
    if (target) {
        this.render(model.getData(), target, position);
    }
}, {
    /**
    * TODO: docs
    */
    render: function (data, target, position) {
        var html = this.getHtml(data);
        var newEl = $(html)[0];
        if (this.el) {
            this.el.parentNode.replaceChild(newEl, this.el);
        } else {
            this.insertEl(newEl, target, position);
        }
        this.el = newEl;
    },

    /**
    * @private
    */
    insertEl: function (el, target, position) {
        if (typeof target == 'string') {
            target = $(target)[0];
        }
        if (target instanceof lt.View) {
            target = target.el;
        }
        if (!target || !target instanceof Node) {
            throw new Error('Target required when when rendering the view for the first time');
        }
        if (typeof position == 'number') {
            target.insertBefore(el, target.children[position]);
        } else {
            target.appendChild(el);
        }
    },

    /**
    * TODO: docs
    */
    setModel: function (model) {
        if (this.model) {
            this.model.un('change', this.onModelChange);
            this.model.un('destroy', this.onModelDestroy);
        }
        if (model) {
            model.on('change', this.onModelChange, this);
            model.on('destroy', this.onModelDestroy, this);
        }
        this.model = model;
    },

    /**
    * @private
    */
    onModelChange: function (keys, newData, oldData, model) {
        if (!this.el) {
            return;
        }
        this.render(model.getData());
    },

    /**
    * @private
    */
    onModelDestroy: function (model) {
        this.destroy();
    },

    /**
    * TODO: docs
    */
    destroy: function () {
        if (this.destroyed) {
            return;
        }
        this.fire('destroy', this);
        this.getHtml = null;
        if (this.el && this.el instanceof Node && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
        this.setModel(null);
        this.el = null;
        this.destroyed = true;
    }
});

lt.mix(lt.View, lt.Observable);
