/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailProfile = Backbone.Model.extend({

    url: function(profileId) {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles/' + profileId;
    },

    initialize: function() {},

    defaults: {
      ProfileId: '',
      ProcessId: 0,
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

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
