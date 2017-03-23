/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Team = Backbone.Model.extend({

    idAttribute: 'Code',

    initialize: function() {},

    defaults: {},

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
