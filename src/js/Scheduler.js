'use strict';
lt.namespace('lt.scheduler');

/**
* TODO: docs
*/
lt.scheduler.Scheduler = lt.extend(Object, function (container) {
    this.slots = [];
    this.slotViews = [];
    this.programs = new lt.ModelCollection();
    this.programs.on('add', this.onProgramAdded, this);
    this.programs.on('remove', this.onProgramRemoved, this);
    this.initGrid(container);
    this.initViewController();
}, {
    /**
    * @private
    */
    initGrid: function (container) {
        var days = lt.config.dayNames;
        days.forEach(function (day, index) {
            var column = new lt.View('tpl-column');
            column.render({
                text: day
            }, container);
            for (var i = 0; i < 24; i++) {
                var model = new lt.scheduler.SlotModel({
                    program: null
                });
                this.slotViews.push(new lt.View('tpl-slot', model, column));
                this.slots.push(model);
            }
        }, this);
    },

    initViewController: function () {
        this.viewController = new lt.scheduler.ProgramViewController(this.programs, this.slotViews);
        this.viewController.on('requestDeletion', this.onDeletionRequest, this);
    },

    onDeletionRequest: function (model) {
        model.destroy();
    },

    /**
    * TODO: docs
    */
    addProgram: function (playlistId, duration, slotId) {
        this.validateInsertionPoint(slotId, duration);

        var isAdjacent = this.processAdjacentInsertion(playlistId, duration, slotId);
        if (isAdjacent) {
            // the processAdjacentInsertion method takes care of this case
            return;
        }

        var program = new lt.scheduler.ProgramModel({
            duration: duration,
            slotId: slotId,
            playlistId: playlistId
        });

        this.programs.push(program);
        program.on('change', this.onProgramChanged, this);
    },

    /**
    * @private
    */
    validateInsertionPoint: function (slotId, duration) {
        if (slotId < 0 || slotId + duration - 1 >= this.slots.length) {
            throw new Error('Invalid insertion point');
        }
        for (var i = 1; i <= duration; i++) {
            var slot = this.slots[slotId + i - 1];
            if (slot.get('program')) {
                throw new Error('Slot ' + (slotId + i - 1) + ' already taken');
            }
        }
    },

    /**
    * @private
    * Checks if the insertion happens directly next to an already existing program of the same playlist.
    * In this case, this method expands the existing program to the new length/position.
    * @param {String} playlistId See {@link this.addProgram}
    * @param {Number} duration See {@link this.addProgram}
    * @param {Number} slotId See {@link this.addProgram}
    * @return {Boolean} `true` if an adjacent list was expanded, `false` otherwise
    */
    processAdjacentInsertion: function (playlistId, duration, slotId) {
        var isAdjacent = false;
        var programBefore = null;

        // check preceding program
        if (slotId > 0) {
            programBefore = this.slots[slotId - 1].get('program');
            if (programBefore && programBefore.get('playlistId') == playlistId) {
                // if the same playlist is already present just before this one, resize it
                var durationBefore = duration + programBefore.get('duration')
                programBefore.set('duration', durationBefore);
                isAdjacent = true;
            } else {
                programBefore = null;
            }
        }

        // check subsequent program
        if (slotId + duration < this.slots.length) {
            var programAfter = this.slots[slotId + duration].get('program');
            if (programAfter && programAfter.get('playlistId') == playlistId) {
                var durationDelta = programAfter.get('duration');
                if (programBefore) {
                    // if the same playlist is already present just before and just after after this one,
                    // resize the one before and remove the one after
                    this.removeProgram(programAfter);
                    programBefore.set('duration', durationBefore + durationDelta);
                } else {
                    // if the same playlist is already present just after this one, resize and move it
                    programAfter.set({
                        duration: duration + durationDelta,
                        slotId: slotId
                    });
                }
                isAdjacent = true;
            }
        }
        return isAdjacent;
    },


    /**
    * @param {Number|lt.scheduler.ProgramModel} program
    */
    removeProgram: function (program) {
        if (typeof program == 'number') {
            var slot = this.slots[program];
            program = slot && slot.get('program');
        }
        if (!program instanceof lt.scheduler.ProgramModel) {
            throw new Error('Invalid program');
        }
        program.destroy();
    },

    /**
    * TODO: docs
    */
    onProgramAdded: function (programs, collection) {
        programs.forEach(function (program) {
            var slotId = program.get('slotId');
            var duration = program.get('duration');
            for (var i = 1; i <= duration; i++) {
                var slot = this.slots[slotId + i - 1];
                slot.set('program', program);
            }
        }, this);
    },

    /**
    * TODO: docs
    */
    onProgramRemoved: function (programs, collection) {
        programs.forEach(function (program) {
            var slotId = program.get('slotId');
            var duration = program.get('duration');
            for (var i = 1; i <= duration; i++) {
                this.slots[slotId + i - 1].set('program', null);
            }
        }, this);
    },

    /**
    * listener for program model change
    */
    onProgramChanged: function (keys, newData, oldData, model) {
        // synchronize slot model
        var oldSlotId = oldData.slotId;
        var newSlotId = newData.slotId;
        var program = this.slots[oldSlotId].get('program');
        for (var i = 0; i < oldData.duration; i++) {
            this.slots[oldSlotId + i].set('program', null);
        }
        for (var i = 0; i < newData.duration; i++) {
            this.slots[newSlotId + i].set('program', program);
        }
    },

    /**
    * TODO: docs
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

    getProgramAt: function (slotId) {
        return this.slots[slotId].get('program');
    }
});
