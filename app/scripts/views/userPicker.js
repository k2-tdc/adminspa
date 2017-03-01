/* global Hktdc, Backbone, JST, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.UserPicker = Backbone.View.extend({

    template: JST['app/scripts/templates/userPicker.ejs'],

    tagName: 'div',

    events: {},

    initialize: function(props) {
      _.extend(this, props);
    },

    render: function() {
      var self = this;
      self.$el.html(self.template());
      try {
        // console.log(self.users);
        var pickedUsersCollection = new Hktdc.Collections.UserPicker();
        var $input = $('.fullUserPicker', self.el);
        $input.autocomplete({
          source: self.users,
          select: function(ev, ui) {
            pickedUsersCollection.add([ui.item]);
            self.onSelect(ui.item);
          },

          close: function(ev, ui) {
            $(ev.target).val('');
          }
        });

        var pickerListView = new Hktdc.Views.UserPickerList({
          collection: pickedUsersCollection,
          onRemove: this.onRemove
        });
        pickerListView.render();
        $('.pickerList', self.el).append(pickerListView.el);
      } catch (e) {
        console.error(e);
      }
    }
  });

  Hktdc.Views.UserPickerList = Backbone.View.extend({

    tagName: 'ul',

    className: 'seleced-user-list',

    initialize: function(props) {
      var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderUserPickerItem');
      this.collection.on('add', function(addedUser, newCollection) {
        $(self.el).empty();
        self.render();
      });
      this.collection.on('remove', function(addedUser, newCollection) {
        $(self.el).empty();
        self.render();
      });
    },

    renderUserPickerItem: function(model) {
      var selectedCCItemView = new Hktdc.Views.UserPickerItem({
        model: model,
        collection: this.collection,
        onRemove: this.onRemove
      });
      selectedCCItemView.render();
      $(this.el).append(selectedCCItemView.el);
    },

    render: function() {
      this.collection.each(this.renderUserPickerItem);
    }

  });

  Hktdc.Views.UserPickerItem = Backbone.View.extend({

    template: JST['app/scripts/templates/userPickerItem.ejs'],

    tagName: 'li',

    events: {
      'click .glyphicon': 'removeUserPickerHandler'
    },

    initialize: function(props) {
      // this.listenTo(this.model, 'change', this.render);
      _.extend(this, props);
      _.bindAll(this, 'removeUserPickerHandler');
    },

    removeUserPickerHandler: function() {
      this.collection.remove(this.model);
      this.onRemove(this.model.toJSON());
    },

    render: function() {
      this.$el.html(this.template({
        selectedUserId: this.model.toJSON().USERID || this.model.toJSON().UserId,
        selectedUserName: this.model.toJSON().FULLNAME || this.model.toJSON().FullName,
        readonly: this.model.toJSON().readonly
      }));
    }
  });
})();
