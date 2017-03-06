/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.RolePermission = Backbone.Collection.extend({

    model: Hktdc.Models.RolePermission

  });
})();
