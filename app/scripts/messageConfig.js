var dialogTitle = {
  error: 'Error',
  confirmation: 'Confirmation',
  information: 'Information'
};

// this global variable ONLY store message displayed on DIALOG
var dialogMessage = {
  common: {
    invalid: {
      form: 'Input is missing/incorrect.'
    },
    error: {
      accessToken: 'Error on getting access token',
      system: 'System error. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      script: 'Script error. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      unknown: 'Unknown error. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    }
  },
  menu: {
    load: {
      error: 'Error on rendering menu'
    }
  },
  emailTemplate: {
    loadList: {
      error: 'Error on getting email template list'
    },
    loadDetail: {
      error: 'Error on getting email template detail'
    },
    save: {
      success: 'Delegation is saved.'
    },
    delete: {
      confirm: 'Do you want to delete the email template?'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected email template(s)?'
    }
  },
  emailProfile: {
    loadList: {
      error: 'Error on getting email profile list'
    },
    loadDetail: {
      error: 'Error on getting email profile detail'
    },
    save: {
      success: 'Delegation is saved.'
    },
    delete: {
      confirm: 'Do you want to delete the email profile?',
      success: 'Email profile is deleted.'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected profile(s)?'
    }
  },
  userRole: {
    loadList: {
      error: 'Error on getting user role list'
    },
    loadDetail: {
      error: 'Error on getting user role detail'
    },
    delete: {
      confirm: 'Do you want to delete this user role?'
    }
  },
  userRoleMember: {
    loadDetail: {
      error: 'Error on getting user rule.'
    },
    save: {
      success: 'User Role Member is saved.'
    },
    delete: {
      confirm: 'Do you want to delete this user role member?',
      success: 'User role memeber is deleted.'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected user role member(s)?'
    }
  },
  rolePermission: {
    loadDetail: {
      error: 'Error on getting role permission detail'
    },
    delete: {
      confirm: 'Do you want to delete the role permission?'
    }
  },
  workerRule: {
    loadDetail: {
      error: 'Error on getting worker rule detail'
    },
    delete: {
      confirm: 'Do you want to delete this rule?'
    },
    save: {
      success: 'Delegation is saved.'
    }
  },
  workerRuleMember: {
    loadDetail: {
      error: 'Error on getting worker rule setting detail'
    },
    delete: {
      confirm: 'Do you want to delete this rule settings?',
      success: 'Rule setting is deleted.'
    },
    save: {
      success: 'Rule setting is saved.'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected rule?'
    }
  },
  delegation: {
    loadDetail: {
      error: 'Error on getting delegation detail'
    },
    save: {
      success: 'Delegation is saved.'
    },
    delete: {
      confirm: 'Do you want to delete the delegation?',
      success: 'Delegation is deleted.'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected delegation(s)?',
      success: 'Delegation is deleted.'
    }
  },
  sharing: {
    loadDetail: {
      error: 'Error on getting delegation detail'
    },
    delete: {
      confirm: 'Do you want to delete the sharing?'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected sharing?'
    }
  },

  component: {
    departmentList: {
      error: 'Error on getting department.'
    },
    fullUserList: {
      error: 'Error on getting full user list.'
    },
    processList: {
      error: 'Error on getting process list'
    },
    delegationUserList: {
      error: 'error on getting delegation users'
    },
    delegationActionList: {
      error: 'error on getting delegation users'
    },
    stepList: {
      error: 'Error on getting task.'
    },
    ruleList: {
      error: 'error on getting rules'
    },
    natureList: {
      error: 'error on getting nature list'
    },
    gradeList: {
      error: 'error on getting grade list'
    },
    groupList: {
      error: 'error on grade list'
    },
    levelList: {
      error: 'error on getting level'
    },
    teamList: {
      error: 'error on getting team list'
    },
    teamFilterList: {
      error: 'error on getting team filter list'
    },
    fileRuleList: {
      error: 'error on getting file type rules.'
    },
    criteriaList: {
      error: 'error on getting criteria'
    },
    priorityList: {
      error: 'error on getting priority'
    },
    profileUserList: {
      error: 'error on getting profile users.'
    },
  }
};

var validateMessage = {
  required: 'Please fill up this field',
  gt: 'Should be greater than %s',
  eitherRequired: 'Either %s is required.',
  conditionalRequired: '%s is required if %s'
};
