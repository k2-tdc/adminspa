/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Criteria = Backbone.Collection.extend({
    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule/criteria/' + code;
    },

    model: Hktdc.Models.Criteria
  });
})();
