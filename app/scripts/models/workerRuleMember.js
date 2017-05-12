/* global Hktdc, Backbone, _, validateMessage */

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.WorkerRuleMember = Backbone.Model.extend({

    url: function(ruleId) {
      return Hktdc.Config.apiURL + '/worker-rule-settings/' + ruleId;
    },

    initialize: function() {
      var self = this;
      this.isInvalid = {
        Rule: function() {
          return !self.attributes.Rule
          ? validateMessage.required
          : false;
        },
        Nature: function() {
          return (!self.attributes.Nature || String(self.attributes.Nature) === '0')
            ? validateMessage.required
            : false;
        },
        Score: function() {
          if (String(self.attributes.Score) === '0' || !self.attributes.Score) {
            return validateMessage.required;
          } else if (isNaN(self.attributes.Score)) {
            return '"Score" must be a number.';
          }
          return false;
        },
        UserId1: function() {
          return (!self.attributes.UserId1 || String(self.attributes.UserId1) === '0')
            ? validateMessage.required
            : false;
        },
        UserId2: function() {
          return (!self.attributes.UserId2 || String(self.attributes.UserId2) === '0')
            ? validateMessage.required
            : false;
        },
        LevelNo: function() {
          return (!self.attributes.LevelNo || String(self.attributes.LevelNo) === '0')
            ? validateMessage.required
            : false;
        },
        GroupID: function() {
          return (!self.attributes.GroupID || String(self.attributes.GroupID) === '0')
            ? validateMessage.required
            : false;
        },
        GroupID1: function() {
          return (!self.attributes.GroupID1 || String(self.attributes.GroupID1) === '0')
            ? validateMessage.required
            : false;
        },
        Grade1: function() {
          return (!self.attributes.Grade1 || String(self.attributes.Grade1) === '0' || typeof self.attributes.Grade1 === 'undefined')
            ? validateMessage.required
            : false;
        },
        Grade2: function() {
          return (!self.attributes.Grade2 || String(self.attributes.Grade2) === '0' || typeof self.attributes.Grade2 === 'undefined')
            ? validateMessage.required
            : false;
        },
        Team: function() {
          return (!self.attributes.Team || String(self.attributes.Team) === '0')
            ? validateMessage.required
            : false;
        },
        TeamFilter: function() {
          return (!self.attributes.TeamFilter || String(self.attributes.TeamFilter) === '0')
            ? validateMessage.required
            : false;
        },
        Priority: function() {
          return isNaN(self.attributes.Priority)
            ? validateMessage.required
            : false;
        },
        Grade3: function() {
          return (!self.attributes.Grade3 || String(self.attributes.Grade3) === '0')
            ? validateMessage.required
            : false;
        },
        Grade4: function() {
          return (!self.attributes.Grade4 || String(self.attributes.Grade4) === '0')
            ? validateMessage.required
            : false;
        },
        Department: function() {
          return (!self.attributes.Department || String(self.attributes.Department) === '0')
            ? validateMessage.required
            : false;
        }
      };
    },

    defaults: {
      showNature: false,
      showScore: false,
      showPer: false,
      showSet: false,
      showRemove: false,
      showAs: false,
      showOf: false,
      showFor: false,
      showDateRange: false,
      showCheckbox: false,
      showRemark: false,
      showReference: false,

      ruleCollection: null,

      Rule: ''
    },

    rules: {
      '1':  { Nature: true, Score: true, UserId1: true,  UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '2':  { Nature: true, Score: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '3':  { Nature: true, Score: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '4':  { Nature: true, Score: true, UserId1: false, UserId2: true,  LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '5':  { Nature: true, Score: true, UserId1: true,  UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '6':  { Nature: true, Score: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '7':  { Nature: true, Score: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '8':  { Nature: true, Score: true, UserId1: false, UserId2: true,  LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
      '9':  { Nature: true, Score: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '10': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '11': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '12': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '13': { Nature: true, Score: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '14': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '15': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '16': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '17': { Nature: true, Score: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '18': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '19': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '20': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '21': { Nature: true, Score: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '22': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '23': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '24': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
      '25': { Nature: true, Score: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '26': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '27': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '28': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '29': { Nature: true, Score: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '30': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '31': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      '32': { Nature: true, Score: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, }
    },

    validate: function(attrs, options) {
      var rule = (this.rules && this.rules[attrs.Rule]) ? this.rules[attrs.Rule] : false;
      // console.log(attrs.Rule);

      // *** valid => return false;
      // *** invalid => return true;

      // for single validate
      // console.log('field: ', options.field);
      if (options.field && !_.isArray(options.field)) {
        if (rule[options.field] && this.isInvalid[options.field] && this.isInvalid[options.field]()) {
          // console.log('invalid: ', options.field, '>> ', this.isInvalid[options.field]());
          options.onInvalid({ message: this.isInvalid[options.field]() });
          return true;
        } else {
          // console.log('valid: ', options.field);
          this.trigger('valid', { field: options.field });
          return false;
        }

      // validate the whole form
      } else {
        var formIsInvalid = false;
        var self = this;
        if (!rule) {
          formIsInvalid = true;
        } else {
          _.each(rule, function(needValidate, ruleName) {
            if (needValidate) {
              if (self.isInvalid[ruleName] && self.isInvalid[ruleName]()) {
                formIsInvalid = true;
              }
            }
          });
        }

        // console.log('formIsInvalid: ', formIsInvalid);
        return formIsInvalid;
      }
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
