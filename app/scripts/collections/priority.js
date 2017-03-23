/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Priority = Backbone.Collection.extend({
    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule/priority/'+ code;
    },

    model: Hktdc.Models.Priority

  });

})();
