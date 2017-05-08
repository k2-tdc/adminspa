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
      system: 'System error. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: $(msg)s',
      script: 'System error. You are welcomed to contact the Helpdesk 24-hours hotline 852-2892-4848 for questions or further assistance. <br />Error code: %(code)s <br />Error message: $(msg)s',
      unknown: 'Unknown error: <br />%(msg)s'
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
  delegation: {
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
  workerRule: {
    delete: {
      confirm: 'Do you want to delete this rule?'
    },
    save: {
      success: 'Delegation is saved.'
    }
  },
  workerRuleMember: {
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
  sharing: {
    delete: {
      confirm: 'Do you want to delete the sharing?'
    },
    batchDelete: {
      confirm: 'Do you want to delete the selected sharing?'
    }
  }
};

var validateMessage = {
  required: 'Please fill up this field',
  gt: 'Should be greater than %s',
  eitherRequired: 'Either %s is required.',
  conditionalRequired: '%s is required if %s'
};
