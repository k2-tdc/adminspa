/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.UserRole = Backbone.Collection.extend({

    url: function(processName) {
      return Hktdc.Config.apiURL + '/user-roles?process=' + processName;
    },

    model: Hktdc.Models.UserRole

  });
})();
