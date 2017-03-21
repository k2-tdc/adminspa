/* global Hktdc, Backbone, JST, _, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';
  Hktdc.Views.WorkerRuleProcessSelect = Backbone.View.extend({
    tagName: 'select',
    className: 'form-control',
    events: {
      'change': 'selectWorkerRuleProcessHandler'
    },
    initialize: function(props) {
      console.debug('[ views/workerRuleProcess.js ] initialize: WorkerRuleProcessSelect');
      _.bindAll(this, 'renderWorkerRuleProcessItem');
      _.extend(this, props);
      this.listenTo(this.collection, 'change', this.render);
      // this.render();
    },

    render: function() {
      // console.log(this.collection.toJSON());
      var self = this;
      this.collection.unshift({ProcessDisplayName: '-- Select --', ProcessID: 0});
      this.collection.each(this.renderWorkerRuleProcessItem);
      self.$el.prop('disabled', self.disable);
      setTimeout(function() {
        self.$el.find('option[value="' + self.selectedWorkerRuleProcess + '"]').prop('selected', true);
      });
    },

    selectWorkerRuleProcessHandler: function(ev) {
      if (this.onSelected) {
        var workerRuleProcessId = $(ev.target).find('option:selected').val();
        this.onSelected(_.find(this.collection.toJSON(), function(workerRuleProcess) {
          return String(workerRuleProcess.ProcessID) === String(workerRuleProcessId);
        }));
      }
    },

    renderWorkerRuleProcessItem: function(model) {
      var workerRuleProcessItemView = new Hktdc.Views.WorkerRuleProcessOption({
        model: model
      });
      this.$el.append(workerRuleProcessItemView.el);
    }

  });

  Hktdc.Views.WorkerRuleProcessOption = Backbone.View.extend({
    template: JST['app/scripts/templates/workerRuleProcessOption.ejs'],
    tagName: 'option',
    attributes: function() {
      return {
        value: String(this.model.toJSON().ProcessID)
      };
    },

    events: {},

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
