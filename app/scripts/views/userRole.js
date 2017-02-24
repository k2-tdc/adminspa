/* global Hktdc, Backbone, JST, utils, Q, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserRole = Backbone.View.extend({

    template: JST['app/scripts/templates/userRole.ejs'],

    tagName: 'div',

    id: '',

    className: '',

    events: {},

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));

      Q.all([
        self.loadEntityList(),
        self.loadProcess()
      ])
        .then(function(results) {
          var entities = results[0];
          var processes = results[1];
          self.renderEntity(entities);
          self.renderProcessSelect(processes);
        })
        .catch(function(err) {
          console.error('error on rendering user role', err);
        });
    },

    loadProcess: function() {
      var deferred = Q.defer();
      var processCollection = new Hktdc.Collections.Process();
      processCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(collection, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadEntityList: function() {
      var entityListCollection = new Hktdc.Collections.Entity();
      return Q.promise(function(resolve, reject) {
        entityListCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function(collection, entityList) {
            var cols = [];
            var col = [];
            var numOfCol = 3;
            for (var i = 0; i <= entityList.length; i++) {
              if (i > 0 && (i % numOfCol) === 0) {
                cols.push(col);
                col = [];
                col.push(entityList[i]);
              } else {
                col.push(entityList[i]);
              }
            }
            resolve(cols);
          },
          error: function(err) {
            reject(err);
          }
        });
      });
    },

    renderProcessSelect: function(processCollection) {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: processCollection,
        selectedProcess: self.model.toJSON().ProcessId,
        onSelected: function(process) {
          self.model.set({
            ProcessId: process.ProcessID,
            ProcessName: process.ProcessName
          });
        }
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderEntity: function(entityData) {
      var entityListView = new Hktdc.Views.EntityList({
        data: entityData
      });
      entityListView.render();
      $('.entity-table', this.el).append(entityListView.el);
    }

  });
})();
