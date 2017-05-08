/* global Hktdc, Backbone, JST, Q, utils, $, _, moment, dialogMessage, sprintf */

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
      var self = this;
      console.info('init create user role member');
      // this.listenTo(this.model, 'change', this.render);

      this.model.on('change:User', this.onUserChange);

      self.listenTo(self.model, 'valid', function(validObj) {
        console.log('is valid', validObj);
        if (validObj.field === 'member') {
          utils.toggleInvalidMessage(self.el, 'User', false);
          utils.toggleInvalidMessage(self.el, 'Query', false);
          utils.toggleInvalidMessage(self.el, 'Dept', false);
        } else {
          utils.toggleInvalidMessage(self.el, validObj.field, false);
        }
      });
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
      departmentCollection.url = departmentCollection.url('user-role-members');
      var doFetch = function() {
        departmentCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            // console.log('selectedUserCollection: ', self.model.toJSON().selectedUserCollection);
            // console.log('selectedUserCollection: ', self.model);
            deferred.resolve(departmentCollection);
          },
          error: function(model, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.component.departmentList.error
            });
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadUser: function() {
      var deferred = Q.defer();
      var userCollection = new Hktdc.Collections.FullUser();
      var doFetch = function() {
        userCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(userCollection);
          },
          error: function(model, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.component.fullUserList.error
            });
          }
        });
      };
      doFetch();

      return deferred.promise;
    },

    renderDepartmentSelection: function(departmentCollection) {
      try {
        var self = this;
        var departmentSelectView = new Hktdc.Views.DepartmentSelect({
          collection: departmentCollection,
          selectedDepartment: self.model.toJSON().department,
          attributes: { field: 'Dept' },
          onSelect: function(departmentId) {
            self.model.set({
              Dept: departmentId
            });

            // validation the role member criteria
            self.model.set({
              member: false
            }, {
              validate: true,
              field: 'member',
              onInvalid: function(invalidObject) {
                utils.toggleInvalidMessage(self.el, 'User', invalidObject.message, true);
                utils.toggleInvalidMessage(self.el, 'Query', invalidObject.message, true);
                utils.toggleInvalidMessage(self.el, 'Dept', invalidObject.message, true);
              }
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
          field: 'ExpiryDate',
          value: (self.model.toJSON().ExpiryDate)
            ? moment(self.model.toJSON().ExpiryDate).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          var date = (moment(val, 'YYYY-MM-DD').isValid())
            ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
            : '';
          self.model.set({
            ExpiryDate: date
          });
          self.model.set({
            ExpiryDate: date
          }, {
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
        var userPickerView = new Hktdc.Views.UserPicker({
          field: 'User',
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
            // validation the role member criteria
            self.model.set({
              member: false
            }, {
              validate: true,
              field: 'member',
              onInvalid: function(invalidObject) {
                utils.toggleInvalidMessage(self.el, 'User', invalidObject.message, true);
                utils.toggleInvalidMessage(self.el, 'Query', invalidObject.message, true);
                utils.toggleInvalidMessage(self.el, 'Dept', invalidObject.message, true);
              }
            });
          },
          onRemove: function(user) {
            var users = _.reject(self.model.toJSON().User, function(selectedEmployeeId) {
              return (selectedEmployeeId === user.EmployeeID);
            });
            self.model.set({
              User: users
            });

            self.model.set({
              member: false
            }, {
              validate: true,
              field: 'member',
              onInvalid: function(invalidObject) {
                utils.toggleInvalidMessage(self.el, 'User', invalidObject.message, true);
                utils.toggleInvalidMessage(self.el, 'Query', invalidObject.message, true);
                utils.toggleInvalidMessage(self.el, 'Dept', invalidObject.message, true);
              }
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
      var self = this;
      var updateObject = {};
      var validateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      var validateField = (targetField === 'Query' || targetField === 'Dept' || targetField === 'User')
          ? 'member'
          : targetField;
      updateObject[targetField] = $target.val();
      validateObject[validateField] = $target.val();
      console.log('update object: ', updateObject);
      self.model.set(updateObject);
      // double set is to prevent invalid value bypass the set model process
      // because if saved the valid model, then set the invalid model will not success and the model still in valid state
      self.model.set(validateObject, {
        validate: true,
        field: validateField,
        onInvalid: function(invalidObject) {
          if (validateField === 'member') {
            console.log('is memeber');
            utils.toggleInvalidMessage(self.el, 'User', invalidObject.message, true);
            utils.toggleInvalidMessage(self.el, 'Query', invalidObject.message, true);
            utils.toggleInvalidMessage(self.el, 'Dept', invalidObject.message, true);
          } else {
            utils.toggleInvalidMessage(self.el, targetField, invalidObject.message, true);
          }
        }
      });
    },

    backButtonHandler: function() {
      window.history.back();
    },

    saveButtonHandler: function() {
      var self = this;
      this.validateField();
      if (this.model.isValid()) {
        this.doSaveUserRoleMember()
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
              message: sprintf(dialogMessage.userRoleMember.save.fail, err.request_id || err)
            });
          });
      } else {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: 'Warning',
          message: dialogMessage.common.invalid.form
        });
      }
    },

    doSaveUserRoleMember: function() {
      var deferred = Q.defer();
      var rawData = this.model.toJSON();
      var self = this;
      var saveData = {
        Dept: rawData.Dept,
        ExpiryDate: (rawData.ExpiryDate && moment(rawData.ExpiryDate, 'YYYY-MM-DD').isValid())
          ? moment(rawData.ExpiryDate, 'YYYY-MM-DD').format('YYYYMMDD')
          : '',
        Query: rawData.Query,
        User: rawData.User,
        UserRoleGUID: rawData.UserRoleGUID
      };
      var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember(saveData);
      var doSave = function() {
        saveUserRoleMemberModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: self.model.toJSON().saveType,
          success: function() {
            deferred.resolve();
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
              deferred.reject();
            }
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    validateField: function() {
      var self = this;
      this.model.set({
        member: false
      }, {
        validate: true,
        field: 'member',
        onInvalid: function(invalidObject) {
          console.log(invalidObject);
          utils.toggleInvalidMessage(self.el, 'User', invalidObject.message, true);
          utils.toggleInvalidMessage(self.el, 'Query', invalidObject.message, true);
          utils.toggleInvalidMessage(self.el, 'Dept', invalidObject.message, true);
        }
      });
      this.model.set({
        ExpiryDate: this.model.toJSON().ExpiryDate
      }, {
        validate: true,
        field: 'ExpiryDate',
        onInvalid: function(invalidObject) {
          console.log(invalidObject);
          utils.toggleInvalidMessage(self.el, 'ExpiryDate', invalidObject.message, true);
        }
      });
    }
  });
})();
