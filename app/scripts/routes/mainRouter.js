/* global Hktdc, Backbone, utils, $, Q, _, moment */

Hktdc.Routers = Hktdc.Routers || {};

(function() {
  'use strict';

  Hktdc.Routers.Main = Backbone.Router.extend({
    routes: {
      '': 'emailProfileList',

      'emailtemplate': 'emailTemplateList',
      'emailtemplate/new': 'editEmailTemplate',
      'emailtemplate/:templateId': 'editEmailTemplate',

      'emailprofile': 'emailProfileList',
      'emailprofile/new': 'editEmailProfile',
      'emailprofile/:templateId': 'editEmailProfile',

      'userrole': 'userRoleList',
      'userrole/new': 'editUserRole',
      'userrole/:roleId': 'editUserRole',
      'userrole/:roleId/member/new': 'editUserRoleMember',
      'userrole/:roleId/member/:memberId': 'editUserRoleMember',

      'permission': 'rolePermissionList',
      'permission/new': 'editRolePermission',
      'permission/:permissionIds': 'editRolePermission',

      'worker-rule': 'workerRoleList',
      'worker-rule/new': 'editWorkerRule',
      'worker-rule/:workerRuleId': 'editWorkerRule',
      'worker-rule/:workerRuleId/member/new': 'editWorkerRuleMember',
      'worker-rule/:workerRuleId/member/:memberId': 'editWorkerRuleMember',

      'delegation': 'delegationList',
      'delegation/new': 'editDelegationDetail',
      'delegation/:delegationId': 'editDelegationDetail',

      'sharing': 'sharingList',
      'sharing/new': 'editSharingDetail',
      'sharing/:sharingId': 'editSharingDetail',

      'logout': 'logout'
    },

    initialize: function() {
      console.debug('[ mainRouter.js ] initialize');
      var self = this;
      var footerView = new Hktdc.Views.Footer();
      self.listenTo(Hktdc.Dispatcher, 'reloadRoute', function(route) {
        // console.debug('reloading route: ', route);
        Backbone.history.navigate(route, true);
        // Backbone.history.loadUrl(route, {trigger: true});
      });
    },

    emailTemplateList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var emailTemplateListModel = new Hktdc.Models.EmailTemplateList({});
          emailTemplateListModel.set({
            mode: 'EMAIL TEMPLATE',
            processId: utils.getParameterByName('processId'),
            'activity-group': utils.getParameterByName('activity-group')
          });
          var emailTemplateListView = new Hktdc.Views.EmailTemplateList({
            model: emailTemplateListModel
          });
          emailTemplateListView.render();
          $('#mainContent').empty().html(emailTemplateListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'EMAIL TEMPLATE'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editEmailTemplate: function(tId) {
      console.log('edit email template');
      Hktdc.Dispatcher.trigger('checkPagePermission', function() {
        try {
          $('#mainContent').addClass('compress');

          var emailTemplateModel = new Hktdc.Models.EmailTemplate({
            mode: 'EMAIL TEMPLATE'
          });
          var onSuccess = function() {
            var emailTemplateView = new Hktdc.Views.EmailTemplate({
              model: emailTemplateModel
            });
            emailTemplateView.render();
            $('#mainContent').empty().html(emailTemplateView.el);

            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'EMAIL TEMPLATE'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (tId) {
            emailTemplateModel.url = emailTemplateModel.url(tId);
            emailTemplateModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                emailTemplateModel.set({
                  TemplateId: tId,
                  ProcessId: emailTemplateModel.toJSON().ProcessID,
                  StepId: emailTemplateModel.toJSON().ActivityGroupID
                });
                onSuccess();
              },
              error: function(model, err) {
                throw err;
              }
            });
          } else {
            onSuccess();
          }
        } catch (e) {
          console.error(e);
        }
      });
    },

    emailProfileList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var emailProfileListModel = new Hktdc.Models.EmailProfileList({});
          emailProfileListModel.set({
            mode: 'EMAIL PROFILE',
            profile: utils.getParameterByName('profile'),
            showSearch: Hktdc.Config.isAdmin
          });
          var emailProfileListView = new Hktdc.Views.EmailProfileList({
            model: emailProfileListModel
          });
          emailProfileListView.render();
          $('#mainContent').empty().html(emailProfileListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'EMAIL PROFILE'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editEmailProfile: function(profileId) {
      // console.log('edit email template');
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');

          var emailProfileModel = new Hktdc.Models.EmailProfile({
            mode: 'EMAIL PROFILE'
          });
          var onSuccess = function() {
            var emailProfileView = new Hktdc.Views.EmailProfile({
              model: emailProfileModel
            });
            emailProfileView.render();
            $('#mainContent').empty().html(emailProfileView.el);

            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'EMAIL PROFILE'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (profileId) {
            emailProfileModel.url = emailProfileModel.url(profileId);
            emailProfileModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                var dayOfWeek = [];
                if (emailProfileModel.toJSON().WeekDay1) {
                  dayOfWeek.push('1');
                }
                if (emailProfileModel.toJSON().WeekDay2) {
                  dayOfWeek.push('2');
                }
                if (emailProfileModel.toJSON().WeekDay3) {
                  dayOfWeek.push('3');
                }
                if (emailProfileModel.toJSON().WeekDay4) {
                  dayOfWeek.push('4');
                }
                if (emailProfileModel.toJSON().WeekDay5) {
                  dayOfWeek.push('5');
                }
                if (emailProfileModel.toJSON().WeekDay6) {
                  dayOfWeek.push('6');
                }
                if (emailProfileModel.toJSON().WeekDay7) {
                  dayOfWeek.push('7');
                }
                emailProfileModel.set({
                  ProfileId: emailProfileModel.toJSON().EmailNotificationProfileID,
                  ProcessId: emailProfileModel.toJSON().ProcessID,
                  StepId: emailProfileModel.toJSON().StepID,
                  TimeSlot: emailProfileModel.toJSON().TimeSlot,
                  UserId: emailProfileModel.toJSON().UserID || Hktdc.Config.userID,
                  showProfile: Hktdc.Config.isAdmin,
                  DayOfWeek: dayOfWeek,
                  showDelete: true
                });
                onSuccess();
              },
              error: function(model, err) {
                throw err;
              }
            });
          } else {
            emailProfileModel.set({
              UserId: Hktdc.Config.userID,
              showProfile: Hktdc.Config.isAdmin
            });
            onSuccess();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    userRoleList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var userRoleListModel = new Hktdc.Models.UserRoleList({});
          userRoleListModel.set({
            mode: 'User Role',
            profile: utils.getParameterByName('profile'),
            showSearch: Hktdc.Config.isAdmin
          });
          var emailProfileListView = new Hktdc.Views.UserRoleList({
            model: userRoleListModel
          });
          emailProfileListView.render();
          $('#mainContent').empty().html(emailProfileListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'USER ROLE'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editUserRole: function(userRoleId) {
      // console.log('edit email template');
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');

          var userRoleModel = new Hktdc.Models.UserRole({
            showMember: !!userRoleId,
            saveType: (userRoleId) ? 'PUT' : 'POST'
          });
          var onSuccess = function() {
            var userRoleView = new Hktdc.Views.UserRole({
              model: userRoleModel
            });
            userRoleView.render();
            $('#mainContent').empty().html(userRoleView.el);

            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'USER ROLE'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (userRoleId) {
            userRoleModel.url = userRoleModel.url(userRoleId);
            userRoleModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                onSuccess();
              },
              error: function(model, err) {
                throw err;
              }
            });
          } else {
            onSuccess();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    editUserRoleMember: function(userRoleId, memberId) {
      console.log('edit role member', memberId);
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');
          var userRoleMemberModel;
          var userRoleMemberView;
          var getUserRole = function() {
            var userRoleModel = new Hktdc.Models.UserRole({
              showMember: !!userRoleId,
              saveType: (userRoleId) ? 'PUT' : 'POST'
            });
            var deferred = Q.defer();
            userRoleModel.url = userRoleModel.url(userRoleId);
            userRoleModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                deferred.resolve(userRoleModel.toJSON());
              },
              error: function(model, err) {
                deferred.reject();
              }
            });
            return deferred.promise;
          };
          var onSuccess = function() {
            userRoleMemberView.render();
            $('#mainContent').empty().html(userRoleMemberView.el);
            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'USER ROLE Member'
            });
            subheaderMenuListView.render();

            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };
          // var renderUserRoleMember = function(userRole) {

          // edit
          if (memberId) {
            userRoleMemberModel = new Hktdc.Models.EditUserRoleMember({
              saveType: 'PUT'
            });
            userRoleMemberModel.url = userRoleMemberModel.url(memberId);
            userRoleMemberModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                userRoleMemberView = new Hktdc.Views.EditUserRoleMember({
                  model: userRoleMemberModel
                });
                onSuccess();
              },
              error: function(err) {
                console.error(err);
              }
            });
          // create
          } else {
            getUserRole()
              .then(function(userRole) {
                userRoleMemberModel = new Hktdc.Models.CreateUserRoleMember({
                  saveType: 'POST',
                  Role: userRole.Role,
                  UserRoleGUID: userRole.UserRoleGUID
                });
                userRoleMemberView = new Hktdc.Views.CreateUserRoleMember({
                  model: userRoleMemberModel
                });

                onSuccess();
              });
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    rolePermissionList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var rolePermissionListModel = new Hktdc.Models.RolePermissionList({});
          rolePermissionListModel.set({
            mode: 'User Permission',
            profile: utils.getParameterByName('profile'),
            showSearch: Hktdc.Config.isAdmin
          });
          var emailProfileListView = new Hktdc.Views.RolePermissionDetailList({
            model: rolePermissionListModel
          });
          emailProfileListView.render();
          $('#mainContent').empty().html(emailProfileListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'USER PERMISSION'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editRolePermission: function(rolePermissionIds) {
      console.log('edit role permission');
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');

          // var rolePermissionIdArray = rolePermissionIds.split(',');
          var loadRolePermission = function(permissionId) {
            var deferred = Q.defer();
            var permissionModel = new Hktdc.Models.RolePermission();
            permissionModel.url = permissionModel.url(permissionId);
            permissionModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                deferred.resolve(permissionModel);
              },
              error: function(err) {
                deferred.reject(err);
              }
            });
            return deferred.promise;
          };

          var onSuccess = function(isCreateRecord, data) {
            var ProcessId = '';
            var ProcessName = '';
            var MenuItemGUID = '';
            var rolePermissionCollection;
            if (data) {
              ProcessId = data.toJSON().ProcessId;
              ProcessName = data.toJSON().ProcessName;
              MenuItemGUID = data.toJSON().MenuItemGUID;
              var permissions = _.map(data.toJSON().Role, function(permission) {
                return {
                  RolePermissionGUID: permission.RolePermissionGUID,
                  MenuItemGUID: MenuItemGUID,
                  UserRoleGUID: permission.UserRoleGUID
                };
              });
              rolePermissionCollection = new Hktdc.Collections.SaveRolePermission(permissions);
              // console.log(rolePermissionCollection.toJSON());
            } else {
              rolePermissionCollection = new Hktdc.Collections.SaveRolePermission([]);
            }

            var rolePermissionModel = new Hktdc.Models.RolePermissionDetail({
              disableProcessSelect: !isCreateRecord,
              saveType: (isCreateRecord) ? 'POST' : 'PUT',
              showDelete: !isCreateRecord,
              permissionCollection: rolePermissionCollection,
              ProcessId: ProcessId,
              deletePermissionArray: [],
              ProcessName: ProcessName,
              MenuItemGUID: MenuItemGUID
            });

            // console.log(rolePermissionModel.toJSON());
            var userRoleView = new Hktdc.Views.RolePermissionDetail({
              model: rolePermissionModel
            });
            userRoleView.render();
            $('#mainContent').empty().html(userRoleView.el);

            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'ROLE PERMISSION'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (rolePermissionIds) {
            // Q.all(_.map(rolePermissionIdArray, function(rolePermissionId) {
            //   return loadRolePermission(rolePermissionId);
            // }))
            loadRolePermission(rolePermissionIds)
              .then(function(results) {
                // console.log('results: ', results.toJSON());
                onSuccess(false, results);
              })
              .fail(function(err) {
                console.error(err);
              });
          } else {
            onSuccess(true);
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    workerRoleList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var workerRuleListModel = new Hktdc.Models.WorkerRuleList({});
          workerRuleListModel.set({
            profile: utils.getParameterByName('profile'),
            showSearch: Hktdc.Config.isAdmin
          });
          var workerRoleListView = new Hktdc.Views.WorkerRuleList({
            model: workerRuleListModel
          });
          workerRoleListView.render();
          $('#mainContent').empty().html(workerRoleListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'WORKER ROLE'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editWorkerRule: function(workerRuleId) {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');

          var workerRuleModel = new Hktdc.Models.WorkerRule({
            showRules: !!workerRuleId,
            saveType: (workerRuleId) ? 'PUT' : 'POST'
          });
          var onSuccess = function() {
            var userRoleView = new Hktdc.Views.WorkerRule({
              model: workerRuleModel
            });
            userRoleView.render();
            $('#mainContent').empty().html(userRoleView.el);

            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'WORKER RULE'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (workerRuleId) {
            workerRuleModel.url = workerRuleModel.url(workerRuleId);
            workerRuleModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                onSuccess();
              },
              error: function(model, err) {
                throw err;
              }
            });
          } else {
            onSuccess();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    editWorkerRuleMember: function(userRoleId, memberId) {
      console.log('edit role member', memberId);
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');
          var workerRuleMemberModel;
          var workerRuleMemberView;
          var getWorkerRule = function() {
            var workerRuleModel = new Hktdc.Models.WorkerRule({
              saveType: (userRoleId) ? 'PUT' : 'POST'
            });
            var deferred = Q.defer();
            workerRuleModel.url = workerRuleModel.url(userRoleId);
            workerRuleModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function() {
                deferred.resolve(workerRuleModel.toJSON());
              },
              error: function(model, err) {
                deferred.reject();
              }
            });
            return deferred.promise;
          };
          var onSuccess = function(renderByRule) {
            if (renderByRule) {
              setTimeout(function() {
                workerRuleMemberView.renderField(renderByRule);
              });
            } else {
              workerRuleMemberView.render();
            }
            $('#mainContent').empty().html(workerRuleMemberView.el);
            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'WORKER RULE SETTING'
            });
            subheaderMenuListView.render();

            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };
          // var renderUserRoleMember = function(userRole) {

          getWorkerRule()
            .then(function(workerRule) {
              // edit
              if (memberId) {
                workerRuleMemberModel = new Hktdc.Models.WorkerRuleMember();
                workerRuleMemberModel.url = workerRuleMemberModel.url(memberId);
                workerRuleMemberModel.fetch({
                  beforeSend: utils.setAuthHeader,
                  success: function() {
                    // console.log(workerRuleMemberModel.toJSON().DateFrom);
                    // console.log(moment(workerRuleMemberModel.toJSON().DateFrom).format('DD MMM YYYY'));
                    workerRuleMemberModel.set({
                      saveType: 'PUT',
                      ProcessDisplayName: workerRule.ProcessDisplayName,
                      Code: workerRule.Code,
                      Worker: workerRule.Worker
                      // DateFrom: moment(workerRuleMemberModel.toJSON().DateFrom).format(''),
                      // DateTo: moment(workerRuleMemberModel.toJSON().DateTo).format(''),
                    });
                    workerRuleMemberView = new Hktdc.Views.EditWorkerRuleMember({
                      model: workerRuleMemberModel
                    });
                    // console.log(workerRuleMemberModel.toJSON().Rule);
                    onSuccess(workerRuleMemberModel.toJSON().Rule);
                  },
                  error: function(err) {
                    console.error(err);
                  }
                });
              // create
              } else {
                _.extend(workerRule, { saveType: 'POST' });
                workerRule.Remark = '';
                workerRule.Score = '';
                workerRuleMemberModel = new Hktdc.Models.WorkerRuleMember(workerRule);
                workerRuleMemberView = new Hktdc.Views.EditWorkerRuleMember({
                  model: workerRuleMemberModel
                });

                onSuccess();
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        });
      } catch (e) {
        console.error(e);
      }
    },

    delegationList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var delegationListModel = new Hktdc.Models.DelegationList({});
          delegationListModel.set({
            showSearch: Hktdc.Config.isAdmin,
            UserId: utils.getParameterByName('UserId')
          });
          var delegationListView = new Hktdc.Views.DelegationList({
            model: delegationListModel
          });
          delegationListView.render();
          $('#mainContent').empty().html(delegationListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'DELEGATION'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editDelegationDetail: function(delegationId) {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');

          var delegationModel = new Hktdc.Models.Delegation({
            showUser: Hktdc.Config.isAdmin,
            showDelete: !!delegationId,
            saveType: (delegationId) ? 'PUT' : 'POST'
          });
          var onSuccess = function() {
            var delegationView = new Hktdc.Views.Delegation({
              model: delegationModel
            });
            delegationView.render();
            $('#mainContent').empty().html(delegationView.el);
            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'DELEGATION'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (delegationId) {
            delegationModel.url = delegationModel.url(delegationId);
            delegationModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function(model) {
                delegationModel.set({
                  StartDate: moment(model.toJSON().StartDate).format('YYYY-MM-DD'),
                  StartTime: moment(model.toJSON().StartDate).format('HH:mm'),
                  EndDate: moment(model.toJSON().EndDate).format('YYYY-MM-DD'),
                  EndTime: moment(model.toJSON().EndDate).format('HH:mm')
                });
                onSuccess();
              },
              error: function(model, err) {
                throw err;
              }
            });
          } else {
            onSuccess();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    sharingList: function() {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          var sharingListModel = new Hktdc.Models.SharingList({});
          sharingListModel.set({
            showSearch: Hktdc.Config.isAdmin,
            UserId: utils.getParameterByName('UserId')
          });
          var sharingListView = new Hktdc.Views.SharingList({
            model: sharingListModel
          });
          sharingListView.render();
          $('#mainContent').empty().html(sharingListView.el);

          var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
          var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
            collection: subheaderMenuListCollection,
            currentPageName: 'SHARING'
          });
          subheaderMenuListView.render();
          $('.subheader-menu-container').html(subheaderMenuListView.el);
        });
      } catch (e) {
        console.error(e);
      }
    },

    editSharingDetail: function(delegationId) {
      try {
        Hktdc.Dispatcher.trigger('checkPagePermission', function() {
          $('#mainContent').addClass('compress');

          var sharingModel = new Hktdc.Models.Sharing({
            showUser: Hktdc.Config.isAdmin,
            showDelete: !!delegationId,
            saveType: (delegationId) ? 'PUT' : 'POST'
          });
          var onSuccess = function() {
            var delegationView = new Hktdc.Views.Sharing({
              model: sharingModel
            });
            delegationView.render();
            $('#mainContent').empty().html(delegationView.el);
            var subheaderMenuListCollection = new Hktdc.Collections.SubheaderMenu();
            var subheaderMenuListView = new Hktdc.Views.SubheaderMenuList({
              collection: subheaderMenuListCollection,
              currentPageName: 'SHARING'
            });
            subheaderMenuListView.render();
            $('.subheader-menu-container').html(subheaderMenuListView.el);
          };

          if (delegationId) {
            sharingModel.url = sharingModel.url(delegationId);
            sharingModel.fetch({
              beforeSend: utils.setAuthHeader,
              success: function(model) {
                sharingModel.set({
                  StartDate: moment(model.toJSON().StartDate).format('YYYY-MM-DD'),
                  StartTime: moment(model.toJSON().StartDate).format('HH:mm'),
                  EndDate: moment(model.toJSON().EndDate).format('YYYY-MM-DD'),
                  EndTime: moment(model.toJSON().EndDate).format('HH:mm')
                });
                onSuccess();
              },
              error: function(model, err) {
                throw err;
              }
            });
          } else {
            onSuccess();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },

    logout: function() {
      var logoutView = new Hktdc.Views.Logout();
      $('#mainContent').html(logoutView.el);
    }
  });
})();
