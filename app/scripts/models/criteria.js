/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Criteria = Backbone.Model.extend({
    idAttribute: 'CriteriaID',

    parse: function(response, options) {
      return response;
    }
  });

})();
