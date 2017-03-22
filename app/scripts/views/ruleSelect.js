/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectRuleHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleSelect');
      _.bindAll(this, 'renderRuleItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      this.collection.unshift({Description: '-- Select --', TemplateID: 0});
      this.collection.each(this.renderRuleItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedRule + '"]').prop('selected', true);
      });
    },

    selectRuleHandler: function(ev) {
      if (this.onSelected) {
        var ruleId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(rule) {
          return String(rule.TemplateID) === String(ruleId);
        }));
      }
    },

    renderRuleItem: function(model) {
      var ruleItemView = new Hktdc.Views.RuleOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleOption = Backbone.View.extend({
    template: JST['app/scripts/templates/ruleOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().TemplateID)
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
