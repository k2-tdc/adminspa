/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.WorkerRuleProcess = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule/process';
    },

    model: Hktdc.Models.Process

  });
})();
