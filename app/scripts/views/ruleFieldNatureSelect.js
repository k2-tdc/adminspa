/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleFieldNatureSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectRuleHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldNatureSelect');
      _.bindAll(this, 'renderRuleItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      if (!this.collection.get(0)) {
        this.collection.unshift({ Description: '-- Select --', NatureID: '' });
      }
      this.collection.each(this.renderRuleItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedNature + '"]').prop('selected', true);
      });
    },

    selectRuleHandler: function(ev) {
      if (this.onSelected) {
        var ruleId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(rule) {
          return String(rule.NatureID) === String(ruleId);
        }));
      }
    },

    renderRuleItem: function(model) {
      var ruleItemView = new Hktdc.Views.RuleFieldNatureOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleFieldNatureOption = Backbone.View.extend({
    template: JST['app/scripts/templates/natureOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().NatureID)
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
