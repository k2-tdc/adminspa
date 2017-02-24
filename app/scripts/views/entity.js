/* global Hktdc, Backbone, JST, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EntityList = Backbone.View.extend({

    template: JST['app/scripts/templates/entityList.ejs'],

    tagName: 'tbody',

    initialize: function(props) {
      // this.listenTo(this.model, 'change', this.render);
      _.extend(this, props);
    },

    render: function() {
      // console.log(this.data);
      this.$el.html(this.template({ entity: this.data }));
      // console.log(this.template({ entity: this.data }));
    }

  });
})();
