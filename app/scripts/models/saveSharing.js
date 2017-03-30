/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveSharing = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/sharing-list';
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
      Permission: '',
      Remark: ''
    },

    validate: function(attrs, options) {
      var errors = [];
      if (!attrs.UserID) {
        errors.push('User is required.');
      }
      if (attrs.TaskID == 0) {
        errors.push('Task is required.');
      }
      if (attrs.ProcessID == 0) {
        errors.push('Workflow is required.');
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
      if (!attrs.Permission) {
        errors.push('Permission is required.');
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
