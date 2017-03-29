/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Sharing = Backbone.Model.extend({

    url: function(delegationId) {
      var path = delegationId ? '/' + delegationId : '';
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/sharing-list' + path;
    },

    initialize: function() {},

    defaults: {
      UserID: '',
      ProcessID: '',
      TaskID: '',
      Dept: '',
      DelegateUserID: '',
      StartDate: '',
      EndDate: '',
      // custom
      StartTime: '17:30',
      EndTime: '17:30',
      // custom
      Action: '',
      Remark: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
