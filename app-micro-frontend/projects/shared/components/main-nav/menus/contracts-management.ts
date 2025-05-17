import {MenuOption} from '../menu-options';

export const ContractsManagement: MenuOption[] = [
  {
    name: 'Contracts Management',
    shortName: 'Contracts Management',
    authority: 'ROLE_MODULE_CONTRACTS_MANGMNT',
    permission: [
      {
        key: 'ROLE_MODULE_CONTRACTS_MANGMNT',
        action: 'View contracts management',
      },
    ],
    route: ['', 'modules', 'contracts-management'],
    pathRoute: ['', 'modules', 'contracts-management', 'management'],
    description: 'Contracts Management',
    icon: 'contract',
    iconType: 'SVG',
    children: [
      {
        name: ' Dashboard',
        authority: 'ROLE_CONTRACTS_MANGMNT_DSHBRD',
        permission: [
          {
            key: 'ROLE_CONTRACTS_MANGMNT_DSHBRD',
            action: 'View contract management dashboard',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'management'],
        icon: 'contract',
        iconType: 'SVG',
      },
      {
        name: 'All Contracts',
        authority: 'ROLE_CONTRACTS_MANGMNT_CNTCT_LST',
        permission: [
          {
            key: 'ROLE_CONTRACTS_MANGMNT_CNTCT_LST',
            action: 'View contract list',
          },
          {
            key: 'ROLE_CONTRACT_MANGMNT_CREATE',
            action: 'Create contract',
          },
          {
            key: 'ROLE_CONTRACT_MANGMNT_DELETE',
            action: 'Delete contract',
          },
          {
            key: 'ROLE_CONTRACT_MANGMNT_EDIT',
            action: 'Edit contract',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'list'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Contracts In Commencement',
        authority: 'ROLE_CONTRACTS_MANGMNT_COMMENCEMENT_LST',
        permission: [
          {
            key: 'ROLE_CONTRACTS_MANGMNT_COMMENCEMENT_LST',
            action: 'View Contracts In Commencement',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'in-commencement'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Contracts In Implementation',
        authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL',
            action: 'View contract implementation',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'in-implementation'],
        children: [
          {
            name: 'All Contract',
            authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_ALL',
            route: ['', 'modules', 'contracts-management', 'in-implementation', 'all'],
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_ALL',
                action: 'View all contract implementation',
              },
            ]
          },
          {
            name: 'Assigned Contract',
            authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_ALL_ASSGND',
            route: ['', 'modules', 'contracts-management', 'in-implementation', 'assigned'],
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_ALL_ASSGND',
                action: 'View assigned contract for implementation',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_CRT',
                action: 'Create contract implementation',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_MNG',
                action: 'Manage contract implementation',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_MNG_ACTVTS',
                action: 'Manage contract implementation activities',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_MNG_MTNGS',
                action: 'Manage contract implementation meeting',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_IMPL_MNG_CLS',
                action: 'Manage contract closure',
              },
            ]
          },
        ],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Contract Payment',
        shortName: 'Contract Payments',
        authority: 'ROLE_TNDR_CONTRACT_PYMNT_RQST',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_PYMNT_RQST',
            action: 'Contract Payments Menu',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'contract-payments'],
        description: 'Contract Payments',
        icon: 'settings',
        iconType: 'SVG',
        key: 'contract-payment-request',
        children: [
          {
            name: 'All Payment Requests',
            authority: 'ROLE_TNDR_CONTRACT_PYMNT_RQSTS',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_PYMNT_RQSTS',
                action: 'View all Contract Payment requests',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-payments',
              'all-contract-payment-request',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Assigned Payment Requests',
            authority: 'ROLE_TNDR_CONTRACT_PYMNT_RQSTS_ASSGND',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_PYMNT_RQSTS_ASSGND',
                action: 'View Assigned Contract Payment requests',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-payments',
              'assigned-contract-payment-request',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Payment request tasks',
            authority: 'ROLE_TNDR_CONTRACT_PYMNT_RQST_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_PYMNT_RQST_TASK',
                action: 'View contract request tasks',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_PYMNT_RQST_TASK_RESPOND',
                action: 'Respond to contract payment request tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-payments',
              'contract-payment-request-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      // {
      //   name: 'Contract Variation Requests',
      //   shortName: 'Contract Variation Requests',
      //   authority: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
      //   permission: [
      //     {
      //       key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
      //       action: 'Contract Variations Menu',
      //     },
      //   ],
      //   route: ['', 'modules', 'contracts-management', 'contract-variation-requests'],
      //   description: 'Contract Variation Request',
      //   icon: 'settings',
      //   iconType: 'SVG',
      //   key: 'contract-variations-requests',
      //   children: [
      //     {
      //       name: 'Contract Variation Requests',
      //       authority: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
      //       permission: [
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
      //           action: 'Contract Variations requests',
      //         },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'contracts-management',
      //         'contract-variation-requests',
      //         'contract-variation-request',
      //       ],
      //       icon: 'tasks',
      //       iconType: 'SVG',
      //     },
      //     {
      //       name: 'Contract Variation Request tasks',
      //       authority: 'ROLE_TNDR_CONTRACT_VARIATION_RQST_TASK',
      //       permission: [
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST_TASK',
      //           action: 'View contract variation request tasks',
      //         },
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST_TASK_TASK_RESPOND',
      //           action: 'Respond to contract variations request tasks',
      //         },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'contracts-management',
      //         'contract-variation-requests',
      //         'contract-variation-request-tasks',
      //       ],
      //       icon: 'tasks',
      //       iconType: 'SVG',
      //     },
      //   ],
      // },
      // {
      //   name: 'Contract Variations',
      //   shortName: 'Contract Variations',
      //   authority: 'ROLE_TNDR_CONTRACT_VARIATIONS',
      //   permission: [
      //     {
      //       key: 'ROLE_TNDR_CONTRACT_VARIATIONS',
      //       action: 'Contract Variations Menu',
      //     },
      //   ],
      //   route: ['', 'modules', 'contracts-management', 'contract-variations'],
      //   description: 'Contract Variations',
      //   icon: 'settings',
      //   iconType: 'SVG',
      //   key: 'contract-variations',
      //   children: [
      //     {
      //       name: 'Contract Variations',
      //       authority: 'ROLE_TNDR_CONTRACT_VARIATIONS',
      //       permission: [
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_VARIATIONS',
      //           action: 'View Contract Variations',
      //         },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'contracts-management',
      //         'contract-variations',
      //         'contract-variations',
      //       ],
      //       icon: 'tasks',
      //       iconType: 'SVG',
      //     },
      //     {
      //       name: 'Contract Variations tasks',
      //       authority: 'ROLE_TNDR_CONTRACT_VARIATION_TASKS',
      //       permission: [
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_VARIATION_TASKS',
      //           action: 'View contract variation tasks',
      //         },
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_VARIATION_TASK_RESPOND',
      //           action: 'Respond to contract variation tasks',
      //         },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'contracts-management',
      //         'contract-variations',
      //         'contract-variation-tasks',
      //       ],
      //       icon: 'tasks',
      //       iconType: 'SVG',
      //     },
      //   ],
      // },
      {
        name: 'Contract Addendum',
        shortName: 'Contract Addendum',
        authority: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMT',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
            action: 'Contract Variations Menu',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_VARIATIONS',
            action: 'Contract Variations Menu',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMT',
            action: 'Contract Addendum Management',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_EXTENSION_MNGMT',
            action: 'Contract Extension',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'contract-addendum'],
        description: 'Contract Addendum',
        icon: 'settings',
        iconType: 'SVG',
        key: 'contract-addendum-management',
        children: [
          {
            name: 'Contract Variation Requests',
            authority: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST',
                action: 'Contract Variations requests',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-variation-requests',
              'contract-variation-request',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Contract Variation Request tasks',
            authority: 'ROLE_TNDR_CONTRACT_VARIATION_RQST_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST_TASK',
                action: 'View contract variation request tasks',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATION_RQST_TASK_TASK_RESPOND',
                action: 'Respond to contract variations request tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-variation-requests',
              'contract-variation-request-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Contract Variations',
            authority: 'ROLE_TNDR_CONTRACT_VARIATIONS',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATIONS',
                action: 'View Contract Variations',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATIONS_CNCL',
                action: 'Cancel Contract Variations',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-variations',
              'contract-variations',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Contract Variations tasks',
            authority: 'ROLE_TNDR_CONTRACT_VARIATION_TASKS',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATION_TASKS',
                action: 'View contract variation tasks',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_VARIATION_TASK_RESPOND',
                action: 'Respond to contract variation tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-variations',
              'contract-variation-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Extensions',
            authority: 'ROLE_TNDR_CONTRACT_EXTENSION_MNGMT',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_EXTENSION_MNGMT',
                action: 'View Contract Extension Management',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-extension',
              'extensions',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Extension  Tasks',
            authority: 'ROLE_TNDR_CONTRACT_EXTENSION_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_EXTENSION_TASK',
                action: 'View Extension Tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-extension',
              'extension-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Addendums',
            authority: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMNT',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMNT_VIEW',
                action: 'View Contract Addendum Management',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMNT_CREATE',
                action: 'Create Contract Addendum Management',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMNT_UPDATE',
                action: 'Update Contract Addendum Management',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_ADDENDUM_MNGMNT_DELETE',
                action: 'Delete Contract Addendum Management',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-addendum',
              'addendum',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Addendum  Tasks',
            authority: 'ROLE_TNDR_CONTRACT_ADDENDUM_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_ADDENDUM_TASK',
                action: 'View Contract Addendum Tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-addendum',
              'addendum-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Contract Cessation',
        shortName: 'Contract Cessation',
        authority: 'ROLE_TNDR_CONTRACT_CESSATION',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_CESSATION',
            action: 'Contract Cessation Menu',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'contract-cessations'],
        description: 'Contract Cessation',
        icon: 'settings',
        iconType: 'SVG',
        key: 'contract-cessations-request',
        children: [
          {
            name: 'Contract Cessation',
            authority: 'ROLE_TNDR_CONTRACT_CESSATION_RQST',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_CESSATION_RQST',
                action: 'Contract Cessation requests',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-cessations',
              'contract-cessation-request',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Contract Cessation tasks',
            authority: 'ROLE_TNDR_CONTRACT_CESSATION_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_CESSATION_TASK',
                action: 'View contract request tasks',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_CESSATION_TASK_RESPOND',
                action: 'Respond to contract payment request tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-cessations',
              'contract-cessation-request-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Tenderer Contract Preconditions Approval Tasks',
        authority: 'ROLE_CONTRACTS_MANGMNT_CNTCT_PRECNDTIN_APPRVL_TSKS',
        permission: [
          {
            key: 'ROLE_CONTRACTS_MANGMNT_CNTCT_PRECNDTIN_APPRVL_TSKS',
            action: 'View contract preconditions approval tasks',
          },
        ],
        route: [
          '',
          'modules',
          'contracts-creation',
          'my-tenderer-contract-information-approval-tasks',
        ],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Inactive Contracts',
        authority: 'ROLE_CONTRACTS_MANGMNT_INACTIVE',
        permission: [
          {
            key: 'ROLE_CONTRACTS_MANGMNT_CLSD_LST',
            action: 'View Closed Contracts',
          },
          {
            key: 'ROLE_CONTRACTS_MANGMNT_SSPND_LST',
            action: 'View Suspended Contracts',
          },
          {
            key: 'ROLE_CONTRACTS_MANGMNT_TRMNTD_LST',
            action: 'View Terminated Contracts',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'inactive-contracts'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Assigned Contracts',
        authority: 'ROLE_CONTRACTS_HOD_ASSSIGNED',
        permission: [
          {
            key: 'ROLE_CONTRACTS_HOD_ASSSIGNED',
            action: 'View HOD Assigned Contracts',
          },
          {
            key: 'ROLE_CONTRACT_HOD_MNG_TEAM',
            action: 'HOD Manage HOD Contract',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'assigned-hod'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Team Management',
        authority: 'ROLE_NGTN_CONTRACT_TEAM_MNGMT',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT',
            action: 'View Team Management',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_CREATE',
            action: 'Create Team',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_VW_PNDG_TASK',
            action: 'View Pending Tasks',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_VW_PREV_TASK',
            action: 'View Previous Task',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_UPDT_TM_MEMBR',
            action: 'Update Team Information',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_PRAPR_APPTMNT_LETTER',
            action: 'Prepare Appointment Letter',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_SIGN_APPTMNT_LETTER',
            action: 'Sign Appointment Letter',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_TEAM_MANAGEMENT_SEND_APPTMNT_LETTER',
            action: 'Send Appointment Letter',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'team-management'],
        icon: 'settings',
        iconType: 'SVG',
      },
      {
        name: 'Team Management Tasks',
        shortName: 'Evaluation Tasks',
        authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_TASKS',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_TASKS',
            action: 'View contract tasks',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'team'],
        description: 'Team Tasks',
        icon: 'tasks',
        key: 'team-task',
        iconType: 'SVG',
        children: [
          {
            name: 'Team Tasks',
            authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_TEAM_TASKS',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_TEAM_TASKS',
                action: 'View team tasks',
              },
            ],
            route: ['', 'modules', 'contracts-management', 'team', 'team-task'],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Reports Tasks',
            authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_REPORT_TASKS',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_REPORT_TASKS',
                action: 'View report tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'team',
              'contract-reports-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Contract Plan',
        shortName: 'Contract Plan',
        authority: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_PLN',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_PLN',
            action: 'View contract plan',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_PLN_CRT',
            action: 'Create contract plan',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_PLN_MNG',
            action: 'Manage contract plan',
          },
          {
            key: 'ROLE_TNDR_CONTRACT_MANAGEMENT_CNTRCT_PLN_DLT',
            action: 'Delete contract plan',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'contract-plan'],
        description: 'Contract Plan',
        icon: 'tasks',
        iconType: 'SVG',
      },

      {
        name: 'Contract Inspection',
        shortName: 'Contract Inspection',
        authority: 'ROLE_TNDR_CONTRACT_INSPECTION_MNGMT',
        permission: [
          {
            key: 'ROLE_TNDR_CONTRACT_INSPECTION_MNGMT',
            action: 'Contract Inspection',
          },
        ],
        route: ['', 'modules', 'contracts-management', 'contract-inspection'],
        description: 'Contract Inspection',
        icon: 'settings',
        iconType: 'SVG',
        key: 'inspection-team-management',
        children: [
          {
            name: 'Inspection Team  Management',
            authority: 'ROLE_TNDR_CONTRACT_INSPECTION_TEAM_MNGMNT',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_INSPECTION_TEAM_MNGMNT',
                action: 'View Inspection Team Management',
              },
              {
                key: 'ROLE_TNDR_CONTRACT_INSPECTION_TEAM_CREATE_UPDATE',
                action: 'Create Update Inspection Team Management',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-inspection',
              'inspection-team-management',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Inspection Team Tasks',
            authority: 'ROLE_TNDR_CONTRACT_INSPECTION_TEAM_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_CONTRACT_INSPECTION_TEAM_TASK',
                action: 'View Inspection Team Tasks',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'contract-inspection',
              'inspection-team-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      // {
      //   name: 'Contract Extension',
      //   shortName: 'Contract Extension',
      //   authority: 'ROLE_TNDR_CONTRACT_INSPECTION_MNGMT',
      //   permission: [
      //     {
      //       key: 'ROLE_TNDR_CONTRACT_EXTENSION_MNGMT',
      //       action: 'Contract Extension',
      //     },
      //   ],
      //   route: ['', 'modules', 'contracts-management', 'contract-extension'],
      //   description: 'Contract Extension',
      //   icon: 'settings',
      //   iconType: 'SVG',
      //   key: 'contract-extension-management',
      //   children: [
      //     {
      //       name: 'Extensions',
      //       authority: 'ROLE_TNDR_CONTRACT_EXTENSION_MNGMT',
      //       permission: [
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_EXTENSION_MNGMT',
      //           action: 'View Contract Extension Management',
      //         },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'contracts-management',
      //         'contract-extension',
      //         'extensions',
      //       ],
      //       icon: 'tasks',
      //       iconType: 'SVG',
      //     },
      //     {
      //       name: 'Extension  Tasks',
      //       authority: 'ROLE_TNDR_CONTRACT_EXTENSION_TASK',
      //       permission: [
      //         {
      //           key: 'ROLE_TNDR_CONTRACT_EXTENSION_TASK',
      //           action: 'View Extension Tasks',
      //         },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'contracts-management',
      //         'contract-extension',
      //         'extension-tasks',
      //       ],
      //       icon: 'tasks',
      //       iconType: 'SVG',
      //     },
      //   ],
      // },

      {
        name: 'All Contract MUSE Logs',
        authority: 'ROLE_CONTRACT_ALL_MUSE_LOGS',
        permission: [
          {
            key: 'ROLE_CONTRACT_ALL_MUSE_LOGS',
            action: 'View All Contract MUSE Logs',
          },
        ],
        route: [
          '',
          'modules',
          'contracts-management',
          'all-muse-logs'
        ],
        icon: 'monitoring',
        iconType: 'SVG',
      },
      {
        name: 'PE Contract MUSE Logs',
        authority: 'ROLE_CONTRACT_PE_MUSE_LOGS',
        permission: [
          {
            key: 'ROLE_CONTRACT_PE_MUSE_LOGS',
            action: 'View PE Contract MUSE Logs',
          },
        ],
        route: [
          '',
          'modules',
          'contracts-management',
          'pe-muse-logs'
        ],
        icon: 'monitoring',
        iconType: 'SVG',
      },
      {
        name: 'Contract Settings',
        shortName: 'Contract Settings',
        authority: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS',
        permission: [
          {
            key: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS',
            action: 'View Contract Settings',
          },
        ],
        route: ['', 'modules', 'contracts-management'],
        pathRoute: ['', 'modules', 'contracts-management', 'settings'],
        description: 'Contract Settings',
        icon: 'settings',
        children: [
          {
            name: 'Tenderer Contract Preconditions',
            authority: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS_VIEW',
            key: 'additional',
            permission: [
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS_VIEW',
                action: 'View Preconditions Settings',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS_CREATE',
                action: 'Create Preconditions Settings',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS_CREATE',
                action: 'Edit Preconditions Settings',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRECONDITIONS_SETTINGS_DELETE',
                action: 'Delete Preconditions',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-creation',
              'settings',
              'additional-tenderer-contract-information',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Contract Plan Sections',
            authority: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION',
            key: 'planSection',
            permission: [
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION',
                action: 'View Contract Plan Sections',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_CREATE',
                action: 'Create Contract Plan Sections',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_EDIT',
                action: 'Edit Contract Plan Section',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_DELETE',
                action: 'Delete Contract Plan Section',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'settings',
              'contract-plan-sections',
            ],
            icon: 'layers',
            iconType: 'MATERIAL',
          },
          {
            name: 'Contract Plan Sections Mapping',
            authority: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_MAPPING',
            key: 'planSectionSettings',
            permission: [
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_MAPPING',
                action: 'View Contract Plan Sections Mapping',
              },
              {
                key: 'vROLE_CONTRACTS_MANGMNT_PLAN_SECTION_MAPPING_CREATE',
                action: 'Create Contract Plan Sections Mapping',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_MAPPING_EDIT',
                action: 'Edit Contract Plan Section Mapping',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PLAN_SECTION_MAPPING_DELETE',
                action: 'Delete Contract Plan Section Mapping',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'settings',
              'contract-plan-sections-mapping',
            ],
            icon: 'layers',
            iconType: 'MATERIAL',
          },

          {
            name: 'Contract Plan Setting',
            authority: 'ROLE_CONTRACTS_MANGMNT_ACTIVITY',
            key: 'contractActivitySetting',
            permission: [
              {
                key: 'ROLE_CONTRACTS_MANGMNT_ACTIVITY',
                action: 'View Contract Plan Setting',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_ACTIVITY_CREATE',
                action: 'Create Contract Plan Setting',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_ACTIVITY_EDIT',
                action: 'Edit Contract Plan Setting',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_ACTIVITY_DELETE',
                action: 'Delete Contract Plan Setting',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'settings',
              'contract-plan-setting',
            ],
            icon: 'layers',
            iconType: 'MATERIAL',
          },

          {
            name: 'Contract Predefined Activity',
            authority: 'ROLE_CONTRACTS_MANGMNT_PRE_DEFINED_ACTIVITY',
            key: 'contractPredefinedActivity',
            permission: [
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRE_DEFINED_ACTIVITY',
                action: 'View Contract Predefined Activity',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRE_DEFINED_ACTIVITY_CREATE',
                action: 'Create Contract Predefined Activity',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRE_DEFINED_ACTIVITY_EDIT',
                action: 'Edit Contract Predefined Activity',
              },
              {
                key: 'ROLE_CONTRACTS_MANGMNT_PRE_DEFINED_ACTIVITY_DELETE',
                action: 'Delete Contract Predefined Activity',
              },
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'settings',
              'contract-predefined-activities',
            ],
            icon: 'layers',
            iconType: 'MATERIAL',
          },

          {
            name: 'Contract Integration Logs',
            authority: 'ROLE_CONTRACTS_MANGMNT_INTGRTN_LGS',
            key: 'contractIntegrationLogs',
            permission: [
              {
                key: 'ROLE_CONTRACTS_MANGMNT_INTGRTN_LGS',
                action: 'View Contract Integration Logs',
              }
            ],
            route: [
              '',
              'modules',
              'contracts-management',
              'settings',
              'contract-integration-log',
            ],
            icon: 'layers',
            iconType: 'MATERIAL',
          },
        ],
      },
    ],
  },
];
/// modules/nest-contracts/store
