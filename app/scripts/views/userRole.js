/* global Hktdc, Backbone, JST, utils, Q, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserRole = Backbone.View.extend({

    template: JST['app/scripts/templates/userRole.ejs'],

    tagName: 'div',

    events: {
      'change .formTextField': 'updateFormModel',
      'click .delBtn': 'deleteButtonHandler',
      'click .saveBtn': 'saveButtonHandler',
      'click .addMemeberBtn': 'addMemberButtonHandler',
      'click .removeMemeberBtn': 'removeMemberButtonHandler'
    },

    initialize: function() {
      console.log(this.model.toJSON().showMember);
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      self.renderDataTable();

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

    renderDataTable: function() {
      var self = this;
      self.userRoleDataTable = $('#memberTable', self.el).DataTable({
        bRetrieve: true,
        order: [0, 'desc'],
        searching: false,
        processing: true,
        oLanguage: {
          sProcessing: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        data: self.model.toJSON().Member,
        createdRow: function(row, data, index) {
          $(row).css({
            cursor: 'pointer'
          });
          $(row).hover(function() {
            $(this).addClass('highlight');
          }, function() {
            $(this).removeClass('highlight');
          });
        },
        columns: [
          {
            data: 'UserRoleMemberGUID',
            render: function(data) {
              return '<input type="checkbox" class="selectUser"/>';
            }
          },
          { data: 'Type' },
          { data: 'Name' },
          { data: 'ExpiryDate' }
        ]
      });

      $('#memberTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.userRoleDataTable.row(this).data();
        Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID + '/member/' + rowData.UserRoleMemberGUID, {
          trigger: true
        });
      });

      $('#memberTable tbody', this.el).on('click', 'td:first-child', function(ev) {
        ev.stopPropagation();
      });

      $('#memberTable tbody', this.el).on('click', '.selectUser', function(ev) {
        ev.stopPropagation();
        var rowData = self.userRoleDataTable.row($(this).parents('tr')).data();
        var originalMember = self.model.toJSON().selectedMember;
        var newMember;
        if ($(this).prop('checked')) {
          newMember = _.union(originalMember, [rowData.UserRoleMemberGUID]);
        } else {
          newMember = _.reject(originalMember, function(memberGUID) {
            return rowData.UserRoleMemberGUID === memberGUID;
          });
        }
        self.model.set({
          selectedMember: newMember
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
        }
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
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
    },

    saveButtonHandler: function() {
      var rawData = this.model.toJSON();
      var saveData = {
        Role: rawData.Role,
        Desc: rawData.Desc,
        ProcessId: rawData.ProcessId,
        UserRoleGUID: rawData.UserRoleGUID
      };
      var saveUserRoleModel = new Hktdc.Models.SaveUserRole(saveData);

      if (!rawData.UserRoleGUID) {
        saveUserRoleModel.unset('UserRoleGUID');
      }

      saveUserRoleModel.url = saveUserRoleModel.url(this.model.toJSON().UserRoleGUID);
      saveUserRoleModel.save({}, {
        beforeSend: utils.setAuthHeader,
        type: this.model.toJSON().saveType,
        success: function() {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'saved',
            type: 'confirmation',
            title: 'Confirmation'
          });
          Backbone.history.navigate('userrole', {trigger: true});
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

    deleteButtonHandler: function() {
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: 'Are you sure to delete?',
        onConfirm: function() {
          var saveUserRoleModel = new Hktdc.Models.SaveUserRole();
          saveUserRoleModel.clear();
          saveUserRoleModel.url = saveUserRoleModel.url(this.model.toJSON().UserRoleGUID);
          saveUserRoleModel.save(null, {
            beforeSend: utils.setAuthHeader,
            type: 'DELETE',
            success: function(response) {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'deleted',
                type: 'confirmation',
                title: 'Confirmation'
              });

              Backbone.history.navigate('userrole', {trigger: true});
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
    },

    addMemberButtonHandler: function() {
      Backbone.history.navigate('userrole/' + this.model.toJSON().UserRoleGUID + '/member/new', {
        trigger: true
      });
    },

    removeMemberButtonHandler: function() {
      var self = this;
      var removeSingleMember = function(guid) {
        var deferred = Q.defer();
        var saveUserRoleMemberModel = new Hktdc.Models.SaveUserRoleMember();
        saveUserRoleMemberModel.clear();
        saveUserRoleMemberModel.url = saveUserRoleMemberModel.url(guid);
        saveUserRoleMemberModel.save(null, {
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
      };
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: 'Are you sure to remove this member?',
        onConfirm: function() {
          Q.all(_.map(self.model.toJSON().selectedMember, function(memberGUID) {
            return removeSingleMember(memberGUID);
          }))
            .then(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'deleted',
                type: 'confirmation',
                title: 'confirmation'
              });
              Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID, true);
              Backbone.history.loadUrl('userrole/' + self.model.toJSON().UserRoleGUID, {
                trigger: true
              });
            })
            .fail(function(err) {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: err,
                type: 'error',
                title: 'error on deleting user role'
              });
            });
        }
      });
    }

  });
})();
