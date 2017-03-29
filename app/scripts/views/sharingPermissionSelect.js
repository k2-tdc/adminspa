/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.SharingPermissionSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectSharingPermissionHandler'
    },
    initialize: function(props) {
      console.debug('[ views/sharingPermission.js ] initialize: SharingPermissionSelect');
      _.bindAll(this, 'renderSharingPermissionItem');
      _.extend(this, props);
    },

    render: function() {
      var self = this;
      this.collection.unshift({
        Key: '-- Select --',
        Value: ''
      });

      this.collection.each(this.renderSharingPermissionItem);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedSharingPermission + '"]').prop('selected', true);
      });
    },

    selectSharingPermissionHandler: function(ev) {
      if (this.onSelect) {
        this.onSelect($(ev.target).val());
      }
    },

    renderSharingPermissionItem: function(model) {
      // console.log(model.toJSON());
      var sharingPermissionItemView = new Hktdc.Views.SharingPermissionOption({
        model: model
      });
      this.$el.append(sharingPermissionItemView.el);
    }

  });

  Hktdc.Views.SharingPermissionOption = Backbone.View.extend({
    template: JST['app/scripts/templates/sharingPermissionOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().Value)
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
