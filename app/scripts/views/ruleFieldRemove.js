/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.RuleFieldRemoveGrade = Backbone.View.extend({
    className: 'row',

    template: JST['app/scripts/templates/ruleFieldRemoveGrade.ejs'],

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
        var gradeFromSelectView = new Hktdc.Views.RuleFieldRemoveSelect({
          collection: self.collection,
          selectedRemove: self.selectedGradeFrom,
          attributes: { field: self.fieldFrom, name: self.fieldFrom },
          onSelected: self.onSelectedFrom
        });
        var ofToSelectView = new Hktdc.Views.RuleFieldRemoveSelect({
          collection: self.collection,
          selectedRemove: self.selectedGradeTo,
          attributes: { field: self.fieldTo, name: self.fieldTo },
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

  Hktdc.Views.RuleFieldRemoveCommon = Backbone.View.extend({
    template: JST['app/scripts/templates/ruleFieldRemove.ejs'],

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
        var fieldName = '';
        switch (self.type) {
          case 'user':
            fieldName = 'UserId1';
            break;
          case 'level':
            fieldName = 'LevelNo';
            break;
          case 'group':
            fieldName = 'GroupID';
            break;
          default:
            fieldName = 'UserId1';
        };

        var gradeFromSelectView = new Hktdc.Views.RuleFieldRemoveSelect({
          collection: self.collection,
          selectedRemove: self.selected,
          attributes: { field: fieldName, name: fieldName },
          onSelected: self.onSelected
        });
        gradeFromSelectView.render();
        $('.commonContainer', self.el).html(gradeFromSelectView.el);
      } catch (e) {
        console.error(e);
      }
    }

  });

  Hktdc.Views.RuleFieldRemoveSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectGradeHandler'
    },
    initialize: function(props) {
      console.debug('[ views/rule.js ] initialize: RuleFieldRemoveSelect');
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
        self.$el.find('option[value="' + self.selectedRemove + '"]').prop('selected', true);
      });
    },

    selectGradeHandler: function(ev) {
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
      var ruleItemView = new Hktdc.Views.RuleFieldRemoveOption({
        model: model
      });
      this.$el.append(ruleItemView.el);
    }

  });

  Hktdc.Views.RuleFieldRemoveOption = Backbone.View.extend({
    template: JST['app/scripts/templates/removeOption.ejs'],
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
