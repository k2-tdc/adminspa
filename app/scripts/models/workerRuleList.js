/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.WorkerRuleList = Backbone.Model.extend({

    initialize: function() {},

    defaults: {
      processCollection: null,
      process: '',
      menuId: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
