/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplateList = Backbone.Model.extend({
    initialize: function() {},

    defaults: {
      processId: 0,
      process: '',
      'activity-group': 0,
      processCollection: null,
      stepCollection: null,
      selectedTemplate: []
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
