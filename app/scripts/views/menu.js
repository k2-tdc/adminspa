/* global Hktdc, Backbone, JST, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.Menu = Backbone.View.extend({

    template: JST['app/scripts/templates/menu.ejs'],

    events: {
      'click li': 'onClickMenu'
    },

    initialize: function() {
      console.debug('[ menu.js ] - Initialize');
      var self = this;
      this.render();
      self.listenTo(Hktdc.Dispatcher, 'checkPagePermission', function(onSuccess) {
        var path = Backbone.history.getHash().split('?')[0].split('/')[0];
        self.checkPagePermission(path, function() {
          onSuccess();
        }, function() {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'Permission denied for accessing this page',
            title: 'error',
            type: 'error'
          });
        });
      });

      self.listenTo(Hktdc.Dispatcher, 'getMenu', function(opt) {
        var foundMenu = _.find(self.model.toJSON().Menu, function(menu) {
          return menu.Name === opt.name;
        });
        opt.onSuccess(foundMenu);
      });

      this.model.on('change:activeTab', this.setActiveMenu.bind(this));
    },

    render: function() {
      var rawMenu = this.model.toJSON();
      var menu = rawMenu.Menu;
      /* add PList and User into menu for mobile version */
      var PListMenu = {
        Mlink: '#',
        Name: 'PROCESS LIST',
        Route: '/#',
        RouteName: 'Process List',
        Scount: null,
        onlyMobileAndTablet: true,
        sumenu: _.map(rawMenu.PList, function(Process) {
          return {
            Mlink: '#',
            Name: Process.ProcessDisplayName,
            onlyMobileAndTablet: true,
            Route: '/#',
            Scount: null,
            RouteName: Process.ProcessName
          };
        })
      };
      // console.log('logouturl: ', Hktdc.Config.logoutURL);
      var UserMenu = {
        Mlink: '#',
        Name: rawMenu.User.UserName,
        Route: '/#',
        RouteName: rawMenu.User.UserID,
        Scount: null,
        onlyMobileAndTablet: true,
        sumenu: [{
          Mlink: '#delegation',
          Name: 'Delegation (under construct)',
          onlyMobileAndTablet: true,
          Route: '/#delegation',
          // Route: '/#',
          Scount: null,
          RouteName: 'delegation'
        }, {
          Mlink: '#logout',
          onlyMobileAndTablet: true,
          Name: 'Logout',
          Route: '/#logout',
          Scount: null,
          RouteName: 'logout'
        }]
      };
      menu.push(UserMenu);
      // console.log(menu);
      /* map the name, the server should return the route later */
      _.each(menu, function(raw) {
        if (raw.sumenu) {
          _.each(raw.sumenu, function(subMenuRaw) {
            var upperLodash = subMenuRaw.Mlink.trim().toUpperCase().replace('#', '');
            // var upperLodash = subMenuRaw.Name.trim().toUpperCase().replace(' ', '_');
            // console.log(upperLodash);
            subMenuRaw.Route = Hktdc.Config.projectPath + subMenuRaw.Mlink || '/#';
            subMenuRaw.RouteName = upperLodash || 'EMAILTEMPLATE';
          });
        } else {
          var upperLodash = raw.Mlink.trim().toUpperCase().replace('#', '');
          // var upperLodash = raw.Name.trim().toUpperCase().replace(' ', '_');
          raw.Route = Hktdc.Config.projectPath + raw.Mlink || '/#';
          raw.RouteName = upperLodash || 'EMAILTEMPLATE';
        }
        // console.log(upperLodash);
        // raw.Route = Hktdc.Config.projectPath + raw.Mlink || '/#';
        // raw.RouteName = upperLodash || 'EMAILTEMPLATE';
      });

      // console.log(menu);

      this.$el.html(this.template({
        data: menu
      }));

      $('nav#menu').mmenu({
        // options
        slidingSubmenus: false
          // offCanvas: false
      });
      // console.log($('nav#menu'));
      if ($(window).width() <= 991) {
        // if ($(window).width() <= 767) {
        $('nav#menu').data('mmenu').close();
      } else {
        $('nav#menu').data('mmenu').open();
      }

      // console.log('rendered menu.js');
    },

    setActiveMenu: function(currentRoute, route) {
      var routeMap = {
        EMAILTEMPLATE: 'EMAILTEMPLATE',
        EMAILPROFILE: 'EMAILPROFILE',
        USERROLE: 'USERROLE',
        PERMISSION: 'PERMISSION',
        ROLEMEMBER: 'ROLEMEMBER',
        'WORKER-RULE': 'WORKER-RULE'
      };

      try {
        var routeName = (route.indexOf('/') >= 0) ? routeMap[route.split('/')[0].toUpperCase()] : route.toUpperCase();
        var routeBase = routeName.split('?')[0] || 'EMAILPROFILE';
        setTimeout(function() {
          if ($('li[routename="' + routeBase + '"]')) {
            $('nav#menu').data('mmenu').setSelected($('li[routename="' + routeBase + '"]'));
          }
        });
      } catch (e) {
        // TODO: pop the error box
        console.error(e);
      }
    },

    checkPagePermission: function(path, onSuccess, onError) {
      var allMainMenu = _.filter(this.model.toJSON().Menu, function(menu) {
        return menu.MenuId;
      });
      var allSubMenu = _.flatten(_.pluck(_.reject(this.model.toJSON().Menu, function(menu) {
        return menu.MenuId;
      }), 'sumenu'));
      var allMenu = allMainMenu.concat(allSubMenu);
      var menuObj = _.find(allMenu, function(menu) {
        if (path === '') {
          return menu.RouteName.toLowerCase() === 'emailprofile';
        }
        return menu.RouteName.toLowerCase() === path;
      });

      if (!(menuObj && menuObj.MenuId)) {
        onError();
      } else {
        var pageGUID = menuObj.MenuId;
        var checkPagePermissionModel = new Hktdc.Models.Menu();
        checkPagePermissionModel.url = checkPagePermissionModel.url(pageGUID);
        checkPagePermissionModel.fetch({
          beforeSend: utils.setAuthHeader,
          success: function(model, data) {
            if (data.EmployeeNo) {
              onSuccess();
            } else {
              onError();
            }
          },
          error: function() {
            onError();
          }
        });
      }
    },

    onClickMenu: function(ev) {
      var $target = $(ev.target);
      if ($(ev.target).is('a')) {
        $target = $(ev.target).parent('li');
      }

      var pagePath = $target.attr('routename').toLowerCase();
      var currentRoute = Backbone.history.getHash();
      if (currentRoute.indexOf(pagePath) >= 0 && currentRoute.split('/').length === 1) {
        Hktdc.Dispatcher.trigger('reloadRoute', pagePath);
      } else {
        Backbone.history.navigate(pagePath, true);
      }
    }

  });
})();
