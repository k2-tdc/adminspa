/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Level = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule/level';
    },

    model: Hktdc.Models.Level

  });

})();
