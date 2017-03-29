/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.StepItem = Backbone.View.extend({

    template: JST['app/scripts/templates/stepItem.ejs'],

    tagName: 'li',

    events: {},

    initialize: function(props) {
      _.extend(this, props);
      this.render();
    },

    render: function() {
      // console.log(this.selectedStep);
      // console.log(this.model.toJSON());
      if (this.tagName === 'option') {
        this.$el.attr('value', this.model.toJSON().StepID);
        if (String(this.parentModel.toJSON().ProId) === String(this.model.toJSON().StepID)) {
          this.$el.prop('selected', true);
        }
      }
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  Hktdc.Views.StepList = Backbone.View.extend({

    tagName: 'ul',
    className: 'dropdown-menu ulnav-header-main',
    events: {
      'change': 'selectStepItemHandler'
    },

    initialize: function(props) {
      var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderStepItem');
      // console.log(this.collection.toJSON());
      // this.listenTo(this.model, 'change', this.render);
      if (this.tagName === 'select') {
        this.parentModel.on('change:ProId', function() {
          self.$el.empty();
          self.render();
        });
      }
    },

    selectStepItemHandler: function(ev) {
      this.parentModel.set({
        ProId: $(ev.target).val()
      });
    },

    renderStepItem: function(model) {
      var itemViewTagName = 'li';
      if (this.tagName === 'select') {
        itemViewTagName = 'option';
        model.set({
          type: 'option'
        });
      }
      var stepItemView = new Hktdc.Views.StepItem({
        model: model,
        tagName: itemViewTagName,
        parentModel: this.parentModel
      });
      // console.log(stepItemView.el);
      this.$el.append(stepItemView.el);
    },

    render: function() {
      if (this.tagName === 'select') {
        this.$el.prepend('<option value="" >--Select--</option>');
      }
      // console.log(this.to);
      this.collection.each(this.renderStepItem);
    }

  });

  Hktdc.Views.StepSelect = Backbone.View.extend({

    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectStepItemHandler'
    },

    initialize: function(props) {
      console.debug('[ views/step.js ] initialize: StepSelect');
      // var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderStepItem');
      // console.log(this.collection);
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      try {
        this.collection.unshift({
          StepDisplayName: '-- Select --',
          StepID: 0
        });
        this.collection.each(this.renderStepItem);
        this.$el.prop('disabled', this.disabled);
      } catch (e) {
        console.error(e);
      }
    },

    selectStepItemHandler: function(ev) {
      if (this.onSelected) {
        this.onSelected($(ev.target).find('option:selected').val());
      }
    },

    renderStepItem: function(model) {
      var self = this;
      var stepItemView = new Hktdc.Views.StepOption({
        model: model
      });
      this.$el.append(stepItemView.el);
      setTimeout(function() {
        // console.log(self.selectedStep);
        self.$el.find('option[value="' + self.selectedStep + '"]').prop('selected', true);
      });
    }
  });

  Hktdc.Views.StepOption = Backbone.View.extend({
    template: JST['app/scripts/templates/stepOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().StepID)
      };
    },

    events: {},

    initialize: function() {
      console.debug('[ views/step.js ] initialize step option');
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
