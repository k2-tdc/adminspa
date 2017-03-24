/*global Hktdc, Backbone*/

Hktdc.Models = Hktdc.Models || {};

(function() {
  'use strict';

  Hktdc.Models.SaveWorkerRuleMember = Backbone.Model.extend({

    url: function() {
      return Hktdc.Config.apiURL + '/worker-rule/rule';
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

    validate: function(attrs, options) {
      var rules = {
        '1':  { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '2':  { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '3':  { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '4':  { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: true,  LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '5':  { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '6':  { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '7':  { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: true,  LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '8':  { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: true,  LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: false, Grade4: false, Department: false },
        '9':  { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '10': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '11': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '12': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '13': { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '14': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '15': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: true,  Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '16': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: true,  Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '17': { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '18': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '19': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '20': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '21': { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '22': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '23': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '24': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: true,  TeamFilter: true,  Priority: true, Grade3: true,  Grade4: true,  Department: false },
        '25': { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '26': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '27': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '28': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '29': { Nature: true, Score: true, UserId: true, UserId1: true,  UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '30': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: true,  GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '31': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: false, GroupID: false, GroupID1: false, Grade1: true,  Grade2: true,  Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
        '32': { Nature: true, Score: true, UserId: true, UserId1: false, UserId2: false, LevelNo: true,  GroupID: false, GroupID1: false, Grade1: false, Grade2: false, Team: false, TeamFilter: false, Priority: true, Grade3: true,  Grade4: true,  Department: true, },
      };
      var rule = rules[attrs.Rule];
      var errors = [];
      if (rule) {
        if (!attrs.Nature && rule.Nature) {
          errors.push('"Nature" must be filled.');
        }
        if (!attrs.Score && rule.Score) {
          errors.push('"Score" must be filled.');
        }
        if (!attrs.UserId && rule.UserId) {
          errors.push('"Per" must be filled.');
        }
        if (!attrs.UserId1 && rule.UserId1) {
          errors.push('"Set" / "Remove" must be filled.');
        }
        if (!attrs.UserId2 && rule.UserId2) {
          errors.push('"For" must be filled.');
        }
        if (!attrs.LevelNo && rule.LevelNo) {
          errors.push('"Set" / "Remove" must be filled.');
        }
        if (!attrs.GroupID && rule.GroupID) {
          errors.push('"Set" / "Remove" must be filled.');
        }
        if (!attrs.GroupID1 && rule.GroupID1) {
          errors.push('"For" must be filled.');
        }
        if (!attrs.Grade1 && rule.Grade1) {
          errors.push('"Set" must be filled.');
        }
        if (!attrs.Grade2 && rule.Grade2) {
          errors.push('"Set" must be filled.');
        }
        if (!attrs.Team && rule.Team) {
          errors.push('"For" must be filled.');
        }
        if (!attrs.TeamFilter && rule.TeamFilter) {
          errors.push('"For" must be filled.');
        }
        if (isNaN(attrs.Priority) && rule.Priority) {
          errors.push('"As" must be filled.');
        }
        if (!attrs.Grade3 && rule.Grade3) {
          errors.push('"Of" must be filled.');
        }
        if (!attrs.Grade4 && rule.Grade4) {
          errors.push('"Of" must be filled.');
        }
        if (!attrs.Department && rule.Department) {
          errors.push('"For" must be filled.');
        }
        if (errors.length) {
          return errors.join('<br>');
        } else {
          return false;
        }
      }
      return false;
    },

    parse: function(response, options) {
      return response;
    }
  });
})();
