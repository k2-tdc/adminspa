/* global Hktdc, Backbone, JST, Q, utils, $, moment, _ */

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
      // this.listenTo(this.model, 'change', this.render);
      console.log(this.model.toJSON());
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      Q.all([
        self.loadProcess(),
        self.loadUsers()
      ])
        .then(function(results) {
          var processCollection = results[0];
          var userCollections = results[1];
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection
          }, {
            silent: true
          });
          self.renderProcessSelect();
          self.renderUserSelect(userCollections);
        })
        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: 'Runtime Error'
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
      var processCollection = new Hktdc.Collections.Process();
      processCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(collection, response) {
          deferred.reject(response);
        }
      });
      return deferred.promise;
    },

    loadUsers: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().fullUserCollection) {
        deferred.resolve(self.model.toJSON().fullUserCollection);
      } else {
        var fullUserCollection = new Hktdc.Collections.FullUser();
        fullUserCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(fullUserCollection);
          },
          error: function(err) {
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
        onSelected: function(process) {
          self.model.set({
            ProcessId: process.ProcessID
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
                modifiedOn: row.ModifiedOn,
                modifiedBy: row.ModifiedBy,
                summary: row.Summary,
                score: row.Score,
                startDate: row.StartDate,
                endDate: row.EndDate
              };
            });
            return modData;
            // return { data: modData, recordsTotal: modData.length };
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
      return Hktdc.Config.apiURL + '/worker-rule/' + this.model.toJSON().WorkerRuleId + '/rule/' + queryString;
    },

    saveButtonHandler: function() {
      var rawData = this.model.toJSON();
      var saveData = {
        ProcessId: rawData.ProcessId,
        Code: rawData.Code,
        Worker: rawData.Worker,
        WorkerType: rawData.WorkerType,
        Summary: rawData.Summary,
        Remark: rawData.Remark,
        Score: rawData.Score
      };
      if (this.model.toJSON().saveType === 'PUT') {
        saveData.WorkerRuleId = this.model.toJSON().WorkerRuleId;
      }
      var saveWorkerRuleModel = new Hktdc.Models.SaveWorkerRule();
      saveWorkerRuleModel.set(saveData);
      saveWorkerRuleModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          message: err,
          type: 'error',
          title: 'Error'
        });
      });

      if (saveWorkerRuleModel.isValid()) {
        saveWorkerRuleModel.url = saveWorkerRuleModel.url(this.model.toJSON().UserRoleGUID);
        saveWorkerRuleModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: this.model.toJSON().saveType,
          success: function(model, response) {
            if (String(response.Success) === '1') {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'saved',
                type: 'confirmation',
                title: 'Confirmation'
              });
              Backbone.history.navigate('worker-rule', {
                trigger: true
              });
            } else {
              Hktdc.Dispatcher.trigger('openAlert', {
                message: response.Msg || 'Error on saving.',
                type: 'error',
                title: 'Error'
              });
            }
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
    },

    deleteRuleButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: 'Are you sure to delete?',
        onConfirm: function() {
          // console.log(self.model.toJSON().selectedWorker);
          var delWorkerRuleModel = new Hktdc.Models.DeleteWorkerRule();
          delWorkerRuleModel.url = delWorkerRuleModel.url(self.model.toJSON().WorkerRuleId);
          delWorkerRuleModel.save(null, {
            type: 'DELETE',
            beforeSend: utils.setAuthHeader,
            success: function(model, response) {
              if (String(response.Success) === '1') {
                Hktdc.Dispatcher.trigger('closeConfirm');
                Hktdc.Dispatcher.trigger('openAlert', {
                  message: 'Deleted',
                  type: 'confirmation',
                  title: 'Confirmation'
                });

                Backbone.history.navigate('worker-rule', {trigger: true});
              } else {
                Hktdc.Dispatcher.trigger('openAlert', {
                  message: response.Msg || 'Error on delete',
                  type: 'error',
                  title: 'Error'
                });
              }
            },
            error: function(model, err) {
              // console.log(err);
              Hktdc.Dispatcher.trigger('openAlert', {
                message: err.responseText || 'Error on saving user role',
                type: 'error',
                title: 'Error'
              });
            }
          });
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
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      updateObject[targetField] = $target.val();
      this.model.set(updateObject);
    },

    removeMemberButtonHandler: function() {
      var self = this;
      var removeSingleMember = function(settingId) {
        var deferred = Q.defer();
        var delMemberModel = new Hktdc.Models.DeleteWorkerRuleMember();
        delMemberModel.url = delMemberModel.url(settingId);
        delMemberModel.save(null, {
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
      if (!(self.model.toJSON().selectedMember && self.model.toJSON().selectedMember.length)) {
        Hktdc.Dispatcher.trigger('openAlert', {
          message: 'Please select worker rule setting',
          type: 'error',
          title: 'warning'
        });
        return false;
      }
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: 'Are you sure to remove the members?',
        onConfirm: function() {
          Q.all(_.map(self.model.toJSON().selectedMember, function(settingId) {
            return removeSingleMember(settingId);
          }))
          .then(function() {
            Hktdc.Dispatcher.trigger('closeConfirm');
            Hktdc.Dispatcher.trigger('openAlert', {
              message: 'deleted',
              type: 'confirmation',
              title: 'confirmation'
            });
            self.doSearch();
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
