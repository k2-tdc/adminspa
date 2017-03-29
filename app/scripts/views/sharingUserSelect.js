/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.SharingUserSelect = Backbone.View.extend({

    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectSharingUserItemHandler'
    },

    initialize: function(props) {
      console.debug('[ views/sharingUser.js ] initialize: SharingUserSelect');
      // var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderSharingUserItem');
      // console.log(this.collection);
      // this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      try {
        this.collection.unshift({
          FullName: '-- Select --',
          UserID: 0
        });
        this.collection.each(this.renderSharingUserItem);
      } catch (e) {
        console.error(e);
      }
    },

    selectSharingUserItemHandler: function(ev) {
      if (this.onSelected) {
        this.onSelected($(ev.target).find('option:selected').val());
      }
    },

    renderSharingUserItem: function(model) {
      var self = this;
      var sharingUserItemView = new Hktdc.Views.SharingUserOption({
        model: model
      });
      this.$el.append(sharingUserItemView.el);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedSharingUser + '"]').prop('selected', true);
      });
    }
  });

  Hktdc.Views.SharingUserOption = Backbone.View.extend({
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
