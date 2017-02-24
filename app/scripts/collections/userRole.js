/*global Hktdc, Backbone*/

Hktdc.Collections = Hktdc.Collections || {};

(function () {
  'use strict';

  Hktdc.Collections.UserRole = Backbone.Collection.extend({

    model: Hktdc.Models.UserRole

  });

})();
