/* global Hktdc, Backbone, JST, $ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.RuleFieldCheckbox = Backbone.View.extend({

    template: JST['app/scripts/templates/ruleFieldCheckbox.ejs'],

    tagName: 'div',

    events: {
      'change .criteria': 'onChangeCriteriaCheckbox'
    },

    initialize: function(options) {
      // this.listenTo(this.model, 'change', this.render);
      _.extend(this, options);
    },

    render: function() {
      this.$el.html(this.template({ criteria: this.criteria }));
    },

    onChangeCriteriaCheckbox: function() {
      var selectedCriteria = [];
      $('.criteria:checked', this.el).each(function(cb) {
        selectedCriteria.push($(this).val());
      });
      this.onChange(selectedCriteria);
    }

  });
})();
