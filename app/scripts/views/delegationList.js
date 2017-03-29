/* global Hktdc, Backbone, JST, $, Q, utils, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.DelegationList = Backbone.View.extend({

    template: JST['app/scripts/templates/delegationList.ejs'],

    tagName: 'div',

    events: {
      'click .searchBtn': 'doSearch',
      'click .createBtn': 'goToCreatePage'
    },

    initialize: function() {
      console.debug('[ views/emailProfileList.js ] - Initialize');
      $('#mainContent').removeClass('compress');
    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));

      Q.fcall(function() {
        if (self.model.toJSON().showSearch) {
          console.debug('[ emailProfile.js ] - load all the remote resources');
          return self.loadUser();
        }
        // put empty into profile users
        return [];
      })
        .then(function(userCollection) {
          self.model.set({
            userCollection: userCollection
          }, {
            silent: true
          });
          self.renderUserSelect();
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

    loadUser: function() {
      var deferred = Q.defer();
      var userCollection = new Hktdc.Collections.FullUser();
      userCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(userCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    renderUserSelect: function() {
      var self = this;
      if (!self.model.toJSON().showSearch) {
        return;
      }
      var userView = new Hktdc.Views.UserSelect({
        collection: self.model.toJSON().userCollection,
        selectedUser: self.model.toJSON().UserId,
        onSelected: function(user) {
          self.model.set({
            UserId: user.UserID
          });
        }
      });

      userView.render();
      $('.userContainer', self.el).html(userView.el);
    },

    renderDataTable: function() {
      var self = this;
      self.delegationDataTable = $('#delegationTable', self.el).DataTable({
        bRetrieve: true,
        order: [1, 'desc'],
        searching: false,
        profileUsering: true,
        oLanguage: {
          sProfileUsering: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        ajax: {
          url: self.getAjaxURL(),
          beforeSend: utils.setAuthHeader,
          dataSrc: function(data) {
            var modData = _.map(data, function(item) {
              return {
                id: item.DelegationID,
                user: item.User,
                workflowTask: item.Workflow + ' / ' + item.Task,
                department: item.Department,
                delegationAction: item.DelegateTo + ' / ' + item.Action,
                date: moment(item.StartDate).format('DD MMM YYYY') + ' -<br />' + moment(item.EndDate).format('DD MMM YYYY'),
                endDate: item.EndDate
              };
            });
            return modData;
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
          // console.log(data.endDate);
          // console.log(moment(data.endDate).unix());
          if (moment(data.endDate).unix() < moment().unix()) {
            $(row).addClass('disabled');
          }
        },
        columns: [{
          data: 'id',
          render: function() {
            return '<input type="checkbox" class="selectDelegation"/>';
          },
          orderable: false
        }, {
          data: 'user'
        }, {
          data: 'workflowTask'
        }, {
          data: 'department'
        }, {
          data: 'delegationAction'
        }, {
          data: 'date'
        }]
      });

      $('#delegationTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.delegationDataTable.row(this).data();
        Backbone.history.navigate('delegation/' + rowData.id, {
          trigger: true
        });
      });

      $('#delegationTable thead', this.el).on('change', '.checkAll', function(ev) {
        var $checkAllCheckbox = $(this);
        var isCheckAll = $checkAllCheckbox.prop('checked');
        $('#delegationTable tbody tr', self.el).each(function() {
          var $checkbox = $(this).find('td:first-child').find('.selectDelegation');
          $checkbox.prop('checked', isCheckAll);
          var rowData = self.delegationDataTable.row($(this)).data();

          var originalMember = self.model.toJSON().selectedTemplate;
          var newMember;

          if (isCheckAll) {
            newMember = _.union(originalMember, [rowData.id]);
          } else {
            newMember = _.reject(originalMember, function(memberGUID) {
              return rowData.id === memberGUID;
            });
          }
          self.model.set({
            selectedTemplate: newMember
          });
          // $checkbox.trigger('change');
        });
      });

      $('#delegationTable tbody', self.el).on('click', '.selectDelegation', function(ev) {
        ev.stopPropagation();
      });

      $('#delegationTable tbody', self.el).on('change', '.selectDelegation', function(ev) {
        ev.stopPropagation();
        var rowData = self.delegationDataTable.row($(this).parents('tr')).data();
        var originalMember = self.model.toJSON().selectedTemplate;
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
          $('#delegationTable tbody tr', self.el).length ===
          $('#delegationTable tbody .selectDelegation:checked', self.el).length
        );

        $('#delegationTable thead .checkAll', self.el).prop('checked', allChecked);
        self.model.set({
          selectedTemplate: newMember
        });
      });
    },

    deleteProfile: function(tId) {
      var self = this;
      var deferred = Q.defer();
      var DeleteProfileModel = Backbone.Model.extend({
        url: Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles/' + tId
      });
      var DeleteProfiletance = new DeleteProfileModel();
      DeleteProfiletance.save(null, {
        type: 'DELETE',
        beforeSend: utils.setAuthHeader,
        success: function(model, response) {
          self.delegationDataTable.ajax.reload();
          // Hktdc.Dispatcher.trigger('reloadMenu');
          deferred.resolve();
        },
        error: function(err) {
          deferred.reject();
          console.log(err);
        }
      });
      return deferred.promise;
    },

    goToCreatePage: function() {
      Backbone.history.navigate('delegation/new', {
        trigger: true
      });
    },

    updateModel: function(field, value) {
      var newObject = {};
      newObject[field] = value;
      console.log(newObject);
      this.model.set(newObject);
    },

    doSearch: function() {
      // console.log(this.model.toJSON());
      var queryParams = _.pick(this.model.toJSON(), 'UserId');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.delegationDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var queryParams = _.pick(this.model.toJSON(), 'UserId');
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/delegation-list' + queryString;
    }
  });
})();
