'use strict';

/**
* An augmented version of Array that fires events:
*
* 'add': fired when elements have been added.
*      Arguments: (elements, this)
*      Note that you must not add items using the [] notation.
*      Use methods like push() etc. instead
* 'remove': fired when elements has been removed
*      Arguments: (elements, this)
* 'reorder': fired when the collection is sorted or reversed
*      Arguments: (this)
*
*/
lt.Collection = lt.extend(Array, function () {
    this.push.apply(this, arguments);
}, {
    pop: function () {
        var result = Array.prototype.pop.apply(this, arguments);
        this.fire('remove', [result], this);
        return result;
    },

    push: function () {
        Array.prototype.push.apply(this, arguments);
        this.fire('add', [].slice.call(arguments), this);
        return this.length;
    },

    reverse: function () {
        Array.prototype.reverse.apply(this, arguments);
        this.fire('reorder', this);
        return this;
    },

    shift: function () {
        var item = Array.prototype.shift.apply(this, arguments);
        this.fire('remove', [item], this);
        return item;
    },

    sort: function () {
        Array.prototype.sort.apply(this, arguments);
        this.fire('reorder', this);
        return this;
    },

    splice: function (index, howMany) {
        var removed = Array.prototype.splice.apply(this, arguments);
        if (removed.length) {
            this.fire('remove', removed);
        }
        var added = [].slice.call(arguments).splice(2, arguments.length);
        if (added.length) {
            this.fire('add', added);
        }
        return removed;
    },

    unshift: function () {
        Array.prototype.unshift.apply(this, arguments);
        this.fire('add', [].slice.call(arguments), this);
        return this.length;
    },

    destroy: function () {
        if (this.destroyed) {
            return;
        }
        this.un();
        [].splice.call(this, 0, this.length);
        this.destroyed = true;
    }

});

lt.mix(lt.Collection, lt.Observable);
