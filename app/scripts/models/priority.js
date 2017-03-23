/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Priority = Backbone.Model.extend({
    idAttribute: 'PriorityID',

    initialize: function() {},

    defaults: {},

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
