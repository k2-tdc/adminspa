/* global Hktdc, Backbone, JST, utils, _,  $, Q, moment */

Hktdc.Views = Hktdc.Views || {};

(function() {
  'use strict';

  Hktdc.Views.EmailTemplateList = Backbone.View.extend({

    template: JST['app/scripts/templates/emailTemplateList.ejs'],

    events: {
      'click .saveBtn': 'doSearch'
        // 'click .advanced-btn': 'toggleAdvanceMode',
        // 'change .user-select': 'updateModelByEvent',
        // 'change .status-select': 'updateModelByEvent',
        // 'blur .search-field': 'updateModelByEvent',
        // 'blur .date': 'updateDateModelByEvent'
    },

    initialize: function(props) {
      console.debug('[ views/emailTemplateList.js ] - Initialize');
      $('#mainContent').removeClass('compress');
    },

    render: function() {
      // console.log(this.model.toJSON());
      // console.log(this.template());
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));
      Q.all([
          self.loadProcess(),
          self.loadStep()
        ])
        .then(function(results) {
          console.debug('[ emailTemplate.js ] - load all the remote resources');
          self.model.set({
            processCollection: results[0],
            stpeCollection: results[1]
          }, {
            silent: true
          });
          // console.log(results);

          self.renderProcessSelect();
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
      self.statusDataTable = $('#statusTable', self.el).DataTable({
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
                id: row.TemplateId,
                process: row.ProcessName,
                step: row.StepName,
                subject: row.Subject
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
          //   data: 'lastActionDate',
          //   render: function(data) {
          //     // return moment(data).format('DD MMM YYYY');
          //     // TODO: temp use belows
          //     return moment().format('DD MMM YYYY');
          //   }
          // }, {
          data: 'step'
        }, {
          data: 'subject'
        }]
      });

      $('#statusTable tbody', this.el).on('click', 'tr', function(ev) {
        var rowData = self.statusDataTable.row(this).data();
        console.log('rowData', rowData);
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
        collection: self.model.toJSON().processCollection
      });
      ProcessSelectView.render();
      $('.processContainer', self.el).html(ProcessSelectView.el);
    },

    renderStepSelect: function() {
      var self = this;
      var processSelectView = new Hktdc.Views.ProcessSelect({
        collection: self.model.toJSON().processCollection
      });
      processSelectView.render();
      $('.processContainer', self.el).html(processSelectView.el);
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
      var queryParams = _.omit(this.model.toJSON(), 'UserId', 'canChooseStatus', 'mode', 'searchUserType');
      // console.log(Backbone.history.getHash().split('?')[0]);
      var currentBase = Backbone.history.getHash().split('?')[0];
      Backbone.history.navigate(currentBase + utils.getQueryString(queryParams));
      this.statusDataTable.ajax.url(this.getAjaxURL()).load();
    },

    getAjaxURL: function() {
      var usefulData = _.pick(this.model.toJSON(), 'CStat', 'ReferID', 'FDate', 'TDate', 'Appl', 'UserId', 'SUser', 'ProsIncId', 'EmployeeId');
      var filterArr = _.map(usefulData, function(val, filter) {
        var value = (_.isNull(val)) ? '' : val;
        return filter + '=' + value;
      });
      return Hktdc.Config.apiURL + '/users/' + Hktdc.Config.userID + '/email-template-list?' + filterArr.join('&');
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
      var processCollection = new Hktdc.Collections.Step();
      processCollection.fetch({
        success: function() {
          deferred.resolve(processCollection);
        },
        error: function(collectoin, err) {
          deferred.reject(err);
        }
      });
      return deferred.promise;
    }
  });
})();
