/* global Hktdc, Backbone, JST, Q, utils, $, moment, _, dialogMessage, sprintf, dialogTitle */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.WorkerRule = Backbone.View.extend({

    template: JST['app/scripts/templates/workerRule.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveButtonHandler',
      'click .deleteBtn': 'deleteRuleButtonHandler',
      'click .removeMemeberBtn': 'removeMemberButtonHandler',
      'click .searchBtn': 'doSearch',
      'click .addMemeberBtn': 'addMemberButtonHandler',
      'blur .formTextField': 'updateFormModel'
    },

    initialize: function() {
      var self = this;
      // this.listenTo(this.model, 'change', this.render);
      // console.log(this.model.toJSON());
      self.listenTo(self.model, 'valid', function(validObj) {
        // console.log('is valid', validObj);
        utils.toggleInvalidMessage(self.el, validObj.field, false);
      });
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      var loadResource = function() {
			Hktdc.Dispatcher.trigger('getMenu', {
				name: 'Process Worker',
				onSuccess: function(menu) {
				  self.model.set({
					menuId: menu.MenuId
				  });
				}});
        return (self.model.toJSON().saveType === 'POST')
          ? Q.all([
            self.loadUsers(),
            self.loadProcess()
          ])
          : Q.all([
            self.loadUsers()
          ]);
      };
      loadResource()
        .then(function(results) {
          var userCollections = results[0];
          var processCollection = results[1];
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          if (self.model.toJSON().saveType === 'POST') {
            self.model.set({
              processCollection: processCollection
            }, {
              silent: true
            });
            self.renderProcessSelect();
          }

          self.renderUserSelect(userCollections);
        })
        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            title: dialogTitle.error,
            message: sprintf(dialogMessage.common.error.script, {
              code: 'unknown',
              msg: dialogMessage.component.general.error
            })
          });
        });

      if (self.model.toJSON().showRules) {
        // self.load
        // self.renderUsers();
        // self.renderWorkers();
        self.renderDataTable();
      }
    },

    loadProcess: function() {
      var deferred = Q.defer();
      //var processCollection = new Hktdc.Collections.Process();
	  var processCollection = new Hktdc.Collections.WorkerRuleProcess();
      processCollection.url = processCollection.url(this.model.toJSON().menuId);
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

    loadUsers: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().fullUserCollection) {
        deferred.resolve(self.model.toJSON().fullUserCollection);
      } else {
        var fullUserCollection = new Hktdc.Collections.FullUser();
        var doFetch = function() {
          fullUserCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              deferred.resolve(fullUserCollection);
            },
            error: function(collection, response) {
              utils.apiErrorHandling(response, {
                // 401: doFetch,
                unknownMessage: dialogMessage.component.fullUserList.error
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
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().ProcessId,
        attributes: { field: 'ProcessId', name: 'ProcessId' },
        onSelected: function(process) {
          self.model.set({
            ProcessId: process.ProcessID
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

    renderUserSelect: function(userCollection) {
      var self = this;
      var workerSelectView = new Hktdc.Views.UserSelect({
        collection: userCollection,
        selectedUser: self.model.toJSON().worker,
        onSelected: function(user) {
          self.model.set({
            WorkerId: user.UserID
          });
        }
      });
      workerSelectView.render();
      var userSelectView = new Hktdc.Views.UserSelect({
        collection: userCollection,
        selectedUser: self.model.toJSON().user,
        onSelected: function(user) {
          self.model.set({
            UserId: user.UserID
          });
        }
      });
      userSelectView.render();
      $('.userSelectContainer', self.el).html(userSelectView.el);
      $('.workerSelectContainer', self.el).html(workerSelectView.el);
    },

    renderDataTable: function() {
      var self = this;
      self.workerRuleDataTable = $('#memberTable', self.el).DataTable({
        bRetrieve: true,
        searching: false,
        processing: true,
        paging: false,
        info: false,
        oLanguage: {
          sProcessing: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        ajax: {
          url: self.getAjaxURL(),
          beforeSend: utils.setAuthHeader,
          dataSrc: function(data) {
            var modData = _.map(data, function(row) {
              return {
                // lastActionDate: row.SubmittedOn,
                id: row.WorkerRuleSettingId,
                modifiedOn: (row.ModifiedOn) ? moment(row.ModifiedOn, 'YYYY-MM-DD').format('DD MMM YYYY') : '',
                modifiedBy: row.ModifiedBy,
                summary: row.Summary,
                score: row.Score,
                startDate: (row.StartDate) ? moment(row.StartDate, 'YYYY-MM-DD').format('DD MMM YYYY') : '',
                endDate: (row.EndDate) ? moment(row.EndDate, 'YYYY-MM-DD').format('DD MMM YYYY') : ''
              };
            });
            return modData;
            // return { data: modData, recordsTotal: modData.length };
          },
          error: function(response, status, err) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.workerRule.loadList.error
            });
          }
        },
        order: [
          [1, 'asc']
        ],
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
            data: 'id',
            render: function(data) {
              return '<input type="checkbox" class="selectUser"/>';
            },
            orderable: false
          },
          {
            data: 'modifiedOn'
          },
          {
            data: 'modifiedBy'
          },
          {
            data: 'summary'
          },
          {
            data: 'score'
          },
          {
            data: 'startDate'
          },
          {
            data: 'endDate'
          }
        ]
      });

      $('#memberTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.workerRuleDataTable.row(this).data();
        Backbone.history.navigate('worker-rule/' + self.model.toJSON().WorkerRuleId + '/member/' + rowData.id, {
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
          var rowData = self.workerRuleDataTable.row($(this)).data();

          var originalMember = self.model.toJSON().selectedMember;
          var newMember;

          if (isCheckAll) {
            newMember = _.union(originalMember, [rowData.id]);
          } else {
            newMember = _.reject(originalMember, function(memberGUID) {
              return rowData.id === memberGUID;
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
        var rowData = self.workerRuleDataTable.row($(this).parents('tr')).data();
        var originalMember = self.model.toJSON().selectedMember;
        var newMember;
        if ($(this).prop('checked')) {
          newMember = _.union(originalMember, [rowData.id]);
        } else {
          newMember = _.reject(originalMember, function(memberGUID) {
            return rowData.id === memberGUID;
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

    getAjaxURL: function() {
      var queryParams = _.pick(this.model.toJSON(), 'UserId', 'WorkerId');
      var queryString = utils.getQueryString(queryParams, true);
      if (queryString !== '') {
        queryString = '&' + queryString.substr(1);
        queryString = queryString.replace('UserId', 'user-id');
        queryString = queryString.replace('WorkerId', 'worker-id');
      }
      return Hktdc.Config.apiURL + '/worker-rule-settings?worker-rule-id=' + this.model.toJSON().WorkerRuleId + queryString;
    },

    saveButtonHandler: function() {
      var self = this;
      self.validateField();
      if (self.model.isValid()) {
        Hktdc.Dispatcher.trigger('openConfirm', {
          title: dialogTitle.confirmation,
          message: dialogMessage.workerRule.save.confirm,
          onConfirm: function() {
            self.doSaveWorkerRule()
            .then(function(response) {
              Hktdc.Dispatcher.trigger('openAlert', {
                title: dialogTitle.information,
                message: dialogMessage.workerRule.save.success
              });
              if (self.model.toJSON().saveType === 'POST' && response.Msg) {
                Backbone.history.navigate('worker-rule/' + response.Msg, {
                  trigger: true
                });
              }
            })
            .catch(function(err) {
              Hktdc.Dispatcher.trigger('openAlert', {
                title: dialogTitle.error,
                message: sprintf(dialogMessage.common.error.script, {
                  code: err.request_id || 'unknown',
                  msg: dialogMessage.workerRule.save.fail
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

    doSaveWorkerRule: function() {
      var deferred = Q.defer();
      var rawData = this.model.toJSON();
      var self = this;
      var saveData = {
        ProcessId: rawData.ProcessId,
        Code: rawData.Code,
        Worker: rawData.Worker,
        WorkerType: rawData.WorkerType,
        Summary: rawData.Summary,
        Remark: rawData.Remark,
        Score: rawData.Score
      };
      if (self.model.toJSON().saveType === 'PUT') {
        saveData.WorkerRuleId = self.model.toJSON().WorkerRuleId;
      }
      var saveWorkerRuleModel = new Hktdc.Models.SaveWorkerRule();
      saveWorkerRuleModel.set(saveData);
      saveWorkerRuleModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: dialogTitle.error,
          message: err
        });
      });
      saveWorkerRuleModel.url = saveWorkerRuleModel.url(self.model.toJSON().WorkerRuleId);
      var doSave = function() {
        saveWorkerRuleModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: self.model.toJSON().saveType,
          success: function(model, response) {
            if (String(response.Success) === '1') {
              deferred.resolve(response);
            } else {
              deferred.reject();
            }
          },
          error: function(model, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.workerRule.save.error
            });
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    deleteRuleButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: dialogTitle.confirmation,
        message: dialogMessage.workerRule.delete.confirm,
        onConfirm: function() {
          // console.log(self.model.toJSON().selectedWorker);
          var delWorkerRuleModel = new Hktdc.Models.DeleteWorkerRule();
          delWorkerRuleModel.url = delWorkerRuleModel.url(self.model.toJSON().WorkerRuleId);
          var doSave = function() {
            delWorkerRuleModel.save(null, {
              type: 'DELETE',
              beforeSend: utils.setAuthHeader,
              success: function(model, response) {
                if (String(response.Success) === '1') {
                  Hktdc.Dispatcher.trigger('closeConfirm');
                  Hktdc.Dispatcher.trigger('openAlert', {
                    title: dialogTitle.confirmation,
                    message: dialogMessage.workerRule.delete.success
                  });

                  Backbone.history.navigate('worker-rule', {trigger: true});
                } else {
                  Hktdc.Dispatcher.trigger('openAlert', {
                    title: dialogTitle.error,
                    message: sprintf(dialogMessage.workerRule.delete.fail, {
                      code: 'unknown',
                      msg: response.Msg || 'Error on delete'
                    })
                  });
                }
              },
              error: function(model, response) {
                Hktdc.Dispatcher.trigger('closeConfirm');
                utils.apiErrorHandling(response, {
                  // 401: doFetch,
                  unknownMessage: dialogMessage.workerRule.delete.error
                });
              }
            });
          };
          doSave();
        }
      });
    },

    doSearch: function() {
      var queryParams = _.pick(this.model.toJSON(), 'UserId', 'WorkerId');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.workerRuleDataTable.ajax.url(this.getAjaxURL()).load();
    },

    addMemberButtonHandler: function() {
      Backbone.history.navigate('worker-rule/' + this.model.toJSON().WorkerRuleId + '/member/new', {
        trigger: true
      });
    },

    updateFormModel: function(ev) {
      var self = this;
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      updateObject[targetField] = $target.val();
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

    removeMemberButtonHandler: function() {
      var self = this;
      var removeSingleMember = function(settingId) {
        var deferred = Q.defer();
        var delMemberModel = new Hktdc.Models.DeleteWorkerRuleMember();
        delMemberModel.url = delMemberModel.url(settingId);
        var doSave = function() {
          delMemberModel.save(null, {
            type: 'DELETE',
            beforeSend: utils.setAuthHeader,
            success: function() {
              deferred.resolve();
            },
            error: function(model, response) {
              utils.apiErrorHandling(response, {
                // 401: doFetch,
                unknownMessage: dialogMessage.workerRuleMember.delete.error
              });
            }
          });
        };
        doSave();
        return deferred.promise;
      };
      if (!(self.model.toJSON().selectedMember && self.model.toJSON().selectedMember.length)) {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: dialogTitle.warning,
          message: dialogMessage.workerRule.selectMember.alert
        });
        return false;
      }
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: dialogTitle.confirmation,
        message: dialogMessage.workerRuleMember.batchDelete.confirm,
        onConfirm: function() {
          Q.all(_.map(self.model.toJSON().selectedMember, function(settingId) {
            return removeSingleMember(settingId);
          }))
          .then(function() {
            Hktdc.Dispatcher.trigger('closeConfirm');
            Hktdc.Dispatcher.trigger('openAlert', {
              title: dialogTitle.confirmation,
              message: dialogMessage.workerRuleMember.batchDelete.success
            });
            self.doSearch();
          })
          .fail(function(err) {
            console.error(err);
            Hktdc.Dispatcher.trigger('closeConfirm');
            Hktdc.Dispatcher.trigger('openAlert', {
              title: 'error on deleting user role',
              message: sprintf(dialogMessage.common.error.script, {
                code: 'unknown',
                msg: dialogMessage.workerRuleMember.batchDelete.error
              })
            });
          });
        }
      });
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
        Code: this.model.toJSON().Code
      }, {
        validate: true,
        field: 'Code',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Code', invalidObject.message, true);
        }
      });

      this.model.set({
        Worker: this.model.toJSON().Worker
      }, {
        validate: true,
        field: 'Worker',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Worker', invalidObject.message, true);
        }
      });

      this.model.set({
        WorkerType: this.model.toJSON().WorkerType
      }, {
        validate: true,
        field: 'WorkerType',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'WorkerType', invalidObject.message, true);
        }
      });

      this.model.set({
        Score: this.model.toJSON().Score
      }, {
        validate: true,
        field: 'Score',
        onInvalid: function(invalidObject) {
          utils.toggleInvalidMessage(self.el, 'Score', invalidObject.message, true);
        }
      });
    }
  });
})();
