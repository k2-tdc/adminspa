/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.WorkerRuleProcess = Backbone.Collection.extend({

    url: function(menuId) {
      return Hktdc.Config.apiURL + '/worker-rules/process?MenuId=' + menuId;
    },

    model: Hktdc.Models.Process

  });
})();
