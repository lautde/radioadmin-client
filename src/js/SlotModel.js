'use strict';
lt.namespace('lt.scheduler');

/**
* TODO: docs
*/
lt.scheduler.SlotModel = lt.extend(lt.Model, {
    getData: function () {
        return {
            classes: '',
            //classes: this.data.program ? 'foo' : ''
        }
    }
});
