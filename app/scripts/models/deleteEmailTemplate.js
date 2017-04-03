/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.DeleteEmailTemplate = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/email-templates/delete';
    },

    defaults: {
      data: []
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
