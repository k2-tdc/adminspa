/* global Hktdc, Backbone, JST, $, _, utils, dialogMessage, dialogTitle */

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
      var rawMenu = this.model.toJSON();
      var menu = rawMenu.Menu || [];

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
          Mlink: '#logout',
          onlyMobileAndTablet: true,
          Name: 'Logout',
          Route: '/#logout',
          Scount: null,
          RouteName: 'logout'
        }]
      };
      if (!_.find(menu, function(m) {
        return m.Name === rawMenu.User.UserName;
      })) {
        menu.push(UserMenu);
      }

      this.render();
      self.listenTo(Hktdc.Dispatcher, 'checkPagePermission', function(onSuccess) {
        var path = Backbone.history.getHash().split('?')[0].split('/')[0];
        self.checkPagePermission(path, function() {
          onSuccess();
        }, function() {
          Hktdc.Dispatcher.trigger('openAlert', {
            title: dialogTitle.error,
            message: dialogMessage.menu.permission.error
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
      var menu = rawMenu.Menu || [];
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
        DELEGATION: 'DELEGATION',
        SHARING: 'SHARING',
        'WORKER-RULE': 'WORKER-RULE'
      };

      try {
        var routeName = (route.indexOf('/') >= 0) ? routeMap[route.split('/')[0].toUpperCase()] : route.toUpperCase();
        var routeBase = routeName.split('?')[0] || 'DELEGATION';
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
          return menu.RouteName.toLowerCase() === 'delegation';
        }
        return menu.RouteName.toLowerCase() === path;
      });

      if (!(menuObj && menuObj.MenuId)) {
        onError();
      } else {
        var pageGUID = menuObj.MenuId;
        var checkPagePermissionModel = new Hktdc.Models.Menu();
        checkPagePermissionModel.url = checkPagePermissionModel.url(pageGUID);
        var doFetch = function() {
          checkPagePermissionModel.fetch({
            beforeSend: utils.setAuthHeader,
            success: function(model, data) {
              if (data.EmployeeNo) {
                onSuccess();
              } else {
                onError();
              }
            },
            error: function(model, response) {
              utils.apiErrorHandling(response, {
                // 401: doFetch,
                unknownMessage: dialogMessage.menu.permission.error
              });
            }
          });
        };
        doFetch();
      }
    },

    onClickMenu: function(ev) {
      var $target = $(ev.target);
      if ($(ev.target).is('a')) {
        $target = $(ev.target).parent('li');
      }

      var pagePath = $target.attr('routename').toLowerCase().split('?')[0];
      var currentRoute = Backbone.history.getHash();
      var isParentPath = (currentRoute.indexOf('/') === -1);
      var containQueryString = currentRoute.indexOf('?') >= 0;
      if (currentRoute.indexOf(pagePath) >= 0 && isParentPath) {
        if (containQueryString) {
          Backbone.history.navigate(pagePath, true);
        } else {
          Backbone.history.loadUrl(pagePath, {
            trigger: true
          });
        }
      } else {
        Backbone.history.navigate(pagePath, true);
      }
    }

  });
})();
