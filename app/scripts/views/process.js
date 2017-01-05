/* global Hktdc, Backbone, JST, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.ProcessSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectProcessHandler'
    },
    initialize: function() {
      console.debug('[ views/process.js ] initialize: ProcessSelect');
      _.bindAll(this, 'renderProcessItem');
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      // console.log(this.collection.toJSON());
      this.collection.unshift({ProcessDisplayName: '-- Select --'});
      this.collection.each(this.renderProcessItem);
    },

    selectProcessHandler: function() {},

    renderProcessItem: function(model) {
      var processItemView = new Hktdc.Views.ProcessOption({
        model: model
      });
      this.$el.append(processItemView.el);
    }

  });

  Hktdc.Views.ProcessOption = Backbone.View.extend({
    template: JST['app/scripts/templates/processOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: this.model.toJSON().name
      };
    },

    events: {},

    initialize: function() {
      console.debug('[ views/process.js ] initialize ProcessOption');
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
