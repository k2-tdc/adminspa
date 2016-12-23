/* global Hktdc, Backbone, utils, _, $ */

Hktdc.Routers = Hktdc.Routers || {};

(function() {
  'use strict';

  Hktdc.Routers.Main = Backbone.Router.extend({
    routes: {
      '': 'emailTemplate',
      'emailtemplate': 'emailTemplate',
      'logout': 'logout'
    },

    initialize: function() {
      console.debug('[ mainRouter.js ] initialize');
      var footerView = new Hktdc.Views.Footer();
    },

    emailTemplate: function() {
      // console.log('crash');
      var emailTemplateModel = new Hktdc.Models.EmailTemplate({});
      emailTemplateModel.set({ mode: 'EMAIL TEMPLATE' });
      var emailTemplateView = new Hktdc.Views.EmailTemplate({
        model: emailTemplateModel
      });
      emailTemplateView.render();
      $('#mainContent').empty().html(emailTemplateView.el);

      var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
      var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
        collection: subheaderMenuListCollection,
        currentPageName: 'EMAIL TEMPLATE'
      });
      subheaderMenuListView.render();
      $('.subheader-menu-container').html(subheaderMenuListView.el);
    },

    logout: function() {
      var logoutView = new Hktdc.Views.Logout();
      $('#mainContent').html(logoutView.el);
    }
  });
})();
