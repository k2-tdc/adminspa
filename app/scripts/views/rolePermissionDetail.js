/* global Hktdc, Backbone, utils, JST, Q, $, _ */

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
      this.model.on('change:ProcessId', function(model, processId) {
        return Q.all([
          self.loadProcessPermission(processId),
          self.loadRole(processId)
        ])
          .then(function(results) {
            var permissionCollection = results[0];
            var roleCollection = results[1];

            self.renderPermissionSelect(permissionCollection);
            self.renderRolePicker(roleCollection);
          });
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
          console.log(self.model.toJSON().ProcessId);
          return Q.all([
            self.loadProcessPermission(self.model.toJSON().ProcessId),
            self.loadRole(self.model.toJSON().ProcessId)
          ]);
        })

        .then(function(results) {
          var permissionCollection = results[0];
          var roleCollection = results[1];
          console.log('render: ', permissionCollection.toJSON());
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
            title: 'Runtime Error'
          });
        });
    },

    loadRole: function(processId) {
      var deferred = Q.defer();
      var roleCollection = new Hktdc.Collections.UserRole();
      if (!processId) {
        deferred.resolve(roleCollection);
      } else {
        roleCollection.url = roleCollection.url(processId);
        roleCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(roleCollection);
          },
          error: function(collection, err) {
            deferred.reject(err);
          }
        });
      }

      return deferred.promise;
    },

    loadProcess: function(processId) {
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

    loadProcessPermission: function(processId) {
      var deferred = Q.defer();
      // console.log(processId);
      var processPermissionCollection = new Hktdc.Collections.ProcessPermission();
      if (!processId) {
        deferred.resolve(processPermissionCollection);
      } else {
        processPermissionCollection.url = processPermissionCollection.url(processId);
        processPermissionCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function(res) {
            console.log('res: ', res);
            deferred.resolve(res);
          },
          error: function(collection, err) {
            deferred.reject(err);
          }
        });
      }

      return deferred.promise;
    },

    renderProcessSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().ProcessId,
        disable: self.model.toJSON().disableProcessSelect,
        onSelected: function(process) {
          self.model.set({
            ProcessId: process.ProcessID,
            ProcessName: process.ProcessName
          });
        }
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderPermissionSelect: function(permissionCollection) {
      try {
        var self = this;
        console.log(permissionCollection);
        var permissionSelectView = new Hktdc.Views.RolePermissionSelect({
          collection: permissionCollection,
          selectedRolePermission: self.model.toJSON().MenuItemGUID,
          onSelected: function(permission) {
            // console.log(self.model.toJSON().permissionCollection);
            // console.log(permission);
            self.model.set({ MenuItemGUID: permission.MenuItemGUID });
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
          },
          onRemove: function(role) {
            // console.log(self.model.toJSON().permissionCollection.toJSON());
            // console.log(role);
            self.model.toJSON().permissionCollection.remove(role.UserRoleGUID);
            if (role.RolePermissionGUID) {
              self.model.toJSON().deletePermissionArray.push(role);
            }
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
      delPermissionModel.save(null, {
        type: 'DELETE',
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve();
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    savePromise: function(permissions) {
      var deferred = Q.defer();
      var self = this;
      var data = _.map(permissions, function(permission) {
        return _.pick(permission, 'RolePermissionGUID', 'MenuItemGUID', 'UserRoleGUID');
      });

      var savePermissionModel = new Hktdc.Models.SaveRolePermission({ data: data });
      savePermissionModel.save(null, {
        type: self.model.toJSON().saveType,
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve();
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    deleteButtonHandler: function() {
      var self = this;
      var deletePermission = [];
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: 'Are you sure to Delete?',
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
                title: 'Confirmation'
              });

              Hktdc.Dispatcher.trigger('closeConfirm');
              Backbone.history.navigate('permission', {trigger: true});
            })
            .fail(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'error on delete',
                type: 'error',
                title: 'Error'
              });
            });
        }
      });
    },

    saveButtonHandler: function() {
      // console.log('delete: ', this.model.toJSON().deletePermissionArray);
      // console.log('perm col', this.model.toJSON().permissionCollection.toJSON());
      var self = this;
      var deleteRolePermission = function() {
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
      };

      var saveRolePermission = function() {
        if (self.model.toJSON().permissionCollection.length) {
          return self.savePromise(self.model.toJSON().permissionCollection.toJSON());
        } else {
          return true;
        }
      };

      Q.all([
        deleteRolePermission(),
        saveRolePermission()
      ])
        .then(function(results) {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'saved!',
            type: 'confirmation',
            title: 'Confirmation'
          });

          Backbone.history.navigate('permission', {trigger: true});
        })
        .fail(function(err) {
          console.log(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'error on save',
            type: 'error',
            title: 'Error'
          });
        });
    }

    // genSaveData: function() {
    //
    // }
  });
})();
