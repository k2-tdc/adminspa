/* global Hktdc, Backbone, JST, $, Q, utils, dialogMessage */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplate = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplate.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveTemplate',
      'click .deleteBtn': 'deleteButtonHandler',
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
      var doFetch = function() {
        processCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(processCollection);
          },
          error: function(collection, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on getting process');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadStep: function() {
      var deferred = Q.defer();
      var stpeCollection = new Hktdc.Collections.Step();
      stpeCollection.url = stpeCollection.url(this.model.toJSON().ProcessName, 'Email');
      var doFetch = function() {
        stpeCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(stpeCollection);
          },
          error: function(collection, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on getting step');
            }
          }
        });
      };
      doFetch();
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
          window.history.back();
          // Backbone.history.navigate('emailtemplate', {trigger: true});
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
      var doSave = function() {
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
          error: function(model, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doSave();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on saving email template.');
            }
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    deleteButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: dialogMessage.emailTemplate.delete.confirm,
        onConfirm: function() {
          self.doDeleteTemplate()
            .then(function(response) {
              Hktdc.Dispatcher.trigger('closeConfirm');
              if (String(response.success) === '1') {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'success',
                  title: 'confirmation',
                  message: 'Deleted record.'
                });

                window.history.back();
              } else {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'error',
                  title: 'error',
                  message: response.Msg
                });
              }
            })
            .catch(function(err) {
              Hktdc.Dispatcher.trigger('openAlert', {
                type: 'error',
                title: 'error',
                message: 'delete failed'
              });
              console.error(err);
            });
        }
      });
    },

    doDeleteTemplate: function() {
      var deferred = Q.defer();
      var data = [{ TemplateId: this.model.toJSON().TemplateId }];
      var DeleteTemplateModel = new Hktdc.Models.DeleteEmailTemplate({data: data});
      DeleteTemplateModel.save(null, {
        type: 'POST',
        beforeSend: utils.setAuthHeader,
        success: function(model, response) {
          deferred.resolve(response);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }

  });
})();
