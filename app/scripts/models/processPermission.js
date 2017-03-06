/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.ProcessPermission = Backbone.Model.extend({

    initialize: function() {},

    defaults: {
      MenuItemGUID: '',
      MenuItemName: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
