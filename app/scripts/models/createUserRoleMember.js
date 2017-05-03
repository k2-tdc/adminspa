/* global Hktdc, Backbone, _, moment*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.CreateUserRoleMember = Backbone.Model.extend({

    initialize: function() {
      var self = this;
      var today = new Date();
      this.isInvalid = {
        member: function() {
          // console.log(self.attributes.User, self.attributes.Query, self.attributes.Dept);
          console.log('User: ', self.attributes.User, (self.attributes.User && self.attributes.User.length));
          console.log('Query: ', self.attributes.Query, (self.attributes.Query && self.attributes.Query !== ''));
          console.log('Dept: ', self.attributes.Dept, (self.attributes.Dept !== '0' && self.attributes.Dept !== 0 && self.attributes.Dept !== ''));
          console.log('final: ', (self.attributes.User && self.attributes.User.length) ||
          (self.attributes.Query && self.attributes.Query !== '') ||
          (self.attributes.Dept !== '0' && self.attributes.Dept !== 0 && self.attributes.Dept !== ''));
          return (
            (self.attributes.User && self.attributes.User.length) ||
            (self.attributes.Query && self.attributes.Query !== '') ||
            (self.attributes.Dept !== '0' && self.attributes.Dept !== 0 && self.attributes.Dept !== '')
          ) ? false : 'Either User/Query/Department is required.';
        },
        ExpiryDate: function() {
          if (!self.attributes.ExpiryDate) {
            return 'Expiry date is required';
          } else if (moment(self.attributes.ExpiryDate, 'YYYY-MM-DD HH:mm').unix() < moment(today).unix()) {
            return 'Expiry date should be greater than today.';
          } else {
            return false;
          }
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
          var field = options.field;
          if (options.field === 'User' || options.field === 'Query' || options.field === 'Dept') {
            field = 'member';
          }
          this.trigger('valid', { field: field });
          return false;
        }

      // validate the whole form
      } else {
        return !(
          !this.isInvalid.member() &&
          !this.isInvalid.ExpiryDate()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
