/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.User = Backbone.Model.extend({

    idAttribute: 'UserID',

    defaults: {
      EmployeeID: '',
      FullName: ''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
