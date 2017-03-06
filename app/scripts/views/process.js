/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.ProcessSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectProcessHandler'
    },
    initialize: function(props) {
      console.debug('[ views/process.js ] initialize: ProcessSelect');
      _.bindAll(this, 'renderProcessItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      this.collection.unshift({ProcessDisplayName: '-- Select --', ProcessID: 0});
      this.collection.each(this.renderProcessItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedProcess + '"]').prop('selected', true);
      });
    },

    selectProcessHandler: function(ev) {
      if (this.onSelected) {
        var processId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(process) {
          return String(process.ProcessID) === String(processId);
        }));
      }
    },

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
        value: String(this.model.toJSON().ProcessID)
      };
    },

    events: {},

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
