/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveUserRole = Backbone.Model.extend({

    url: function(roleId) {
      var roleIdPath = (roleId) ? '/' + roleId : '';
      return Hktdc.Config.apiURL + '/user-role' + roleIdPath;
    },

    initialize: function() {},

    defaults: {
      Role: '',
      Desc: '',
      ProcessId: 0,

      // absent if insert
      UserRoleGUID: null
    },

    parse: function(response, options) {
      return response;
    }
  });

})();
