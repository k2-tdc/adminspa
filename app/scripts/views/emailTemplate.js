/* global Hktdc, Backbone, JST, $, Q, utils */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplate = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplate.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveTemplate',
      // 'blur'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));

      Q.all([
        self.loadProcess(),
        self.loadStep()
      ])
        .then(function(results) {
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            applicationCollection: results[0],
            processCollection: results[1]
          }, {silent: true});
          // console.log(results);

          self.renderProcessSelect();
          self.renderStepSelect();
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

    loadProcess: function() {
      var deferred = Q.defer();
      var applicationCollection = new Hktdc.Collections.Application();
      applicationCollection.fetch({
        success: function() {
          deferred.resolve(applicationCollection);
        },
        error: function(collection, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadStep: function() {
      var deferred = Q.defer();
      var processCollection = new Hktdc.Collections.Process();
      processCollection.fetch({
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(collection, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    renderProcessSelect: function() {
      var self = this;
      var ApplicationSelectView = new Hktdc.Views.ApplicationSelect({
        collection: self.model.toJSON().applicationCollection
      });
      ApplicationSelectView.render();
      $('.applicationContainer', self.el).html(ApplicationSelectView.el);
    },

    renderStepSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    },

    saveTemplate: function() {
      var deferred = Q.defer();
      Backbone.emulateHTTP = true;
      Backbone.emulateJSON = true;

      var sendRequestModel = new Hktdc.Models.SaveEmailTemplate({
        UserId: Hktdc.Config.userID,
        TemplateId: this.model.toJSON().TemplateId,
        ProcessId: this.model.toJSON().Application,
        StepId: this.model.toJSON().Process,
        Subject: this.model.toJSON().Subject,
        Body: this.model.toJSON().Body,
        Enabled: this.model.toJSON().Enabled
      });
      sendRequestModel.save({}, {
        beforeSend: utils.setAuthHeader,
        success: function(mymodel, response) {
          deferred.resolve(response);
        },
        error: function(model, e) {
          deferred.reject('Submit Request Error' + JSON.stringify(e, null, 2));
        }
      });
      return deferred.promise;
    }

  });
})();
