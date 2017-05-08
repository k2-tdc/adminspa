/* global Hktdc, _, Cookies, $, dialogTitle, dialogMessage, sprintf */
/* all application level methods should be placed here */

window.utils = {

  setURL: function(env) {
    // console.log(env);
    var envConfig = window.Hktdc.Config.environments[env || 'localDev'];
    var host = envConfig.api.host;
    var port = (envConfig.api.port) ? ':' + envConfig.api.port : '';
    var base = envConfig.api.base;
    var protocol = envConfig.api.protocol || 'http';
    Hktdc.Config.apiURL = protocol + '://' + host + port + base;

    // Hktdc.Config.SPADomain = envConfig.SPADomain;
    Hktdc.Config.projectPath = envConfig.projectPath;
    Hktdc.Config.OAuthLoginUrl = envConfig.SPADomain + envConfig.OAuthLoginPath;
    Hktdc.Config.OAuthGetTokenUrl = envConfig.SPADomain + envConfig.OAuthGetTokenPath;
    Hktdc.Config.SPAHomeUrl = envConfig.SPADomain + envConfig.SPAHomePath;
    Hktdc.Config.OAuthGetUserIDURL = envConfig.SPADomain + envConfig.OAuthGetUserIDPath;
    Hktdc.Config.needAuthHeader = envConfig.needAuthHeader;
    Hktdc.Config.logoutURL = envConfig.logoutURL;
    // console.log(Hktdc.Config);
    // console.log(Hktdc.Config.apiURL);
  },

  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  parseQueryString: function(queryString) {
    var params = {};
    if (queryString) {
      _.each(
        _.map(decodeURI(queryString).split(/&/g), function(el, i) {
          var aux = el.split('='),
            o = {};
          if (aux.length >= 1) {
            var val = undefined;
            if (aux.length === 2)
              val = aux[1];
            o[aux[0]] = val;
          }
          return o;
        }),
        function(o) {
          _.extend(params, o);
        }
      );
    }
    return params;
  },

  getQueryString: function(obj, notAllowEmpty) {
    var queryPart = _.map(obj, function(val, key) {
      var value;
      if (notAllowEmpty) {
        // console.log('notAllowEmpty');
        if (!val || val === '0') {
          // console.log('no value');
          return '';
        }
        // console.log('have value');
        return key + '=' + val;
      } else {
        value = (_.isNull(val)) ? '' : val;
        return key + '=' + value;
      }
    });
    if (_.compact(queryPart).length) {
      return '?' + _.compact(queryPart).join('&');
    }
    return '';
  },

  setAuthHeader: function(xhr) {
    if (Hktdc.Config.needAuthHeader) {
      if (Cookies.get('ACCESS-TOKEN')) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('ACCESS-TOKEN'));
      // } else {
      //   window.location.href = window.Hktdc.Config.OAuthLoginUrl + '?redirect_uri=' + encodeURI(window.location.href);
      }
    }
  },

  errorHandling: function(response, handler) {
    // return format: { request_id: xxx, error: xxxxxxx }
    var returnObj;
    try {
      var responseObj = JSON.parse(response.responseText);
      returnObj = (responseObj.request_id)
        ? responseObj
        : {
          request_id: false,
          error: sprintf(dialogMessage.common.error.unknown, handler.unknown)
        };
    } catch (e) {
      returnObj = {
        request_id: false,
        error: sprintf(dialogMessage.common.error.unknown, handler.unknown)
      };
    }
    if (response.status === 401) {
      this.getAccessToken(function() {
        handler[401]();
      }, function(err) {
        returnObj.error = err;
        handler.error(returnObj);
      });
    } else if (response.status === 500) {
      handler.error(returnObj);
    } else {
      handler.error(returnObj);
    }
  },

  toggleInvalidMessage: function(viewElement, field, message, isShow) {
    var $target = $('[field=' + field + ']', viewElement);
    var $errorContainer = ($target.parents('.container').find('.error-message').length)
      ? $target.parents('.container').find('.error-message')
      : $target.parents().siblings('.error-message');
    if (isShow) {
      $errorContainer.removeClass('hidden');
      $errorContainer.html(message);
      $target.addClass('error-input');
    } else {
      $errorContainer.addClass('hidden');
      $errorContainer.empty();
      $target.removeClass('error-input');
    }
  },

  makeId: function(length) {
    var text = '';
    length = length || 10;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  apiErrorHandling: function(options) {
    // options: response, apiRequest, onError, apiName
    if (options.response.status === 401) {
      this.getAccessToken(function() {
        options.apiRequest();
      }, function(err) {
        options.onError({
          error: err,
          request_id: false
        });
      });
    } else {
      try {
        options.onError(JSON.parse(options.response.responseText));
      } catch (e) {
        console.error(options.response.responseText);
        options.onError({
          error: options.apiName + ' error',
          request_id: false
        });
      }
    }
  },

  /* =============================================>>>>>
  = OAuth Login =
  ===============================================>>>>> */
  createCORSRequest: function(method, url) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
      alert('IE 8/9');
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  },

  getAccessToken: function(onSuccess, onError) {
    var defaultError = function() {
      Hktdc.Dispatcher.trigger('openAlert', {
        title: dialogTitle.error,
        message: dialogMessage.common.auth.accessToken
      });
    };

    if (!(Hktdc.Config.environment === 'uat' || Hktdc.Config.environment === 'chsw')) {
      var msg = 'in local env';
      if (onError && typeof onError === 'function') {
        onError(msg);
      } else {
        defaultError(msg);
      }
      return;
    }

    var self = this;
    var accessToken = '';
    var refreshToken = Cookies.get('REFRESH-TOKEN');

    var oauthUrl = window.Hktdc.Config.OAuthLoginUrl + '?redirect_uri=' + encodeURI(window.location.href);
    // var oauthUrl = window.Hktdc.Config.OAuthLoginUrl + '?redirect_uri=' + encodeURI(window.Hktdc.Config.SPAHomeUrl);

    /* if no refresh token */
    if (!refreshToken) {

      /* Initiate OAuth login flow */
      window.location.href = oauthUrl;

    /* else have refresh token */
    } else {
      accessToken = Cookies.get('ACCESS-TOKEN');
      console.log('access token:' + accessToken);

      /* if access token is invalid: no accessToken OR accessToken is expiried */
      if (!accessToken) {
        console.log('OAuth refresh token.');
        /* Send GET request to token endpoint for getting access token through AJAX */

        var xhr = self.createCORSRequest('GET', window.Hktdc.Config.OAuthGetTokenUrl);
        if (!xhr) {
          alert('Please use another browser that supports CORS.');
          window.location.href = oauthUrl;
          return false;
        }
        xhr.setRequestHeader('X-REFRESH-TOKEN', refreshToken);

        // Response handlers.
        xhr.onload = function() {
          accessToken = Cookies.get('ACCESS-TOKEN');
          console.log('Refreshed Token, new access token:' + accessToken);
          if (accessToken) {
            onSuccess(accessToken);
          } else {
            var msg = 'Access token empty after refresh.';
            if (onError && typeof onError === 'function') {
              onError(msg);
            } else {
              defaultError(msg);
            }
          }
        };

        xhr.onerror = function() {
          if (onError && typeof onError === 'function') {
            var msg = 'Can\'t get new access token by refresh token.';
            onError(msg);
          } else {
            defaultError(msg);
          }
        };

        xhr.send();

      /* access token is valid */
      } else {
        console.debug('use existing token: ', accessToken);
        onSuccess(accessToken);
      }
    }
  },

  getLoginUserIdByToken: function(accessToken, onSuccess, onError) {
    console.log('getLoginUserIdByToken: ', accessToken);
    var Userid = '';
    var self = this;
    var url = window.Hktdc.Config.OAuthGetUserIDURL + '?access_token=' + accessToken;
    var xhr = self.createCORSRequest('GET', url);
    if (!xhr) {
      onError('CORS not supported');
      return;
    }
    // xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);

    // Response handlers.
    xhr.onload = function() {
      var text = xhr.responseText;
      var objLoginUser = JSON.parse(text);
      // console.log(JSON.stringify(objLoginUsers, null, 2));
      Userid = objLoginUser.user_id;

      onSuccess(Userid);
      // alert(Userid);
      // return objLoginUser;
    };

    xhr.onerror = function() {
      var text = xhr.responseText;
      onError(text);
    };
    xhr.async = false;
    xhr.send();
  }

  /* = End of OAuth Login = */
  /* =============================================<<<<< */

};
