/* global Hktdc, Backbone, _, validateMessage */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.WorkerRule = Backbone.Model.extend({

    url: function(workerRuleId) {
      var path = workerRuleId ? '/' + workerRuleId : '';
      return Hktdc.Config.apiURL + '/worker-rules' + path;
    },

    initialize: function() {
      var self = this;
      this.isInvalid = {
        ProcessId: function() {
          return (self.attributes.ProcessId && String(self.attributes.ProcessId) !== '0') ? false : validateMessage.required;
        },
        Code: function() {
          return (self.attributes.Code) ? false : validateMessage.required;
        },
        Worker: function() {
          return (String(self.attributes.Worker) !== '0' && !!self.attributes.Worker) ? false : validateMessage.required;
        },
        WorkerType: function() {
          return (String(self.attributes.WorkerType) !== '0' && !!self.attributes.WorkerType) ? false : validateMessage.required;
        },
        Score: function() {
          return (String(self.attributes.Score) !== '0' && !!self.attributes.Score) ? false : validateMessage.required;
        }
      };
    },

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
      saveType: '',

      // for search
      WorkerId: '',
      UserId: ''

    },

    validate: function(attrs, options) {
      // *** valid => return false;
      // *** invalid => return true;

      // for single validate
      if (options.field && !_.isArray(options.field)) {
        if (this.isInvalid[options.field] && this.isInvalid[options.field]()) {
          console.log('invalid: ', options.field, '>> ', this.isInvalid[options.field]());
          options.onInvalid({
            message: this.isInvalid[options.field]()
          });
          return true;
        } else {
          this.trigger('valid', {
            field: options.field
          });
          return false;
        }

        // validate the whole form
      } else {
        return !(
          !this.isInvalid.ProcessId() &&
          !this.isInvalid.Code() &&
          !this.isInvalid.Worker() &&
          !this.isInvalid.WorkerType() &&
          !this.isInvalid.Score()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
