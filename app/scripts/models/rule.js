/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Rule = Backbone.Model.extend({
    
    idAttribute: 'TemplateID',

    initialize: function() {},

    defaults: {},

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
