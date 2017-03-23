/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.RuleFieldNature = Backbone.Model.extend({

    idAttribute: 'NatureID',

    defaults: {
      Description: '',
      DisplayOrder: '',
      Enabled: '',
      ModifiedOn: ''
    },

    parse: function(response, options) {
      return response;
    }
  });

})();
