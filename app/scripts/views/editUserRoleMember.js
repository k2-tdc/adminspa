/* global Hktdc, Backbone, JST, Q, utils, $, _, moment, dialogMessage, sprintf */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EditUserRoleMember = Backbone.View.extend({

    template: JST['app/scripts/templates/editUserRoleMember.ejs'],

    tagName: 'div',

    events: {
      'click .deleteBtn': 'deleteButtonHandler',
      'click .saveBtn': 'saveButtonHandler',
      'blur .formTextField': 'updateFormModel'
    },

    initialize: function() {
      var self = this;
      console.info('init edit user role member');
      // this.listenTo(this.model, 'change', this.render);
      self.model.on('invalid', function(model, invalidObject) {
        utils.toggleInvalidMessage(self.el, invalidObject.field, true);
      });

      self.listenTo(self.model, 'valid', function(validObj) {
        // console.log('is valid', validObj);
        utils.toggleInvalidMessage(self.el, validObj.field, false);
      });
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      self.renderDatePicker();
    },

    renderDatePicker: function() {
      var self = this;
      var createDateFromView = new Hktdc.Views.DatePicker({
        model: new Hktdc.Models.DatePicker({
          field: 'ExpiryDate',
          placeholder: 'Expiry Date',
          value: (self.model.toJSON().ExpiryDate)
            ? moment(self.model.toJSON().ExpiryDate).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          var saveValue = {
            ExpiryDate: (moment(val, 'YYYY-MM-DD').isValid())
              ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
              : ''
          };
          self.model.set(saveValue);
          self.model.set(saveValue, {
            validate: true,
            field: 'ExpiryDate',
            onInvalid: function(invalidObject) {
              utils.toggleInvalidMessage(self.el, 'ExpiryDate', invalidObject.message, true);
            }
          });
        }
      });

      $('.expiryDatePicker', self.el).html(createDateFromView.el);
    },

    renderUserPicker: function(userCollection) {
      try {
        var self = this;
        var $input = $('.fullUserPicker', this.el);
        // console.log($input);
        // console.log(userCollection.toJSON());
        var newEmployeeArray = _.map(userCollection.toJSON(), function(employee) {
          employee.label = employee.FullName;
          return employee;
        });
        $input.autocomplete({
          source: newEmployeeArray,
          select: function(ev, ui) {
            var existing = _.find(self.model.toJSON().User, function(selectedEmployeeId) {
              return (selectedEmployeeId === ui.item.EmployeeID);
            });
            if (!existing) {
              self.model.set({
                User: _.union(self.model.toJSON().User, [ui.item.EmployeeID])
              });
            }
          },

          close: function(ev, ui) {
            // console.log($(ev.target).val());
            $(ev.target).val('');
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    deleteButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: dialogMessage.userRoleMember.delete.confirm,
        onConfirm: function() {
          var rawData = self.model.toJSON();
          var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember();
          saveUserRoleMemberModel.clear();
          saveUserRoleMemberModel.url = saveUserRoleMemberModel.url(rawData.UserRoleMemberGUID);
          var doSave = function() {
            saveUserRoleMemberModel.save(null, {
              type: 'DELETE',
              beforeSend: utils.setAuthHeader,
              success: function() {
                Hktdc.Dispatcher.trigger('closeConfirm');
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: 'Information',
                  message: dialogMessage.userRoleMember.delete.success
                });
                Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID, {trigger: true});
              },
              error: function(model, response) {
                  utils.apiErrorHandling(response, {
                      // 401: doFetch,
                      unknownMessage: dialogMessage.userRoleMember.delete.error
                  });
              }
            });
          };
          doSave();
        }
      });
    },

    saveButtonHandler: function() {
      var self = this;
      self.validateField();
      if (self.model.isValid()) {
        self.doSaveRoleMember()
          .then(function(response) {
            Hktdc.Dispatcher.trigger('openAlert', {
              type: 'success',
              title: 'Information',
              message: dialogMessage.userRoleMember.save.success
            });
            Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID, {trigger: true});
          })
          .catch(function(err) {
            Hktdc.Dispatcher.trigger('openAlert', {
              type: 'error',
              title: dialogTitle.error,
              message: sprintf(dialogMessage.userRoleMember.save.fail, {
                code: err.request_id || 'unknown',
                msg: err.error || 'unknown'
              })
            });
          });
      } else {
        Hktdc.Dispatcher.trigger('openAlert', {
          type: 'error',
          title: 'Alert',
          message: dialogMessage.commom.invalid.form
        });
      }
    },

    doSaveRoleMember: function() {
      var deferred = Q.defer();
      var self = this;
      var rawData = this.model.toJSON();
      var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember();

      saveUserRoleMemberModel.clear();
      saveUserRoleMemberModel.set({
        UserRoleMemberGUID: rawData.UserRoleMemberGUID,
        ExpiryDate: (rawData.ExpiryDate && moment(rawData.ExpiryDate, 'YYYY-MM-DD').isValid())
          ? moment(rawData.ExpiryDate, 'YYYY-MM-DD').format('YYYYMMDD')
          : ''
      });
      saveUserRoleMemberModel.url = saveUserRoleMemberModel.url(rawData.UserRoleMemberGUID);
      var doSave = function() {
        saveUserRoleMemberModel.save(null, {
          beforeSend: utils.setAuthHeader,
          type: self.model.toJSON().saveType,
          success: function(model, response) {
            deferred.resolve(response);
          },
          error: function(model, response) {
              utils.apiErrorHandling(response, {
                  // 401: doFetch,
                  unknownMessage: dialogMessage.userRoleMember.save.error
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
        ExpiryDate: this.model.toJSON().ExpiryDate
      }, {
        validate: true,
        field: 'ExpiryDate',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'ExpiryDate', invalidObject.message, true);
        }
      });
    }

  });
})();
