/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.Process = Backbone.Collection.extend({

    url: function() {
      //url: function(menuId) {
	  return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/applications';
	  //return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/applications?page=' + menuId;
    },

    model: Hktdc.Models.Process

  });
})();
