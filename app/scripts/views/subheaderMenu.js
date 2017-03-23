/* global Hktdc, Backbone, JST, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.SubheaderMenuList = Backbone.View.extend({

    template: JST['app/scripts/templates/subheaderMenuList.ejs'],

    tagName: 'div',

    initialize: function(props) {
      _.extend(this, props);
      // _.bindAll()
      var self = this;
      this.listenTo(Hktdc.Dispatcher, 'updateSubMenu', function(newPageName) {
        self.currentPageName = newPageName;
        self.render();
        $('.subheader-menu-container').html(self.el);
      });
    },

    render: function() {
      // console.log(this.currentPageName);
      // console.log(this.template({title: this.currentPageName}));
      this.$el.html(this.template({
        title: this.currentPageName
      }));
    }

  });

  Hktdc.Views.SubheaderMenu = Backbone.View.extend({

    template: JST['app/scripts/templates/subheaderMenu.ejs'],

    tagName: 'li',

    events: {},

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });
})();
