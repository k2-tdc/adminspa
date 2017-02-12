/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplate = Backbone.Model.extend({

    url: function(tId) {
      return Hktdc.Config.apiURL + '/email-templates/' + tId;
    },

    defaults: {
      TemplateId: 0,
      ProcessId: 0,
      StepId: 0,
      Subject: '',
      Body: '',
      Enabled: true,

      processCollection: null,
      stepCollection: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
