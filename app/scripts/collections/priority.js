/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Priority = Backbone.Collection.extend({
    url: function(workerRuleId) {
      return Hktdc.Config.apiURL + '/worker-rule-settings/priorities?worker-rule-id='+ workerRuleId;
    },

    model: Hktdc.Models.Priority

  });

})();
