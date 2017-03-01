/* global Hktdc, Backbone, JST, Q, utils, $, _, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.CreateUserRoleMember = Backbone.View.extend({

    template: JST['app/scripts/templates/createUserRoleMember.ejs'],

    tagName: 'div',

    events: {
      'blur .formTextField': 'updateFormModel',
      'click .backBtn': 'backButtonHandler',
      'click .saveBtn': 'saveButtonHandler'
    },

    initialize: function() {
      console.info('init create user role member');
      // this.listenTo(this.model, 'change', this.render);
      this.model.on('change:User', this.onUserChange);
    },

    render: function() {
      var self = this;
      console.log(self.model.toJSON());
      self.$el.html(self.template(self.model.toJSON()));
      self.renderDatePicker();

      Q.all([
        self.loadDepartment(),
        self.loadUser()
      ])
        .then(function(results) {
          var departmentCollection = results[0];
          var userCollection = results[1];
          self.renderDepartmentSelection(departmentCollection);
          self.renderUserPicker(userCollection);
        });
    },

    loadDepartment: function() {
      var deferred = Q.defer();
      var departmentCollection = new Hktdc.Collections.Department();
      departmentCollection.url = departmentCollection.url();
      departmentCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          // console.log('selectedUserCollection: ', self.model.toJSON().selectedUserCollection);
          // console.log('selectedUserCollection: ', self.model);
          deferred.resolve(departmentCollection);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadUser: function() {
      var deferred = Q.defer();
      var userCollection = new Hktdc.Collections.FullUser();
      userCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(userCollection);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    },

    renderDepartmentSelection: function(departmentCollection) {
      try {
        var self = this;
        var departmentSelectView = new Hktdc.Views.DepartmentSelect({
          collection: departmentCollection,
          selectedDepartment: self.model.toJSON().department,
          onSelect: function(departmentId) {
            self.model.set({
              Dept: departmentId
            });
          }
        });
        departmentSelectView.render();
        $('.departmentContainer', self.el).html(departmentSelectView.el);
      } catch (e) {
        console.error(e);
      }
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
        var userPickerView = new Hktdc.Views.UserPicker({
          users: _.map(userCollection.toJSON(), function(employee) {
            employee.label = employee.FullName;
            return employee;
          }),
          onSelect: function(user) {
            var existing = _.find(self.model.toJSON().User, function(selectedEmployeeId) {
              return (selectedEmployeeId === user.EmployeeID);
            });
            if (!existing) {
              self.model.set({
                User: _.union(self.model.toJSON().User, [user.EmployeeID])
              });
            }
          },
          onRemove: function(user) {
            var users = _.reject(self.model.toJSON().User, function(selectedEmployeeId) {
              return (selectedEmployeeId === user.EmployeeID);
            });
            self.model.set({
              User: users
            });
          }
        });
        userPickerView.render();
        $('.userPicker', this.el).append(userPickerView.el);
      } catch (e) {
        console.log(e);
      }
    },

    updateFormModel: function(ev) {
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      updateObject[targetField] = $target.val();
      this.model.set(updateObject);
    },

    backButtonHandler: function() {
      window.history.back();
    },

    saveButtonHandler: function() {
      var rawData = this.model.toJSON();
      var saveData = {
        Dept: rawData.Role,
        ExpiryDate: rawData.ExpiryDate,
        Query: rawData.Query,
        User: rawData.User,
        UserRoleGUID: rawData.UserRoleGUID
      };
      var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember(saveData);

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
