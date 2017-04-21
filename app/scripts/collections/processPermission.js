/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function () {
  'use strict';

  Hktdc.Collections.ProcessPermission = Backbone.Collection.extend({

    url: function(processName) {
      return Hktdc.Config.apiURL + '/permissions?process=' + processName;
    },

    model: Hktdc.Models.ProcessPermission

  });

})();
