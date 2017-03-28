/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.DelegationList = Backbone.Model.extend({

    url: '',

    initialize: function() {},

    defaults: {
      userId: '',
      userCollection: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
