/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Entity = Backbone.Collection.extend({
    url: function() {
      return Hktdc.Config.apiURL + '/entity';
    },

    model: Hktdc.Models.Entity

  });

})();
