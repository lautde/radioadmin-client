'use strict';
lt.namespace('lt.scheduler');

/**
* TODO: docs
*/
lt.scheduler.ProgramView = lt.extend(lt.View, {

    render: function (data, target, position) {
        lt.View.prototype.render.call(this, data, target, position);
        var brightness = SB.color.calculateBrightness(data.color);

        if (brightness < .5) {
            this.el.classList.add('dark');
        }
        this.deleteBtn = this.el.querySelector('.delete');
        this.deleteListener = this.requestDeletion.bind(this);
        this.deleteBtn.addEventListener('click', this.deleteListener, false);
    },

    requestDeletion: function () {
        this.fire('requestDeletion', this);
    },

    destroy: function () {
        this.deleteBtn.removeEventListener('click', this.deleteListener, false);
        lt.View.prototype.destroy.apply(this, arguments);
    }
});
