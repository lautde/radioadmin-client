'use strict';
lt.namespace('lt.scheduler');

/**
* TODO: docs
*/
lt.scheduler.ProgramModel = lt.extend(lt.Model, function (data) {
    data = data || {};
    lt.Model.prototype.constructor.call(this, {
        duration: data.duration,
        slotId: data.slotId,
        playlistId: data.playlistId,
        title: data.title,
        classes: data.classes,
        color: data.color
    });
}, {
    /**
    * TODO: docs
    */
    getters: {
        parts: function () {
            var data = this.data;
            var partEnd = data.slotId % 24 + data.duration;
            var result;
            if (partEnd <= 24) {
                result = [data.duration];
            } else {
                var first = 24 - data.slotId % 24;
                result = [first];
                var sum = first;
                do {
                    var part = Math.min(data.duration - sum, 24);
                    result.push(part);
                    sum += part;
                } while (sum < data.duration);
            }
            return result;
        }
    },

    /**
    * TODO: docs
    */
    getData: function () {
        var data = lt.Model.prototype.getData.apply(this, arguments);
        data.parts = this.get('parts');
        return data;
    }
});
