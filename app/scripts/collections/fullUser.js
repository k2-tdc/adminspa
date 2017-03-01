/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.FullUser = Backbone.Collection.extend({

    model: Hktdc.Models.User,

    url: function() {
      return Hktdc.Config.apiURL + '/users';
    }

  });
})();
