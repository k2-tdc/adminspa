/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.DelegationUser = Backbone.Collection.extend({

    url: function(department) {
      return Hktdc.Config.apiURL + '/delegation-sharing-list/user?Dept=' + department;
    },

    model: Hktdc.Models.User

  });

})();
