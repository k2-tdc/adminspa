/* global Hktdc, Backbone, JST, Q, utils, $, moment, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.WorkerRule = Backbone.View.extend({

    template: JST['app/scripts/templates/workerRule.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveButtonHandler',
      'blur .formTextField': 'updateFormModel'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
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
        self.renderUsers();
        self.renderWorkers();
      }
    },

    loadProcess: function() {
      var deferred = Q.defer();
      var processCollection = new Hktdc.Collections.WorkerRuleProcess();
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
      var saveWorkerRuleModel = new Hktdc.Models.SaveWorkerRule();
      saveWorkerRuleModel.set(saveData);
      saveWorkerRuleModel.on('invalid', function(model, err) {
        console.log('invalid');
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
          success: function() {
            Hktdc.Dispatcher.trigger('openAlert', {
              message: 'saved',
              type: 'confirmation',
              title: 'Confirmation'
            });
            Backbone.history.navigate('worker-rule', {
              trigger: true
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
    },

    renderDataTable: function() {
      var self = this;
      self.userRoleDataTable = $('#memberTable', self.el).DataTable({
        bRetrieve: true,
        searching: false,
        processing: true,
        oLanguage: {
          sProcessing: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        data: self.model.toJSON().Member,
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
            data: 'UserRoleMemberGUID',
            render: function(data) {
              return '<input type="checkbox" class="selectUser"/>';
            },
            orderable: false
          },
          {
            data: 'Type'
          },
          {
            data: 'Name'
          },
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

    updateFormModel: function(ev) {
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      updateObject[targetField] = $target.val();
      this.model.set(updateObject);
    },
  });
})();
