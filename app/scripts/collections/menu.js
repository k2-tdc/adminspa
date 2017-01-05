/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Menu = Backbone.Collection.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/admin/users/' + Hktdc.Config.userID + 'menuitems';
    },

    model: Hktdc.Models.Menu

  });

})();
