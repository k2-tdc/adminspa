/* global Hktdc, Backbone, moment, _ */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Delegation = Backbone.Model.extend({

    url: function(delegationId) {
      var path = delegationId ? '/' + delegationId : '';
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/delegation-list' + path;
    },

    initialize: function() {
      var self = this;
      this.isInvalid = {
        UserID: function() {
          return (self.attributes.UserID) ? false : 'User is required.';
        },
        TaskID: function() {
          return (
            (!!self.attributes.TaskID || String(self.attributes.TaskID) !== '0') &&
            String(self.attributes.ProcessID) !== '0'
          )
            ? false
            : 'Task is required if Process is selected.';
        },
        Dept: function() {
          return (String(self.attributes.Dept) !== '0' && !!self.attributes.Dept) ? false : 'Department is required.';
        },
        DelegateUserID: function() {
          return (String(self.attributes.DelegateUserID) !== '0' && !!self.attributes.DelegateUserID) ? false : 'Delegate To is required.';
        },
        StartDate: function() {
          return (self.attributes.StartDate) ? false : 'Start date is required';
        },
        StartTime: function() {
          return (self.attributes.StartTime) ? false : 'Start time is required';
        },
        EndDate: function() {
          if (!self.attributes.EndDate) {
            return 'End date is required';
          } else if (moment(self.attributes.EndDate, 'YYYY-MM-DD HH:mm').unix() < moment(self.attributes.StartDate, 'YYYY-MM-DD HH:mm').unix()) {
            return 'and should be greater than start date.';
          } else {
            return false;
          }
        },
        EndTime: function() {
          return (self.attributes.EndTime) ? false : 'End time is required';
        },
        Action: function() {
          return (self.attributes.Action) ? false : 'Action is required.';
        }
      };
    },

    defaults: {
      UserID: '',
      ProcessID: '',
      TaskID: '',
      Dept: '',
      DelegateUserID: '',
      StartDate: '',
      EndDate: '',
      // custom
      StartTime: '00:00',
      EndTime: '00:00',
      // custom
      Action: '',
      Remark: ''
    },

    validate: function(attrs, options) {
      // *** valid => return false;
      // *** invalid => return true;

      // for single validate
      if (options.field && !_.isArray(options.field)) {
        if (this.isInvalid[options.field] && this.isInvalid[options.field]()) {
          console.log('invalid: ', options.field, '>> ', this.isInvalid[options.field]());
          options.onInvalid({ message: this.isInvalid[options.field]() });
          return true;
        } else {
          this.trigger('valid', { field: options.field });
          return false;
        }

      // validate the whole form
      } else {
        return !(
          !this.isInvalid.UserID() &&
          !this.isInvalid.TaskID() &&
          !this.isInvalid.Dept() &&
          !this.isInvalid.DelegateUserID() &&
          !this.isInvalid.StartDate() &&
          !this.isInvalid.EndDate() &&
          !this.isInvalid.StartTime() &&
          !this.isInvalid.EndTime() &&
          !this.isInvalid.Action()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
