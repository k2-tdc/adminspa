/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveEmailTemplate = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/email-template';
    },

    initialize: function() {},

    defaults: {
      UserId: '',
      TemplateId: '',
      ProcessId: '',
      StepId: '',
      Subject: '',
      Body: '',
      Enabled: false
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
