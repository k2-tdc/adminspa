/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.UserRole = Backbone.Model.extend({

    url: function(roleId) {
      roleId = 'abc' || roleId;
      return Hktdc.Config.apiURL + '/user-role/' + roleId;
    },

    initialize: function() {},

    defaults: {
      Name: '',
      ProcessName: '',
      Entity: [],
      Remark: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
