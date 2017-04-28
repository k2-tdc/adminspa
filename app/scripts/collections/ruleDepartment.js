/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.RuleDepartment = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule-settings/department';
    },

    model: Hktdc.Models.RuleDepartment

  });

})();
