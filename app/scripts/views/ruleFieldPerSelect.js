/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleFieldPerSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectRuleHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldPerSelect');
      _.bindAll(this, 'renderItem');
      _.extend(this, props);
      // this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      console.log(this.collection.toJSON().length);
      var self = this;
      console.log(this.collection.toJSON()[0]);
      if (!this.collection.get(0)) {
        console.log('crash');
        this.collection.unshift({FullName: '-- Select --', UserID: 0});
      }
      console.log(this.collection.toJSON()[0]);
      this.collection.each(this.renderItem);
      // self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedPer + '"]').prop('selected', true);
      });
    },

    selectRuleHandler: function(ev) {
      if (this.onSelected) {
        var ruleId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(rule) {
          return String(rule.UserID) === String(ruleId);
        }));
      }
    },

    renderItem: function(model) {
      var ruleItemView = new Hktdc.Views.RuleFieldPerOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleFieldPerOption = Backbone.View.extend({
    template: JST['app/scripts/templates/userOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().UserID)
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
