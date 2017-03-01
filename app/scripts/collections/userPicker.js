/* global Hktdc, Backbone */

Hktdc.Collections = Hktdc.Collections || {};

(function() {
  'use strict';

  Hktdc.Collections.UserPicker = Backbone.Collection.extend({

    model: Hktdc.Models.UserPicker

  });
})();
