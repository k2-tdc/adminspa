/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Department = Backbone.Model.extend({

    idAttribute: 'DeptCode',

    parse: function(response, options) {
      return response;
    }
  });
})();
