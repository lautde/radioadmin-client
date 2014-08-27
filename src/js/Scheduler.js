lt.namespace('lt.scheduler');
(function () {
    'use strict';

    /**
    * The laut.fm Scheduler widget.
    * It manages a tabular overview of free "slots", which can be filled with "programs".
    * One slot is one hour long. One program may occupy slots on more than one day.
    * @constructor
    * @param {Element} container The HTML element to render this widget to
    */
    lt.scheduler.Scheduler = lt.extend(Object, function (container) {
        this.slots = [];
        this.slotViews = [];
        this.programs = new lt.scheduler.SchedulerModel(this.slots);
        this.programs.on('add', this.onProgramAdded, this);
        this.programs.on('remove', this.onProgramRemoved, this);
        this.initGrid(container);
        this.initViewController();
    }, {
        /**
        * @private
        * Set up the calendar GUI
        * @param {Element} container The HTML element to render this widget to
        */
        initGrid: function (container) {
            var days = lt.config.dayNames;
            days.forEach(function (day, index) { // 7 days
                var column = new lt.View('tpl-column');
                column.render({
                    text: day
                }, container);
                for (var h = 0; h < 24; h++) { // … * 24 hours
                    var model = new lt.scheduler.SlotModel({
                        program: null
                    });
                    this.slotViews.push(new lt.View('tpl-slot', model, column));
                    this.slots.push(model);
                }
            }, this);
        },

        /**
        * @private
        * Initialize the associated ProgramViewController instance
        */
        initViewController: function () {
            this.viewController = new lt.scheduler.ProgramViewController(this.programs, this.slotViews);
            this.viewController.on('requestDeletion', this.onDeletionRequest, this);
        },

        /**
        * Callback for deletion request
        * @param {ProgramModel} model The model that the user wants to delete
        */
        onDeletionRequest: function (model) {
            // show confirmation dialog here, if needed, e.g.
            // if (window.confirm(model.get('title') + ' löschen?'))
            model.destroy(); // the view controller will make sure the associated views are destroyed, too
        },

        /**
        * Callback for addition of new programs to the program collection.
        * @param {Array} programs The programs that have been added
        * @param {Collection} collection The program collection
        */
        onProgramAdded: function (programs, collection) {
            programs.forEach(function (program) {
                var slotId = program.get('slotId');
                var duration = program.get('duration');
                for (var i = 1; i <= duration; i++) {
                    var slot = this.slots[slotId + i - 1];
                    slot.set('program', program);
                }
                program.on('change', this.onProgramChanged, this);
            }, this);
        },

        /**
        * Callback for removal of programs from the program collection.
        * @param {Array} programs The programs that have been deleted
        * @param {Collection} collection The program collection
        */
        onProgramRemoved: function (programs, collection) {
            programs.forEach(function (program) {
                var slotId = program.get('slotId');
                var duration = program.get('duration');
                for (var i = 1; i <= duration; i++) {
                    this.slots[slotId + i - 1].set('program', null);
                }
                program.un('change', this.onProgramChanged, this);
            }, this);
        },

        /**
        * listener for program model change
        * @param {Array} keys The properties that have changed in the model
        * @param {Object} newData The current model data
        * @param {Object} oldData The model data before the change happened
        * @param {ProgramModel} model
        */
        onProgramChanged: function (keys, newData, oldData, model) {
            // synchronize slot model
            var oldSlotId = oldData.slotId;
            var newSlotId = newData.slotId;
            var program = this.slots[oldSlotId].get('program');
            var i;
            for (i = 0; i < oldData.duration; i++) {
                this.slots[oldSlotId + i].set('program', null);
            }
            for (i = 0; i < newData.duration; i++) {
                this.slots[newSlotId + i].set('program', program);
            }
        },

        /**
        * TODO: docs
        * TODO: implement D&D
        */
        getPossibleDropTargets: function (requiredLength, splitMidnight) {
            alert('FIXME');
            requiredLength = requiredLength || 1;
            var intervals = [];
            var interval = [];
            for (var i = 0; i < this.slots.length; i++) {
                if (splitMidnight && interval.length && i % 24 === 0) {
                    intervals.push(interval);
                    interval = [];
                }
                var slot = this.slots[i];
                if (slot.isEmpty()) {
                    interval.push(i);
                } else if (interval.length) {
                    intervals.push(interval);
                    interval = [];
                }
            }
            intervals = intervals.filter(function (interval) {
                return interval.length >= requiredLength;
            });
            var flat = intervals.reduce(function (result, interval) {
                return result.concat(interval);
            }, []);
            var startingPoints = flat.filter(function (hour) {
                return flat.indexOf(hour + length - 1) > -1;
            });
            return {
                indexes: flat,
                intervals: intervals,
                startingPoints: startingPoints
            };
        },

        /**
        * Get the program at the given slot id
        * @param {Number} slotId
        * @return {ProgramModel}
        */
        getProgramAt: function (slotId) {
            var slot = this.slots[slotId];
            return slot && slot.get('program');
        }
    });
})();
