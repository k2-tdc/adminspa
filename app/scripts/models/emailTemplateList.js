/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplateList = Backbone.Model.extend({
    initialize: function() {},

    defaults: {
      ProcessId: 0,
      StepId: 0,
      processCollection: null,
      stepCollection: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
