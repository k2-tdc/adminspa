/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RolePermissionSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectRolePermissionHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rolePermission.js ] initialize: RolePermissionSelect');
      _.bindAll(this, 'renderRolePermissionItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      var self = this;
      this.collection.unshift({
        MenuItemName: '-- Select --',
        MenuItemGUID: 0
      });
      this.collection.each(this.renderRolePermissionItem);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedRolePermission + '"]').prop('selected', true);
      });
    },

    selectRolePermissionHandler: function(ev) {
      if (this.onSelected) {
        var rolePermissionId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(rolePermission) {
          return String(rolePermission.MenuItemGUID) === String(rolePermissionId);
        }));
      }
    },

    renderRolePermissionItem: function(model) {
      var rolePermissionItemView = new Hktdc.Views.RolePermissionOption({
        model: model
      });
      this.$el.append(rolePermissionItemView.el);
    }

  });

  Hktdc.Views.RolePermissionOption = Backbone.View.extend({
    template: JST['app/scripts/templates/rolePermissionOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().MenuItemGUID)
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
