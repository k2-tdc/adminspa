/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.ProcessItem = Backbone.View.extend({

    template: JST['app/scripts/templates/processItem.ejs'],

    tagName: 'li',

    events: {},

    initialize: function(props) {
      _.extend(this, props);
      this.render();
    },

    render: function() {
      // console.log(this.selectedProcess);
      // console.log(this.model.toJSON());
      if (this.tagName === 'option') {
        this.$el.attr('value', this.model.toJSON().ProcessID);
        if (String(this.parentModel.toJSON().ProId) === String(this.model.toJSON().ProcessID)) {
          this.$el.prop('selected', true);
        }
      }
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  Hktdc.Views.ProcessList = Backbone.View.extend({

    tagName: 'ul',
    className: 'dropdown-menu ulnav-header-main',
    events: {
      'change': 'selectProcessItemHandler'
    },

    initialize: function(props) {
      var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderProcessItem');
      // console.log(this.collection.toJSON());
      // this.listenTo(this.model, 'change', this.render);
      if (this.tagName === 'select') {
        this.parentModel.on('change:ProId', function() {
          self.$el.empty();
          self.render();
        });
      }
    },

    selectProcessItemHandler: function(ev) {
      this.parentModel.set({
        ProId: $(ev.target).val()
      });
    },

    renderProcessItem: function(model) {
      var itemViewTagName = 'li';
      if (this.tagName === 'select') {
        itemViewTagName = 'option';
        model.set({
          type: 'option'
        });
      }
      var processItemView = new Hktdc.Views.ProcessItem({
        model: model,
        tagName: itemViewTagName,
        parentModel: this.parentModel
      });
      // console.log(processItemView.el);
      this.$el.append(processItemView.el);
    },

    render: function() {
      if (this.tagName === 'select') {
        this.$el.prepend('<option value="" >--Select--</option>');
      }
      // console.log(this.to);
      this.collection.each(this.renderProcessItem);
    }

  });

  Hktdc.Views.ProcessSelect = Backbone.View.extend({

    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectProcessItemHandler'
    },

    initialize: function(props) {
      console.debug('[ views/process.js ] initialize: ProcessSelect');
      // var self = this;
      _.extend(this, props);
      _.bindAll(this, 'renderProcessItem');
      this.listenTo(this.collection, 'change', this.render);
    },

    render: function() {
      this.collection.unshift({Name: '-- Select --'});
      this.collection.each(this.renderProcessItem);
    },

    selectProcessItemHandler: function(ev) {},

    renderProcessItem: function(model) {
      var processItemView = new Hktdc.Views.ProcessOption({
        model: model
        // parentModel: this.parentModel
      });
      this.$el.append(processItemView.el);
    }
  });

  Hktdc.Views.ProcessOption = Backbone.View.extend({
    template: JST['app/scripts/templates/processOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: this.model.toJSON().ProcessName
      };
    },

    events: {},

    initialize: function() {
      console.debug('[ views/process.js ] initialize process option');
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
