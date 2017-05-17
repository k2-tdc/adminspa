/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Rule = Backbone.Collection.extend({

    url: function(workerRuleId) {
      // return Hktdc.Config.apiURL + '/worker-rule-settings/rules?worker-rule-id=' + workerRuleId;
      return Hktdc.Config.apiURL + '/worker-rule-settings/templates?worker-rule-id=' + workerRuleId;
    },

    model: Hktdc.Models.Rule

  });
})();
