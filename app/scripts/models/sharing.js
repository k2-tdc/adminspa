/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Sharing = Backbone.Model.extend({

    url: function(sharingId) {
      var path = sharingId ? '/' + sharingId : '';
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
      StartTime: '00:00',
      EndTime: '00:00',
      // custom
      Permission: '',
      Remark: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
