/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveSharing = Backbone.Model.extend({

    url: function(sharingId) {
      var sharingIdURI = (sharingId) ? '/' + sharingId : '';
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/sharing-list' + sharingIdURI;
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

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
