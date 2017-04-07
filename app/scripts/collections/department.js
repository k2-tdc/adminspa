/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Department = Backbone.Collection.extend({

    url: function(type) {
      return Hktdc.Config.apiURL + '/departments?type=' + type;
    },

    model: Hktdc.Models.Department

  });
})();
