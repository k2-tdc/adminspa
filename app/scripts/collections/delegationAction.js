/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.DelegationAction = Backbone.Collection.extend({
    url: function(type) {
      return Hktdc.Config.apiURL + '/delegation-list/actions?type=' + type;
    },

    model: Hktdc.Models.DelegationAction

  });
})();
