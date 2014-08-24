'use strict';

/**
* @param {ModelCollection} programs
* @param {Array} slotViews
*/
lt.scheduler.ProgramViewController = lt.extend(Object, function (programs, slotViews) {
    this.programs = programs;
    this.slotViews = slotViews;
    this.proxyMap = [];
    this.programs.on('add', this.onProgramAdded, this);
    this.programs.on('remove', this.onProgramRemoved, this);
}, {
    /**
    * TODO: docs
    */
    onProgramAdded: function (programs) {
        programs.forEach(function (program) {
            program.on('change', this.onProgramChange, this);
            this.createViews(program);
        }, this);
    },

    /**
    * TODO: docs
    */
    onProgramRemoved: function (programs) {
        programs.forEach(function (program) {
            program.un('change', this.onProgramChange, this);
            this.removeViews(program);
        }, this);
    },

    /**
    * TODO: docs
    */
    removeViews: function (program) {
        var found = false;
        for (var i = 0; i < this.proxyMap.length; i++) {
            if (this.proxyMap[i].program === program) {
                this.proxyMap[i].proxyModels.forEach(function (proxy) {
                    proxy.destroy();
                });
                found = true;
                break;
            }
        }
        if (found) {
            this.proxyMap.splice(i, 1);
        }
    },

    /**
    * TODO: docs
    */
    onProgramChange: function (changed, newData, oldData, program) {
        if (changed.indexOf('duration') != -1 || changed.indexOf('slotId') != -1) {
            this.removeViews(program);
            this.createViews(program);
        } else {
            var proxyData = lt.mix({}, newData);
            delete proxyData.duration;
            delete proxyData.slotId;
            delete proxyData.classes;
            delete proxyData.color;
            for (var i = 0; i < this.proxyMap.length; i++) {
                if (this.proxyMap[i].program === program) {
                    this.proxyMap[i].proxyModels.forEach(function (proxy) {
                        proxy.set(proxyData);
                    });
                }
            }
        }
    },

    /**
    * TODO: docs
    */
    createViews: function (program) {
        var proxyModels = [];
        var slotId = program.get('slotId');
        var color = randomColor(); console.warn('FIXME: get color from playlist');
        program.get('parts').forEach(function (partLength, partIndex, parts) {
            var classes = [];
            if (partIndex < parts.length - 1) {
                classes.push('open-end');
            }
            if (partIndex > 0) {
                classes.push('open-start');
            }
            var model = new lt.scheduler.ProgramModel({
                duration: partLength,
                slotId: slotId,
                playlistId: program.playlistId,
                classes: classes,
                color: color
            });
            var view = new lt.scheduler.ProgramView('tpl-program', model, this.slotViews[slotId]);
            view.on('requestDeletion', this.onDeletionRequest, this);
            proxyModels.push(model);
            slotId += partLength;
        }, this);
        this.proxyMap.push({
            program: program,
            proxyModels: proxyModels
        });
    },

    /**
    * TODO: docs
    */
    onDeletionRequest: function (view) {
        for (var i = 0; i < this.proxyMap.length; i++) {
            var proxyModels = this.proxyMap[i].proxyModels;
            for (var j = 0; j < proxyModels.length; j++) {
                if (proxyModels[j] === view.model) {
                    this.fire('requestDeletion', this.proxyMap[i].program);
                }
            }
        }
    }
});

lt.mix(lt.scheduler.ProgramViewController, lt.Observable);
