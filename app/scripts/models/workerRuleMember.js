/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.WorkerRuleMember = Backbone.Model.extend({

    initialize: function() {},

    defaults: {
      showNature: false,
      showScore: false,
      showPer: false,
      showSet: false,
      showRemove: false,
      showAs: false,
      showOf: false,
      showFor: false,
      showDateRange: false,
      showCheckbox: false,
      showRemark: false,
      showReference: false,

      ruleCollection: null,

      Rule: '',
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
