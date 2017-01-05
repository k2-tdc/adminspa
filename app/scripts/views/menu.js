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
      this.render();
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
        USERROLE: 'USERROLE',
        USERPERMISSION: 'USERPERMISSION',
        WORKERRULE: 'WORKERRULE'
      };

      try {
        var routeName = (route.indexOf('/') >= 0) ? routeMap[route.split('/')[0].toUpperCase()] : route.toUpperCase();
        var routeBase = routeName.split('?')[0] || 'EMAILTEMPLATE';
        setTimeout(function() {
          if ($('li[routename="' + routeBase + '"]')) {
            $('nav#menu').data('mmenu').setSelected($('li[routename="' + routeBase + '"]'));
          }
        });
      } catch (e) {
        // TODO: pop the error box
        console.log(e);
      }
    },

    onClickMenu: function(ev) {
      var $target = $(ev.target);

      if ($(ev.target).is('a')) {
        $target = $(ev.target).parent('li');
      }
      Hktdc.Dispatcher.trigger('reloadRoute', $target.attr('routename').toLowerCase());
    }

  });
})();
