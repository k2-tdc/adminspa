/* global Hktdc, Backbone, utils, _, $, Q, NProgress, alert, dialogTitle, sprintf, dialogMessage */

window.Hktdc = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Dispatcher: _.extend({}, Backbone.Events),
  Config: {
    procId: 1,
    isAdmin: false,
    isAppWebView: false,
    apiURL: '',
    refreshTokenInterval: 2,  // in minutes
    gettingToken: false,
    accessToken: '',
    refreshToken: '',
    OAuthLoginUrl: '',
    OAuthGetTokenUrl: '',
    logoutURL: '',
    needAuthHeader: false,
    projectPath: '',
    SPAHomeUrl: '',
    userID: '',
    userName: '',
    RuleCode: 'IT0008;IT0009',
    environments: {
      // local host
      localDev: {
        api: {
          protocol: 'http',
          host: 'localhost',
          port: '9999',
          base: '/api'
        },
        needAuthHeader: false,
        logoutURL: 'https://corpsso.tdc.org.hk/adfs/ls/?wa=wsignout1.0',
        projectPath: '/',
        SPAHomePath: '/'
      },
      // REAL UAT VM - dev test
      uat: {
        api: {
          protocol: 'https',
          host: 'api.uat.hktdc.org',
          base: '/workflow'
        },
        needAuthHeader: true,
        projectPath: '/vicosyscommon/',
        SPAHomePath: '/vicosyscommon/',
        SPADomain: 'https://workflowuat.tdc.org.hk',
        logoutURL: 'https://corpsso.tdc.org.hk/adfs/ls/?wa=wsignout1.0',
        OAuthLoginPath: '/auth/oauth2/login',
        OAuthGetTokenPath: '/auth/oauth2/token',
        OAuthGetUserIDPath: '/auth/oauth2/tokeninfo'
      }
    }

  },

  init: function(env) {
    'use strict';
    console.debug('[ main.js ] - Initialize');
    var utils = window.utils;
    var Hktdc = window.Hktdc;
    Hktdc.Config.environment = env;
    try {
      var self = this;
      this.globalConfig(env);
      if (env === 'uat' || env === 'chsw') {
        /* check auth */
        utils.getAccessToken(function(accessToken) {
          console.debug('[ main.js ] - setting up application...');
          /* if auth ed */
          Hktdc.Config.accessToken = accessToken;
          /* get user id by access token */
          utils.getLoginUserIdByToken(accessToken, function(userID) {
            /* initialize the application */
            Hktdc.Config.userID = userID;

            /* done user profile config */
            self.setupMasterPageComponent(function(menuModel) {
              var mainRouter = new self.Routers.Main();
              mainRouter.on('route', function(route, params) {
                // console.log(route);
                menuModel.set('activeTab', Backbone.history.getHash());
              });
              Backbone.history.start();
            });
          }, function(error) {
            console.log('Error on getting userID', error);
          });
        }, function(error) {
          /* else */
          console.error('OAuth Error', error);
          alert('Error on getting the access token on init. Redirect to login page.');
          window.location.href = window.Hktdc.Config.OAuthLoginUrl + '?redirect_uri=' + encodeURIComponent(window.location.href);
        });
      } else {
        Hktdc.Config.userID = 'aachen';
        // userName set in menu
        // Hktdc.Config.userName = 'Aaron Chen (ITS - Testing account)';
        self.setupMasterPageComponent(function(menuModel) {
          var mainRouter = new self.Routers.Main();
          mainRouter.on('route', function(route, params) {
            menuModel.set('activeTab', Backbone.history.getHash());
          });

          Backbone.history.start();
        });
      }
    } catch (e) {
      console.log(e);
      console.log('init application error!', e);
    }
  },

  setupMasterPageComponent: function(onSuccess) {
    var Hktdc = window.Hktdc;
    var utils = window.utils;
    var self = this;
    var headerModel = new Hktdc.Models.Header();
    var footerModel = new Hktdc.Models.Footer();

    // TODO: webview custom user-agent
    Hktdc.Config.isAppWebView = utils.getParameterByName('intraapp') && utils.getParameterByName('intraapp') === 'yes';
    // Hktdc.Config.isAppWebView = true;
    // Hktdc.Config.isAppWebView = false;

    var headerView = new Hktdc.Views.Header({
      model: headerModel
    });
    var footerView = new Hktdc.Views.Footer({
      model: footerModel
    });

    if (Hktdc.Config.isAppWebView) {
      $('body').addClass('app-web-view');

      // application switch
      $('#header_main .nav-header-main').addClass('app-web-view');

      // web view show current page
      $('#header_main .subheader-menu-container').addClass('app-web-view');

      // tdc logo
      $('#header').addClass('app-web-view');

      // content subheader
      $('#content').addClass('app-web-view');
    }

    this.initAlertDialog();
    this.initConfirmDialog();

    this.loadMenu()
      .then(function(menuModel) {
        var menu = menuModel.toJSON();
        Hktdc.Config.userName = menu.UserName;
        Hktdc.Config.employeeID = menu.EmployeeNo;
        Hktdc.Config.isAdmin = menu.IsAdmin;
        menuModel.set({
          Menu: menu.Menu,
          PList: menu.PList,
          User: { UserName: menu.UserName, UserID: menu.UserID }
        });

        var menuView = new Hktdc.Views.Menu({
          model: menuModel
        });

        $('#menu').html(menuView.el);
        menuView.listenTo(window.Hktdc.Dispatcher, 'reloadMenu', function() {
          self.loadMenu()
            .then(function(newMenuModel) {
              menuView.remove();
              var newMenu = newMenuModel.toJSON();
              newMenuModel.set({
                Menu: newMenu.Menu,
                PList: newMenu.PList,
                User: { UserName: newMenu.UserName, UserID: newMenu.UserID }
              });
              var newMenuView = new Hktdc.Views.Menu({
                model: newMenuModel
              });
              newMenuModel.set('activeTab', Backbone.history.getHash());
              $('#menu').html(newMenuView.el);
            })
            .catch(function(error) {
              Hktdc.Dispatcher.trigger('openAlert', {
                title: dialogTitle.error,
                message: sprintf(dialogMessage.common.error.system, { code: error.request_id, msg: error.error })
              });
            });
        });
        // console.log(Hktdc.Config.environments[Hktdc.Config.environment].SPAHomePath);
        var userView = new Hktdc.Views.User({
          model: new Hktdc.Models.User({
            UserName: menu.UserName,
            UserID: menu.UserID,
            HomePath: Hktdc.Config.environments[Hktdc.Config.environment].SPAHomePath
          })
        });

        // headerModel.set({
        //   stepList: menuModel.toJSON().PList
        // });
        onSuccess(menuModel);
      })
      .catch(function(error) {
        Hktdc.Dispatcher.trigger('openAlert', {
          title: dialogTitle.error,
          message: sprintf(dialogMessage.common.error.system, { code: error.request_id, msg: error.error })
        });
      });
  },

  loadMenu: function() {
    var deferred = Q.defer();
    var menuModel = new Hktdc.Models.Menu();
    var doFetch = function() {
      menuModel.fetch({
        beforeSend: utils.setAuthHeader,
        success: function(menuModel) {
          // menuModel.set('activeTab', Backbone.history.getHash());
          // onSuccess(menuModel);
          deferred.resolve(menuModel);
        },
        error: function(model, response) {
          utils.apiErrorHandling(response, {
            // 401: doFetch,
            unknownMessage: dialogMessage.menu.load.error
          });
        }
      });
    };
    doFetch();
    return deferred.promise;
  },

  initAlertDialog: function() {
    var alertDialogView = new Hktdc.Views.AlertDialog({
      model: new Hktdc.Models.AlertDialog()
    });

    $('body').append(alertDialogView);

    alertDialogView.listenTo(window.Hktdc.Dispatcher, 'openAlert', function(data) {
      alertDialogView.model.set({
        message: data.message,
        title: data.title,
        type: data.type,
        open: true
      });
    });
  },

  initConfirmDialog: function() {
    var confirmDialogView = new Hktdc.Views.ConfirmDialog({
      model: new Hktdc.Models.ConfirmDialog()
    });

    $('body').append(confirmDialogView);

    confirmDialogView.listenTo(window.Hktdc.Dispatcher, 'openConfirm', function(data) {
      confirmDialogView.model.set({
        message: data.message,
        title: data.title,
        onConfirm: data.onConfirm,
        open: true
      });
    });
    confirmDialogView.listenTo(window.Hktdc.Dispatcher, 'closeConfirm', function(data) {
      confirmDialogView.model.set({
        open: false
      });
    });
    confirmDialogView.listenTo(window.Hktdc.Dispatcher, 'toggleLockButton', function(isLock) {
      confirmDialogView.model.set({
        lockConfirmBtn: isLock
      });
    });
  },

  globalConfig: function(env) {
    utils.setURL(env);
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;
    NProgress.configure({
      parent: '#page',
      showSpinner: false
    });

    // below is for sorting date
    $.fn.dataTable.moment('DD MMM YYYY');

    $(document).ajaxStart(function(event) {
      NProgress.start();
    });
    $(document).ajaxComplete(function() {
      NProgress.done();
      // NProgress.remove();
    });

    var originalFetch = Backbone.Model.prototype.fetch;
    Backbone.Model.prototype.fetch = function(options) {
      var self = this;
      if (env === 'uat' || env === 'chsw') {
        return utils.getAccessToken(function() {
          originalFetch.call(self, options);
        }, function() {
          console.error('can\'t get access token fro API gateway, redirect to login page');
          var oauthUrl = window.Hktdc.Config.OAuthLoginUrl + '?redirect_uri=' + encodeURIComponent(window.location.href);
          window.location.href = oauthUrl;
        });
      } else {
        // Backbone.Model.prototype.fetch(options);
        return originalFetch.call(this, options);
      }
    };

    var originalSave = Backbone.Model.prototype.save;
    Backbone.Model.prototype.save = function(attrs, options) {
      var self = this;
      if (env === 'uat' || env === 'chsw') {
        if (!options) { options = {}; }
        return utils.getAccessToken(function() {
          originalSave.call(self, attrs, options);
        }, function() {
          console.error('can\'t get access token fro API gateway, redirect to login page');
          var oauthUrl = window.Hktdc.Config.OAuthLoginUrl + '?redirect_uri=' + encodeURIComponent(window.location.href);
          window.location.href = oauthUrl;
        });
      } else {
        return originalSave.call(this, attrs, options);
      }
    };

  }

};

$(document).ready(function() {
  'use strict';
  //Hktdc.init('localDev');
  Hktdc.init('uat');
});
