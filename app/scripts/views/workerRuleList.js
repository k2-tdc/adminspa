/* global Hktdc, Backbone, JST, _, $, utils, Q */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.WorkerRuleList = Backbone.View.extend({

    template: JST['app/scripts/templates/workerRuleList.ejs'],

    tagName: 'div',

    events: {
      'click .createBtn': 'goToCreatePage',
      'click .searchBtn': 'doSearch'
    },

    initialize: function() {
      $('#mainContent').removeClass('compress');
      // this.listenTo(this.model, 'change', this.render);
      // var self = this;
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      Hktdc.Dispatcher.trigger('getMenu', {
        name: 'Process Worker',
        onSuccess: function(menu) {
          self.model.set({
            menuId: menu.MenuId
          });
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
        }}
      );
    },

    loadProcess: function() {
      var deferred = Q.defer();
      var processCollection = new Hktdc.Collections.WorkerRuleProcess();
      processCollection.url = processCollection.url(this.model.toJSON().menuId);
      var doFetch = function() {
        processCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(processCollection);
          },
          error: function(collection, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on loading process');
            }
          }
        });
      };
      doFetch();
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
      self.workerRuleDataTable = $('#workerTable', self.el).DataTable({
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
          },
          error: function(xhr, status, err) {
            console.log(xhr);
            if (xhr.status === 401) {
              utils.getAccessToken(function() {
                self.workerRuleDataTable.ajax.url(self.getAjaxURL()).load();
              });
            } else {
              console.error(xhr.responseText);
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'Error on getting worker rule list.',
                type: 'error',
                title: 'Error'
              });
            }
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
          data: 'code'
        }, {
          data: 'worker'
        }, {
          data: 'summary'
        }, {
          data: 'score'
        }]
      });

      $('#workerTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.workerRuleDataTable.row(this).data();
        Backbone.history.navigate('worker-rule/' + rowData.id, {
          trigger: true
        });
      });

      $('#workerTable tbody', this.el).on('click', 'td:first-child', function(ev) {
        ev.stopPropagation();
      });
    },

    doSearch: function() {
      var queryParams = _.omit(this.model.toJSON(), 'showSearch', 'processCollection', 'mode', 'menuId');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.workerRuleDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var queryParams = _.omit(this.model.toJSON(), 'showSearch', 'processCollection', 'mode', 'menuId');
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
          var saveUserRoleModel = new Hktdc.Models.SaveWorkerRule();
          saveUserRoleModel.clear();
          saveUserRoleModel.url = saveUserRoleModel.url(this.model.toJSON().WorkerRuleId);
          var doSave = function() {
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
              error: function(model, response) {
                if (response.status === 401) {
                  utils.getAccessToken(function() {
                    doSave();
                  });
                } else {
                  console.error(response.responseText);
                  Hktdc.Dispatcher.trigger('openAlert', {
                    message: 'error on saving user role',
                    type: 'error',
                    title: 'Error'
                  });
                }
              }
            });
          };
          doSave();
        }
      });
    }

  });
})();
