/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.UserRole = Backbone.Collection.extend({

    url: function(processId) {
      return Hktdc.Config.apiURL + '/role-permission/user-role/' + processId;
    },

    model: Hktdc.Models.UserRole

  });
})();
