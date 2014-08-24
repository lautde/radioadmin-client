'use strict';

lt.ModelCollection = lt.extend(lt.Collection, function () {
    this.on('add', this.onAdded, this);
    lt.Collection.apply(this, arguments);
}, {
    onAdded: function (models) {
        models.forEach(function (model) {
            if (!(model instanceof lt.Model)) {
                throw new Error('ModelCollection accepts only super models. You are not on the guest list…');
            }
            model.on('destroy', this.onModelDestroy, this);
        }, this);
    },

    onModelDestroy: function (model) {
        var indexes = [];
        this.forEach(function (item, index) {
            if (item === model) {
                indexes.push(index);
            }
        });
        indexes.reverse().forEach(function (index) {
            this.splice(index, 1);
        }, this);

    },

    destroy: function (dostroyModels) {
        if (this.destroyed) {
            return;
        }
        if (dostroyModels) {
            this.forEach(function (model) {
                model.off('destroy', this.onModelDestroy, this);
                model.destroy();
            });
        }
        lt.Collection.prototype.destroy.call(this);
    }
});
