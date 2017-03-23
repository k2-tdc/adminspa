/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Group = Backbone.Collection.extend({
    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule/user-group';
    },

    model: Hktdc.Models.Group

  });
})();
