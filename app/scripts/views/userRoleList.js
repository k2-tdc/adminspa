/*global Hktdc, Backbone, JST*/

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserRoleList = Backbone.View.extend({

    template: JST['app/scripts/templates/userRoleList.ejs'],

    tagName: 'div',

    id: '',

    className: '',

    events: {},

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });

})();
