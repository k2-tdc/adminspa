/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EditUserRoleMember = Backbone.Model.extend({

    url: function(memberGUID) {
      return Hktdc.Config.apiURL + '/user-role-members/' + memberGUID;
    },

    initialize: function() {},

    defaults: {
      UserRoleMemberGUID: '',
      Role: '',

      // Type: (Department/User/Query)
      Type: '',
      TypeVal: '',
      ExpiryDate: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
