/* global Hktdc, Backbone, JST, $, Q, utils, dialogMessage, sprintf, dialogTitle */

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
      self.listenTo(self.model, 'valid', function(validObj) {
        // console.log('is valid', validObj);
        utils.toggleInvalidMessage(self.el, validObj.field, false);
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
            title: dialogTitle.error,
            message: sprintf(dialogMessage.common.error.script, {
              code: 'unknown',
              msg: dialogMessage.component.processList.error
            })
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
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.component.processList.error
            });
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
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.component.stepList.error
            });
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
        attributes: {
          field: 'ProcessId',
          name: 'ProcessId'
        },
        onSelected: function(process) {
          self.model.set({
            ProcessId: process.ProcessID,
            ProcessName: process.ProcessName
          });

          self.model.set({
            ProcessId: process.ProcessID
          }, {
            validate: true,
            field: 'ProcessId',
            onInvalid: function(invalidObject) {
              utils.toggleInvalidMessage(self.el, 'ProcessId', invalidObject.message, true);
            }
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
        attributes: {
          field: 'StepId',
          name: 'StepId'
        },
        selectedStep: self.model.toJSON().StepId,
        onSelected: function(stepId) {
          self.model.set({
            StepId: stepId
          });
          self.model.set({
            StepId: stepId
          }, {
            validate: true,
            field: 'StepId',
            onInvalid: function(invalidObject) {
              utils.toggleInvalidMessage(self.el, 'StepId', invalidObject.message, true);
            }
          });
        }
      });
      stepSelectView.render();
      setTimeout(function() {
        $('.stepContainer', self.el).html(stepSelectView.el);
      });
    },

    updateFormModel: function(ev) {
      var self = this;
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      if ($target.is('[type="checkbox"]')) {
        updateObject[targetField] = ($target.prop('checked')) ? 1 : 0;
      } else {
        updateObject[targetField] = $target.val();
      }
      self.model.set(updateObject);

      // double set is to prevent invalid value bypass the set model process
      // because if saved the valid model, then set the invalid model will not success and the model still in valid state
      self.model.set(updateObject, {
        validate: true,
        field: targetField,
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, targetField, invalidObject.message, true);
        }
      });
    },

    saveTemplate: function() {
      var self = this;
      self.validateField();
      if (self.model.isValid()) {
        Hktdc.Dispatcher.trigger('openConfirm', {
          title: dialogTitle.confirmation,
          message: dialogMessage.emailTemplate.save.confirm,
          onConfirm: function() {
            self.doSaveTemplate()
              .then(function(response) {
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.information,
                  message: dialogMessage.emailTemplate.save.success
                });
                window.history.back();
                // Backbone.history.navigate('emailtemplate', {trigger: true});
              })
              .catch(function(err) {
                console.error(err);
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.error,
                  message: sprintf(dialogMessage.common.error.script, {
                    code: 'unknown',
                    msg: dialogMessage.emailTemplate.save.error
                  })
                });
              })
              .fin(function() {
                Hktdc.Dispatcher.trigger('closeConfirm');
              });
          }
        });
      } else {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: dialogTitle.warning,
          message: dialogMessage.common.invalid.form
        });
      }
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

      var method = 'POST';
      if (sendEmailTemplateModel.toJSON().TemplateId) {
        method = 'PUT';
        sendEmailTemplateModel.url = sendEmailTemplateModel.url(parseInt(this.model.toJSON().TemplateId));
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
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.emailTemplate.save.error
            });
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    deleteButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: dialogTitle.confirmation,
        message: dialogMessage.emailTemplate.delete.confirm,
        onConfirm: function() {
          self.doDeleteTemplate()
            .then(function(response) {
              if (String(response.Success) === '1') {
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.information,
                  message: dialogMessage.emailTemplate.delete.success
                });
                window.history.back();
              } else {
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.error,
                  message: sprintf(dialogMessage.common.error.system, {
                    code: 'unknown',
                    msg: response.error || response.msg || response.Msg || dialogMessage.emailTemplate.delete.fail
                  })
                });
              }
            })
            .catch(function(err) {
              console.error(err);
              Hktdc.Dispatcher.trigger('openAlert', {
                title: dialogTitle.error,
                message: sprintf(dialogMessage.common.error.script, {
                  code: 'unknown',
                  msg: dialogMessage.emailTemplate.delete.error
                })
              });
            })
            .fin(function() {
              Hktdc.Dispatcher.trigger('closeConfirm');
            });
        }
      });
    },

    doDeleteTemplate: function() {
      var deferred = Q.defer();
      var data = [{
        TemplateId: this.model.toJSON().TemplateId
      }];
      var DeleteTemplateModel = new Hktdc.Models.DeleteEmailTemplate({
        data: data
      });
      var doSave = function() {
        DeleteTemplateModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: 'POST',
          success: function(mymodel, response) {
            if (response.Success === '1' || response.Success === 1) {
              deferred.resolve(response);
            } else {
              deferred.reject(response.Msg);
            }
          },
          error: function(model, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.emailTemplate.delete.error
            });
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    validateField: function() {
      var self = this;
      this.model.set({
        ProcessId: this.model.toJSON().ProcessId
      }, {
        validate: true,
        field: 'ProcessId',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'ProcessId', invalidObject.message, true);
        }
      });

      this.model.set({
        StepId: this.model.toJSON().StepId
      }, {
        validate: true,
        field: 'StepId',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'StepId', invalidObject.message, true);
        }
      });

      this.model.set({
        Subject: this.model.toJSON().Subject
      }, {
        validate: true,
        field: 'Subject',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Subject', invalidObject.message, true);
        }
      });

      this.model.set({
        Body: this.model.toJSON().Body
      }, {
        validate: true,
        field: 'Body',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Body', invalidObject.message, true);
        }
      });
    }
  });
})();
