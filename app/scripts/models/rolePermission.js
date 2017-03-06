/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.RolePermission = Backbone.Model.extend({

    idAttribute: 'UserRoleGUID',

    url: function(permissionID) {
      return Hktdc.Config.apiURL + '/role-permission-detail?RolePermissionGUID=' + permissionID;
    },

    initialize: function() {},

    defaults: {
      Process: '',
      Permission: '',
      UserRoleGUID: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
