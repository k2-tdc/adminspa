/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Process = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/GetEmailProcessStepList?UserId=' + Hktdc.Config.userID + '&ProcessId=';
    },

    model: Hktdc.Models.Process

  });
})();
