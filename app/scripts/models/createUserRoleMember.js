/* global Hktdc, Backbone, _ */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.CreateUserRoleMember = Backbone.Model.extend({

    initialize: function() {
      var self = this;
      this.isInvalid = {
        UserID: function() {
          return (self.attributes.UserID) ? false : 'User is required.';
        }
      };
    },

    defaults: {
      Role: '',

      UserRoleGUID: '',

      // Dept: (DeptCode),
      Dept: '',

      // User: [ (EmployeeID), (EmployeeID)],
      User: [],
      Query: '',
      ExpiryDate: ''
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
          !this.isInvalid.UserID()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
