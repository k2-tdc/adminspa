/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SharingList = Backbone.Model.extend({

    initialize: function() {},

    defaults: {
      UserId: '',
      userCollection: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
