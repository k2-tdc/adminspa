/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Step = Backbone.Collection.extend({

    url: function(processName) {
      // return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/applications/steps/' + processId;
      return Hktdc.Config.apiURL + '/activity-groups?activity-group-type=email&process' + processName;
    },

    model: Hktdc.Models.Step

  });
})();
