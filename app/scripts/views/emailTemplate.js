/* global Hktdc, Backbone, JST, $, Q, utils */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplate = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplate.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveTemplate',
      'blur .formTextField': 'updateFormModel',
      'change .formCheckboxField': 'updateFormModel'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
      var self = this;
      if (this.model.toJSON().ProcessName) {
        setTimeout(function() {
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                stepCollection: stepCollection
              });
            });
        });
      }
      self.model.on('change:stepCollection', function() {
        console.log('change step collection');
        self.renderStepSelect();
      });
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));

      self.loadProcess()
        .then(function(processCollection) {
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection
          }, {
            silent: true
          });
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

    loadStep: function() {
      var deferred = Q.defer();
      var stpeCollection = new Hktdc.Collections.Step();
      stpeCollection.url = stpeCollection.url(this.model.toJSON().ProcessName, 'Email');
      stpeCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(stpeCollection);
        },
        error: function(collection, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    renderProcessSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().ProcessId,
        onSelected: function(process) {
          self.model.set({
            ProcessId: process.ProcessID,
            ProcessName: process.ProcessName
          });
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                StepId: null,
                stepCollection: stepCollection
              });
            });
        }
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderStepSelect: function() {
      var self = this;
      var stepSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON().StepId,
        onSelected: function(stepId) {
          self.model.set({StepId: stepId});
        }
      });
      stepSelectView.render();
      setTimeout(function() {
        $('.stepContainer', self.el).html(stepSelectView.el);
      });
    },

    updateFormModel: function(ev) {
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      if ($target.is('[type="checkbox"]')) {
        updateObject[targetField] = ($target.prop('checked')) ? 1 : 0;
      } else {
        updateObject[targetField] = $target.val();
      }
      this.model.set(updateObject);
      // this.model.set(updateObject, {
      // validate: true,
      // field: targetField
      // });
      // double set is to prevent invalid value bypass the set model process
      // because if saved the valid model, then set the invalid model will not success and the model still in valid state
    },

    saveTemplate: function() {
      this.doSaveTemplate()
        .then(function(response) {
          Hktdc.Dispatcher.trigger('openAlert', {
            type: 'success',
            title: 'Confirmation',
            message: 'You have saved'
          });
          Backbone.history.navigate('emailtemplate', {trigger: true});
        })
        .catch(function(err) {
          Hktdc.Dispatcher.trigger('openAlert', {
            type: 'success',
            title: 'Confirmation',
            message: err
          });
        });
    },

    doSaveTemplate: function() {
      var deferred = Q.defer();
      Backbone.emulateHTTP = true;
      Backbone.emulateJSON = true;
      // console.log(this.model.toJSON());
      var sendEmailTemplateModel = new Hktdc.Models.SaveEmailTemplate({
        UserId: Hktdc.Config.userID,
        TemplateId: (this.model.toJSON().TemplateId) ? parseInt(this.model.toJSON().TemplateId) : 0,
        ProcessId: parseInt(this.model.toJSON().ProcessId),
        StepId: parseInt(this.model.toJSON().StepId),
        Subject: this.model.toJSON().Subject,
        Body: this.model.toJSON().Body,
        Enabled: (this.model.toJSON().Enabled) ? 1 : 0
      });

      if (sendEmailTemplateModel.toJSON().TemplateId) {
        var method = 'PUT';
        sendEmailTemplateModel.url = sendEmailTemplateModel.url(parseInt(this.model.toJSON().TemplateId));
      } else {
        var method = 'POST';
      }
      sendEmailTemplateModel.save({}, {
        beforeSend: utils.setAuthHeader,
        type: method,
        success: function(mymodel, response) {
          // console.log(response);
          if (response.Success === '1' || response.Success === 1) {
            deferred.resolve();
          } else {
            deferred.reject(response.Msg);
          }
        },
        error: function(model, e) {
          deferred.reject('Submit Request Error' + JSON.stringify(e, null, 2));
        }
      });
      return deferred.promise;
    }

  });
})();
