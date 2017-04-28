/* global Hktdc, Backbone, _ */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.UserRole = Backbone.Model.extend({

    idAttribute: 'UserRoleGUID',

    url: function(roleId) {
      var roleIdPath = (roleId) ? '/' + roleId : '';
      return Hktdc.Config.apiURL + '/user-roles' + roleIdPath;
    },

    initialize: function() {
      var self = this;
      this.isInvalid = {
        Role: function() {
          return (self.attributes.Role) ? false : 'Role is required.';
        },
        Desc: function() {
          return (self.attributes.Desc) ? false : 'Description is required.';
        },
        ProcessId: function() {
          console.log(self.attributes.ProcessId);
          return (String(self.attributes.ProcessId) !== '0' && !!self.attributes.ProcessId) ? false : 'Process is required.';
        }
      };
    },

    defaults: {
      Role: '',
      Desc: '',
      ProcessId: '',
      UserRoleGUID: '',

      ProcessName: '',
      Member: [
        // UserRoleMemberGUID: xxx,
        // Type: xxx,
        // Name: xxx,
        // ExpiryDate: xxx (DateTime)
      ],

      processCollection: null,
      showMember: false,
      saveType: 'POST',
      selectedMember: []
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
          !this.isInvalid.Role() &&
          !this.isInvalid.Desc() &&
          !this.isInvalid.ProcessId()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
