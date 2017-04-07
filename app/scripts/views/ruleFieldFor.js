/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleFieldFor = Backbone.View.extend({
    template: JST['app/scripts/templates/ruleFieldFor.ejs'],

    initialize: function(opts) {
      _.extend(this, opts);
      if (!this.collection.get(0)) {
        var data = {};
        if (this.type === 'user') {
          data.UserID = '0';
          data.FullName = '-- Select --';
        } else if (this.type === 'team') {
          data.Code = '0';
          data.Description = '-- Select --';
        } else if (this.type === 'group') {
          data.GroupID = '0';
          data.Description = '-- Select --';
        } else if (this.type === 'department') {
          data.DeptCode = '0';
          data.DeptName = '-- Select --';
        }
        this.collection.unshift(data);
      }
    },

    render: function() {
      var self = this;
      self.$el.html(self.template());

      try {
        var gradeFromSelectView = new Hktdc.Views.RuleFieldForSelect({
          collection: self.collection,
          selectedFor: self.selectedFor,
          onSelected: self.onSelected
        });
        gradeFromSelectView.render();
        $('.commonContainer', self.el).html(gradeFromSelectView.el);
      } catch (e) {
        console.error(e);
      }
    }

  });

  Hktdc.Views.RuleFieldForSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectForHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldForSelect');
      _.bindAll(this, 'renderItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      console.log(this.selectedFor);
      var self = this;
      this.collection.each(this.renderItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedFor + '"]').prop('selected', true);
      });
    },

    selectForHandler: function(ev) {
      if (this.onSelected) {
        var targetId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(selectedItem) {
          return (
            String(selectedItem.DeptCode) === String(targetId) ||
            String(selectedItem.GroupID) === String(targetId) ||
            String(selectedItem.UserID) === String(targetId) ||
            String(selectedItem.Code) === String(targetId)
          );
        }));
      }
    },

    renderItem: function(model) {
      var ruleItemView = new Hktdc.Views.RuleFieldForOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleFieldForOption = Backbone.View.extend({
    template: JST['app/scripts/templates/forOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(
          this.model.toJSON().DeptCode ||
          this.model.toJSON().GroupID ||
          this.model.toJSON().UserID ||
          this.model.toJSON().Code
        )
      };
    },

    events: {},

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({ data: this.model.toJSON() }));
    }

  });

  Hktdc.Views.RuleFieldForTeamFilterSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectForHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldForTeamFilterSelect');
      _.bindAll(this, 'renderItem');
      _.extend(this, props);
      if (!this.collection.get(0)) {
        this.collection.unshift({ Description: '--- Select ---', FilterID: '0' });
      }
      // this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      this.collection.each(this.renderItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedFor + '"]').prop('selected', true);
      });
    },

    selectForHandler: function(ev) {
      if (this.onSelected) {
        var targetId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(selectedItem) {
          return String(selectedItem.FilterID) === String(targetId);
        }));
      }
    },

    renderItem: function(model) {
      var itemView = new Hktdc.Views.RuleFieldForTeamFilterOption({
        model: model
      });
      this.$el.append(itemView.el);
    }

  });

  Hktdc.Views.RuleFieldForTeamFilterOption = Backbone.View.extend({
    template: JST['app/scripts/templates/forOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().FilterID)
      };
    },

    events: {},

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template({ data: this.model.toJSON() }));
    }

  });
})();
