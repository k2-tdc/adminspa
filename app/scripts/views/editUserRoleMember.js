/* global Hktdc, Backbone, JST, Q, utils, $, _, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EditUserRoleMember = Backbone.View.extend({

    template: JST['app/scripts/templates/editUserRoleMember.ejs'],

    tagName: 'div',

    events: {
      'click .deleteBtn': 'deleteButtonHandler',
      'click .saveBtn': 'saveButtonHandler'
    },

    initialize: function() {
      console.info('init edit user role member');
      // this.listenTo(this.model, 'change', this.render);
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
          placeholder: 'Expiry Date',
          value: (self.model.toJSON().ExpiryDate)
            ? moment(self.model.toJSON().ExpiryDate).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          self.model.set({
            ExpiryDate: (moment(val, 'YYYY-MM-DD').isValid())
              ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
              : ''
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
        message: 'Are you sure to delete?',
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
                  message: 'Deleted',
                  type: 'confirmation',
                  title: 'Confirmation'
                });
                Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID, {trigger: true});
              },
              error: function(model, response) {
                if (response.status === 401) {
                  utils.getAccessToken(function() {
                    doSave();
                  });
                } else {
                  console.error(response.responseText);

                  Hktdc.Dispatcher.trigger('openAlert', {
                    message: 'error on deleting user role member.',
                    type: 'error',
                    title: 'error on saving user role'
                  });
                }
              }
            });
          };
          doSave();
        }
      });
    },

    saveButtonHandler: function() {
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
          type: this.model.toJSON().saveType,
          success: function() {
            Hktdc.Dispatcher.trigger('openAlert', {
              message: 'saved',
              type: 'confirmation',
              title: 'Confirmation'
            });

            Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID, {trigger: true});
          },
          error: function(model, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doSave();
              });
            } else {
              console.error(response.responseText);
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'error on saving user role member',
                type: 'error',
                title: 'error on saving user role'
              });
            }
          }
        });
      };
      doSave();
    }

  });
})();
