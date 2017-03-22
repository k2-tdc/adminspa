/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.WorkerRule = Backbone.Model.extend({

    url: function(workerRuleId) {
      var path = workerRuleId ? '/' + workerRuleId : '';
      return Hktdc.Config.apiURL + '/worker-rule' + path;
    },

    initialize: function() {},

    defaults: {
      WorkerRuleId: '',
      ProcessName: '',
      ProcessDisplayName: '',
      Code: '',
      Worker: '',
      WorkerType: '',
      Summary: '',
      Remark: '',
      Score: '',

      showRules: false,
      saveType: ''

    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });

})();
