/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveWorkerRule = Backbone.Model.extend({

    url: function(roleId) {
      var roleIdPath = (roleId) ? '/' + roleId : '';
      return Hktdc.Config.apiURL + '/worker-rules' + roleIdPath;
    },

    initialize: function() {},

    defaults: {
      ProcessId: '',
      Code: '',
      Worker: '',
      WorkerType: '',
      Summary: '',
      Remark: '',
      Score: 0
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
