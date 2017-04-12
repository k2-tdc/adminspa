/* global Hktdc, Backbone, JST, Q, utils, $, _, sprintf, dialogMessage */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailProfile = Backbone.View.extend({

    template: JST['app/scripts/templates/emailProfile.ejs'],

    tagName: 'div',

    events: {
      'click .saveBtn': 'saveProfile',
      'click .delBtn': 'deleteProfile',
      'blur .formTextField': 'updateFormModel',
      'change [name="TimeSlot"]': 'updateFormModel',
      'change [name="DayOfWeek"]': 'updateFormModel'
        // 'click [name="DayOfWeek"] option': 'updateFormModel'
    },

    initialize: function() {
      // this.listenTo(this.model, 'change', this.render);
      if (this.model.toJSON().ProcessName) {
        setTimeout(function() {
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                stepCollection: stepCollection
              });
            });
        });
      }

      var self = this;
      self.model.on('change:stepCollection', function() {
        console.log('change step collection');
        self.renderStepSelect();
      });
    },

    render: function() {
      var self = this;
      // console.log(this.model.toJSON());
      this.$el.html(this.template(this.model.toJSON()));
      Q.all([
        self.loadProcess(),
        Q.fcall(function() {
          if (self.model.toJSON().showProfile) {
            return self.loadProfileUser();
          }
          return [];
        })
      ])
        .then(function(results) {
          var processCollection = results[0];
          var profileUserCollection = results[1];
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection,
            profileUserCollection: profileUserCollection
          }, {
            silent: true
          });
          self.renderProcessSelect();
          self.renderProfileUserSelect();
        })

        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: sprintf(dialogMessage.common.serverError.fail, err.request_id || 'unknown'),
            title: 'Error'
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
                deferred.reject({
                  request_id: false,
                  error: err
                });
              });
            } else {
              try {
                deferred.reject(JSON.parse(response.responseText));
              } catch (e) {
                console.error(response.responseText);
                deferred.reject({
                  request_id: false,
                  error: 'error on getting process'
                });
              }
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadProfileUser: function() {
      var deferred = Q.defer();
      var profileUserCollection = new Hktdc.Collections.ProfileUser();
      var doFetch = function() {
        profileUserCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(profileUserCollection);
          },
          error: function(collectoin, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject({
                  request_id: false,
                  error: err
                });
              });
            } else {
              try {
                deferred.reject(JSON.parse(response.responseText));
              } catch (e) {
                console.error(response.responseText);
                deferred.reject({
                  request_id: false,
                  error: 'error on getting profile users.'
                });
              }
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    loadStep: function() {
      var deferred = Q.defer();
      var stpeCollection = new Hktdc.Collections.Step();
      stpeCollection.url = stpeCollection.url(this.model.toJSON().ProcessName, encodeURI('Email Profile'));
      var doFetch = function() {
        stpeCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(stpeCollection);
          },
          error: function(collection, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doFetch();
              }, function(err) {
                deferred.reject({
                  error: err,
                  request_id: false
                });
              });
            } else {
              try {
                deferred.reject(JSON.parse(response.responseText));
              } catch (e) {
                console.error(response.responseText);
                deferred.reject({
                  request_id: false,
                  error: 'error on getting steps.'
                });
              }
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
      $('.processContainer', self.el).html(processSelectView.el);
    },

    renderStepSelect: function() {
      var self = this;
      var stepSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON().StepID,
        onSelected: function(stepId) {
          self.model.set({
            StepID: stepId
          });
        }
      });
      stepSelectView.render();
      setTimeout(function() {
        $('.stepContainer', self.el).html(stepSelectView.el);
      });
    },

    renderProfileUserSelect: function() {
      var self = this;
      var ProfileUserView;
      if (Hktdc.Config.isAdmin) {
        ProfileUserView = new Hktdc.Views.ProfileUserSelect({
          collection: self.model.toJSON().profileUserCollection,
          selectedProfileUser: self.model.toJSON().UserId,
          onSelected: function(profileUserId) {
            self.model.set({
              UserId: profileUserId
            });
          }
        });

        ProfileUserView.render();
      // } else {
      //   ProfileUserView = new Hktdc.Views.ProfileUserLabel({
      //     model: new Hktdc.Models.EmailProfile({FullName: Hktdc.Config.userName})
      //   });
        $('.profileUserContainer', self.el).html(ProfileUserView.el);
      }

      // console.log(ProfileUserView.el);
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

    saveProfile: function() {
      this.doSaveProfile()
        .then(function(response) {
          Hktdc.Dispatcher.trigger('openAlert', {
            title: 'Information',
            message: dialogMessage.emailProfile.save.success
          });
          window.history.back();
          // Backbone.history.navigate('emailprofile', {
          //   trigger: true
          // });
        })
        .catch(function(err) {
          Hktdc.Dispatcher.trigger('openAlert', {
            title: 'Error',
            message: sprintf(dialogMessage.emailProfile.save.fail, err.request_id || 'unknown')
          });
        });
    },

    doSaveProfile: function() {
      var deferred = Q.defer();
      Backbone.emulateHTTP = true;
      Backbone.emulateJSON = true;
      // console.log(this.model.toJSON());
      var data = {
        ProfileId: (this.model.toJSON().ProfileId) ? parseInt(this.model.toJSON().ProfileId) : 0,
        ProcessId: parseInt(this.model.toJSON().ProcessID),
        StepId: parseInt(this.model.toJSON().StepID),
        UserId: this.model.toJSON().UserId, // "Profile" in UI
        TimeSlot: parseInt(this.model.toJSON().TimeSlot),
        CC: '',
        BCC: ''
      };

      // var dayNameMapping
      for (var weekDay = 1; weekDay <= 7; weekDay++) {
        data['WeekDay' + weekDay] = (_.find(this.model.toJSON().DayOfWeek, function(selectedWeekDay, index) {
          return String(selectedWeekDay) === String(weekDay);
        })) ? 1 : 0;
      }

      var saveEmailProfileModel = new Hktdc.Models.SaveEmailProfile();
      saveEmailProfileModel.set(data);
      saveEmailProfileModel.on('invalid', function(model, err) {
        // console.log('invalid');
        // console.log(err);
        Hktdc.Dispatcher.trigger('openAlert', {
          message: err,
          title: 'Error'
        });
      });
      // console.log('is valid: ', saveEmailProfileModel.isValid());
      if (saveEmailProfileModel.isValid()) {
        var method = (saveEmailProfileModel.toJSON().ProfileId) ? 'PUT' : 'POST';
        saveEmailProfileModel.url = saveEmailProfileModel.url(data.ProfileId);
        var doSave = function() {
          saveEmailProfileModel.save({}, {
            beforeSend: utils.setAuthHeader,
            type: method,
            success: function(mymodel, response) {
              // console.log(response);
              if (response.success) {
                deferred.resolve(response);
              } else {
                deferred.reject({
                  error: 'save failed',
                  request_id: false
                });
              }
            },
            error: function(model, response) {
              if (response.status === 401) {
                utils.getAccessToken(function() {
                  doSave();
                }, function(err) {
                  deferred.reject({
                    request_id: false,
                    error: err
                  });
                });
              } else {
                try {
                  deferred.reject(JSON.parse(response.responseText));
                } catch (e) {
                  console.error(response.responseText);
                  deferred.reject({
                    request_id: false,
                    error: 'Save profile error'
                  });
                }
              }
            }
          });
        };
        doSave();
      }
      return deferred.promise;
    },

    deleteProfile: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: dialogMessage.emailProfile.delete.confirm,
        onConfirm: function() {
          self.doDeleteProfile(self.model.toJSON().ProfileId)
            .then(function() {
              Hktdc.Dispatcher.trigger('openAlert', {
                title: 'Information',
                message: dialogMessage.emailProfile.delete.success
              });
              Hktdc.Dispatcher.trigger('closeConfirm');
              Backbone.history.navigate('emailprofile', {
                trigger: true
              });
            })
            .catch(function(err) {
              Hktdc.Dispatcher.trigger('openAlert', {
                title: 'Error',
                message: sprintf(dialogMessage.emailProfile.delete.fail, err.request_id || 'unknown')
              });
            });
        }
      });
    },

    doDeleteProfile: function(profileId) {
      var deferred = Q.defer();
      var DeleteProfileModel = Backbone.Model.extend({
        url: Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-profiles/' + profileId
      });
      var DeleteProfiletance = new DeleteProfileModel();
      var doSave = function() {
        DeleteProfiletance.save(null, {
          type: 'DELETE',
          beforeSend: utils.setAuthHeader,
          success: function(model, response) {
            // Hktdc.Dispatcher.trigger('reloadMenu');
            deferred.resolve();
          },
          error: function(model, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doSave();
              }, function(err) {
                deferred.reject({
                  request_id: false,
                  error: err
                });
              });
            } else {
              try {
                deferred.reject(JSON.parse(response.responseText));
              } catch (e) {
                console.error(response.responseText);
                deferred.reject({
                  request_id: false,
                  error: 'error on deleting profile'
                });
              }
            }
          }
        });
      };
      doSave();
      return deferred.promise;
    }

  });
})();
