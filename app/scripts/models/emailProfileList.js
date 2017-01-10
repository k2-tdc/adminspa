/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailProfileList = Backbone.Model.extend({
    initialize: function() {},

    defaults: {
      profile: '', // = 'profile' in UI

      showSearch: false,
      profileUserCollection: null
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
