/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveRolePermission = Backbone.Model.extend({

    idAttribute: 'UserRoleGUID',

    url: function() {
      return Hktdc.Config.apiURL + '/role-permission';
    },

    initialize: function() {},

    // defaults: {
    //   RolePermissionGUID: '',
    //   MenuItemGUID: '',
    //   UserRoleGUID: ''
    // },
    
    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
