/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveDelegation = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/delegation-list';
    },

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

    parse: function(response, options) {
      return response;
    }
  });
})();
