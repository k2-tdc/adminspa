/* global Hktdc, Backbone, _, moment */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EditUserRoleMember = Backbone.Model.extend({

    url: function(memberGUID) {
      return Hktdc.Config.apiURL + '/user-role-members/' + memberGUID;
    },

    initialize: function() {
      var self = this;
      var today = new Date();
      this.isInvalid = {
        ExpiryDate: function() {
          if (!self.attributes.ExpiryDate) {
            return 'End date is required';
          } else if (moment(self.attributes.ExpiryDate, 'YYYY-MM-DD HH:mm').unix() < moment(today).unix()) {
            return 'and should be greater than today.';
          } else {
            return false;
          }
        }
      };
    },

    defaults: {
      UserRoleMemberGUID: '',
      Role: '',

      // Type: (Department/User/Query)
      Type: '',
      TypeVal: '',
      ExpiryDate: ''
    },

    validate: function(attrs, options) {
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
          !this.isInvalid.ExpiryDate()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
