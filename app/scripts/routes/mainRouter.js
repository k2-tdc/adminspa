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
      'emailprofile': 'emailProfileList',
      'emailprofile/new': 'editEmailProfile',
      'emailprofile/:templateId': 'editEmailProfile',
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
        emailTemplateListModel.set({
          mode: 'EMAIL TEMPLATE',
          processId: utils.getParameterByName('processId'),
          step: utils.getParameterByName('step')
        });
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
            beforeSend: utils.setAuthHeader,
            success: function() {
              emailTemplateModel.set({
                TemplateId: tId,
                ProcessId: emailTemplateModel.toJSON().ProcessID,
                StepId: emailTemplateModel.toJSON().ActivityGroupID
              });
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

    emailProfileList: function() {
      try {
        var emailProfileListModel = new Hktdc.Models.EmailProfileList({});
        emailProfileListModel.set({
          mode: 'EMAIL PROFILE',
          profile: utils.getParameterByName('profile'),
          showSearch: Hktdc.Config.isAdmin
        });
        var emailProfileListView = new Hktdc.Views.EmailProfileList({
          model: emailProfileListModel
        });
        emailProfileListView.render();
        $('#mainContent').empty().html(emailProfileListView.el);

        var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
        var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
          collection: subheaderMenuListCollection,
          currentPageName: 'EMAIL PROFILE'
        });
        subheaderMenuListView.render();
        $('.subheader-menu-container').html(subheaderMenuListView.el);
      } catch (e) {
        console.error(e);
      }
    },

    editEmailProfile: function(profileId) {
      // console.log('edit email template');
      try {
        $('#mainContent').addClass('compress');

        var emailProfileModel = new Hktdc.Models.EmailProfile({
          mode: 'EMAIL PROFILE'
        });
        var onSuccess = function() {
          var emailProfileView = new Hktdc.Views.EmailProfile({
            model: emailProfileModel
          });
          emailProfileView.render();
          $('#mainContent').empty().html(emailProfileView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'EMAIL PROFILE'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        };

        if (profileId) {
          emailProfileModel.url = emailProfileModel.url(profileId);
          emailProfileModel.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              var dayOfWeek = [];
              if (emailProfileModel.toJSON().WeekDay1) {
                dayOfWeek.push('1');
              }
              if (emailProfileModel.toJSON().WeekDay2) {
                dayOfWeek.push('2');
              }
              if (emailProfileModel.toJSON().WeekDay3) {
                dayOfWeek.push('3');
              }
              if (emailProfileModel.toJSON().WeekDay4) {
                dayOfWeek.push('4');
              }
              if (emailProfileModel.toJSON().WeekDay5) {
                dayOfWeek.push('5');
              }
              if (emailProfileModel.toJSON().WeekDay6) {
                dayOfWeek.push('6');
              }
              if (emailProfileModel.toJSON().WeekDay7) {
                dayOfWeek.push('7');
              }
              emailProfileModel.set({
                ProfileId: emailProfileModel.toJSON().EmailNotificationProfileID,
                ProcessId: emailProfileModel.toJSON().ProcessID,
                StepId: emailProfileModel.toJSON().StepID,
                TimeSlot: emailProfileModel.toJSON().TimeSlot,
                UserId: emailProfileModel.toJSON().UserID || Hktdc.Config.userID,
                DayOfWeek: dayOfWeek,
                showDelete: true
              });
              onSuccess();
            },
            error: function(model, err) {
              throw err;
            }
          });
        } else {
          emailProfileModel.set({
            UserId: Hktdc.Config.userID
          });
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
