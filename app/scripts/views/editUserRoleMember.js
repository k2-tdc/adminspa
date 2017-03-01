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
            ? moment(self.model.toJSON().ExpiryDate, 'MM/DD/YYYY').format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          self.model.set({
            ExpiryDate: val
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
      var rawData = this.model.toJSON();
      var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember();
      saveUserRoleMemberModel.clear();
      saveUserRoleMemberModel.url = saveUserRoleMemberModel.url(rawData.UserRoleMemberGUID);
      saveUserRoleMemberModel.save(null, {
        type: 'DELETE',
        beforeSend: utils.setAuthHeader,
        success: function() {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'saved',
            type: 'confirmation',
            title: 'Runtime Error'
          });
        },
        error: function(err) {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: 'error on saving user role'
          });
        }
      });
    },

    saveButtonHandler: function() {
      var rawData = this.model.toJSON();
      var saveData = {
        Role: rawData.Role,
        Desc: rawData.Desc,
        ProcessId: rawData.ProcessId,
        UserRoleGUID: rawData.UserRoleGUID
      };
      var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember(saveData);

      if (!rawData.UserRoleGUID) {
        saveUserRoleMemberModel.unset('UserRoleGUID');
      }

      // saveUserRoleMemberModel.url = saveUserRoleMemberModel.url(this.model.toJSON().UserRoleGUID);
      saveUserRoleMemberModel.save(null, {
        beforeSend: utils.setAuthHeader,
        type: this.model.toJSON().saveType,
        success: function() {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'saved',
            type: 'confirmation',
            title: 'Runtime Error'
          });
        },
        error: function(err) {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: 'error on saving user role'
          });
        }
      });
    }

  });
})();
