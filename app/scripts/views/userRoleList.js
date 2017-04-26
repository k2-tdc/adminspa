/* global Hktdc, Backbone, JST, $, utils, _, Q */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserRoleList = Backbone.View.extend({

    template: JST['app/scripts/templates/userRoleList.ejs'],

    tagName: 'div',

    events: {
      'click .searchBtn': 'doSearch',
      'click .createBtn': 'goToCreatePage'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
      $('#mainContent').removeClass('compress');
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));
      self.loadProcess()
        .then(function(processCollection) {
          var selectedProcess = _.find(processCollection.toJSON(), function(process) {
            return String(process.ProcessID) === String(self.model.toJSON().processId);
          });
          // console.log(selectedProcess);
          if (selectedProcess) {
            self.model.set({
              process: selectedProcess.ProcessName
            });
          }
          self.renderDataTable();
          self.renderProcessSelect(processCollection);
        })
        .catch(function(err) {
          console.log(err);
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

    renderProcessSelect: function(processCollection) {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: processCollection,
        selectedProcess: self.model.toJSON().processId,
        onSelected: function(process) {
          self.model.set({
            process: process.ProcessName,
            processId: process.ProcessID
          });
        }
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderDataTable: function() {
      var self = this;
      self.userRoleDataTable = $('#userRoleTable', self.el).DataTable({
        bRetrieve: true,
        order: [0, 'desc'],
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
                id: row.UserRoleGUID,
                role: row.Role,
                description: row.Desc
              };
            });
            return modData;
            // return { data: modData, recordsTotal: modData.length };
          },
          error: function(xhr, status, err) {
            console.log(xhr);
            if (xhr.status === 401) {
              utils.getAccessToken(function() {
                self.userRoleDataTable.ajax.url(self.getAjaxURL()).load();
              });
            } else {
              console.error(xhr.responseText);
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'Error on getting user role list.',
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
        },
        columns: [{
          data: 'role'
        }, {
          data: 'description'
        }]
      });

      $('#userRoleTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.userRoleDataTable.row(this).data();
        Backbone.history.navigate('userrole/' + rowData.id, {
          trigger: true
        });
      });
    },

    goToCreatePage: function() {
      Backbone.history.navigate('userrole/new', {trigger: true});
    },

    getAjaxURL: function() {
      var queryParams = _.pick(this.model.toJSON(), 'process');
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/user-roles' + queryString;
    },

    doSearch: function() {
      // console.log(this.model.toJSON());
      var queryParams = _.pick(this.model.toJSON(), 'processId');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.userRoleDataTable.ajax.url(this.getAjaxURL()).load();
    }
  });
})();
