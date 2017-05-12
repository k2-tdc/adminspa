var dialogTitle = {
  error: 'Error',
  confirmation: 'Confirmation',
  information: 'Information',
  warning: 'Warning'
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
      unknown: 'Unknown error. <br />%s'
    }
  },
  menu: {
    load: {
      error: 'Error on rendering menu'
    },
    permission: {
      error: 'Permission denied for accessing this page'
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
      success: 'Delegation is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      confirm: 'Do you want to delete the email template?',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
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
      success: 'Delegation is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      confirm: 'Do you want to delete the email profile?',
      success: 'Email profile is deleted.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
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
    save: {
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      confirm: 'Do you want to delete this user role?',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    }
  },
  userRoleMember: {
    loadDetail: {
      error: 'Error on getting user rule.'
    },
    save: {
      success: 'User Role Member is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      confirm: 'Do you want to delete this user role member?',
      success: 'User role memeber is deleted.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected user role member(s)?'
    }
  },
  rolePermission: {
    loadDetail: {
      error: 'Error on getting role permission detail'
    },
    loadList: {
      error: 'Error on getting role permission list'
    },
    save: {
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      confirm: 'Do you want to delete the role permission?',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    }
  },
  workerRule: {
    loadDetail: {
      error: 'Error on getting worker rule detail'
    },
    loadList: {
      error: 'Error on getting worker rule list'
    },
    delete: {
      confirm: 'Do you want to delete this rule?',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    save: {
      success: 'Delegation is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    }
  },
  workerRuleMember: {
    loadDetail: {
      error: 'Error on getting worker rule setting detail'
    },
    loadList: {
      error: 'Error on getting worker rule setting list'
    },
    delete: {
      confirm: 'Do you want to delete this rule settings?',
      success: 'Rule setting is deleted.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    save: {
      success: 'Rule setting is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected rule?'
    }
  },
  delegation: {
    loadDetail: {
      error: 'Error on getting delegation detail'
    },
    loadList: {
      error: 'Error on getting delegation list'
    },
    save: {
      success: 'Delegation is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      confirm: 'Do you want to delete the delegation?',
      success: 'Delegation is deleted.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected delegation(s)?',
      success: 'Delegation is deleted.'
    }
  },
  download: {
    attachment: {
      error: 'error on download attachment'
    },
    workerRulePreview: {
      error: 'error on download preview'
    }
  },
  sharing: {
    loadDetail: {
      error: 'Error on getting delegation detail'
    },
    loadList: {
      error: 'Error on getting delegation list'
    },
    save: {
      success: 'Sharing is saved.',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
    },
    delete: {
      success: 'Sharing is deleted.',
      confirm: 'Do you want to delete the sharing?',
      error: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s',
      fail: 'System failure. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: %(msg)s'
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
    roleList: {
      error: 'error on getting role'
    },
    permissionList: {
      error: 'error on getting process permission'
    },
    sharingUserList: {
      error: 'error on getting sharing users'
    },
    sharingPermissionList: {
      error: 'error on getting permission'
    }
  }
};

var validateMessage = {
  required: 'Please fill up this field',
  gt: 'Should be greater than %s',
  eitherRequired: 'Either %s is required.',
  conditionalRequired: '%s is required if %s'
};
