/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.RuleFieldNature = Backbone.Collection.extend({

    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule-settings/natures';
    },

    model: Hktdc.Models.RuleFieldNature

  });

})();
