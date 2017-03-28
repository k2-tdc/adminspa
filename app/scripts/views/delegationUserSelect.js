/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.DelegationUserSelect = Backbone.View.extend({

    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectDelegationUserItemHandler'
    },

    initialize: function(props) {
      console.debug('[ views/delegationUser.js ] initialize: DelegationUserSelect');
      // var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderDelegationUserItem');
      // console.log(this.collection);
      // this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      try {
        this.collection.unshift({
          FullName: '-- Select --',
          UserID: 0
        });
        this.collection.each(this.renderDelegationUserItem);
      } catch (e) {
        console.error(e);
      }
    },

    selectDelegationUserItemHandler: function(ev) {
      if (this.onSelected) {
        this.onSelected($(ev.target).find('option:selected').val());
      }
    },

    renderDelegationUserItem: function(model) {
      var self = this;
      var delegationUserItemView = new Hktdc.Views.DelegationUserOption({
        model: model
      });
      this.$el.append(delegationUserItemView.el);
      setTimeout(function() {
        // console.log(self.selectedDelegationUser);
        self.$el.find('option[value="' + self.selectedDelegationUser + '"]').prop('selected', true);
      });
    }
  });

  Hktdc.Views.DelegationUserOption = Backbone.View.extend({
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
