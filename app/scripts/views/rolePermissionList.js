/* global Hktdc, Backbone, JST, $, _, utils */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.RolePermissionDetailList = Backbone.View.extend({

    template: JST['app/scripts/templates/rolePermissionList.ejs'],

    tagName: 'div',

    events: {
      'click .createBtn': 'goToCreatePage'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.renderDataTable();
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
      return Hktdc.Config.apiURL + '/role-permission';
    }

  });
})();
