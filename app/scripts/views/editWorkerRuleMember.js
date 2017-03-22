/* global Hktdc, Backbone, JST, Q, utils, $, _ */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EditWorkerRuleMember = Backbone.View.extend({

    template: JST['app/scripts/templates/workerRuleMember.ejs'],

    events: {},

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
      console.log(this.model.toJSON());
    },

    render: function() {
      var self = this;
      self.$el.html(self.template(self.model.toJSON()));

      self.loadRule()
        .then(function(ruleCollection) {
          self.renderRuleSelect(ruleCollection);
        })
        .catch(function(e) {
          console.error(e);
        });
    },

    loadRule: function() {
      var deferred = Q.defer();
      var ruleCollection = new Hktdc.Collections.Rule();
      // console.log(this.model.toJSON());
      ruleCollection.url = ruleCollection.url(this.model.toJSON().Code);
      ruleCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(ruleCollection);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    },

    renderRuleSelect: function(rulesCollection) {
      var self = this;
      try {
        var ruleSelectView = new Hktdc.Views.RuleSelect({
          collection: rulesCollection,
          selectedProcess: self.model.toJSON().ProcessId,
          onSelected: function(rule) {
            // console.log(rule);
            self.model.set({
              rule: rule.TemplateId
            });
            self.renderField(rule.TemplateId);
          }
        });
        ruleSelectView.render();
        $('.ruleContainer', self.el).html(ruleSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderField: function(targetId) {
      var optionalModule = {
        '1': ['setUser', 'asSelectable', 'forUser', 'checkbox', 'remark', 'reference'],
        '2': ['setUser', 'asSelectable', 'forUser', 'checkbox', 'remark', 'reference'],
        '3': ['setGrade', 'asSelectable', 'forUser', 'checkbox', 'remark', 'reference'],
        '4': ['setLevel', 'asSelectable', 'forUser', 'checkbox', 'remark', 'reference'],
        '5': ['removeUser', 'asFixed', 'forUser', 'checkbox', 'remark', 'reference'],
        '6': ['removeGroup', 'asFixed', 'forUser', 'checkbox', 'remark', 'reference'],
        '7': ['removeGrade', 'asFixed', 'forUser', 'checkbox', 'remark', 'reference'],
        '8': ['removeLevel', 'asFixed', 'forUser', 'checkbox', 'remark', 'reference'],
        '9': ['of', 'setUser', 'asSelectable', 'forGroup', 'checkbox', 'remark', 'reference'],
        '10': ['of', 'setGroup', 'asSelectable', 'forGroup', 'checkbox', 'remark', 'reference'],
        '11': ['of', 'setGrade', 'asSelectable', 'forGroup', 'checkbox', 'remark', 'reference'],
        '12': ['of', 'setLevel', 'asSelectable', 'forGroup', 'checkbox', 'remark', 'reference'],
        '13': ['of', 'removeUser', 'asFixed', 'forGroup', 'checkbox', 'remark', 'reference'],
        '14': ['of', 'removeGroup', 'asFixed', 'forGroup', 'checkbox', 'remark', 'reference'],
        '15': ['of', 'removeGrade', 'asFixed', 'forGroup', 'checkbox', 'remark', 'reference'],
        '16': ['of', 'removeLevel', 'asFixed', 'forGroup', 'checkbox', 'remark', 'reference'],
        '17': ['of', 'setUser', 'asSelectable', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '18': ['of', 'setGroup', 'asSelectable', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '19': ['of', 'setGrade', 'asSelectable', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '20': ['of', 'setLevel', 'asSelectable', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '21': ['of', 'removeUser', 'asFixed', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '22': ['of', 'removeGroup', 'asFixed', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '23': ['of', 'removeGrade', 'asFixed', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '24': ['of', 'removeLevel', 'asFixed', 'forSubordinate', 'checkbox', 'remark', 'reference'],
        '25': ['of', 'setUser', 'asSelectable', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '26': ['of', 'setGroup', 'asSelectable', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '27': ['of', 'setGrade', 'asSelectable', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '28': ['of', 'setLevel', 'asSelectable', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '29': ['of', 'removeUser', 'asFixed', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '30': ['of', 'removeGroup', 'asFixed', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '31': ['of', 'removeGrade', 'asFixed', 'forDepartment', 'checkbox', 'remark', 'reference'],
        '32': ['of', 'removeLevel', 'asFixed', 'forDepartment', 'checkbox', 'remark', 'reference']
      };
      var targetOptionalModule = optionalModule[String(targetId)];
      var mandatoryModule = ['nature', 'score', 'per', 'checkbox', 'dateRange', 'remark', 'reference'];

      var ruleModules = targetOptionalModule.concat(mandatoryModule);
    }
  });
})();
