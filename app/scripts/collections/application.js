/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Application = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/GetProcessList?UserId=' + Hktdc.Config.userID + '&ProcessName=admin';
    },

    model: Hktdc.Models.Application

  });
})();
