/* global Hktdc, Backbone, JST, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.RolePicker = Backbone.View.extend({

    template: JST['app/scripts/templates/rolePicker.ejs'],

    tagName: 'div',

    initialize: function(props) {
      _.extend(this, props);
    },

    render: function() {
      var self = this;
      self.$el.html(self.template({ field: self.field }));
      try {
        var pickedRolesCollection = new Hktdc.Collections.RolePicker(this.selectedRole);
        var $input = $('.fullRolePicker', self.el);
        $input.autocomplete({
          source: self.roles,
          minLength: 0,
          select: function(ev, ui) {
            if (!pickedRolesCollection.get(ui.item.UserRoleGUID)) {
              pickedRolesCollection.add([ui.item]);
            }
            self.onSelect(ui.item);
          },
          close: function(ev, ui) {
            $(ev.target).val('');
          }
        });

        // $input.on('focus', function() {
        //   $input.autocomplete('search', '');
        // });
        $input.on('click', function() {
          $input.autocomplete('search', $input.val());
        });

        var pickerListView = new Hktdc.Views.RolePickerList({
          collection: pickedRolesCollection,
          onRemove: this.onRemove
        });
        pickerListView.render();
        $('.pickerList', self.el).append(pickerListView.el);
      } catch (e) {
        console.error(e);
      }
    }
  });

  Hktdc.Views.RolePickerList = Backbone.View.extend({

    tagName: 'ul',

    className: 'seleced-role-list',

    initialize: function(props) {
      var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderRolePickerItem');
      this.collection.on('add', function(addedRole, newCollection) {
        console.log('on add');
        $(self.el).empty();
        self.render();
      });
      this.collection.on('remove', function(addedRole, newCollection) {
        $(self.el).empty();
        self.render();
      });
    },

    renderRolePickerItem: function(model) {
      var selectedRoleItemView = new Hktdc.Views.RolePickerItem({
        model: model,
        collection: this.collection,
        onRemove: this.onRemove
      });
      selectedRoleItemView.render();
      $(this.el).append(selectedRoleItemView.el);
    },

    render: function() {
      this.collection.each(this.renderRolePickerItem);
    }

  });

  Hktdc.Views.RolePickerItem = Backbone.View.extend({

    template: JST['app/scripts/templates/rolePickerItem.ejs'],

    tagName: 'li',

    events: {
      'click .glyphicon': 'removeRolePickerHandler'
    },

    initialize: function(props) {
      // this.listenTo(this.model, 'change', this.render);
      _.extend(this, props);
      _.bindAll(this, 'removeRolePickerHandler');
    },

    removeRolePickerHandler: function() {
      this.collection.remove(this.model);
      this.onRemove(this.model.toJSON());
    },

    render: function() {
      this.$el.html(this.template({
        selectedRoleId: this.model.toJSON().UserRoleGUID,
        selectedRoleName: this.model.toJSON().Role
      }));
    }
  });
})();
