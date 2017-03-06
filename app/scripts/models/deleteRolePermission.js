/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.DeleteRolePermission = Backbone.Model.extend({

    url: function(permissionGUIDArray) {
      var permissionGUIDString = permissionGUIDArray.join(',');
      return Hktdc.Config.apiURL + '/role-permission?RolePermissionGUID=' + permissionGUIDString;
    },

    initialize: function() {},

    defaults: {
      RolePermissionGUID: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
