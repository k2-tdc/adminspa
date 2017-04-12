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
      /*if (self.model.toJSON().Dept) {
        setTimeout(function() {
          self.loadSharingUser(self.model.toJSON().Dept)
            .then(function(sharingUserCollection) {
              self.model.set({
                sharingUserCollection: sharingUserCollection
              });
            });
        });
      }*/

      self.model.on('change:stepCollection', function(model, stepCol) {
        self.renderTaskSelect();
      });
      /*self.model.on('change:sharingUserCollection', function() {
        self.renderSharingUserSelect();
      });*/
    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));

      Q.all([
        self.loadProcess(),
        self.loadFullUser(),
        self.loadDepartment(),
        self.loadPermission()
      ])
        .then(function(results) {
          var processCollection = results[0];
          var userCollection = results[1];
          var departmentCollection = results[2];
          var actionCollection = results[3];

          console.debug('[ sharing.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection,
            userCollection: userCollection
          }, {
            silent: true
          });
          if (self.model.toJSON().showUser) {
            self.renderUserSelect();
          }
          self.renderSharingUserSelect();
          self.renderProcessSelect();
          self.renderDepartmentSelection(departmentCollection);
          self.renderPermissionSelect(actionCollection);
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
      var doFetch = function() {
        processCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(processCollection);
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
              deferred.reject('error on getting process');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadFullUser: function() {
      var deferred = Q.defer();
      var userCollection = new Hktdc.Collections.FullUser();
      var doFetch = function() {
        userCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(userCollection);
          },
          error: function(collectoin, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on getting full user.');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadSharingUser: function(input) {
      var deferred = Q.defer();
      var departmentCode = (input === 'All') ? '' : input;
      var sharingUserCollection = new Hktdc.Collections.DelegationUser();
      sharingUserCollection.url = sharingUserCollection.url(departmentCode);
      var doFetch = function() {
        sharingUserCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(sharingUserCollection);
          },
          error: function(collectoin, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on getting sharing users.');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadPermission: function() {
      var deferred = Q.defer();
      var sharingPermissionCollection = new Hktdc.Collections.SharingPermission();
      sharingPermissionCollection.url = sharingPermissionCollection.url('Sharing');
      var doFetch = function() {
        sharingPermissionCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(sharingPermissionCollection);
          },
          error: function(collectoin, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on getting permission');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadTask: function() {
      var deferred = Q.defer();
      var stepCollection = new Hktdc.Collections.Step();
      stepCollection.url = stepCollection.url(this.model.toJSON().ProcessName, encodeURI('Delegation'));
      var doFetch = function() {
        stepCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(stepCollection);
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
              deferred.reject('error on getting task.');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadDepartment: function() {
      var deferred = Q.defer();
      var departmentCollection = new Hktdc.Collections.Department();
      departmentCollection.url = departmentCollection.url('sharing');
      var doFetch = function() {
        departmentCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            // console.log('selectedUserCollection: ', self.model.toJSON().selectedUserCollection);
            // console.log('selectedUserCollection: ', self.model);
            deferred.resolve(departmentCollection);
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
              deferred.reject('error on getting department');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    renderProcessSelect: function() {
      var self = this;
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

    renderTaskSelect: function() {
      var self = this;
      var stepSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON().TaskID,
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
        departmentCollection.unshift({
          DeptName: '-- All Department --',
          DeptCode: 'All'
        });
        var departmentSelectView = new Hktdc.Views.DepartmentSelect({
          collection: departmentCollection,
          selectedDepartment: self.model.toJSON().Dept,
          onSelect: function(departmentId) {
            self.model.set({
              Dept: departmentId
            });
            /*self.loadSharingUser(departmentId)
              .then(function(sharingUserCollection) {
                self.model.set({
                  DelegateUserID: null,
                  sharingUserCollection: sharingUserCollection
                });
              });*/
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
          selectedSharingPermission: self.model.toJSON().Permission,
          onSelect: function(permissionId) {
            self.model.set({
              Permission: permissionId
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
        collection: self.model.toJSON().userCollection,
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
        Dept: rawData.Dept || 'All',
        DelegateUserID: rawData.DelegateUserID,
        StartDate: rawData.StartDate + ' ' + rawData.StartTime,
        EndDate: rawData.EndDate + ' ' + rawData.EndTime,
        Permission: rawData.Permission,
        Remark: rawData.Remark
      };
      if (rawData.saveType === 'PUT') {
        data.DelegationID = rawData.DelegationID;
      }
      var saveSharingModel = new Hktdc.Models.SaveSharing();
      saveSharingModel.set(data);
      if (rawData.saveType === 'PUT') {
        saveSharingModel.url = saveSharingModel.url(parseInt(rawData.DelegationID));
      }
      saveSharingModel.on('invalid', function(model, err) {
        Hktdc.Dispatcher.trigger('openAlert', {
          message: err,
          type: 'error',
          title: 'Error'
        });
      });
      console.log(data);
      // console.log('is valid: ', saveSharingModel.isValid());
      if (saveSharingModel.isValid()) {
        var doSave = function() {
          saveSharingModel.save({}, {
            beforeSend: utils.setAuthHeader,
            type: rawData.saveType,
            success: function(mymodel, response) {
              // console.log(response);
              if (response.Success === "1" || response.Success === 1) {
                deferred.resolve(response);
              } else {
                deferred.reject(response.Msg);
              }
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
                deferred.reject('error on saving sharing.');
              }
            }
          });
        };
        doSave();
        // } else {
        //   deferred.reject('Please fill all the fields.');
      }
      return deferred.promise;
    },

    deleteSharing: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: dialogMessage.sharing.delete.confirm,
        onConfirm: function() {
          self.doDeleteSharing()
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

    doDeleteSharing: function() {
      var deferred = Q.defer();
      var deleteSharingModel = new Hktdc.Models.DeleteSharing();
      deleteSharingModel.url = deleteSharingModel.url(this.model.toJSON().DelegationID);
      var doSave = function() {
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
          error: function(model, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doSave();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on deleting sharing.');
            }
          }
        });
      };
      doSave();
      return deferred.promise;
    }

  });
})();
