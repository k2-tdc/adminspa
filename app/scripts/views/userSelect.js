/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.UserSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectGradeHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: UserSelect');
      _.bindAll(this, 'renderItem');
      _.extend(this, props);
      // this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      console.log(this.collection.toJSON());
      var self = this;
      this.collection.each(this.renderItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedUser + '"]').prop('selected', true);
      });
    },

    selectGradeHandler: function(ev) {
      if (this.onSelected) {
        var gradeId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(grade) {
          return String(grade.Grade) === String(gradeId);
        }));
      }
    },

    renderItem: function(model) {
      var ruleItemView = new Hktdc.Views.UserOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.UserOption = Backbone.View.extend({
    template: JST['app/scripts/templates/userOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: this.model.toJSON().UserID
      };
    },

    events: {},

    initialize: function() {
      this.render();
    },

    render: function() {
      // console.log(this.model.toJSON().FullName);
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
