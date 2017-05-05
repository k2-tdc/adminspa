/* global Hktdc, Backbone, _, validateMessage */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.EmailTemplate = Backbone.Model.extend({

    initialize: function() {
      var self = this;
      this.isInvalid = {
        ProcessId: function() {
          return (String(self.attributes.ProcessId) !== '0' && !!self.attributes.ProcessId) ? false : validateMessage.required;
        },
        StepId: function() {
          return (String(self.attributes.StepId) !== '0' && !!self.attributes.StepId) ? false : validateMessage.required;
        },
        Subject: function() {
          return (self.attributes.Subject) ? false : validateMessage.required;
        },
        Body: function() {
          return (self.attributes.Body) ? false : validateMessage.required;
        }
      };
    },

    url: function(tId) {
      return Hktdc.Config.apiURL + '/email-templates/' + tId;
    },

    defaults: {
      TemplateId: 0,
      ProcessId: 0,
      StepId: 0,
      Subject: '',
      Body: '',
      Enabled: true,

      processCollection: null,
      stepCollection: null
    },

    validate: function(attrs, options) {
      // *** valid => return false;
      // *** invalid => return true;

      // for single validate
      if (options.field && !_.isArray(options.field)) {
        if (this.isInvalid[options.field] && this.isInvalid[options.field]()) {
          console.log('invalid: ', options.field, '>> ', this.isInvalid[options.field]());
          options.onInvalid({ message: this.isInvalid[options.field]() });
          return true;
        } else {
          this.trigger('valid', { field: options.field });
          return false;
        }

      // validate the whole form
      } else {
        return !(
          !this.isInvalid.ProcessId() &&
          !this.isInvalid.StepId() &&
          !this.isInvalid.Subject() &&
          !this.isInvalid.Body()
        );
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
