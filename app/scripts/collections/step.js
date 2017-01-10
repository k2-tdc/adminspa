/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Step = Backbone.Collection.extend({

    url: function(processId) {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/applications/steps/' + processId;
    },

    model: Hktdc.Models.Step

  });
})();
