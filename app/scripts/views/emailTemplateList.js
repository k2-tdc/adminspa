/* global Hktdc, Backbone, JST, utils, _,  $, Q, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplateList = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplateList.ejs'],

    events: {
      'click .searchBtn': 'doSearch',
      'click .createBtn': 'goToCreatePage',
      'click .batchDeleteBtn': 'batchDeleteTemplate'
        // 'click .advanced-btn': 'toggleAdvanceMode',
        // 'change .user-select': 'updateModelByEvent',
        // 'change .status-select': 'updateModelByEvent',
        // 'blur .search-field': 'updateModelByEvent',
        // 'blur .date': 'updateDateModelByEvent'
    },

    initialize: function(props) {
      console.debug('[ views/emailTemplateList.js ] - Initialize');
      var self = this;
      $('#mainContent').removeClass('compress');
      if (this.model.toJSON().processId) {
        setTimeout(function() {
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                stepCollection: stepCollection
              });
            });
        });
      }
      self.model.on('change:stepCollection', function() {
        console.log('change step collection');
        self.renderStepSelect();
      });
    },

    render: function() {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));

      self.loadProcess()
        .then(function(processCollection) {
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            processCollection: processCollection
          }, {
            silent: true
          });
          self.renderProcessSelect();
          self.renderDataTable();
        })
        .catch(function(err) {
          console.error(err);
          Hktdc.Dispatcher.trigger('openAlert', {
            message: err,
            type: 'error',
            title: 'Runtime Error'
          });
        });

      /* Use DataTable's AJAX instead of backbone fetch and render */
      /* because to make use of DataTable function */
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

    loadStep: function() {
      var deferred = Q.defer();
      var stepCollection = new Hktdc.Collections.Step();
      stepCollection.url = stepCollection.url(this.model.toJSON().process, 'Email');
      var doFetch = function() {
        stepCollection.fetch({
          beforeSend: utils.setAuthHeader,
          success: function() {
            deferred.resolve(stepCollection);
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
              deferred.reject('error on getting step');
            }
          }
        });
      };
      doFetch();
      return deferred.promise;
    },

    renderDataTable: function() {
      var self = this;
      self.templateDataTable = $('#templateTable', self.el).DataTable({
        bRetrieve: true,
        order: [1, 'asc'],
        searching: false,
        processing: true,
        oLanguage: {
          sProcessing: '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'
        },
        ajax: {
          url: self.getAjaxURL(),
          beforeSend: utils.setAuthHeader,
          dataSrc: function(data) {
            // console.log(JSON.stringify({
            //   data: data
            // }, null, 2));
            var modData = _.map(data, function(row) {
              return {
                // lastActionDate: row.SubmittedOn,
                id: row.EmailTemplateID,
                process: row.ProcessName,
                step: row.StepName,
                subject: row.Subject,
                enabled: row.Enabled
              };
            });
            return modData;
            // return { data: modData, recordsTotal: modData.length };
          }
        },
        createdRow: function(row, data, index) {
          $(row).css({
            cursor: 'pointer'
          });
          $(row).hover(function() {
            $(this).addClass('highlight');
          }, function() {
            $(this).removeClass('highlight');
          });
          if (!data.enabled) {
            $(row).addClass('disabled');
          }
        },
        columns: [{
          data: 'id',
          render: function(data) {
            return '<input type="checkbox" class="selectTemplate"/>';
          },
          orderable: false
        }, {
          data: 'process'
        }, {
          data: 'step'
        }, {
          data: 'subject'
        }]
      });

      $('#templateTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.templateDataTable.row(this).data();
        Backbone.history.navigate('emailtemplate/' + rowData.id, {
          trigger: true
        });
      });

      $('#templateTable thead', this.el).on('change', '.checkAll', function(ev) {
        var $checkAllCheckbox = $(this);
        var isCheckAll = $checkAllCheckbox.prop('checked');
        $('#templateTable tbody tr', self.el).each(function() {
          var $checkbox = $(this).find('td:first-child').find('.selectTemplate');
          $checkbox.prop('checked', isCheckAll);
          var rowData = self.templateDataTable.row($(this)).data();

          var originalMember = self.model.toJSON().selectedTemplate;
          var newMember;

          if (isCheckAll) {
            newMember = _.union(originalMember, [rowData.id]);
          } else {
            newMember = _.reject(originalMember, function(memberGUID) {
              return rowData.id === memberGUID;
            });
          }
          self.model.set({
            selectedTemplate: newMember
          });
          // $checkbox.trigger('change');
        });
      });

      $('#templateTable tbody', this.el).on('click', 'td:first-child', function(ev) {
        ev.stopPropagation();
      });

      $('#templateTable tbody', this.el).on('change', '.selectTemplate', function(ev) {
        ev.stopPropagation();
        var rowData = self.templateDataTable.row($(this).parents('tr')).data();
        var originalMember = self.model.toJSON().selectedTemplate;
        var newMember;
        // console.log(originalMember);
        if ($(this).prop('checked')) {
          newMember = _.union(originalMember, [rowData.id]);
        } else {
          newMember = _.reject(originalMember, function(memberGUID) {
            return rowData.id === memberGUID;
          });
        }
        var allChecked = (
          $('#templateTable tbody tr', self.el).length ===
          $('#templateTable tbody .selectTemplate:checked', self.el).length
        );

        $('#templateTable thead .checkAll', self.el).prop('checked', allChecked);
        self.model.set({
          selectedTemplate: newMember
        });
      });
    },

    renderProcessSelect: function() {
      var self = this;
      var ProcessSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().processId,
        onSelected: function(process) {
          self.model.set({
            processId: process.ProcessID,
            process: process.ProcessName
          });
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                'activity-group': null,
                stepCollection: stepCollection
              });
            });
        }
      });
      ProcessSelectView.render();
      $('.processContainer', self.el).html(ProcessSelectView.el);
    },

    renderStepSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.StepSelect({
        collection: self.model.toJSON().stepCollection,
        selectedStep: self.model.toJSON()['activity-group'],
        onSelected: function(stepId) {
          self.model.set({
            'activity-group': stepId
          });
        }
      });
      processSelectView.render();
      $('.stepContainer', self.el).html(processSelectView.el);
    },

    deleteTemplate: function(input) {
      var deferred = Q.defer();
      var data = (_.isArray(input))
        ? _.map(input, function(tId) {
          return {TemplateId: tId };
        })
        : [{ TemplateId: input }];
      var DeleteTemplateModel = Backbone.Model.extend({
        url: Hktdc.Config.apiURL + '/email-templates/delete-templates'
      });
      var DeleteTemplateInstance = new DeleteTemplateModel({data: data});
      var doSave = function() {
        DeleteTemplateInstance.save(null, {
          type: 'POST',
          beforeSend: utils.setAuthHeader,
          success: function(model, response) {
            deferred.resolve(response);
          },
          error: function(collection, response) {
            if (response.status === 401) {
              utils.getAccessToken(function() {
                doSave();
              }, function(err) {
                deferred.reject(err);
              });
            } else {
              console.error(response.responseText);
              deferred.reject('error on deleting template');
            }
          }
        });
      };
      doSave();
      return deferred.promise;
    },

    goToCreatePage: function() {
      console.log('crash');
      Backbone.history.navigate('emailtemplate/new', {trigger: true});
    },

    updateModel: function(field, value) {
      var newObject = {};
      newObject[field] = value;
      console.log(newObject);
      this.model.set(newObject);
    },

    updateModelByEvent: function(ev) {
      var field = $(ev.target).attr('name');
      var value = $(ev.target).val();
      this.updateModel(field, value);
    },

    updateDateModelByEvent: function(ev) {
      var field = $(ev.target).attr('name');
      var value = '';
      if ($(ev.target).val()) {
        value = moment($(ev.target).val(), 'DD MMM YYYY').format('MM/DD/YYYY');
      }

      this.updateModel(field, value);
    },

    doSearch: function() {
      var queryParams = _.pick(this.model.toJSON(), 'processId', 'activity-group');
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.templateDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var queryParams = _.pick(this.model.toJSON(), 'process', 'activity-group');
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/email-templates' + queryString;
    },

    batchDeleteTemplate: function() {
      var self = this;
      Hktdc.Dispatcher.trigger('openConfirm', {
        title: 'confirmation',
        message: 'Are you sure to Delete?',
        onConfirm: function() {
          self.deleteTemplate(self.model.toJSON().selectedTemplate)
            .then(function(response) {
              Hktdc.Dispatcher.trigger('closeConfirm');
              if (String(response.success) === '1') {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'success',
                  title: 'confirmation',
                  message: 'Batch Deleted record'
                });

                self.templateDataTable.ajax.reload();
                // Hktdc.Dispatcher.trigger('reloadMenu');
              } else {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'error',
                  title: 'error',
                  message: response.Msg
                });
              }
            })
            .catch(function(err) {
              Hktdc.Dispatcher.trigger('openAlert', {
                type: 'error',
                title: 'error',
                message: 'delete failed'
              });
              console.error(err);
            });
        }
      });
    }
  });
})();
