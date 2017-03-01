/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.CreateUserRoleMember = Backbone.Model.extend({

    url: '',

    initialize: function() {},

    defaults: {
      Role: '',

      UserRoleGUID: '',

      // Dept: (DeptCode),
      Dept: '',

      // User: [ (EmployeeID), (EmployeeID)],
      User: [],
      Query: '',
      ExpiryDate: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
