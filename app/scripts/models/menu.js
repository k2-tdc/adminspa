/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.Menu = Backbone.Model.extend({

    url: function(page) {
      var pageQS = page ? '&page=' + page : '';
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/applications/authorized-pages?process=admin' + pageQS;
    },

    initialize: function() {},

    defaults: {
      Menu: [{
        Name: 'NEW REQUEST',
        Scount: 1,
        Mlink: '/#request',
        sumenu: null
      }, {
        Name: 'CHECK STATUS',
        Scount: 2,
        Mlink: '/#check_status',
        sumenu: null
      }, {
        Name: 'TO-DO LIST',
        Scount: 0,
        Mlink: '/#todo_list',
        sumenu: [{
          Name: 'ALL TASKS',
          Scount: 3,
          Mlink: '/#'
        }, {
          Name: 'APPROVAL TASKS',
          Scount: 3,
          Mlink: '/#'
        }]
      }, {
        Name: 'APPROVER',
        Scount: 5,
        Mlink: '/#',
        sumenu: [{
          Name: 'APPROVAL HISTORY',
          Scount: 3,
          Mlink: '/#'
        }]
      }, {
        Name: 'REPORT',
        Scount: 5,
        Mlink: '/#',
        sumenu: [{
          Name: 'USAGE REPORT',
          Scount: null,
          Mlink: '/#'
        }]
      }, {
        Name: 'HELP',
        Scount: 5,
        Mlink: '/#',
        sumenu: [{
          Name: 'Quick User Guide',
          Scount: null,
          Mlink: '/#user_guide'
        }]
      }],
      activeTab: false
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
