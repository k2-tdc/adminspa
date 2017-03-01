/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveUserRoleMember = Backbone.Model.extend({

    url: function(memberId) {
      var memberIdPath = (memberId) ? '/' + memberId : '';
      return Hktdc.Config.apiURL + '/user-role-member' + memberIdPath;
    },

    initialize: function() {},

    defaults: {
      UserRoleGUID: '',
      Dept: '',
      User: [],
      Query: '',
      ExpiryDate: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
