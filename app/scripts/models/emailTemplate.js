/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplate = Backbone.Model.extend({

    url: '',

    initialize: function() {},

    defaults: {
      ApplicationCollection: null,
      Application: null,
      ProcessCollection: null,
      Process: null,
      Subject: '',
      Body: '',
      StaticContent: false,
      Enable: false
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
