/* global Hktdc, Backbone, JST, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.ApplicationSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectApplicationHandler'
    },
    initialize: function() {
      console.debug('[ views/application.js ] initialize: ApplicationSelect');
      _.bindAll(this, 'renderApplicationItem');
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      // console.log(this.collection.toJSON());
      this.collection.unshift({ProcessDisplayName: '-- Select --'});
      this.collection.each(this.renderApplicationItem);
    },

    selectApplicationHandler: function() {},

    renderApplicationItem: function(model) {
      var applicationItemView = new Hktdc.Views.ApplicationOption({
        model: model
      });
      this.$el.append(applicationItemView.el);
    }

  });

  Hktdc.Views.ApplicationOption = Backbone.View.extend({
    template: JST['app/scripts/templates/applicationOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: this.model.toJSON().name
      };
    },

    events: {},

    initialize: function() {
      console.debug('[ views/application.js ] initialize ApplicationOption');
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
