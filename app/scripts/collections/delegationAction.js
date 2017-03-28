/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function () {
  'use strict';

  Hktdc.Collections.DelegationAction = Backbone.Collection.extend({
    url: function(type) {
      return Hktdc.Config.apiURL + '/users/delegation-sharing-list/action?type=' + type;
    },

    model: Hktdc.Models.DelegationAction

  });
})();
