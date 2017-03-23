/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Level = Backbone.Model.extend({

    idAttribute: 'LevelNo',

    defaults: {},

    parse: function(response, options) {
      return response;
    }
  });

})();
