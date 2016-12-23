/* global Hktdc, Backbone, JST, $, Q */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplate = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplate.ejs'],

    tagName: 'div',

    events: {},

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      
      Q.all([
        self.loadApplication(),
        self.loadProcess()
      ])
        .then(function(results) {
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            applicationCollection: results[0],
            processCollection: results[1]
          }, {silent: true});
          // console.log(results);

          self.renderApplicationSelect();
          self.renderProcessSelect();
        })
        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: 'Runtime Error'
          });
        });
    },

    loadApplication: function() {
      var deferred = Q.defer();
      var applicationCollection = new Hktdc.Collections.Application();
      applicationCollection.fetch({
        success: function() {
          deferred.resolve(applicationCollection);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadProcess: function() {
      var deferred = Q.defer();
      var processCollection = new Hktdc.Collections.Process();
      processCollection.fetch({
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    renderApplicationSelect: function() {
      var self = this;
      var ApplicationSelectView = new Hktdc.Views.ApplicationSelect({
        collection: self.model.toJSON().applicationCollection
      });
      ApplicationSelectView.render();
      $('.applicationContainer', self.el).html(ApplicationSelectView.el);
    },

    renderProcessSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    }
  });
})();
