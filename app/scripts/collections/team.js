/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Team = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule-settings/teams';
    },

    model: Hktdc.Models.Team

  });
})();
