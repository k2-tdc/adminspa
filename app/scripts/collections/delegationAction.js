/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.DelegationAction = Backbone.Collection.extend({
    url: function() {
      return Hktdc.Config.apiURL + '/delegation-list/actions';
    },

    model: Hktdc.Models.DelegationAction

  });
})();
