/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Level = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule-settings/levels';
    },

    model: Hktdc.Models.Level

  });

})();
