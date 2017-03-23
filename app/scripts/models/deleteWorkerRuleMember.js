/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.DeleteWorkerRuleMember = Backbone.Model.extend({

    url: function(id) {
      return Hktdc.Config.apiURL + '/worker-rule/rule/' + id;
    },

    initialize: function() {},

    defaults: {},

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
