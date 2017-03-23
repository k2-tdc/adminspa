/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleFieldAsSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectPriorityHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldAsSelect');
      _.bindAll(this, 'renderItem');
      _.extend(this, props);
      // this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      var self = this;
      console.log(this.collection.get(0).toJSON());
      if (!this.collection.get(0)) {
        console.log('inininni');
        this.collection.unshift({ Description: '-- Select --', PriorityID: '0' });
      }
      this.collection.each(this.renderItem);
      // self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedPriority + '"]').prop('selected', true);
      });
    },

    selectPriorityHandler: function(ev) {
      if (this.onSelected) {
        var priorityId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(rule) {
          return String(rule.PriorityID) === String(priorityId);
        }));
      }
    },

    renderItem: function(model) {
      var ruleItemView = new Hktdc.Views.RuleFieldAsOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleFieldAsOption = Backbone.View.extend({
    template: JST['app/scripts/templates/priorityOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().PriorityID)
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
