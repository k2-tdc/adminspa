/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.DeleteSharing = Backbone.Model.extend({

    url: function(id) {
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/sharing-list/' + id;
    },

    initialize: function() {},

    defaults: {},

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
