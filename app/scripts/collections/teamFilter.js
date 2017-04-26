/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.TeamFilter = Backbone.Collection.extend({
    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule-settings/team-filters';
    },

    model: Hktdc.Models.TeamFilter

  });

})();
