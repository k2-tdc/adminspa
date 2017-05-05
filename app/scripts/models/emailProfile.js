/* global Hktdc, Backbone, validateMessage */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailProfile = Backbone.Model.extend({

    url: function(profileId) {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles/' + profileId;
    },

    initialize: function() {
      var self = this;
      this.isInvalid = {
        ProcessID: function() {
          return (self.attributes.ProcessID && String(self.attributes.ProcessID) !== '0') ? false : validateMessage.required;
        },
        StepID: function() {
          return (self.attributes.StepID && String(self.attributes.StepID) !== '0') ? false : validateMessage.required;
        },
        DayOfWeek: function() {
          return (self.attributes.DayOfWeek && self.attributes.DayOfWeek.length) ? false : validateMessage.required;
        },
        UserId: function() {
          return (self.attributes.UserId && String(self.attributes.UserId) !== '0') ? false : validateMessage.required;
        }
      };
    },

    defaults: {
      ProfileId: '',
      ProcessID: 0,
      ProcessName: 0,
      StepID: 0,
      TimeSlot: 1,
      DayOfWeek: [],
      UserId: '', // "Profile" in UI

      WeekDay1: false,
      WeekDay2: false,
      WeekDay3: false,
      WeekDay4: false,
      WeekDay5: false,
      WeekDay6: false,
      WeekDay7: false,
      processCollection: null,
      stepCollection: null,
      showDelete: false,
      profileUserCollection: null
    },

    validate: function(attrs, options) {
      // *** valid => return false;
      // *** invalid => return true;

      // for single validate
      if (options.field && !_.isArray(options.field)) {
        if (this.isInvalid[options.field] && this.isInvalid[options.field]()) {
          console.log('invalid: ', options.field, '>> ', this.isInvalid[options.field]());
          options.onInvalid({
            message: this.isInvalid[options.field]()
          });
          return true;
        } else {
          this.trigger('valid', {
            field: options.field
          });
          return false;
        }

        // validate the whole form
      } else {
        return !(
          !this.isInvalid.UserId() &&
          !this.isInvalid.ProcessID() &&
          !this.isInvalid.StepID() &&
          !this.isInvalid.DayOfWeek()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
