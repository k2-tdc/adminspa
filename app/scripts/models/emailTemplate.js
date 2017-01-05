/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplate = Backbone.Model.extend({

    url: function(tId) {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-template/' + tId;
    },

    defaults: {
      TemplateId: '',
      Subject: '',
      Body: '',
      Enable: false,

      Process: '',
      Process: '',

      ProcessCollection: null,
      ProcessCollection: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
