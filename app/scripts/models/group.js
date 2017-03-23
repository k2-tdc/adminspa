/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Group = Backbone.Model.extend({

    idAttribute: 'GroupID',

    initialize: function() {},

    defaults: {},

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
