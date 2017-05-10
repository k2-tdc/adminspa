/* global Hktdc, Backbone, JST, utils, _,  $, Q, sprintf, dialogMessage */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailProfileList = Backbone.View.extend({

    template: JST['app/scripts/templates/emailProfileList.ejs'],

    events: {
      'click .searchBtn': 'doSearch',
      'click .createBtn': 'goToCreatePage'
        // 'click .advanced-btn': 'toggleAdvanceMode',
        // 'change .user-select': 'updateModelByEvent',
        // 'change .status-select': 'updateModelByEvent',
        // 'blur .search-field': 'updateModelByEvent',
        // 'blur .date': 'updateDateModelByEvent'
    },

    initialize: function(props) {
      console.debug('[ views/emailProfileList.js ] - Initialize');
      var self = this;
      $('#mainContent').removeClass('compress');
      if (this.model.toJSON().profile) {
        setTimeout(function() {
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                stepCollection: stepCollection
              });
            });
        });
      }
      self.model.on('change:stepCollection', function() {
        console.log('change step collection');
        self.renderStepSelect();
      });
    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));

      Q.fcall(function() {
        if (self.model.toJSON().showSearch) {
          console.debug('[ emailProfile.js ] - load all the remote resources');
          return self.loadProfileUser();
        }
        // put empty into profile users
        return [];
      })
        .then(function(profileUserCollection) {
          self.model.set({
            profileUserCollection: profileUserCollection
          }, {
            silent: true
          });
          self.renderProfileUserSelect();
          self.renderDataTable();
        })
        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: sprintf(dialogMessage.common.serverError.fail, err.request_id || 'unknown'),
            type: 'error',
            title: 'Runtime Error'
          });
        });

      /* Use DataTable's AJAX instead of backbone fetch and render */
      /* because to make use of DataTable function */
    },

    loadProfileUser: function() {
      var deferred = Q.defer();
      var profileUserCollection = new Hktdc.Collections.ProfileUser();
      var doFetch = function() {
        profileUserCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(profileUserCollection);
          },
          error: function(collection, response) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.component.profileUserList.error
            });
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    renderDataTable: function() {
      var self = this;
      self.profileDataTable = $('#profileTable', self.el).DataTable({
        bRetrieve: true,
        order: [0, 'desc'],
        searching: false,
        profileUsering: true,
        oLanguage: {
          sProfileUsering: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        ajax: {
          url: self.getAjaxURL(),
          beforeSend: utils.setAuthHeader,
          dataSrc: function(data) {
            var modData = _.map(data, function(profile) {
              var weekDayObject = _.pick(profile, 'WeekDay1', 'WeekDay2', 'WeekDay3', 'WeekDay4', 'WeekDay5', 'WeekDay6', 'WeekDay7');
              // console.log('weekDayObject', weekDayObject);

              var dayNameMapping = {
                'WeekDay1': 'Mon',
                'WeekDay2': 'Tue',
                'WeekDay3': 'Wed',
                'WeekDay4': 'Thu',
                'WeekDay5': 'Fri',
                'WeekDay6': 'Sat',
                'WeekDay7': 'Sun'
              };
              var timeNameMapping = [
                '-- N/A --',
                '00:00 - 00:59',
                '01:00 - 01:59',
                '02:00 - 02:59',
                '03:00 - 03:59',
                '04:00 - 04:59',
                '05:00 - 05:59',
                '06:00 - 06:59',
                '07:00 - 07:59',
                '08:00 - 08:59',
                '09:00 - 09:59',
                '10:00 - 10:59',
                '11:00 - 11:59',
                '12:00 - 12:59',
                '13:00 - 13:59',
                '14:00 - 14:59',
                '15:00 - 15:59',
                '16:00 - 16:59',
                '17:00 - 17:59',
                '18:00 - 18:59',
                '19:00 - 19:59',
                '20:00 - 20:59',
                '21:00 - 21:59',
                '22:00 - 22:59',
                '23:00 - 23:59'
              ];
              var weekDay = _.reduce(weekDayObject, function(memo, dayIsSelected, dayId) {
                if (dayIsSelected) {
                  memo.push(dayNameMapping[dayId]);
                }
                return memo;
              }, []);

              return {
                // lastActionDate: profile.SubmittedOn,
                id: profile.EmailNotificationProfileID,
                profileUser: profile.UserFullName || 'Default',
                processAndStep: profile.ProcessName + ((profile.StepName) ? ' / ' + profile.StepName : ''),
                weekDay: weekDay,
                timeSlot: timeNameMapping[profile.TimeSlot]
              };
            });
            // console.log(modData);
            return modData;
            // return { data: modData, recordsTotal: modData.length };
          },
          error: function(response, status, err) {
            utils.apiErrorHandling(response, {
              // 401: doFetch,
              unknownMessage: dialogMessage.emailProfile.loadList.error
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
          // if (data.condition) {
          // }
        },
        columns: [{
          data: 'profileUser'
        }, {
          data: 'processAndStep'
          // render: function(data) {
          //   console.log(data);
          //   return data.process + ' / ' + data.step;
          // }
        }, {
          data: 'weekDay',
          render: function(data) {
            return data.join(', ');
          }
        }, {
          data: 'timeSlot'
          // render: function(data) {
          //   return data.timeSlot;
          // }
        }]
      });

      $('#profileTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.profileDataTable.row(this).data();
        Backbone.history.navigate('emailprofile/' + rowData.id, {
          trigger: true
        });
      });
    },

    renderProfileUserSelect: function() {
      var self = this;
      var ProfileUserView;
      if (self.model.toJSON().showSearch) {
        ProfileUserView = new Hktdc.Views.ProfileUserSelect({
          collection: self.model.toJSON().profileUserCollection,
          selectedProfileUser: self.model.toJSON().profile,
          onSelected: function(profileUserId) {
            self.model.set({
              profile: profileUserId
            });
          }
        });

        ProfileUserView.render();
      } else {
        ProfileUserView = new Hktdc.Views.ProfileUserLabel({
          model: new Hktdc.Models.EmailProfile({FullName: Hktdc.Config.userName})
        });
      }
      // console.log(ProfileUserView.el);
      $('.profileUserContainer', self.el).html(ProfileUserView.el);
    },

    renderStepSelect: function() {
      var self = this;
      var profileUserSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON().StepId,
        onSelected: function(stepId) {
          self.model.set({
            StepId: stepId
          });
        }
      });
      profileUserSelectView.render();
      $('.stepContainer', self.el).html(profileUserSelectView.el);
    },

    deleteProfile: function(tId) {
      var self = this;
      var deferred = Q.defer();
      var DeleteProfileModel = Backbone.Model.extend({
        url: Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles/' + tId
      });
      var DeleteProfiletance = new DeleteProfileModel();
      var doSave = function() {
        DeleteProfiletance.save(null, {
          type: 'DELETE',
          beforeSend: utils.setAuthHeader,
          success: function(model, response) {
            self.profileDataTable.ajax.reload();
            // Hktdc.Dispatcher.trigger('reloadMenu');
            deferred.resolve();
          },
          error: function(model, response) {
              utils.apiErrorHandling(response, {
                  // 401: doFetch,
                  unknownMessage: dialogMessage.emailProfile.delete.error
              });
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    goToCreatePage: function() {
      Backbone.history.navigate('emailprofile/new', {
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
      var queryParams = _.omit(this.model.toJSON(), 'profileUserCollection', 'mode', 'showSearch', '');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.profileDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var queryParams = _.omit(this.model.toJSON(), 'profileUserCollection', 'mode', 'showSearch', '');
      console.log(queryParams);
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles' + queryString;
    }
  });
})();
