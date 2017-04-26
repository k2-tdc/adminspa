/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveUserRole = Backbone.Model.extend({

    url: function(roleId) {
      var roleIdPath = (roleId) ? '/' + roleId : '';
      return Hktdc.Config.apiURL + '/user-roles' + roleIdPath;
    },

    initialize: function() {},

    defaults: {
      Role: '',
      Desc: '',
      ProcessId: 0,

      // absent if insert
      UserRoleGUID: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
