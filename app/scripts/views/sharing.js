/* global Hktdc, Backbone, JST, Q, utils, $, _, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.Sharing = Backbone.View.extend({

    template: JST['app/scripts/templates/sharing.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveSharing',
      'click .delBtn': 'deleteSharing',
      'blur .formTextField': 'updateFormModel'
    },

    initialize: function() {
      var self = this;
      if (self.model.toJSON().ProcessID) {
        setTimeout(function() {
          if (String(self.model.toJSON().ProcessID) !== '0') {
            self.loadTask()
              .then(function(stepCollection) {
                self.model.set({
                  stepCollection: stepCollection
                });
              });
          } else {
            self.model.set({
              stepCollection: new Hktdc.Collections.Step([]),
              TaskID: 0
            });
          }
        });
      }

      self.model.on('change:stepCollection', function(model, stepCol) {
        self.renderTaskSelect(String(model.toJSON().ProcessID) === '0');
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
        self.loadPermission(),
        self.loadSharingUser()
      ])
        .then(function(results) {
          var processCollection = results[0];
          var userCollection = results[1];
          var departmentCollection = results[2];
          var actionCollection = results[3];
          var sharingUserCollection = results[4];

          console.debug('[ sharing.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection,
            userCollection: userCollection,
            sharingUserCollection: sharingUserCollection
          }, {
            silent: true
          });
          if (self.model.toJSON().showUser) {
            self.renderUserSelect();
          }
          self.renderProcessSelect();
          self.renderDepartmentSelection(departmentCollection);
          self.renderPermissionSelect(actionCollection);
          self.renderDatePicker();
          self.renderSharingUserSelect();
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

    loadSharingUser: function(departmentCode) {
      var deferred = Q.defer();
      var sharingUserCollection = new Hktdc.Collections.SharingUser();
      sharingUserCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(sharingUserCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadPermission: function() {
      var deferred = Q.defer();
      var sharingPermissionCollection = new Hktdc.Collections.SharingPermission();
      sharingPermissionCollection.url = sharingPermissionCollection.url('Sharing');
      sharingPermissionCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(sharingPermissionCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    loadTask: function() {
      var deferred = Q.defer();
      var stpeCollection = new Hktdc.Collections.Step();
      stpeCollection.url = stpeCollection.url(this.model.toJSON().ProcessName, encodeURI('Sharing'));
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
      self.model.toJSON().processCollection.unshift({
        ProcessID: 0,
        ProcessDisplayName: '-- All Workflow --',
        ProcessName: 'All'
      });
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().ProcessID,
        onSelected: function(process) {
          self.model.set({
            ProcessID: process.ProcessID,
            ProcessName: process.ProcessName
          });
          if (String(process.ProcessID) !== '0') {
            self.loadTask()
              .then(function(stepCollection) {
                self.model.set({
                  TaskID: 0,
                  stepCollection: stepCollection
                });
              });
          } else {
            self.model.set({
              TaskID: 0,
              stepCollection: new Hktdc.Collections.Step([])
            });
          }
        }
      });
      processSelectView.render();
      $('.workflowContainer', self.el).html(processSelectView.el);
    },

    renderTaskSelect: function(disabled) {
      var self = this;
      var stepSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON().TaskID,
        disabled: disabled,
        onSelected: function(taskId) {
          self.model.set({
            TaskID: taskId
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
          }
        });
        departmentSelectView.render();
        $('.departmentContainer', self.el).html(departmentSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderPermissionSelect: function(actionCollection) {
      try {
        var self = this;
        var actionSelectView = new Hktdc.Views.SharingPermissionSelect({
          collection: actionCollection,
          selectedSharingAction: self.model.toJSON().Permission,
          onSelect: function(departmentId) {
            self.model.set({
              Permission: departmentId
            });
          }
        });
        actionSelectView.render();
        $('.permissionContainer', self.el).html(actionSelectView.el);
      } catch (e) {
        console.error(e);
      }
    },

    renderSharingUserSelect: function() {
      var self = this;
      var SharingUserView = new Hktdc.Views.SharingUserSelect({
        collection: self.model.toJSON().sharingUserCollection,
        selectedSharingUser: self.model.toJSON().DelegateUserID,
        onSelected: function(sharingUserId) {
          self.model.set({
            DelegateUserID: sharingUserId
          });
        }
      });

      SharingUserView.render();
      $('.sharingUserContainer', self.el).html(SharingUserView.el);
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

    saveSharing: function() {
      // console.log(this.model.toJSON());
      this.doSaveSharing()
        .then(function(response) {
          Hktdc.Dispatcher.trigger('openAlert', {
            type: 'success',
            title: 'Confirmation',
            message: 'Sharing is saved.'
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

    doSaveSharing: function() {
      var deferred = Q.defer();
      var rawData = this.model.toJSON();
      var data = {
        UserID: (rawData.showUser) ? rawData.UserID : Hktdc.Config.userID,
        ProcessID: rawData.ProcessID || 0,
        TaskID: rawData.TaskID || 0,
        Dept: rawData.Dept,
        DelegateUserID: rawData.DelegateUserID,
        StartDate: rawData.StartDate + ' ' + rawData.StartTime,
        EndDate: rawData.EndDate + ' ' + rawData.EndTime,
        Action: rawData.Action,
        Remark: rawData.Remark
      };
      if (rawData.saveType === 'PUT') {
        data.SharingID = rawData.SharingID;
      }
      var saveSharingModel = new Hktdc.Models.SaveSharing();
      saveSharingModel.set(data);
      saveSharingModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          message: err,
          type: 'error',
          title: 'Error'
        });
      });
      // console.log('is valid: ', saveSharingModel.isValid());
      if (saveSharingModel.isValid()) {
        saveSharingModel.save({}, {
          beforeSend: utils.setAuthHeader,
          type: rawData.saveType,
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

    deleteSharing: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: 'Are you sure to delete the sharing?',
        onConfirm: function() {
          self.doDeleteSharing(self.model.toJSON().SharingId)
            .then(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                type: 'success',
                title: 'confirmation',
                message: 'You have deleted the record!'
              });
              Hktdc.Dispatcher.trigger('closeConfirm');
              window.history.back();
            })
            .catch(function(err) {
              console.error(err);
              Hktdc.Dispatcher.trigger('openAlert', {
                type: 'error',
                title: 'error',
                message: 'Error on deleting record.'
              });
            });
        }
      });
    },

    doDeleteSharing: function(sharingId) {
      var deferred = Q.defer();
      var deleteSharingModel = new Hktdc.Models.DeleteSharing();
      deleteSharingModel.url = deleteSharingModel.url(this.model.toJSON().SharingID);
      deleteSharingModel.save(null, {
        type: 'DELETE',
        beforeSend: utils.setAuthHeader,
        success: function(model, response) {
          if (String(response.Success) === '1') {
            deferred.resolve();
          } else {
            deferred.reject(response.Msg);
          }
        },
        error: function(err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }

  });
})();