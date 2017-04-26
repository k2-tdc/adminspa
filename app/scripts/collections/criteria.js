/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Criteria = Backbone.Collection.extend({
    url: function(workerRuleId) {
      return Hktdc.Config.apiURL + '/worker-rule-settings/criteria?worker-rule-id=' + workerRuleId;
    },

    model: Hktdc.Models.Criteria
  });
})();
