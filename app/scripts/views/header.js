/* global Hktdc, Backbone, JST, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.Header = Backbone.View.extend({

    template: JST['app/scripts/templates/header.ejs'],

    // set auto bind to existing #header
    el: '#header',

    initialize: function(props) {
      // this.listenTo(this.model, 'change', this.render);
      var self = this;
      this.render();
      this.model.on('change:stepList', function(model, pList) {
        // console.log(newValue.toJSON());
        // console.log('changed: ', pList);
        var stepListView = new Hktdc.Views.StepList({
          collection: new Hktdc.Collections.Step(pList)
        });
        stepListView.render();
        $('.process-switch', self.el).append(stepListView.el);
      });

      // if (bowser.check({mobile: true})) {
      //   $('.process-switch', self.el).addClass('mobile');
      // } else {
      //   $('.process-switch', self.el).removeClass('mobile');
      // }
    },

    events: {
      'click .process-switch': 'changeZIndex'
    },

    changeZIndex: function() {
      // $('#menu').css({zIndex: 0});
      // $('#page').css({zIndex: 1});
    },

    render: function() {
      // var data = this.model.toJSON() || ;
      this.$el.html(this.template());
    }

  });

})();
