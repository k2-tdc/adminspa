/* global Hktdc, Backbone, _, validateMessage */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.RolePermissionDetail = Backbone.Model.extend({

    initialize: function() {
      var self = this;
      this.isInvalid = {
        ProcessId: function() {
          return (String(self.attributes.ProcessId) !== '0' && !!self.attributes.ProcessId) ? false : validateMessage.required;
        },
        MenuItemGUID: function() {
          return (String(self.attributes.MenuItemGUID) !== '0' && !!self.attributes.MenuItemGUID) ? false : validateMessage.required;
        },
        permissionCollection: function() {
          return (self.attributes.permissionCollection && self.attributes.permissionCollection.length > 0) ? false : validateMessage.required;
        }
      };
    },

    defaults: {
      // store the raw role permission
      permissionCollection: null,
      deletePermissionArray: [],

      ProcessId: '',
      ProcessName: '',
      MenuItemGUID: '',

      processCollection: null
    },

    validate: function(attrs, options) {
      // *** valid => return false;
      // *** invalid => return true;

      // for single validate
      if (options.field && !_.isArray(options.field)) {
        if (this.isInvalid[options.field] && this.isInvalid[options.field]()) {
          console.log('invalid: ', options.field, '>> ', this.isInvalid[options.field]());
          options.onInvalid({ message: this.isInvalid[options.field]() });
          return true;
        } else {
          this.trigger('valid', { field: options.field });
          return false;
        }

      // validate the whole form
      } else {
        return !(
          !this.isInvalid.ProcessId() &&
          !this.isInvalid.MenuItemGUID() &&
          !this.isInvalid.permissionCollection()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
