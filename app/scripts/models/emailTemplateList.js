/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplateList = Backbone.Model.extend({
    initialize: function() {},

    defaults: {
      canChooseStatus: true,
      searchUserType: '',

      CStat: '',
      ReferID: '',
      FDate: '',
      TDate: '',
      Appl: '',
      UserId: '',
      SUser: '',
      // for detail
      ProsIncId: '',
      showAdvanced: false
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
