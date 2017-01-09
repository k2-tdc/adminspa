/* global Hktdc, Backbone, JST, utils, _,  $, Q, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplateList = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplateList.ejs'],

    events: {
      'click .searchBtn': 'doSearch',
      'click .createBtn': 'goToCreatePage'
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
      if (this.model.toJSON().ProcessId) {
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
      processCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(collection, response) {
          deferred.reject(response);
        }
      });
      return deferred.promise;
    },

    loadStep: function() {
      var deferred = Q.defer();
      var stepCollection = new Hktdc.Collections.Step();
      stepCollection.url = stepCollection.url(this.model.toJSON().ProcessId);
      stepCollection.fetch({
        beforeSend: utils.setAuthHeader,
        success: function() {
          deferred.resolve(stepCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    },

    renderDatePicker: function() {
      var self = this;
      $('.datepicker-toggle-btn', self.el).mousedown(function(ev) {
        ev.stopPropagation();
        // $(this).prev().data('open');
        // console.log($(ev.target));
        var $target = $(ev.target).parents('.input-group').find('.date');
        var open = $target.data('open');
        // console.log(open);
        if (open) {
          $target.datepicker('hide');
        } else {
          $target.datepicker('show');
        }
      });
      $('.date', self.el)
        .datepicker({
          autoclose: true,
          format: {
            toDisplay: function(date, format, language) {
              return moment(date).format('DD MMM YYYY');
            },
            toValue: function(date, format, language) {
              return moment(date).format('MM/DD/YYYY');
            }
          }
        })
        .on('changeDate', function(ev) {
          var $input = ($(ev.target).is('input')) ? $(ev.target) : $(ev.target).find('input');
          var fieldName = $input.attr('name');
          var val = moment($(this).datepicker('getDate')).format('MM/DD/YYYY');
          // console.log(fieldName);
          // console.log(val);
          self.updateModel(fieldName, val);
        })
        .on('show', function(ev) {
          $(ev.target).data('open', true);
        })
        .on('hide', function(ev) {
          $(ev.target).data('open', false);
        });
    },

    renderDataTable: function() {
      var self = this;
      self.templateDataTable = $('#statusTable', self.el).DataTable({
        bRetrieve: true,
        order: [0, 'desc'],
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
          // if (data.condition) {
          // }
        },
        columns: [{
          data: 'process'
        }, {
          data: 'step'
        }, {
          data: 'subject'
        }, {
          data: 'delete',
          render: function(data) {
            return '<button type="button" class="form-control deleteBtn"><i class="glyphicon glyphicon-remove"></i></button>'
          }
        }]
      });

      $('#statusTable tbody', this.el).on('click', '.deleteBtn', function(ev) {
        ev.stopPropagation();
        var rowData = self.templateDataTable.row($(this).parents('tr')).data();
        var targetId = rowData.id;
        Hktdc.Dispatcher.trigger('openConfirm', {
          title: 'confirmation',
          message: 'Are you sure want to Delete?',
          onConfirm: function() {
            self.deleteTemplate(targetId)
              .then(function() {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'success',
                  title: 'confirmation',
                  message: 'deleted!'
                });
                Hktdc.Dispatcher.trigger('closeConfirm');
              })
              .catch(function() {
                Hktdc.Dispatcher.trigger('openAlert', {
                  type: 'error',
                  title: 'error',
                  message: 'delete failed'
                });
              });
          }
        });

        // console.log('rowData', rowData);
      });

      $('#statusTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.templateDataTable.row(this).data();
        // console.log('rowData', rowData);
        // var SNOrProcIdPath = '';
        // if ((rowData.SN)) {
        //   SNOrProcIdPath = '/' + rowData.SN;
        // } else {
        //   if (rowData.ProcInstID) {
        //     SNOrProcIdPath = '/' + rowData.ProcInstID;
        //   }
        // }
        // var typePath;
        // if (self.model.toJSON().mode === 'APPROVAL TASKS') {
        //   typePath = '/approval/';
        // } else if (self.model.toJSON().mode === 'ALL TASKS') {
        //   typePath = '/all/';
        // } else if (self.model.toJSON().mode === 'DRAFT') {
        //   typePath = '/draft/';
        // } else {
        //   typePath = '/check/';
        // }
        Backbone.history.navigate('emailtemplate/' + rowData.id, {
          trigger: true
        });
      });
    },

    renderProcessSelect: function() {
      var self = this;
      var ProcessSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection,
        selectedProcess: self.model.toJSON().ProcessId,
        onSelected: function(processId) {
          self.model.set({
            ProcessId: processId
          });
          self.loadStep()
            .then(function(stepCollection) {
              self.model.set({
                StepId: null,
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
        selectedStep: self.model.toJSON().StepId,
        onSelected: function(stepId) {
          self.model.set({
            StepId: stepId
          });
        }
      });
      processSelectView.render();
      $('.stepContainer', self.el).html(processSelectView.el);
    },

    deleteTemplate: function(tId) {
      var self = this;
      var deferred = Q.defer();
      var DeleteTemplateModel = Backbone.Model.extend({
        url: Hktdc.Config.apiURL + '/admin/users/' + Hktdc.Config.userID + '/email-template/' + tId
      });
      var DeleteTemplatetance = new DeleteTemplateModel();
      DeleteTemplatetance.save(null, {
        type: 'DELETE',
        beforeSend: utils.setAuthHeader,
        success: function(model, response) {
          self.templateDataTable.ajax.reload();
          Hktdc.Dispatcher.trigger('reloadMenu');
          deferred.resolve();
        },
        error: function(err) {
          deferred.reject();
          console.log(err);
        }
      });
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
      // console.log(this.model.toJSON());
      var queryParams = _.omit(this.model.toJSON(), 'stepCollection', 'processCollection', 'mode');
      // console.log(queryParams);
      // console.log(Backbone.history.getHash().split('?')[0]);
      var currentBase = Backbone.history.getHash().split('?')[0];
      var queryString = utils.getQueryString(queryParams, true);
      Backbone.history.navigate(currentBase + queryString);
      this.templateDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var queryParams = _.omit(this.model.toJSON(), 'stepCollection', 'processCollection', 'mode');
      var queryString = utils.getQueryString(queryParams, true);
      return Hktdc.Config.apiURL + '/admin/users/' + Hktdc.Config.userID + '/email-template-list' + queryString;
      /*
      console.log(this.model.);
      switch (this.model.toJSON().mode) {
        case 'DRAFT':
          statusApiURL = Hktdc.Config.apiURL + '/GetEmailTemplateList?' + filterArr.join('&');
          break;
        case 'ALL TASKS':
          statusApiURL = Hktdc.Config.apiURL + '/GetWorklist?' + filterArr.join('&');
          break;
        case 'APPROVAL TASKS':
          statusApiURL = Hktdc.Config.apiURL + '/GetApproveList?' + filterArr.join('&');
          break;
        case 'CHECK STATUS':
          statusApiURL = Hktdc.Config.apiURL + '/GetRequestList?' + filterArr.join('&');
          break;
        default:
          console.log('mode error');
          statusApiURL = Hktdc.Config.apiURL + '/GetRequestDetails?' + filterArr.join('&');
      }
      return statusApiURL;
      */
    }
  });
})();
