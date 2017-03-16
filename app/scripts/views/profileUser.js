/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.ProfileUserLabel = Backbone.View.extend({
    template: JST['app/scripts/templates/profileUserLabel.ejs'],
    tagName: 'div',
    className: 'form-data',
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });

  Hktdc.Views.ProfileUserSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectProfileUserHandler'
    },
    initialize: function(props) {
      console.debug('[ views/profileUser.js ] initialize: ProfileUserSelect');
      _.bindAll(this, 'renderProfileUserItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      this.collection.unshift({FullName: '-- Default --', UserID: 'DEFAULT', EmployeeID: 'DEFAULT' });
      this.collection.unshift({FullName: '-- Select --', UserID: 0});
      this.collection.each(this.renderProfileUserItem);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedProfileUser + '"]').prop('selected', true);
      });
    },

    selectProfileUserHandler: function(ev) {
      if (this.onSelected) {
        this.onSelected($(ev.target).val());
      }
    },

    renderProfileUserItem: function(model) {
      var profileUserItemView = new Hktdc.Views.ProfileUserOption({
        model: model
      });
      this.$el.append(profileUserItemView.el);
    }

  });

  Hktdc.Views.ProfileUserOption = Backbone.View.extend({
    template: JST['app/scripts/templates/profileUserOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().UserID)
      };
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
