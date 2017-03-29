/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.SharingPermission = Backbone.Collection.extend({
    url: function(type) {
      return Hktdc.Config.apiURL + '/sharing-list/action?type=' + type;
    },

    model: Hktdc.Models.SharingPermission

  });
})();
