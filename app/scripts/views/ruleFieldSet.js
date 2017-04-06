/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleFieldSetGrade = Backbone.View.extend({
    template: JST['app/scripts/templates/ruleFieldSetGrade.ejs'],

    className: 'row',

    initialize: function(opts) {
      _.extend(this, opts);
      if (!this.collection.get(0)) {
        this.collection.unshift({Description: '-- Select --', Grade: 0});
      }
    },

    render: function() {
      var self = this;
      self.$el.html(self.template());

      try {
        var gradeFromSelectView = new Hktdc.Views.RuleFieldSetSelect({
          collection: self.collection,
          selectedSet: self.selectedGradeFrom,
          onSelected: self.onSelectedFrom
        });
        var ofToSelectView = new Hktdc.Views.RuleFieldSetSelect({
          collection: self.collection,
          selectedSet: self.selectedGradeTo,
          onSelected: self.onSelectedTo
        });
        gradeFromSelectView.render();
        ofToSelectView.render();
        $('.gradeFromContainer', self.el).html(gradeFromSelectView.el);
        $('.gradeToContainer', self.el).html(ofToSelectView.el);
      } catch (e) {
        console.error(e);
      }
    }
  });

  Hktdc.Views.RuleFieldSetCommon = Backbone.View.extend({
    template: JST['app/scripts/templates/ruleFieldSet.ejs'],

    initialize: function(opts) {
      _.extend(this, opts);
      if (!this.collection.get(0)) {
        var data = {};
        if (this.type === 'user') {
          data.UserID = '0';
          data.FullName = '-- Select --';
        } else if (this.type === 'level') {
          data.LevelNo = '0';
          data.Description = '-- Select --';
        } else if (this.type === 'group') {
          data.GroupID = '0';
          data.Description = '-- Select --';
        }
        this.collection.unshift(data);
      }
    },

    render: function() {
      this.$el.html(this.template());
      var self = this;
      try {
        var commonSelectView = new Hktdc.Views.RuleFieldSetSelect({
          collection: self.collection,
          selectedSet: self.selected,
          onSelected: self.onSelected
        });
        commonSelectView.render();
        $('.commonContainer', self.el).html(commonSelectView.el);
      } catch (e) {
        console.error(e);
      }
    }

  });

  Hktdc.Views.RuleFieldSetSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldSetSelect');
      _.bindAll(this, 'renderItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      this.collection.each(this.renderItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedSet + '"]').prop('selected', true);
      });
    },

    selectHandler: function(ev) {
      if (this.onSelected) {
        var targetId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(collectionItem) {
          return (
            String(collectionItem.Grade) === String(targetId) ||
            String(collectionItem.GroupID) === String(targetId) ||
            String(collectionItem.UserID) === String(targetId) ||
            String(collectionItem.LevelNo) === String(targetId)
          );
        }));
      }
    },

    renderItem: function(model) {
      var ruleItemView = new Hktdc.Views.RuleFieldSetOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleFieldSetOption = Backbone.View.extend({
    template: JST['app/scripts/templates/setOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(
          this.model.toJSON().Grade ||
          this.model.toJSON().GroupID ||
          this.model.toJSON().UserID ||
          this.model.toJSON().LevelNo
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
})();
