lt.namespace('lt.scheduler');
(function () {
    'use strict';

    /**
    * Model for a one hour long time period in the calendar.
    */
    lt.scheduler.SlotModel = lt.extend(lt.Model, {
        // TODO: implement. The table cell view should be updated (for example on D&D), so getData should return classes
        getData: function () {
        return {classes:''};
        }
    });
})();
