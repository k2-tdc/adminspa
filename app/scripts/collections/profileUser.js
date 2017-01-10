/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function () {
  'use strict';

  Hktdc.Collections.ProfileUser = Backbone.Collection.extend({
    url: function(processId) {
      return Hktdc.Config.apiURL + '/profile-list';
    },

    model: Hktdc.Models.ProfileUser

  });
})();
