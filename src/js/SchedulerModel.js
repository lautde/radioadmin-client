lt.namespace('lt.scheduler');
(function () {
    'use strict';

    lt.scheduler.SchedulerModel = lt.extend(lt.ModelCollection, function (slots) {
        this.slots = slots;
        lt.ModelCollection.apply(this);
    }, {

        /**
         * Insert a program into the schedule.
         * There must be enough free space for insertion, otherwise this method throws an Error.
         * @param {Number} playlistId The playlist id that the program belongs to
         * @param {Number} duration Program's duration in hours. Can be from 1 up to 168 (=7*24)
         * @param {Number} slotId The index of the slot where tho program should start.
         *                        0 = Monday 0:00, 23 = Monday 23:00, 27 = Tuesday 3:00 etc.
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
            this.push(program);
        },

        /**
         * @private
         * Check if the requested slot is free.
         * @param {Number} slotId See {@link this.addProgram}
         * @param {Number} duration See {@link this.addProgram}
         */
        validateInsertionPoint: function (slotId, duration) {
            if (slotId < 0 || slotId + duration > 7 * 24) {
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
            var durationBefore = 0;

            // check preceding program
            if (slotId > 0) {
                programBefore = this.slots[slotId - 1].get('program');
                if (programBefore && programBefore.get('playlistId') == playlistId) {
                    // if the same playlist is already present just before this one, resize it
                    durationBefore = duration + programBefore.get('duration');
                    programBefore.set('duration', durationBefore);
                    isAdjacent = true;
                } else {
                    programBefore = null;
                }
            }

            // check subsequent program
            if (slotId + duration < this.slots.length) {
                var programAfter = this.slots[slotId + duration].get('program');
                var durationDelta;
                if (programAfter && programAfter.get('playlistId') == playlistId) {
                    durationDelta = programAfter.get('duration');
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
         * Remove the given program from the schedule
         * @param {Number|lt.scheduler.ProgramModel} program
         *        Either the slot id where the program is running, or a program model
         */
        removeProgram: function (program) {
            if (typeof program == 'number') {
                program = this.getProgramAt(program);
            }
            if (!(program instanceof lt.scheduler.ProgramModel)) {
                throw new Error('Invalid program');
            }
            program.destroy();
        },

        /**
         * change the duration of the current program
         * @param {Number|lt.scheduler.ProgramModel} program
         *        Either the slot id where the program is running, or a program model
         * @param {number} newDuration The program's new duration
         */
        resizeProgram: function (program, newDuration) {
            if (typeof program == 'number') {
                program = this.getProgramAt(program);
            }
            if (!(program instanceof lt.scheduler.ProgramModel)) {
                throw new Error('Invalid program');
            }
            if (newDuration < 1) {
                throw new Error('Duration must be positive');
            }
            var slotId = program.get('slotId');
            if (slotId + newDuration > this.slots.length) {
                throw new Error('Program does not fit in calendar');
            }
            var oldDuration = program.get('duration');
            if (newDuration == oldDuration) {
                return;
            } else if (newDuration > oldDuration) {
                for (var i = slotId + oldDuration; i < slotId + newDuration; i++) {
                    if (this.slots[i].get('program')) {
                        throw new Error('Slot ' + i + ' already taken');
                    }
                }
            }
            program.set('duration', newDuration);
        }
    });
})();
