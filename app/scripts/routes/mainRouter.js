/* global Hktdc, Backbone, utils, _, $ */

Hktdc.Routers = Hktdc.Routers || {};

(function() {
  'use strict';

  Hktdc.Routers.Main = Backbone.Router.extend({
    routes: {
      '': 'emailTemplateList',
      'emailtemplate': 'emailTemplateList',
      'emailtemplate/new': 'editEmailTemplate',
      'emailtemplate/:templateId': 'editEmailTemplate',
      'logout': 'logout'
    },

    initialize: function() {
      console.debug('[ mainRouter.js ] initialize');
      var self = this;
      var footerView = new Hktdc.Views.Footer();
      self.listenTo(Hktdc.Dispatcher, 'reloadRoute', function(route) {
        console.debug('reloading route: ', route);
        Backbone.history.navigate(route, true);
        Backbone.history.loadUrl(route, {trigger: true});
      });
    },

    emailTemplateList: function() {
      try {
        var emailTemplateListModel = new Hktdc.Models.EmailTemplateList({});
        emailTemplateListModel.set({ mode: 'EMAIL TEMPLATE' });
        var emailTemplateListView = new Hktdc.Views.EmailTemplateList({
          model: emailTemplateListModel
        });
        emailTemplateListView.render();
        $('#mainContent').empty().html(emailTemplateListView.el);

        var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
        var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
          collection: subheaderMenuListCollection,
          currentPageName: 'EMAIL TEMPLATE'
        });
        subheaderMenuListView.render();
        $('.subheader-menu-container').html(subheaderMenuListView.el);
      } catch (e) {
        console.error(e);
      }
    },

    editEmailTemplate: function(tId) {
      console.log('edit email template');
      try {
        $('#mainContent').addClass('compress');

        var emailTemplateModel = new Hktdc.Models.EmailTemplate({
          mode: 'EMAIL TEMPLATE'
        });
        var onSuccess = function() {
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
        };
        if (tId) {
          emailTemplateModel.url = emailTemplateModel.url(tId);
          emailTemplateModel.fetch({
            success: function() {
              onSuccess();
            },
            error: function(model, err) {
              throw err;
            }
          });
        } else {
          onSuccess();
        }
      } catch (e) {
        console.error(e);
      }
    },

    logout: function() {
      var logoutView = new Hktdc.Views.Logout();
      $('#mainContent').html(logoutView.el);
    }
  });
})();
