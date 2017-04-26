/* global Hktdc, Backbone, JST, Q, utils, $, _, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EditWorkerRuleMember = Backbone.View.extend({

    template: JST['app/scripts/templates/workerRuleMember.ejs'],

    events: {
      'click .saveBtn': 'saveButtonHandler',
      'click .previewBtn': 'previewButtonHandler',
      'click .deleteBtn': 'deleteButtonHandler',
      'blur .formTextField': 'updateFormModel'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
      // console.log(this.model.toJSON());
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

      if (self.model.toJSON().showNature) {
        self.loadNature()
          .then(function(natureCollection) {
            return self.renderNature(natureCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showPer) {
        self.loadUsers()
          .then(function(userCollection) {
            return self.renderPer(userCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showAs) {
        self.loadPriority()
          .then(function(priorityCollection) {
            return self.renderAs(priorityCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showCheckbox) {
        self.loadCriteria()
          .then(function(criteriaCollection) {
            return self.renderCheckbox(criteriaCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showOf) {
        self.loadGrading()
          .then(function(gradingCollection) {
            return self.renderOf(gradingCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showSet) {
        var setType = self.model.toJSON().showSet;
        Q.fcall(function() {
          if (setType === 'user') {
            return self.loadUsers();
          } else if (setType === 'grade') {
            return self.loadGrading();
          } else if (setType === 'group') {
            return self.loadGroup();
          } else {
            return self.loadLevel();
          }
        })
          .then(function(typeCollection) {
            return self.renderSet(setType, typeCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showRemove) {
        var removeType = self.model.toJSON().showRemove;
        Q.fcall(function() {
          if (removeType === 'user') {
            return self.loadUsers();
          } else if (removeType === 'grade') {
            return self.loadGrading();
          } else if (removeType === 'group') {
            return self.loadGroup();
          } else {
            return self.loadLevel();
          }
        })
          .then(function(typeCollection) {
            return self.renderRemove(removeType, typeCollection);
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showFor) {
        var forType = self.model.toJSON().showFor;
        Q.fcall(function() {
          if (forType === 'department') {
            return self.loadDepartment();
          } else if (forType === 'user') {
            return self.loadUsers();
          } else if (forType === 'group') {
            return self.loadGroup();
          } else if (forType === 'team') {
            return Q.all([
              self.loadTeam(),
              self.loadTeamFilter()
            ]);
          }
        })
          .then(function(typeCollection) {
            if (forType === 'team') {
              self.renderFor(forType, typeCollection[0]);
              self.renderForTeamFilter(typeCollection[1]);
            } else {
              self.renderFor(forType, typeCollection);
            }
          }).catch(function(e) {
            console.error(e);
          });
      }

      if (self.model.toJSON().showDateRange) {
        this.renderDatePicker();
      }

      if (self.model.toJSON().showReference) {
        self.loadFileTypeRules()
          .then(function(uploadRule) {
            self.renderAttachment(uploadRule, self.model.toJSON().Reference);
          });
      }
    },

    loadRule: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().ruleCollection) {
        deferred.resolve(self.model.toJSON().ruleCollection);
      } else {
        var ruleCollection = new Hktdc.Collections.Rule();
        // console.log(this.model.toJSON());
        ruleCollection.url = ruleCollection.url(self.model.toJSON().WorkerRuleId);
        var doFetch = function() {
          ruleCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                ruleCollection: ruleCollection
              });
              deferred.resolve(ruleCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting rules');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadNature: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().natureCollection) {
        deferred.resolve(self.model.toJSON().natureCollection);
      } else {
        var natureCollection = new Hktdc.Collections.RuleFieldNature();
        natureCollection.url = natureCollection.url(self.model.toJSON().WorkerRuleId);
        var doFetch = function() {
          natureCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                natureCollection: natureCollection
              });
              deferred.resolve(natureCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting nature.');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadUsers: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().fullUserCollection) {
        deferred.resolve(self.model.toJSON().fullUserCollection);
      } else {
        var fullUserCollection = new Hktdc.Collections.FullUser();
        // console.log(self.model.toJSON());
        var doFetch = function() {
          fullUserCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                fullUserCollection: fullUserCollection
              });
              deferred.resolve(fullUserCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting full users.');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadGrading: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().gradingCollection) {
        deferred.resolve(self.model.toJSON().gradingCollection);
      } else {
        var gradingCollection = new Hktdc.Collections.Grading();
        // console.log(self.model.toJSON());
        gradingCollection.url = gradingCollection.url(self.model.toJSON().WorkerRuleId);
        var doFetch = function() {
          gradingCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                gradingCollection: gradingCollection
              });
              deferred.resolve(gradingCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on gettin grades');
              }
            }
          });
        };
        doFetch();
      }

      return deferred.promise;
    },

    loadGroup: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().groupCollection) {
        deferred.resolve(self.model.toJSON().groupCollection);
      } else {
        var groupCollection = new Hktdc.Collections.Group();
        groupCollection.url = groupCollection.url();
        var doFetch = function() {
          groupCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                groupCollection: groupCollection
              });
              deferred.resolve(groupCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting group.');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadLevel: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().levelCollection) {
        deferred.resolve(self.model.toJSON().levelCollection);
      } else {
        var levelCollection = new Hktdc.Collections.Level();
        var doFetch = function() {
          levelCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                levelCollection: levelCollection
              });
              deferred.resolve(levelCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting level');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadDepartment: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().ruleDepartmentCollection) {
        deferred.resolve(self.model.toJSON().ruleDepartmentCollection);
      } else {
        var doFetch = function() {
          var ruleDepartmentCollection = new Hktdc.Collections.Department();
          ruleDepartmentCollection.url = ruleDepartmentCollection.url('worker-rules');
          ruleDepartmentCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                ruleDepartmentCollection: ruleDepartmentCollection
              });
              deferred.resolve(ruleDepartmentCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting rule department');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadTeam: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().teamCollection) {
        deferred.resolve(self.model.toJSON().teamCollection);
      } else {
        var teamCollection = new Hktdc.Collections.Team();
        var doFetch = function() {
          teamCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                teamCollection: teamCollection
              });
              deferred.resolve(teamCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting team');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadTeamFilter: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().teamFilterCollection) {
        deferred.resolve(self.model.toJSON().teamFilterCollection);
      } else {
        var teamFilterCollection = new Hktdc.Collections.TeamFilter();
        var doFetch = function() {
          teamFilterCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                teamFilterCollection: teamFilterCollection
              });
              deferred.resolve(teamFilterCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting team filter.');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadFileTypeRules: function() {
      var deferred = Q.defer();
      var fileRuleModel = new Hktdc.Models.FileRule();
      var doFetch = function() {
        fileRuleModel.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(fileRuleModel);
          },
          error: function(collcetion, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on getting file type rules.');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadCriteria: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().criteriaCollection) {
        deferred.resolve(self.model.toJSON().criteriaCollection);
      } else {
        var criteriaCollection = new Hktdc.Collections.Criteria();
        criteriaCollection.url = criteriaCollection.url(self.model.toJSON().WorkerRuleId);
        var doFetch = function() {
          criteriaCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                criteriaCollection: criteriaCollection
              });
              deferred.resolve(criteriaCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting criteria');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    loadPriority: function() {
      var deferred = Q.defer();
      var self = this;
      if (self.model.toJSON().priorityCollection) {
        deferred.resolve(self.model.toJSON().priorityCollection);
      } else {
        var priorityCollection = new Hktdc.Collections.Priority();
        priorityCollection.url = priorityCollection.url(self.model.toJSON().WorkerRuleId);
        var doFetch = function() {
          priorityCollection.fetch({
            beforeSend: utils.setAuthHeader,
            success: function() {
              self.model.set({
                priorityCollection: priorityCollection
              });
              deferred.resolve(priorityCollection);
            },
            error: function(collection, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doFetch();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on getting priority');
              }
            }
          });
        };
        doFetch();
      }
      return deferred.promise;
    },

    renderRuleSelect: function(ruleCollection) {
      var self = this;
      try {
        var ruleSelectView = new Hktdc.Views.RuleSelect({
          collection: ruleCollection,
          selectedRule: self.model.toJSON().Rule,
          onSelected: function(rule) {
            self.model.set({
              Rule: rule.TemplateID,
              Nature: '',
              Score: rule.DefaultScore,
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

            });
            self.renderField(rule.TemplateID);
          }
        });
        ruleSelectView.render();
        $('.ruleContainer', self.el).html(ruleSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderField: function(targetId) {
      var module = {
        '1':  {nature: true, score: true, per: true, set: 'user',   remove: false,    as: 'selectable', of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '2':  {nature: true, score: true, per: true, set: 'group',   remove: false,   as: 'selectable', of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '3':  {nature: true, score: true, per: true, set: 'grade',  remove: false,    as: 'selectable', of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '4':  {nature: true, score: true, per: true, set: 'level',  remove: false,    as: 'selectable', of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '5':  {nature: true, score: true, per: true, set: false,    remove: 'user',   as: 'fixed',      of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '6':  {nature: true, score: true, per: true, set: false,    remove: 'group',  as: 'fixed',      of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '7':  {nature: true, score: true, per: true, set: false,    remove: 'grade',  as: 'fixed',      of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '8':  {nature: true, score: true, per: true, set: false,    remove: 'level',  as: 'fixed',      of: false, for: 'user',       dateRange: true, checkbox: true, remark: true, reference: true },
        '9':  {nature: true, score: true, per: true, set: 'user',   remove: false,    as: 'selectable', of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '10': {nature: true, score: true, per: true, set: 'group',  remove: false,    as: 'selectable', of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '11': {nature: true, score: true, per: true, set: 'grade',  remove: false,    as: 'selectable', of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '12': {nature: true, score: true, per: true, set: 'level',  remove: false,    as: 'selectable', of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '13': {nature: true, score: true, per: true, set: false,    remove: 'user',   as: 'fixed',      of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '14': {nature: true, score: true, per: true, set: false,    remove: 'group',  as: 'fixed',      of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '15': {nature: true, score: true, per: true, set: false,    remove: 'grade',  as: 'fixed',      of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '16': {nature: true, score: true, per: true, set: false,    remove: 'level',  as: 'fixed',      of: true,  for: 'group',      dateRange: true, checkbox: true, remark: true, reference: true },
        '17': {nature: true, score: true, per: true, set: 'user',   remove: false,    as: 'selectable', of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '18': {nature: true, score: true, per: true, set: 'group',  remove: false,    as: 'selectable', of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '19': {nature: true, score: true, per: true, set: 'grade',  remove: false,    as: 'selectable', of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '20': {nature: true, score: true, per: true, set: 'level',  remove: false,    as: 'selectable', of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '21': {nature: true, score: true, per: true, set: false,    remove: 'user',   as: 'fixed',      of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '22': {nature: true, score: true, per: true, set: false,    remove: 'group',  as: 'fixed',      of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '23': {nature: true, score: true, per: true, set: false,    remove: 'grade',  as: 'fixed',      of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '24': {nature: true, score: true, per: true, set: false,    remove: 'level',  as: 'fixed',      of: true,  for: 'team',       dateRange: true, checkbox: true, remark: true, reference: true },
        '25': {nature: true, score: true, per: true, set: 'user',   remove: false,    as: 'selectable', of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '26': {nature: true, score: true, per: true, set: 'group',  remove: false,    as: 'selectable', of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '27': {nature: true, score: true, per: true, set: 'grade',  remove: false,    as: 'selectable', of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '28': {nature: true, score: true, per: true, set: 'level',  remove: false,    as: 'selectable', of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '29': {nature: true, score: true, per: true, set: false,    remove: 'user',   as: 'fixed',      of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '30': {nature: true, score: true, per: true, set: false,    remove: 'group',  as: 'fixed',      of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '31': {nature: true, score: true, per: true, set: false,    remove: 'grade',  as: 'fixed',      of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
        '32': {nature: true, score: true, per: true, set: false,    remove: 'level',  as: 'fixed',      of: true,  for: 'department', dateRange: true, checkbox: true, remark: true, reference: true },
      };
      // console.log(targetId);
      var ruleModules = module[String(targetId)];

      this.model.set({
        showNature: ruleModules.nature,
        showScore: ruleModules.score,
        showPer: ruleModules.per,
        showSet: ruleModules.set,
        showRemove: ruleModules.remove,
        showAs: ruleModules.as,
        showOf: ruleModules.of,
        showFor: ruleModules.for,
        showDateRange: ruleModules.dateRange,
        showCheckbox: ruleModules.checkbox,
        showRemark: ruleModules.remark,
        showReference: ruleModules.reference,
      });
      // console.log(this.model.toJSON());
      this.render();
    },

    renderNature: function(natureCollection) {
      var self = this;
      console.log(self.model.toJSON());
      try {
        var natureSelectView = new Hktdc.Views.RuleFieldNatureSelect({
          collection: natureCollection,
          selectedNature: self.model.toJSON().Nature || 0,
          onSelected: function(rule) {
            self.model.set({
              Nature: rule.NatureID
            });
          }
        });
        natureSelectView.render();
        $('.natureContainer', self.el).html(natureSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderPer: function(perCollection) {
      var self = this;
      try {
        var natureSelectView = new Hktdc.Views.RuleFieldPerSelect({
          collection: perCollection,
          selectedPerUser: self.model.toJSON().UserId || 0,
          onSelected: function(user) {
            self.model.set({
              UserId: user.UserID
            });
          }
        });
        natureSelectView.render();
        $('.perContainer', self.el).html(natureSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderAs: function(priorityCollection) {
      var self = this;
      try {
        var natureSelectView = new Hktdc.Views.RuleFieldAsSelect({
          collection: priorityCollection,
          selectedPriority: self.model.toJSON().Priority || 0,
          onSelected: function(selectedItem) {
            self.model.set({
              Priority: parseInt(selectedItem.PriorityID) || 0
            });
          }
        });
        natureSelectView.render();
        $('.asContainer', self.el).html(natureSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderOf: function(ofCollection) {
      var self = this;
      try {
        var ofFromSelectView = new Hktdc.Views.RuleFieldOfSelect({
          collection: ofCollection,
          selectedGrade: self.model.toJSON().Grade3 || 0,
          onSelected: function(grade) {
            self.model.set({
              Grade3: grade.Grade
            });
          }
        });
        var ofToSelectView = new Hktdc.Views.RuleFieldOfSelect({
          collection: ofCollection,
          selectedGrade: self.model.toJSON().Grade4 || 0,
          onSelected: function(grade) {
            self.model.set({
              Grade4: grade.Grade
            });
          }
        });
        ofFromSelectView.render();
        ofToSelectView.render();
        $('.ofFromContainer', self.el).html(ofFromSelectView.el);
        $('.ofToContainer', self.el).html(ofToSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderSet: function(type, setCollection) {
      var self = this;
      var gradeView;
      try {
        if (type === 'grade') {
          gradeView = new Hktdc.Views.RuleFieldSetGrade({
            collection: setCollection,
            selectedGradeFrom: self.model.toJSON().Grade1 || 0,
            selectedGradeTo: self.model.toJSON().Grade2 || 0,
            onSelectedFrom: function(grade) {
              self.model.set({
                Grade1: grade.Grade
              });
            },
            onSelectedTo: function(grade) {
              self.model.set({
                Grade2: grade.Grade
              });
            }
          });
        } else {
          gradeView = new Hktdc.Views.RuleFieldSetCommon({
            collection: setCollection,
            type: type,
            selected: function() {
              if (type === 'user') {
                return self.model.toJSON().UserId1;
              } else if (type === 'level') {
                return self.model.toJSON().LevelNo;
              } else if (type === 'group') {
                return self.model.toJSON().GroupID;
              }
            }(),
            onSelected: function(selectedData) {
              console.log(selectedData);
              if (type === 'user') {
                self.model.set({
                  UserId1: selectedData.UserID
                });
              } else if (type === 'level') {
                self.model.set({
                  LevelNo: selectedData.LevelNo
                });
              } else if (type === 'group') {
                self.model.set({
                  GroupID: selectedData.GroupID
                });
              }
            }
          });
        }

        gradeView.render();
        $('.setContainer', self.el).html(gradeView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderRemove: function(type, removeCollection) {
      var self = this;
      var gradeView;
      try {
        if (type === 'grade') {
          gradeView = new Hktdc.Views.RuleFieldRemoveGrade({
            collection: removeCollection,
            selectedGradeFrom: self.model.toJSON().Grade1 || 0,
            selectedGradeTo: self.model.toJSON().Grade2 || 0,
            onSelectedFrom: function(grade) {
              self.model.set({
                Grade1: grade.Grade
              });
            },
            onSelectedTo: function(grade) {
              self.model.set({
                Grade2: grade.Grade
              });
            }
          });
        } else {
          gradeView = new Hktdc.Views.RuleFieldRemoveCommon({
            collection: removeCollection,
            type: type,
            selected: function() {
              if (type === 'user') {
                return self.model.toJSON().UserId1;
              } else if (type === 'level') {
                return self.model.toJSON().LevelNo;
              } else if (type === 'group') {
                return self.model.toJSON().GroupID;
              }
            }(),
            onSelected: function(selectedData) {
              console.log(selectedData);
              if (type === 'user') {
                self.model.set({
                  UserId1: selectedData.UserID
                });
              } else if (type === 'level') {
                self.model.set({
                  LevelNo: selectedData.LevelNo
                });
              } else if (type === 'group') {
                self.model.set({
                  GroupID: selectedData.GroupID
                });
              }
            }
          });
        }

        gradeView.render();
        $('.removeContainer', self.el).html(gradeView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderFor: function(type, forCollection) {
      var self = this;
      var forView;
      try {
        forView = new Hktdc.Views.RuleFieldFor({
          collection: forCollection,
          type: type,
          selectedFor: function() {
            if (type === 'user') {
              return self.model.toJSON().UserId2 || 0;
            } else if (type === 'team') {
              return self.model.toJSON().Team || 0;
            } else if (type === 'group') {
              return self.model.toJSON().GroupID1 || 0;
            } else if (type === 'department') {
              return self.model.toJSON().Department || 0;
            }
          }(),
          onSelected: function(selectedData) {
            console.log(selectedData);
            if (type === 'user') {
              self.model.set({
                UserId2: selectedData.UserID
              });
            } else if (type === 'team') {
              self.model.set({
                Team: selectedData.Code
              });
            } else if (type === 'group') {
              self.model.set({
                GroupID1: selectedData.GroupID
              });
            } else {
              self.model.set({
                Department: selectedData.DeptCode
              });
            }
          }
        });

        forView.render();
        $('.forContainer', self.el).html(forView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderForTeamFilter: function(teamCollection) {
      var self = this;
      try {
        var teamFilterSelectView = new Hktdc.Views.RuleFieldForTeamFilterSelect({
          collection: teamCollection,
          selectedFor: self.model.toJSON().TeamFilter || 0,
          onSelected: function(selected) {
            self.model.set({
              TeamFilter: selected.FilterID
            });
          }
        });
        teamFilterSelectView.render();
        $('.forTeamFilterContainer', self.el).html(teamFilterSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderDatePicker: function() {
      var self = this;
      // console.log(self.model.toJSON().DateFrom);
      // console.log(moment(self.model.toJSON().DateFrom).format('DD MMM YYYY'));
      var fromDateView = new Hktdc.Views.DatePicker({
        model: new Hktdc.Models.DatePicker({
          value: (self.model.toJSON().DateFrom)
            ? moment(self.model.toJSON().DateFrom).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          self.model.set({
            DateFrom: (moment(val, 'YYYY-MM-DD').isValid())
              ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
              : ''
          });
        }
      });

      var toDateView = new Hktdc.Views.DatePicker({
        model: new Hktdc.Models.DatePicker({
          value: (self.model.toJSON().DateTo)
            ? moment(self.model.toJSON().DateTo).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          self.model.set({
            DateTo: (moment(val, 'YYYY-MM-DD').isValid())
              ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
              : ''
          });
        }
      });
      $('.fromDatePicker', self.el).html(fromDateView.el);
      $('.toDatePicker', self.el).html(toDateView.el);
    },

    renderCheckbox: function(criteria) {
      var self = this;
      var groupedCriteria = _.map(_.groupBy(criteria.toJSON(), 'CriteriaGroup'), function(val, key) {
        return {key: key, criteria: val};
      });

      var checkboxView = new Hktdc.Views.RuleFieldCheckbox({
        criteria: groupedCriteria,
        selectedCriteria: self.model.toJSON().Criteria,
        onChange: function(newCriterias) {
          self.model.set({
            Criteria: newCriterias
          });
        }
      });
      checkboxView.render();
      $('.checkboxContainer', self.el).html(checkboxView.el);
    },

    renderAttachment: function(rulesModel, attachmentList) {
      this.model.set({
        selectedAttachmentCollection: new Hktdc.Collections.Attachment([])
      });
      try {
        var attachmentCollections = new Hktdc.Collections.Attachment(attachmentList);
        var attachmentListView = new Hktdc.Views.AttachmentList({
          collection: attachmentCollections,
          requestFormModel: this.model,
          rules: rulesModel.toJSON()
        });
        attachmentListView.render();
        // console.log(attachmentListView.el);
        $('.attachmentContainer').html(attachmentListView.el);
      } catch (e) {
        console.error(e);
      }
    },

    updateFormModel: function(ev) {
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      updateObject[targetField] = $target.val();
      this.model.set(updateObject);
    },

    saveButtonHandler: function() {
      var self = this;
      this.saveRuleSetting()
        .then(function(response) {
          var ruleSettingId = response.Msg;
          return self.sendAttachment(
            ruleSettingId,
            self.model.toJSON().selectedAttachmentCollection
          );
        })
        .then(function() {
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'saved',
            type: 'confirmation',
            title: 'Confirmation'
          });

          Backbone.history.navigate('worker-rule/' + self.model.toJSON().WorkerRuleId, { trigger: true });
        })
        .catch(function(err) {
          console.log(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: 'Error on saving user role',
            type: 'error',
            title: 'Error'
          });
        });
    },

    previewButtonHandler: function() {
      var queryParams = _.omit(this.model.toJSON(), 'departmentCollection', 'applicantCollection');
      var url = Hktdc.Config.apiURL + '/worker-rules/preview';
      var xhr = new XMLHttpRequest();
      var rawData = this.model.toJSON();
      // console.log(rawData.DateFrom);
      // console.log(rawData.DateTo);
      var formData = new FormData();
      var modelData = {
        RuleCode: rawData.Code || '',
        Rule: rawData.Rule || '',
        Score: parseInt(rawData.Score),
        UserId1: rawData.UserId1 || '',
        UserId2: rawData.UserId2 || '',
        LevelNo: rawData.LevelNo || '',
        GroupID: rawData.GroupID || '',
        GroupID1: rawData.GroupID1 || '',
        Grade1: rawData.Grade1 || '',
        Grade2: rawData.Grade2 || '',
        Team: rawData.Team || '',
        TeamFilter: rawData.TeamFilter || '',
        Priority: parseInt(rawData.Priority) || 0,
        Grade3: rawData.Grade3 || '',
        Grade4: rawData.Grade4 || '',
        Department: rawData.Department || '',
        DateFrom: moment(rawData.DateFrom, 'YYYY-MM-DD').isValid()
          ? moment(rawData.DateFrom).format('YYYY-MM-DD')
          : '',
        DateTo: moment(rawData.DateTo, 'YYYY-MM-DD').isValid()
          ? moment(rawData.DateTo).format('YYYY-MM-DD')
          : '',
        Criteria: rawData.Criteria || ''
      };
      formData.append('model', JSON.stringify(modelData));

      xhr.addEventListener('loadstart', function() {
        NProgress.start();
      });
      xhr.addEventListener('loadend', function() {
        NProgress.done();
      });

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + Hktdc.Config.accessToken);
      xhr.responseType = 'blob';
      xhr.onreadystatechange = function() {
        var anchorLink;
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            var blob;
            try {
              blob = new Blob([xhr.response], {
                type: 'application/octet-stream'
              });
            } catch (e) {
              // Old browser, need to use blob builder
              window.BlobBuilder = window.BlobBuilder ||
                                   window.WebKitBlobBuilder ||
                                   window.MozBlobBuilder ||
                                   window.MSBlobBuilder;
              if (window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(xhr.response);
                blob = bb.getBlob('application/octet-stream');
              }
            }
            if (blob) {
              window.navigator.msSaveBlob(blob, 'preview.xls');
            }
          } else {
            // Trick for making downloadable link
            anchorLink = document.createElement('a');
            anchorLink.href = window.URL.createObjectURL(xhr.response);
            // Give filename you wish to download
            anchorLink.download = 'preview.xls';
            anchorLink.style.display = 'none';
            document.body.appendChild(anchorLink);
            anchorLink.click();
          }
        }
      };
      xhr.send(formData);
    },

    deleteButtonHandler: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'Confirmation',
        message: 'Are you sure to delete?',
        onConfirm: function() {
          var delMemberModel = new Hktdc.Models.DeleteWorkerRuleMember();
          delMemberModel.url = delMemberModel.url(self.model.toJSON().WorkerSettingId);
          var doSave = function() {
            delMemberModel.save(null, {
              type: 'DELETE',
              beforeSend: utils.setAuthHeader,
              success: function() {
                Hktdc.Dispatcher.trigger('closeConfirm');
                Hktdc.Dispatcher.trigger('openAlert', {
                  message: 'Deleted',
                  type: 'confirmation',
                  title: 'Confirmation'
                });
                Backbone.history.navigate('worker-rule/' + self.model.toJSON().WorkerRuleId, {trigger: true});
              },
              error: function(model, response) {
                if (response.status === 401) {
                  utils.getAccessToken(function() {
                    doSave();
                  });
                } else {
                  console.error(response.responseText);
                  Hktdc.Dispatcher.trigger('openAlert', {
                    message: 'error on deleting worker rule member.',
                    type: 'error',
                    title: 'error on saving user role'
                  });
                }
              }
            });
          };
          doSave();
        }
      });
    },

    saveRuleSetting: function() {
      console.log('raw Model: ', this.model.toJSON());
      var self = this;
      var deferred = Q.defer();
      var saveRuleMemberModel = new Hktdc.Models.SaveWorkerRuleMember();
      var rawData = this.model.toJSON();
      var data = {
        WorkerRuleId: rawData.WorkerRuleId,
        WorkerSettingId: rawData.WorkerSettingId || '',
        Rule: rawData.Rule,
        Nature: rawData.Nature,
        Score: parseInt(rawData.Score),
        UserId: rawData.UserId || '',
        UserId1: rawData.UserId1 || '',
        UserId2: rawData.UserId2 || '',
        LevelNo: rawData.LevelNo || '',
        GroupID: rawData.GroupID || '',
        GroupID1: rawData.GroupID1 || '',
        Grade1: rawData.Grade1 || '',
        Grade2: rawData.Grade2 || '',
        Team: rawData.Team || '',
        TeamFilter: rawData.TeamFilter || '',
        Priority: parseInt(rawData.Priority) || 0,
        Grade3: rawData.Grade3 || '',
        Grade4: rawData.Grade4 || '',
        Department: rawData.Department || '',
        DateFrom: (rawData.DateFrom && moment(rawData.DateFrom, 'YYYY-MM-DD').isValid())
          ? moment(rawData.DateFrom, 'YYYY-MM-DD').format('YYYYMMDD')
          : '',
        DateTo: (rawData.DateTo && moment(rawData.DateTo, 'YYYY-MM-DD').isValid())
          ? moment(rawData.DateTo, 'YYYY-MM-DD').format('YYYYMMDD')
          : '',
        Criteria: rawData.Criteria || '',
        Remark: rawData.Remark
      };
      saveRuleMemberModel.set(data);

      saveRuleMemberModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          message: err,
          type: 'error',
          title: 'Error'
        });
      });

      if (saveRuleMemberModel.isValid()) {
        console.log('saveModel: ', saveRuleMemberModel.toJSON());
        var doSave = function() {
          saveRuleMemberModel.save(null, {
            type: rawData.saveType,
            beforeSend: utils.setAuthHeader,
            success: function(model, response) {
              deferred.resolve(response);
            },
            error: function(model, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doSave();
                }, function(err) {
                  deferred.reject(err);
                });
              } else {
                console.error(response.responseText);
                deferred.reject('error on saving rule member.');
              }
            }
          });
        };
        doSave();
      }

      return deferred.promise;
    },

    sendAttachment: function(refId, attachmentCollection) {
      var deferred = Q.defer();
      var files = _.reject(attachmentCollection.toJSON(), function(attachment) {
        return attachment.AttachmentGUID;
      });
      if (files.length <= 0) {
        deferred.resolve();
        return;
      }
      var ajaxOptions = {
        type: 'POST',
        processData: false,
        cache: false,
        contentType: false
      };
      var data = new FormData();
      var sendAttachmentModel = new Hktdc.Models.SendAttachment();
      var filename = _.map(files, function(file) {
        return (file.file) && file.file.name;
      });

      sendAttachmentModel.url = sendAttachmentModel.url(refId);

      _.each(files, function(file, i) {
        data.append('file' + i, file.file);
      });

      ajaxOptions.data = data;
      var doSave = function() {
        sendAttachmentModel.save(null, $.extend({}, ajaxOptions, {
          beforeSend: utils.setAuthHeader,
          success: function(model, response) {
            deferred.resolve();
          },
          error: function(model, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doSave();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('Submit File Error');
            }
          }
        }));
      };
      doSave();
      return deferred.promise;
    }

  });
})();
