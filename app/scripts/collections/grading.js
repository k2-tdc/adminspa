/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Grading = Backbone.Collection.extend({

    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule/grade';
    },
    model: Hktdc.Models.Grading

  });
})();
