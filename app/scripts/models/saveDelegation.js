/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveDelegation = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/delegation-list';
    },

    initialize: function() {},

    defaults: {
      // update only
      // DelegationID: '',

      UserID: '',
      ProcessID: '',
      TaskID: '',
      Dept: '',
      DelegateUserID: '',
      StartDate: '',
      EndDate: '',
      Action: '',
      Remark: ''
    },

    validate: function(attrs, options) {
      var errors = [];
      if (!attrs.UserID) {
        errors.push('User is required.');
      }
      if (!attrs.TaskID && attrs.ProcessID !== 0) {
        errors.push('Task is required.');
      }
      if (!attrs.Dept) {
        errors.push('Department is required.');
      }
      if (!attrs.DelegateUserID) {
        errors.push('Delegate To is required.');
      }
      if (!attrs.StartDate) {
        errors.push('Start Date is required.');
      }
      if (!attrs.EndDate) {
        errors.push('End Date is required.');
      } else if (moment(attrs.EndDate, 'YYYY-MM-DD HH:mm').unix() < moment(attrs.StartDate, 'YYYY-MM-DD HH:mm').unix()) {
        errors.push('End Date must be later than Start Date.');
      // } else if (moment(attrs.EndDate, 'YYYY-MM-DD HH:mm').unix() < moment().unix()) {
      //   errors.push('End Date must be later than today.');
      }
      if (!attrs.Action) {
        errors.push('Action is required.');
      }
      if (errors.length) {
        return errors.join('<br/>');
      }
      return false;
    },

    parse: function(response, options) {
      return response;
    }
  });

})();
