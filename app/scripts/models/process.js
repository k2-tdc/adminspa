/* global Hktdc, Backbone */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Process = Backbone.Model.extend({
    idAttribute: 'ProcessID',

    defaults: {
      FULL_NAME: '',
      IsDefault: '',
      ProcessDisplayName: '',
      ProcessID: null,
      ProcessName: '',
      RoleType: '',
      UserId: '',
	  menuId:''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
