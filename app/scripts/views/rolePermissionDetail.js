/* global Hktdc, Backbone, utils, JST, Q, $, _, dialogMessage, dialogTitle */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.RolePermissionDetail = Backbone.View.extend({

    template: JST['app/scripts/templates/rolePermissionDetail.ejs'],

    tagName: 'div',

    events: {
      'click .delBtn': 'deleteButtonHandler',
      'click .saveBtn': 'saveButtonHandler'
    },

    initialize: function() {
      var self = this;
      // this.listenTo(this.model, 'change', this.render);
      this.model.on('change:ProcessName', function(model, processName) {
        return Q.all([
          self.loadProcessPermission(processName),
          self.loadRole(processName)
        ])
          .then(function(results) {
            var permissionCollection = results[0];
            var roleCollection = results[1];

            self.renderPermissionSelect(permissionCollection);
            self.renderRolePicker(roleCollection);
          });
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
          // console.log(self.model.toJSON().ProcessId);
          return Q.all([
            self.loadProcessPermission(self.model.toJSON().ProcessName),
            self.loadRole(self.model.toJSON().ProcessName)
          ]);
        })

        .then(function(results) {
          var permissionCollection = results[0];
          var roleCollection = results[1];
          // console.log('render: ', permissionCollection.toJSON());
          self.renderPermissionSelect(permissionCollection);
          self.renderRolePicker(roleCollection);
          // if (self.model.toJSON().ProcessId) {
          //
          // } else {
          //
          // }
        })

        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: dialogTitle.error
          });
        });
    },

    loadRole: function(processName) {
      var deferred = Q.defer();
      var roleCollection = new Hktdc.Collections.UserRole();
      if (!processName) {
        deferred.resolve(roleCollection);
      } else {
        roleCollection.url = roleCollection.url(processName);
        var doFetch = function() {
          roleCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              deferred.resolve(roleCollection);
            },
            error: function(collection, response) {
              utils.apiErrorHandling(response, {
                // 401: doFetch,
                unknownMessage: dialogMessage.component.roleList.error
              });
            }
          });
        };
        doFetch();
      }

      return deferred.promise;
    },

    loadProcess: function(processId) {
      var deferred = Q.defer();
      var processCollection;
      if (this.model.toJSON().disableProcessSelect) {
        processCollection = new Hktdc.Collections.Process();
        deferred.resolve(processCollection);
      } else {
        processCollection = new Hktdc.Collections.Process();
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
      }
      return deferred.promise;
    },

    loadProcessPermission: function(processId) {
      var deferred = Q.defer();
      // console.log(processId);
      var processPermissionCollection = new Hktdc.Collections.ProcessPermission();
      if (!processId) {
        deferred.resolve(processPermissionCollection);
      } else {
        processPermissionCollection.url = processPermissionCollection.url(processId);
        var doFetch = function() {
          processPermissionCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function(res) {
              deferred.resolve(res);
            },
            error: function(collection, response) {
              utils.apiErrorHandling(response, {
                // 401: doFetch,
                unknownMessage: dialogMessage.component.permissionList.error
              });
            }
          });
        };
        doFetch();
      }

      return deferred.promise;
    },

    renderProcessSelect: function() {
      var self = this;
      var processSelectView;
      if (self.model.toJSON().disableProcessSelect) {
        processSelectView = {
          el: '<span class="form-data">' + self.model.toJSON().ProcessDisplayName + '</span>'
        };
      } else {
        processSelectView = new Hktdc.Views.ProcessSelect({
          collection: self.model.toJSON().processCollection,
          selectedProcess: self.model.toJSON().ProcessId,
          attributes: { field: 'ProcessId', name: 'ProcessId' },
          disable: self.model.toJSON().disableProcessSelect,
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
          }
        });
        processSelectView.render();
      }

      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderPermissionSelect: function(permissionCollection) {
      try {
        var self = this;
        var permissionSelectView = new Hktdc.Views.RolePermissionSelect({
          collection: permissionCollection,
          selectedRolePermission: self.model.toJSON().MenuItemGUID,
          attributes: { field: 'MenuItemGUID', name: 'MenuItemGUID' },
          onSelected: function(permission) {
            // console.log(self.model.toJSON().permissionCollection);
            // console.log(permission);
            self.model.set({ MenuItemGUID: permission.MenuItemGUID });

            self.model.set({
              MenuItemGUID: permission.MenuItemGUID
            }, {
              validate: true,
              field: 'MenuItemGUID',
              onInvalid: function(invalidObject) {
                utils.toggleInvalidMessage(self.el, 'MenuItemGUID', invalidObject.message, true);
              }
            });
            self.model.toJSON().permissionCollection.each(function(permissionModel) {
              permissionModel.set({
                MenuItemGUID: permission.MenuItemGUID
              });
            });
          }
        });
        permissionSelectView.render();
        $('.permissionContainer', self.el).html(permissionSelectView.el);
      } catch (e) {
        console.error('error caught when rendering permission select', e);
      }
    },

    renderRolePicker: function(roleCollection) {
      try {
        var self = this;
        // console.log(roleCollection.toJSON());
        // console.log(self.model.toJSON().permissionCollection.toJSON());
        var rolePickerView = new Hktdc.Views.RolePicker({
          field: 'permissionCollection',
          roles: _.map(roleCollection.toJSON(), function(role) {
            role.label = role.Role;
            return role;
          }),
          selectedRole: _.map(self.model.toJSON().permissionCollection.toJSON(), function(permission) {
            var found = _.find(roleCollection.toJSON(), function(role) {
              return role.UserRoleGUID === permission.UserRoleGUID;
            });
            found.RolePermissionGUID = permission.RolePermissionGUID;
            return found;
          }) || new Hktdc.Collections.SaveRolePermission(),
          onSelect: function(role) {
            // console.log(self.model.toJSON().permissionCollection.toJSON());
            // console.log(self.model.toJSON());
            // console.log(role);
            var existing = _.find(self.model.toJSON().permissionCollection.toJSON(), function(selectedRole) {
              return (selectedRole.UserRoleGUID === role.UserRoleGUID);
            });
            // console.log('existing: ', existing);
            if (!existing) {
              var newRolePermission = new Hktdc.Models.RolePermission({
                RolePermissionGUID: '',
                MenuItemGUID: self.model.toJSON().MenuItemGUID,
                UserRoleGUID: role.UserRoleGUID
              });
              // console.log(newRolePermission.toJSON());
              self.model.toJSON().permissionCollection.add(newRolePermission);
            }
            // self.model.toJSON().permissionCollection.set(new Hktdc.Models.RolePermission(role));
            // console.log(self.model.toJSON().permissionCollection.toJSON());
            self.model.set({
              permissionCollection: self.model.toJSON().permissionCollection
            }, {
              validate: true,
              field: 'permissionCollection',
              onInvalid: function(invalidObject) {
                utils.toggleInvalidMessage(self.el, 'permissionCollection', invalidObject.message, true);
              }
            });
          },
          onRemove: function(role) {
            // console.log(self.model.toJSON().permissionCollection.toJSON());
            // console.log(role);
            self.model.toJSON().permissionCollection.remove(role.UserRoleGUID);
            self.model.set({
              permissionCollection: self.model.toJSON().permissionCollection
            }, {
              validate: true,
              field: 'permissionCollection',
              onInvalid: function(invalidObject) {
                utils.toggleInvalidMessage(self.el, 'permissionCollection', invalidObject.message, true);
              }
            });
            // if (role.RolePermissionGUID) {
            //   self.model.toJSON().deletePermissionArray.push(role);
            // }
            // console.log(self.model.toJSON().deletePermissionArray);
            // console.log(self.model.toJSON().permissionCollection.toJSON());
          }
        });
        rolePickerView.render();
        $('.rolePicker', this.el).empty();
        $('.rolePicker', this.el).append(rolePickerView.el);
      } catch (e) {
        console.log(e);
      }
    },

    deletePromise: function(permissionGUIDArray) {
      var deferred = Q.defer();
      var delPermissionModel = new Hktdc.Models.DeleteRolePermission();
      delPermissionModel.url = delPermissionModel.url(permissionGUIDArray);
      var doSave = function() {
        delPermissionModel.save(null, {
          type: 'DELETE',
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve();
          },
          error: function(model, response) {
              utils.apiErrorHandling(response, {
                  // 401: doFetch,
                  unknownMessage: dialogMessage.rolePermission.delete.error
              });
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    savePromise: function(permissions) {
      var deferred = Q.defer();
      var self = this;
      var data = _.map(permissions, function(permission) {
        return _.pick(permission, 'RolePermissionGUID', 'MenuItemGUID', 'UserRoleGUID');
      });

      var savePermissionModel = new Hktdc.Models.SaveRolePermission({ data: data, OldMenuItemGUID: self.model.toJSON().OldMenuItemGUID });
      savePermissionModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: dialogTitle.error,
          message: err
        });
      });

      var doSave = function() {
        savePermissionModel.save(null, {
          type: self.model.toJSON().saveType,
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve();
          },
          error: function(model, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.rolePermission.save.error
            });
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    deleteButtonHandler: function() {
      var self = this;
      var deletePermission = [];
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: dialogTitle.confirmation,
        message: dialogMessage.rolePermission.delete.confirm,
        onConfirm: function() {
          self.model.toJSON().permissionCollection.each(function(permission) {
            // console.log(permission);
            if (permission.toJSON().RolePermissionGUID) {
              deletePermission.push(permission.toJSON());
            }
          });

          return self.deletePromise(_.pluck(deletePermission, 'RolePermissionGUID'))
            .then(function(results) {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'deleted',
                type: 'confirmation',
                title: dialogTitle.confirmation
              });

              Hktdc.Dispatcher.trigger('closeConfirm');
              // Backbone.history.navigate('permission', {trigger: true});
              window.history.back();
            })
            .fail(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'error on delete',
                type: 'error',
                title: dialogTitle.error
              });
            });
        }
      });
    },

    saveButtonHandler: function() {
      var self = this;
      /* var deleteRolePermission = function() {
        var deletePermission = [];
        _.each(self.model.toJSON().deletePermissionArray, function(permission) {
          if (permission.RolePermissionGUID) {
            deletePermission.push(permission);
          }
        });
        if (deletePermission.length) {
          return self.deletePromise(_.pluck(deletePermission, 'RolePermissionGUID'));
        } else {
          return true;
        }
      }; */

      this.validateField();
      if (this.model.isValid()) {
        Q.all([
          // deleteRolePermission(),
          self.savePromise(self.model.toJSON().permissionCollection.toJSON())
        ])
          .then(function(results) {
            Hktdc.Dispatcher.trigger('openAlert', {
              message: 'saved!',
              type: 'confirmation',
              title: dialogTitle.confirmation
            });

            // Backbone.history.navigate('permission', {trigger: true});
            window.history.back();
          })
          .fail(function(err) {
            console.log(err);
            Hktdc.Dispatcher.trigger('openAlert', {
              message: 'error on save',
              type: 'error',
              title: dialogTitle.error
            });
          });
      } else {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: dialogTitle.warning,
          message: dialogMessage.common.invalid.form
        });
      }
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
        MenuItemGUID: this.model.toJSON().MenuItemGUID
      }, {
        validate: true,
        field: 'MenuItemGUID',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'MenuItemGUID', invalidObject.message, true);
        }
      });

      this.model.set({
        permissionCollection: this.model.toJSON().permissionCollection
      }, {
        validate: true,
        field: 'permissionCollection',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'permissionCollection', invalidObject.message, true);
        }
      });
    }
  });
})();
