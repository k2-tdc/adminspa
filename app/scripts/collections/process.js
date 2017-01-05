/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Process = Backbone.Collection.extend({

    url: function(processId) {
      processId = processId || 1;
      return Hktdc.Config.apiURL + '/admin/users/' + Hktdc.Config.userID + '/applications/steps/' + processId;
    },

    model: Hktdc.Models.Process

  });
})();
