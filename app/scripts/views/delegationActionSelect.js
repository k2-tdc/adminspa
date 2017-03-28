/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.DelegationActionSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectDelegationActionHandler'
    },
    initialize: function(props) {
      console.debug('[ views/delegationAction.js ] initialize: DelegationActionSelect');
      _.bindAll(this, 'renderDelegationActionItem');
      _.extend(this, props);
    },

    render: function() {
      var self = this;
      this.collection.unshift({
        Value: '-- Select --',
        Key: ''
      });

      this.collection.each(this.renderDelegationActionItem);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedDelegationAction + '"]').prop('selected', true);
      });
    },

    selectDelegationActionHandler: function(ev) {
      if (this.onSelect) {
        this.onSelect($(ev.target).val());
      }
    },

    renderDelegationActionItem: function(model) {
      // console.log(model.toJSON());
      var delegationActionItemView = new Hktdc.Views.DelegationActionOption({
        model: model
      });
      this.$el.append(delegationActionItemView.el);
    }

  });

  Hktdc.Views.DelegationActionOption = Backbone.View.extend({
    template: JST['app/scripts/templates/delegationActionOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().Key)
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
