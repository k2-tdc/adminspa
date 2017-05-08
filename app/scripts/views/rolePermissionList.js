/* global Hktdc, Backbone, JST, $, _, utils */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.RolePermissionDetailList = Backbone.View.extend({

    template: JST['app/scripts/templates/rolePermissionList.ejs'],

    tagName: 'div',

    events: {
      'click .createBtn': 'goToCreatePage',
      'click .searchBtn': 'doSearch'
    },

    initialize: function() {
      $('#mainContent').removeClass('compress');
      // this.listenTo(this.model, 'change', this.render);
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
      self.rolePermissionDataTable = $('#rolePermissionTable', self.el).DataTable({
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
                id: row.RolePermissionGUID.join(','),
                process: row.Process,
                permission: row.Permission,
                role: row.Role
              };
            });
            return modData;
            // return { data: modData, recordsTotal: modData.length };
          },
          error: function(xhr, status, err) {
            console.log(xhr);
            if (xhr.status === 401) {
              utils.getAccessToken(function() {
                self.rolePermissionDataTable.ajax.url(self.getAjaxURL()).load();
              });
            } else {
              console.error(xhr.responseText);
              Hktdc.Dispatcher.trigger('openAlert', {
                message: 'Error on getting role permission list.',
                type: 'error',
                title: dialogTitle.error
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
          data: 'process'
        }, {
          data: 'permission'
        }, {
          data: 'role'
        }]
      });

      $('#rolePermissionTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.rolePermissionDataTable.row(this).data();
        console.log(rowData.id);
        Backbone.history.navigate('permission/' + rowData.id, {
          trigger: true
        });
      });
    },

    goToCreatePage: function() {
      Backbone.history.navigate('permission/new', {trigger: true});
    },

    getAjaxURL: function() {
      // var queryParams = _.omit(this.model.toJSON(), 'stepCollection', 'processCollection', 'mode');
      // var queryString = utils.getQueryString(queryParams, true);
      // return Hktdc.Config.apiURL + '/role-permission' + queryString;
        var queryParams = _.pick(this.model.toJSON(), 'process');
        var queryString = utils.getQueryString(queryParams, true);
        return Hktdc.Config.apiURL + '/role-permissions' + queryString;
    },

      doSearch: function() {
          // console.log(this.model.toJSON());
          var queryParams = _.pick(this.model.toJSON(), 'processId');
          var currentBase = Backbone.history.getHash().split('?')[0];
          var queryString = utils.getQueryString(queryParams, true);
          Backbone.history.navigate(currentBase + queryString);
          this.rolePermissionDataTable.ajax.url(this.getAjaxURL()).load();
      }
  });
})();
