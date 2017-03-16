/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function () {
  'use strict';

  Hktdc.Collections.ProfileUser = Backbone.Collection.extend({
    url: function(processId) {
      return Hktdc.Config.apiURL + '/users';
    },

    model: Hktdc.Models.ProfileUser

  });
})();
