/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveWorkerRuleMember = Backbone.Model.extend({

    url: function(code) {
      return Hktdc.Config.apiURL + '/worker-rule/criteria/' + code;
    },

    initialize: function() {},

    defaults: {
      WorkerRuleId: '',
      WorkerSettingId: '',
      Rule: '',
      Nature: '',
      Score: '',
      UserId: '',
      UserId1: '',
      UserId2: '',
      LevelNo: '',
      GroupID: '',
      GroupID1: '',
      Grade1: '',
      Grade2: '',
      Team: '',
      TeamFilter: '',
      Priority: '',
      Grade3: '',
      Grade4: '',
      Department: '',
      DateFrom: '',
      DateTo: '',
      Criteria: '',
      Remark: ''
    },

    validate: function(attrs, options) {},

    parse: function(response, options) {
      return response;
    }
  });
})();
