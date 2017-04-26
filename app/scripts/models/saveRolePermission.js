/* global Hktdc, Backbone, _ */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveRolePermission = Backbone.Model.extend({

    idAttribute: 'UserRoleGUID',

    url: function() {
      return Hktdc.Config.apiURL + '/role-permissions';
    },

    initialize: function() {},

    // defaults: {
    //   data: [
    //     {
    //       RolePermissionGUID: '',
    //       MenuItemGUID: '',
    //       UserRoleGUID: ''
    //     }, ...
    //   ]
    // }

    validate: function(attrs, options) {
      var errors = [];
      if (attrs.data && attrs.data.length === 0) {
        errors.push('Role is required.');
      }
      _.each(attrs.data, function(data) {
        if (!data.MenuItemGUID) {
          errors.push('Permission is required.');
        }
        if (!data.UserRoleGUID) {
          errors.push('Role is required.');
        }
      });

      if (errors.length) {
        return _.uniq(errors).join('<br>');
      }
      return false;
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
