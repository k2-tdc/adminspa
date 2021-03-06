/* global Hktdc, Backbone, JST, _, $, utils, Q, dialogTitle, dialogMessage, sprintf */

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
                title: dialogTitle.error,
                message: sprintf(dialogMessage.common.error.script, {
                  code: 'unknown',
                  msg: dialogMessage.component.processList.error
                })
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
          error: function(response, status, err) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.workerRuleMember.loadList.error
            });
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
      return Hktdc.Config.apiURL + '/worker-rules' + queryString;
    },

    goToCreatePage: function() {
      Backbone.history.navigate('worker-rule/new', {trigger: true});
    }
  });
})();
