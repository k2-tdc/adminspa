/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function () {
  'use strict';

  Hktdc.Collections.ProcessPermission = Backbone.Collection.extend({

    url: function(processId) {
      return Hktdc.Config.apiURL + '/role-permission/menuitem/' + processId;
    },

    model: Hktdc.Models.ProcessPermission

  });

})();
