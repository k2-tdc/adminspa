/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Rule = Backbone.Collection.extend({

    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule/rule/' + code;
    },

    model: Hktdc.Models.Rule

  });
})();
