/* global Hktdc, Backbone, JST, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.SelectedUser = Backbone.View.extend({

    template: JST['app/scripts/templates/selectedUser.ejs'],

    tagName: 'li',

    events: {
      'click .glyphicon': 'removeSelectedUserHandler'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
    },

    removeSelectedUserHandler: function() {
      this.collection.remove(this.model);
    },

    render: function() {
      this.$el.html(this.template({
        selectedUserId: this.model.toJSON().USERID || this.model.toJSON().UserId,
        selectedUserName: this.model.toJSON().FULLNAME || this.model.toJSON().FullName,
        readonly: this.model.toJSON().readonly
      }));
    }
  });

  Hktdc.Views.SelectedUserList = Backbone.View.extend({

    tagName: 'ul',

    className: 'seleced-user-list',

    initialize: function(props) {
      var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderSelectedUserItem');
      this.render();

      this.collection.on('add', function(addedUser, newCollection) {
        $(self.el).empty();
        self.render();
      });
      this.collection.on('remove', function(addedUser, newCollection) {
        $(self.el).empty();
        self.render();
      });
    },

    renderSelectedUserItem: function(model) {
      model.set({
        readonly: this.requestFormModel.toJSON().mode === 'read'
      });
      var selectedUserItemView = new Hktdc.Views.SelectedUser({
        model: model,
        collection: this.collection
      });
      selectedUserItemView.render();
      $(this.el).append(selectedUserItemView.el);
    },

    render: function() {
      /* the collection share with new request selectedUserCollection */
      console.log(this.requestFormModel.toJSON());
      if (this.collection.length || this.requestFormModel.toJSON().mode !== 'read') {
        this.collection.each(this.renderSelectedUserItem);
      } else {
        $(this.el).append('NIL');
      }
    }

  });
})();
