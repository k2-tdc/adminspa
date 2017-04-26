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

    validate: function(attrs, options) {
      var errors = [];
      if (!attrs.ProcessId) {
        errors.push('ProcessId is required.');
      }
      if (!attrs.Code) {
        errors.push('Code is required.');
      }
      if (!attrs.Worker) {
        errors.push('Worker is required.');
      }
      if (!attrs.WorkerType) {
        errors.push('WorkerType is required.');
      }
      if (!attrs.Score) {
        errors.push('Score is required.');
      }

      if (errors.length) {
        return errors.join('<br>');
      }
      return false;
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
