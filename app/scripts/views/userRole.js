/* global Hktdc, Backbone, JST, utils, Q, $, _, moment, dialogMessage, dialogTitle, sprintf */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserRole = Backbone.View.extend({

    template: JST['app/scripts/templates/userRole.ejs'],

    tagName: 'div',

    events: {
      // 'change .formTextField': 'updateFormModel',
      'blur .formTextField': 'updateFormModel',
      'click .delBtn': 'deleteButtonHandler',
      'click .saveBtn': 'saveButtonHandler',
      'click .addMemeberBtn': 'addMemberButtonHandler',
      'click .removeMemeberBtn': 'removeMemberButtonHandler'
    },

    initialize: function() {
      // $('#mainContent').removeClass('compress');
      var self = this;
      self.model.on('change:selectedMember', function(model, value) {
        console.log(value);
      });

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
            title: dialogTitle.error,
            message: sprintf(dialogMessage.common.error.script, {
              code: 'unknown',
              msg: dialogMessage.component.processList.error
            })
          });
        });
    },

    renderDataTable: function() {
      var self = this;
      self.userRoleDataTable = $('#memberTable', self.el).DataTable({
        bRetrieve: true,
        searching: false,
        processing: true,
        paging: false,
        info: false,
        oLanguage: {
          sProcessing: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        data: self.model.toJSON().Member,
        order: [[1, 'asc']],
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
            },
            orderable: false
          },
          { data: 'Type' },
          { data: 'Name' },
          {
            data: 'ExpiryDate',
            render: function(data) {
              return (moment(data).isValid()) ? moment(data).format('DD MMM YYYY') : '';
            }
          }
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

      /* checkbox event */
      $('#memberTable thead', this.el).on('change', '.checkAll', function(ev) {
        var $checkAllCheckbox = $(this);
        var isCheckAll = $checkAllCheckbox.prop('checked');
        $('#memberTable tbody tr', self.el).each(function() {
          var $checkbox = $(this).find('td:first-child').find('.selectUser');
          $checkbox.prop('checked', isCheckAll);
          var rowData = self.userRoleDataTable.row($(this)).data();

          var originalMember = self.model.toJSON().selectedMember;
          var newMember;

          if (isCheckAll) {
            newMember = _.union(originalMember, [rowData.UserRoleMemberGUID]);
          } else {
            newMember = _.reject(originalMember, function(memberGUID) {
              return rowData.UserRoleMemberGUID === memberGUID;
            });
          }
          self.model.set({
            selectedMember: newMember
          });
          // $checkbox.trigger('change');
        });
      });

      $('#memberTable tbody', this.el).on('change', '.selectUser', function(ev) {
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
        var allChecked = (
          $('#memberTable tbody tr', self.el).length ===
          $('#memberTable tbody .selectUser:checked', self.el).length
        );

        $('#memberTable thead .checkAll', self.el).prop('checked', allChecked);
        self.model.set({
          selectedMember: newMember
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

    renderProcessSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        attributes: { field: 'ProcessId', name: 'ProcessId' },
        selectedProcess: self.model.toJSON().ProcessId,
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
      $('.processContainer', self.el).html(processSelectView.el);
    },

    updateFormModel: function(ev) {
      var self = this;
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      console.log(targetField);
      if ($target.is('select')) {
        updateObject[targetField] = $target.val();
      } else {
        updateObject[targetField] = $target.val();
      }
      console.log(updateObject);
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

    saveButtonHandler: function() {
      var self = this;
      self.validateField();
      if (self.model.isValid()) {
        Hktdc.Dispatcher.trigger('openConfirm', {
          title: dialogTitle.confirmation,
          message: dialogMessage.userRole.save.confirm,
          onConfirm: function() {
            self.doSaveUserRole()
              .then(function(response) {
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.information,
                  message: dialogMessage.userRole.save.success
                });
                Backbone.history.navigate('userrole/' + response.Msg, {trigger: true});
                // Backbone.history.navigate('userrole', {trigger: true});
                // window.history.back();
              })
              .catch(function(err) {
                console.error(err);
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.confirmation,
                  message: sprintf(dialogMessage.common.error.script, {
                    code: 'unknown',
                    msg: dialogMessage.userRole.save.error
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

    doSaveUserRole: function() {
      var deferred = Q.defer();
      var rawData = this.model.toJSON();
      var self = this;
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

      saveUserRoleModel.url = saveUserRoleModel.url(self.model.toJSON().UserRoleGUID);
      var doSave = function() {
        saveUserRoleModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: self.model.toJSON().saveType,
          success: function(model, response) {
            if (response.Msg) {
              deferred.resolve(response);
            } else {
              deferred.reject('save failed');
            }
          },
          error: function(model, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.userRole.save.error
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
        Role: this.model.toJSON().Role
      }, {
        validate: true,
        field: 'Role',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Role', invalidObject.message, true);
        }
      });
      this.model.set({
        Desc: this.model.toJSON().Desc
      }, {
        validate: true,
        field: 'Desc',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Desc', invalidObject.message, true);
        }
      });
      this.model.set({
        ProcessId: this.model.toJSON().ProcessId
      }, {
        validate: true,
        field: 'ProcessId',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'ProcessId', invalidObject.message, true);
        }
      });
    },

    deleteButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: dialogTitle.confirmation,
        message: dialogMessage.userRole.delete.confirm,
        onConfirm: function() {
          var saveUserRoleModel = new Hktdc.Models.SaveUserRole();
          saveUserRoleModel.clear();
          saveUserRoleModel.url = saveUserRoleModel.url(self.model.toJSON().UserRoleGUID);
          var doSave = function() {
            saveUserRoleModel.save(null, {
              beforeSend: utils.setAuthHeader,
              type: 'DELETE',
              success: function(response) {
                Hktdc.Dispatcher.trigger('closeConfirm');
                Hktdc.Dispatcher.trigger('openAlert', {
                  title: dialogTitle.confirmation,
                  message: dialogMessage.userRole.delete.success
                });

                Backbone.history.navigate('userrole', {trigger: true});
              },
              error: function(model, response) {
                Hktdc.Dispatcher.trigger('closeConfirm');
                utils.apiErrorHandling(response, {
                  // 401: doFetch,
                  unknownMessage: dialogMessage.userRole.delete.error
                });
              }
            });
          };
          doSave();
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
        var doSave = function() {
          saveUserRoleMemberModel.save(null, {
            type: 'DELETE',
            beforeSend: utils.setAuthHeader,
            success: function() {
              deferred.resolve();
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
        return deferred.promise;
      };
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: dialogTitle.confirmation,
        message: dialogMessage.userRoleMember.batchDelete.confirm,
        onConfirm: function() {
          Q.all(_.map(self.model.toJSON().selectedMember, function(memberGUID) {
            return removeSingleMember(memberGUID);
          }))
            .then(function() {
              Hktdc.Dispatcher.trigger('closeConfirm');
              Hktdc.Dispatcher.trigger('openAlert', {
                title: dialogTitle.confirmation,
                message: dialogMessage.userRoleMember.delete.success
              });
              Backbone.history.navigate('userrole/' + self.model.toJSON().UserRoleGUID, true);
              Backbone.history.loadUrl('userrole/' + self.model.toJSON().UserRoleGUID, {
                trigger: true
              });
            })
            .fail(function(err) {
              console.error(err);
              Hktdc.Dispatcher.trigger('openAlert', {
                title: dialogTitle.error,
                message: sprintf(dialogMessage.common.error.script, {
                  code: 'unknown',
                  msg: dialogMessage.userRoleMember.delete.error
                })
              });
            });
        }
      });
    }

  });
})();
