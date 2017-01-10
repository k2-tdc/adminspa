/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveEmailProfile = Backbone.Model.extend({

    url: function(profileId) {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles' + ((profileId) ? '/' + profileId : '');
    },

    initialize: function() {},

    defaults: {
      ProfileId: '',
      ProcessId: '',
      StepId: '',
      UserId: '', // "Profile" in UI
      CC: '',
      BCC: '',
      TimeSlot: 0, // 1: 0000 - 0059
      WeekDay1: 0, // Mon
      WeekDay2: 0, // Tue
      WeekDay3: 0, // Wed
      WeekDay4: 0, // Thu
      WeekDay5: 0, // Fri
      WeekDay6: 0, // Sat
      WeekDay7: 0 // Sun
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
