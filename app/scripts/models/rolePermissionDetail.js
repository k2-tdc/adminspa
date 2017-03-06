/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.RolePermissionDetail = Backbone.Model.extend({

    initialize: function() {},

    defaults: {
      // store the raw role permission
      permissionCollection: null,
      deletePermissionArray: [],

      ProcessId: '',
      ProcessName: '',
      MenuItemGUID: '',

      processCollection: null,
      selectedRole: []
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
