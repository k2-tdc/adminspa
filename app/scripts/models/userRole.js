/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.UserRole = Backbone.Model.extend({

    idAttribute: 'UserRoleGUID',

    url: function(roleId) {
      var roleIdPath = (roleId) ? '/' + roleId : '';
      return Hktdc.Config.apiURL + '/user-roles' + roleIdPath;
    },

    initialize: function() {},

    defaults: {
      UserRoleGUID: '',
      Role: '',
      Desc: '',
      ProcessId: '',
      ProcessName: '',
      Member: [
        // UserRoleMemberGUID: xxx,
        // Type: xxx,
        // Name: xxx,
        // ExpiryDate: xxx (DateTime)
      ],

      processCollection: null,
      showMember: false,
      saveType: 'POST',
      selectedMember: []
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
