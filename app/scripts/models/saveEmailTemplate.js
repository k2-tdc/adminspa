/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveEmailTemplate = Backbone.Model.extend({

    url: function(tId) {
      var templateIdURI = (tId) ? '/' + tId : '';
      return Hktdc.Config.apiURL + '/email-templates' + templateIdURI;
    },

    initialize: function() {},

    defaults: {
      TemplateId: '',
      ProcessId: '',
      StepId: '',
      Subject: '',
      Body: '',
      UserId: '',
      Enabled: 0
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
