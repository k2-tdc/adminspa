/* global Hktdc, Backbone, JST, Q, utils, $, _, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.Delegation = Backbone.View.extend({

    template: JST['app/scripts/templates/delegation.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveDelegation',
      'click .delBtn': 'deleteDelegation',
      'blur .formTextField': 'updateFormModel'
    },

    initialize: function() {
      var self = this;
      if (this.model.toJSON().ProcessID) {
        setTimeout(function() {
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                stepCollection: stepCollection
              });
            });
        });
      }
      if (this.model.toJSON().Dept) {
        setTimeout(function() {
          self.loadDelegationUser(self.model.toJSON().Dept)
            .then(function(delegationUserCollection) {
              self.model.set({
                delegationUserCollection: delegationUserCollection
              });
            });
        });
      }

      var self = this;
      self.model.on('change:stepCollection', function() {
        console.log('change step collection');
        self.renderTaskSelect();
      });
      self.model.on('change:delegationUserCollection', function() {
        console.log('change delegationUser Collection');
        self.renderDelegationUserSelect();
      });
    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));

      Q.all([
        self.loadProcess(),
        Q.fcall(function() {
          if (self.model.toJSON().showUser) {
            return self.loadFullUser();
          }
          return [];
        }),
        self.loadDepartment(),
        self.loadAction()
      ])
        .then(function(results) {
          var processCollection = results[0];
          var userCollection = results[1];
          var departmentCollection = results[2];
          var actionCollection = results[3];
          console.debug('[ delegation.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection,
            userCollection: userCollection
          }, {
            silent: true
          });
          self.renderProcessSelect();
          self.renderUserSelect();
          self.renderDepartmentSelection(departmentCollection);
          self.renderActionSelect(actionCollection);
          self.renderDatePicker();
        })

        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: 'Runtime Error'
          });
        });
    },

    loadProcess: function() {
      var deferred = Q.defer();
      var processCollection = new Hktdc.Collections.Process();
      processCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(collection, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadFullUser: function() {
      var deferred = Q.defer();
      var userCollection = new Hktdc.Collections.FullUser();
      userCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(userCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadDelegationUser: function(departmentCode) {
      var deferred = Q.defer();
      var delegationUserCollection = new Hktdc.Collections.DelegationUser();
      delegationUserCollection.url = delegationUserCollection.url(departmentCode);
      delegationUserCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(delegationUserCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadAction: function() {
      var deferred = Q.defer();
      var delegationActionCollection = new Hktdc.Collections.DelegationAction();
      delegationActionCollection.url = delegationActionCollection.url('Delegation');
      delegationActionCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(delegationActionCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadStep: function() {
      var deferred = Q.defer();
      var stpeCollection = new Hktdc.Collections.Step();
      stpeCollection.url = stpeCollection.url(this.model.toJSON().ProcessName, encodeURI('Email Delegation'));
      stpeCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(stpeCollection);
        },
        error: function(collection, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadDepartment: function() {
      var deferred = Q.defer();
      var departmentCollection = new Hktdc.Collections.Department();
      departmentCollection.url = departmentCollection.url();
      departmentCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          // console.log('selectedUserCollection: ', self.model.toJSON().selectedUserCollection);
          // console.log('selectedUserCollection: ', self.model);
          deferred.resolve(departmentCollection);
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    renderProcessSelect: function() {
      var self = this;
      self.model.toJSON().processCollection.unshift({ ProcessID: '0', ProcessDisplayName: '-- All Workflow --' });
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().ProcessID,
        onSelected: function(process) {
          self.model.set({
            ProcessID: process.ProcessID,
            ProcessName: process.ProcessName
          });
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                StepID: null,
                stepCollection: stepCollection
              });
            });
        }
      });
      processSelectView.render();
      $('.workflowContainer', self.el).html(processSelectView.el);
    },

    renderTaskSelect: function() {
      var self = this;
      var stepSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON().TaskID,
        onSelected: function(stepId) {
          self.model.set({
            TaskID: stepId
          });
        }
      });
      stepSelectView.render();
      setTimeout(function() {
        $('.stepContainer', self.el).html(stepSelectView.el);
      });
    },

    renderUserSelect: function() {
      var self = this;
      var userView;
      if (Hktdc.Config.isAdmin) {
        userView = new Hktdc.Views.UserSelect({
          collection: self.model.toJSON().userCollection,
          selectedUser: self.model.toJSON().UserID,
          onSelected: function(selectedUser) {
            var userId = selectedUser.UserID;
            self.model.set({
              UserID: userId
            });
          }
        });

        userView.render();
        $('.userContainer', self.el).html(userView.el);
      }
    },

    renderDatePicker: function() {
      var self = this;
      // console.log(self.model.toJSON().DateFrom);
      // console.log(moment(self.model.toJSON().DateFrom).format('DD MMM YYYY'));
      var fromDateView = new Hktdc.Views.DatePicker({
        model: new Hktdc.Models.DatePicker({
          value: (self.model.toJSON().StartDate)
            ? moment(self.model.toJSON().StartDate).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          self.model.set({
            StartDate: (moment(val, 'YYYY-MM-DD').isValid())
              ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
              : ''
          });
        }
      });

      var toDateView = new Hktdc.Views.DatePicker({
        model: new Hktdc.Models.DatePicker({
          value: (self.model.toJSON().EndDate)
            ? moment(self.model.toJSON().EndDate).format('DD MMM YYYY')
            : null
        }),
        onSelect: function(val) {
          self.model.set({
            EndDate: (moment(val, 'YYYY-MM-DD').isValid())
              ? moment(val, 'YYYY-MM-DD').format('YYYYMMDD')
              : ''
          });
        }
      });
      $('.fromDatePicker', self.el).html(fromDateView.el);
      $('.toDatePicker', self.el).html(toDateView.el);
    },

    renderDepartmentSelection: function(departmentCollection) {
      try {
        var self = this;
        var departmentSelectView = new Hktdc.Views.DepartmentSelect({
          collection: departmentCollection,
          selectedDepartment: self.model.toJSON().Dept,
          onSelect: function(departmentId) {
            self.model.set({
              Dept: departmentId
            });
            self.loadDelegationUser(departmentId)
              .then(function(delegationUserCollection) {
                self.model.set({
                  DelegateUserID: null,
                  delegationUserCollection: delegationUserCollection
                });
              });
          }
        });
        departmentSelectView.render();
        $('.departmentContainer', self.el).html(departmentSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderActionSelect: function(actionCollection) {
      try {
        var self = this;
        var actionSelectView = new Hktdc.Views.DelegationActionSelect({
          collection: actionCollection,
          selectedDelegationAction: self.model.toJSON().Action,
          onSelect: function(departmentId) {
            self.model.set({
              Action: departmentId
            });
          }
        });
        actionSelectView.render();
        $('.actionContainer', self.el).html(actionSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderDelegationUserSelect: function() {
      var self = this;
      var DelegationUserView;
      if (Hktdc.Config.isAdmin) {
        DelegationUserView = new Hktdc.Views.DelegationUserSelect({
          collection: self.model.toJSON().delegationUserCollection,
          selectedDelegationUser: self.model.toJSON().DelegateUserID,
          onSelected: function(delegationUserId) {
            self.model.set({
              DelegateUserID: delegationUserId
            });
          }
        });

        DelegationUserView.render();
        $('.delegationUserContainer', self.el).html(DelegationUserView.el);
      }
    },

    updateFormModel: function(ev) {
      var updateObject = {};
      var $target = $(ev.target);
      var targetField = $target.attr('name');
      if ($target.is('select')) {
        updateObject[targetField] = $target.val();
      } else {
        updateObject[targetField] = $target.val();
      }
      this.model.set(updateObject);

      // this.model.set(updateObject, {
      // validate: true,
      // field: targetField
      // });
      // double set is to prevent invalid value bypass the set model process
      // because if saved the valid model, then set the invalid model will not success and the model still in valid state
    },

    saveDelegation: function() {
      // console.log(this.model.toJSON());
      this.doSaveDelegation()
        .then(function(response) {
          Hktdc.Dispatcher.trigger('openAlert', {
            type: 'success',
            title: 'Confirmation',
            message: 'Delegation is saved.'
          });
          window.history.back();
        })
        .catch(function(err) {
          Hktdc.Dispatcher.trigger('openAlert', {
            type: 'error',
            title: 'Confirmation',
            message: err
          });
        });
    },

    doSaveDelegation: function() {
      var deferred = Q.defer();
      var rawData = this.model.toJSON();
      var data = {
        UserID: rawData.UserID,
        ProcessID: rawData.ProcessID,
        TaskID: rawData.TaskID,
        Dept: rawData.Dept,
        DelegateUserID: rawData.DelegateUserID,
        StartDate: rawData.StartDate + ' ' + rawData.StartTime,
        EndDate: rawData.EndDate + ' ' + rawData.EndTime,
        Action: rawData.Action,
        Remark: rawData.Remark
      };

      var saveDelegationModel = new Hktdc.Models.SaveDelegation();
      saveDelegationModel.set(data);
      saveDelegationModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          message: err,
          type: 'error',
          title: 'Error'
        });
      });
      // console.log('is valid: ', saveDelegationModel.isValid());
      if (saveDelegationModel.isValid()) {
        var method = (saveDelegationModel.toJSON().DelegationId) ? 'PUT' : 'POST';
        saveDelegationModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: method,
          success: function(mymodel, response) {
            // console.log(response);
            if (response.Success) {
              deferred.resolve(response);
            } else {
              deferred.reject('save failed');
            }
          },
          error: function(model, e) {
            deferred.reject('Submit Request Error' + JSON.stringify(e, null, 2));
          }
        });
        // } else {
        //   deferred.reject('Please fill all the fields.');
      }
      return deferred.promise;
    },

    deleteDelegation: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: 'Are you sure to delete the delegation?',
        onConfirm: function() {
          self.doDeleteDelegation(self.model.toJSON().DelegationId)
            .then(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                type: 'success',
                title: 'confirmation',
                message: 'You have deleted the record!'
              });
              Hktdc.Dispatcher.trigger('closeConfirm');
              Backbone.history.navigate('emaildelegation', {
                trigger: true
              });
            })
            .catch(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                type: 'error',
                title: 'error',
                message: 'Error on deleting record.'
              });
            });
        }
      });
    },

    doDeleteDelegation: function(delegationId) {
      var deferred = Q.defer();
      var DeleteDelegationModel = Backbone.Model.extend({
        url: Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-delegations/' + delegationId
      });
      var DeleteDelegationtance = new DeleteDelegationModel();
      DeleteDelegationtance.save(null, {
        type: 'DELETE',
        beforeSend: utils.setAuthHeader,
        success: function(model, response) {
          // Hktdc.Dispatcher.trigger('reloadMenu');
          deferred.resolve();
        },
        error: function(err) {
          deferred.reject();
          console.log(err);
        }
      });
      return deferred.promise;
    }

  });
})();
