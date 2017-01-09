/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveEmailTemplate = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/admin/email-template';
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
