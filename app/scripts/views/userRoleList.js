/* global Hktdc, Backbone, JST, $, utils, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserRoleList = Backbone.View.extend({

    template: JST['app/scripts/templates/userRoleList.ejs'],

    tagName: 'div',

    events: {
      'click .createBtn': 'goToCreatePage'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.renderDataTable();
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
      console.log('crash');
      Backbone.history.navigate('userrole/new', {trigger: true});
    },

    getAjaxURL: function() {
      var queryParams = _.omit(this.model.toJSON(), 'stepCollection', 'processCollection', 'mode');
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/user-role' + queryString;
    }

  });
})();
