lt.namespace('lt.scheduler');
(function () {
    'use strict';

    /**
    * A component that creates one or multiple program views for a program, depending on its length.
    * Once it is instantiated, view creation, update and destruction happens automatically whenever the
    * program collection or one of its entries changes.
    * From a high level perspective, this acts as a View in the Scheduler, but on the inside it is a Controller.
    *                  +-------------+
    * +-------------+  | 0:00        |
    * | 23:00       |  |             |
    * | ProgramView |  | ProgramView |
    * +-----+-------+  +-----+-------+
    *       |                |         <- automagic binding
    *    ProxyModel       ProxyModel
    *         \            /           <- ProgramViewController
    *          ProgramModel
    *
    * @param {ModelCollection} programCollection The collection of programs (mutable)
    * @param {Array} slotViews List of views where the programs in the collection should be rendered
    */
    lt.scheduler.ProgramViewController = lt.extend(Object, function (programCollection, slotViews) {
        this.proxyMap = [];
        this.slotViews = slotViews;
        programCollection.on('add', this.onProgramAdded, this);
        programCollection.on('remove', this.onProgramRemoved, this);
    }, {
        /**
        * Callback for the 'add' event in the program collection
        * @param {Array} programs The programs that have been added
        */
        onProgramAdded: function (programs) {
            programs.forEach(function (program) {
                program.on('change', this.onProgramChange, this);
                this.createViews(program);
            }, this);
        },

        /**
        * Callback for the 'remove' event in the program collection
        * @param {Array} programs The programs that have been removed
        */
        onProgramRemoved: function (programs) {
            programs.forEach(function (program) {
                program.un('change', this.onProgramChange, this);
                this.removeViews(program);
            }, this);
        },

        /**
        * @private
        * Remove all program views associated with a given model.
        * Also destroys the underlying proxy models.
        * @param {ProgramModel} program The program to remove
        */
        removeViews: function (program) {
            var found = false;
            for (var i = 0; i < this.proxyMap.length; i++) {
                if (this.proxyMap[i].program === program) {
                    /*jshint loopfunc: true*/
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
        * Callback for the 'change' event in a single program.
        * Updates or destroys/rebuilds associated views, depending on what has changed
        * @param {Array} changed The properties that have changed in the model
        * @param {Object} newData The current model data
        * @param {Object} oldData The model data before the change happened
        * @param {ProgramModel} program
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
                for (var i = 0; i < this.proxyMap.length; i++) { // find proxy models for program mode
                    if (this.proxyMap[i].program === program) {
                        /*jshint loopfunc: true*/
                        this.proxyMap[i].proxyModels.forEach(function (proxy) {
                            proxy.set(proxyData);
                        });
                    }
                }
            }
        },

        /**
        * @private
        * Create one or more program views, and also deploy a "proxy" model for each,
        * so that standard data binding can be used.
        * @param {ProgramModel} program The program to create views for.
        */
        createViews: function (program) {
            var proxyModels = [];
            var slotId = program.get('slotId');
            var color = randomColor();
            console.warn('FIXME: get color from playlist');
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
        * @private
        * Callback for the requestDeletion event from one of the program views,
        * occurring when the user has pressed the delete button
        * @param {ProgramView} view
        */
        onDeletionRequest: function (view) {
            this.fire('requestDeletion', this.getProgramForView(view));
        },
    
        /**
        * Get the ProgramModel (not proxy model) for a given view
        * @param {ProgramView} view
        * @return {ProgramModel}
        */
        getProgramForView: function (view) {
            // Uhm, yes, this is slightly tricky…
            // It would be easier to do view.program = program; in createViews(),
            // but that's sloppy MVC, and we don't do that.
            // this.proxyMap is clean but a bit of work.
            for (var i = 0; i < this.proxyMap.length; i++) {
                var proxyModels = this.proxyMap[i].proxyModels;
                for (var j = 0; j < proxyModels.length; j++) {
                    if (proxyModels[j] === view.model) {
                        return this.proxyMap[i].program;
                    }
                }
            }
        }
    });

    lt.mix(lt.scheduler.ProgramViewController, lt.Observable);
})();
