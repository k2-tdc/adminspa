/* global Hktdc, Backbone, JST, _, $, utils, Q */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.WorkerRuleList = Backbone.View.extend({

    template: JST['app/scripts/templates/workerRuleList.ejs'],

    tagName: 'div',

    events: {
      'click .createBtn': 'goToCreatePage',
      'click .batchDeleteBtn': 'deleteButtonHandler',
      'click .searchBtn': 'doSearch'
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
          self.renderWokerRuleProcessSelect();
          self.renderDataTable();
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

    renderWokerRuleProcessSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.WorkerRuleProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedWorkerRuleProcess: self.model.toJSON().process,
        onSelected: function(process) {
          console.log(process);
          self.model.set({
            process: process.ProcessName
          });
        }
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderDataTable: function() {
      var self = this;
      self.templateDataTable = $('#workerTable', self.el).DataTable({
        bRetrieve: true,
        order: [1, 'asc'],
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
                id: row.WorkerRuleId,
                code: row.Code,
                worker: row.Worker,
                score: row.Score,
                summary: row.Summary,
                process: row.ProcessName
              };
            });
            return modData;
            // return { data: modData, recordsTotal: modData.length };
          }
        },
        createdRow: function(row, data, index) {
          $(row).css({
            cursor: 'pointer'
          });
          $(row).hover(function() {
            $(this).addClass('highlight');
          }, function() {
            $(this).removeClass('highlight');
          });
          // if (!data.enabled) {
          //   $(row).addClass('disabled');
          // }
        },
        columns: [{
          data: 'id',
          render: function(data) {
            return '<input type="checkbox" class="selectWorker"/>';
          },
          orderable: false
        }, {
          data: 'code'
        }, {
          data: 'worker'
        }, {
          data: 'summary'
        }, {
          data: 'score'
        }]
      });

      $('#workerTable tbody', this.el).on('click', '.deleteBtn', function(ev) {
        ev.stopPropagation();
        var rowData = self.templateDataTable.row($(this).parents('tr')).data();
        var targetId = rowData.id;
        Hktdc.Dispatcher.trigger('openConfirm', {
          title: 'confirmation',
          message: 'Are you sure to Delete?',
          onConfirm: function() {
            self.deleteTemplate(targetId)
              .then(function(response) {
                Hktdc.Dispatcher.trigger('closeConfirm');
                if (String(response.success) === '1') {
                  Hktdc.Dispatcher.trigger('openAlert', {
                    type: 'success',
                    title: 'confirmation',
                    message: 'Deleted record: ' + rowData.process + ' - ' + rowData.step
                  });

                  self.templateDataTable.ajax.reload();
                  // Hktdc.Dispatcher.trigger('reloadMenu');
                } else {
                  Hktdc.Dispatcher.trigger('openAlert', {
                    type: 'error',
                    title: 'error',
                    message: response.Msg
                  });
                }
              })
              .catch(function(err) {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'error',
                  title: 'error',
                  message: 'delete failed'
                });
                console.error(err);
              });
          }
        });

        // console.log('rowData', rowData);
      });

      $('#workerTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.templateDataTable.row(this).data();
        Backbone.history.navigate('emailtemplate/' + rowData.id, {
          trigger: true
        });
      });

      $('#workerTable thead', this.el).on('change', '.checkAll', function(ev) {
        var $checkAllCheckbox = $(this);
        var isCheckAll = $checkAllCheckbox.prop('checked');
        $('#workerTable tbody tr', self.el).each(function() {
          var $checkbox = $(this).find('td:first-child').find('.selectWorker');
          $checkbox.prop('checked', isCheckAll);
          var rowData = self.templateDataTable.row($(this)).data();

          var originalMember = self.model.toJSON().selectedWorker;
          var newMember;

          if (isCheckAll) {
            newMember = _.union(originalMember, [rowData.id]);
          } else {
            newMember = _.reject(originalMember, function(memberGUID) {
              return rowData.id === memberGUID;
            });
          }
          self.model.set({
            selectedWorker: newMember
          });
          // $checkbox.trigger('change');
        });
      });

      $('#workerTable tbody', this.el).on('click', 'td:first-child', function(ev) {
        ev.stopPropagation();
      });

      $('#workerTable tbody', this.el).on('change', '.selectWorker', function(ev) {
        ev.stopPropagation();
        var rowData = self.templateDataTable.row($(this).parents('tr')).data();
        var originalMember = self.model.toJSON().selectedWorker;
        var newMember;
        // console.log(originalMember);
        if ($(this).prop('checked')) {
          newMember = _.union(originalMember, [rowData.id]);
        } else {
          newMember = _.reject(originalMember, function(memberGUID) {
            return rowData.id === memberGUID;
          });
        }
        var allChecked = (
          $('#workerTable tbody tr', self.el).length ===
          $('#workerTable tbody .selectWorker:checked', self.el).length
        );

        $('#workerTable thead .checkAll', self.el).prop('checked', allChecked);
        self.model.set({
          selectedWorker: newMember
        });
      });
    },

    doSearch: function() {
      var queryParams = _.omit(this.model.toJSON(), 'showSearch', 'processCollection', 'mode');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.templateDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var queryParams = _.omit(this.model.toJSON(), 'showSearch', 'processCollection', 'mode');
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/worker-rule' + queryString;
    },

    goToCreatePage: function() {
      Backbone.history.navigate('worker-rule/new', {trigger: true});
    },

    deleteButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: 'Are you sure to delete?',
        onConfirm: function() {
          // console.log(self.model.toJSON().selectedWorker);
          var saveUserRoleModel = new Hktdc.Models.SaveWorker();
          saveUserRoleModel.clear();
          saveUserRoleModel.url = saveUserRoleModel.url(this.model.toJSON().UserRoleGUID);
          saveUserRoleModel.save(null, {
            beforeSend: utils.setAuthHeader,
            type: 'POST',
            success: function(response) {
              Hktdc.Dispatcher.trigger('closeConfirm');
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
    }

  });
})();
