import { MenuOption } from '../menu-options';

export const PreQualification: MenuOption[] = [
  {
    name: 'Pre Qualification',
    shortName: 'Pre Qualification',
    route: ['', 'modules', 'pre-qualification'],
    pathRoute: ['', 'modules', 'pre-qualification', 'dashboard'],
    description: 'Tenderer Pre-Qualification',
    icon: 'pre_qualification',
    iconType: 'SVG',
    authority: 'ROLE_MODULES_PRE_QUALFCTION',
    permission: [
      {
        key: 'ROLE_MODULES_APP_MNGT',
        action: '',
      },
    ],
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_PRE_QUALFCTION_DASHBOARD',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_DASHBOARD',
            action: 'View pre qualification dashboard',
          },
        ],
        route: ['', 'modules', 'pre-qualification', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Pre Qualification',
        authority: 'ROLE_PRE_QUALFCTION_PRE_QUALFCTION',
        permission: [
          { key: "ROLE_PRE_QUALFCTION_PRE_QUALFCTION", action: "View list of pre qualifications" },
          { key: "ROLE_PRE_QUALFCTION_PRE_QUALFCTION_CRT", action: "Create pre qualification" },
          { key: "ROLE_PRE_QUALFCTION_PRE_QUALFCTION_MNG", action: "Manage pre qualification additional details" },
          { key: "ROLE_PRE_QUALFCTION_PRE_QUALFCTION_DLT", action: "Delete pre qualification" },
        ],
        route: ['', 'modules', 'pre-qualification', 'pre-qualification'],
        icon: 'pre_qualification',
        iconType: 'SVG',
      },
      {
        name: 'Pre Qualification Tasks',
        authority: 'ROLE_PRE_QUALFCTION_PRE_QUALFCTION_TSK',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_PRE_QUALFCTION_TSK',
            action: 'View pre qualification task',
          },
        ],
        route: ['', 'modules', 'pre-qualification', 'pre-qualification-tasks'],
        icon: 'my_task',
        iconType: 'SVG',
      },
      {
        name: 'Pre Qualification Re-advertisement',
        shortName: 'Pre Qualification Re-advertisement',
        authority: 'ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_MENU',
        permission: [
          { key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_MENU", action: "Tender re-advertisement" }
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation'],
        description: 'Tender Re-advertisement',
        icon: 'requisition',
        iconType: 'SVG',
        children: [
          {
            name: 'Pre Qualification Re-advertisement',
            authority: 'ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT',
            permission: [
              {
                key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT",
                action: "View pre qualification re-advertisement"
              },
              {
                key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_CRT",
                action: "Create pre qualification re-advertisement"
              },
              {
                key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_EDT",
                action: "Edit pre qualification re-advertisement"
              },
              {
                key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_DLT",
                action: "Delete pre qualification re-advertisement"
              },
              {
                key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_RSRT_WRKFLW",
                action: "Restart Workflow"
              }
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'pre-qualification-re-advertisement',
            ],
            icon: 'redo',
            iconType: 'MATERIAL',
          },
          {
            name: 'Pre Qualification Re-advertisement Tasks',
            authority: 'ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_TASK',
            permission: [
              {
                key: "ROLE_PRE_QUALFCTION_RE_ADVERTISEMENT_TASK",
                action: "View pre qualification re-advertisement tasks"
              }
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'pre-qualification-re-advertisement-tasks',
            ],
            icon: 'redo',
            iconType: 'MATERIAL',
          },
        ]
      },
      {
        name: 'Evaluation',
        authority: 'ROLE_PRE_QUALFCTION_EVALUATION',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_EVALUATION',
            action: 'View evaluation',
          },
        ],
        route: [
          '',
          'modules',
          'pre-qualification',
          'pre-qualification-process',
        ],
        icon: 'my_task',
        iconType: 'SVG',
      },
      {
        name: 'Evaluation Management',
        authority: 'ROLE_PRE_QUALFCTION_MANAGEMENT',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_MANAGEMENT',
            action: 'View pre qualification management',
          },
        ],
        route: ['', 'modules', 'pre-qualification', 'pre-qualification-team'],
        icon: 'teams',
        iconType: 'SVG',
      },

      {
        name: 'Pre Qualification Cancellation',
        authority: 'ROLE_PRE_QUALFCTION_CANCELLATION',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_CANCELLATION',
            action: 'View Pre Qualification Cancellation',
          },
          {
            key: 'ROLE_PRE_QUALFCTION_PERFORM_CANCELLATION',
            action: 'Perform Pre Qualification Cancellation',
          },
        ],
        children: [
          {
            name: 'Cancellation Request',
            authority: 'ROLE_PRE_QUALFCTION_CANCELLATION_REQUEST',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_CANCELLATION_REQUEST',
                action: 'Pre Qualification Cancellation Request',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'pre-qualification-cancellation',
              'requests'
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Cancellation Tasks',
            authority: 'ROLE_PRE_QUALFCTION_CANCELLATION_TASK',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_CANCELLATION_TASK',
                action: 'Pre Qualification Cancellation Tasks',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'pre-qualification-cancellation',
              'tasks'
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
        ],
        route: [
          '',
          'modules',
          'pre-qualification',
          'pre-qualification-cancellation',
        ],
        icon: 'my_task',
        iconType: 'SVG',
      },
      {
        name: 'Pre Qualification Modification',
        authority: 'ROLE_PRE_QUALFCTION_MODIFICATION',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_MODIFICATION',
            action: 'View Pre Qualification Modification',
          },
          {
            key: 'ROLE_PRE_QUALFCTION_PERFORM_MODIFICATION',
            action: 'Perform Pre Qualification Modification',
          },
        ],
        children: [
          {
            name: 'Modification Request',
            authority: 'ROLE_PRE_QUALFCTION_MODIFICATION_REQUEST',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_MODIFICATION_REQUEST',
                action: 'Pre Qualification Modification Request',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'pre-qualification-modification',
              'requests'
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Modification Tasks',
            authority: 'ROLE_PRE_QUALFCTION_MODIFICATION_TASK',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_MODIFICATION_TASK',
                action: 'Pre Qualification Modification Tasks',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'pre-qualification-modification',
              'tasks'
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          ],
        route: [
          '',
          'modules',
          'pre-qualification',
          'pre-qualification-modification',
        ],
        icon: 'my_task',
        iconType: 'SVG',
      },
      {
        name: 'Team Management',
        authority: 'ROLE_PRE_QUALFCTION_TEAM_MNGMNT',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_TEAM_MNGMNT',
            action: 'View team management',
          },
        ],
        route: ['', 'modules', 'pre-qualification', 'team-management'],
        icon: 'team_manage',
        iconType: 'SVG',
      },
      {
        name: 'Pre Qualification Report',
        authority: 'ROLE_PRE_QUALFCTION_REPORT',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_REPORT',
            action: 'Pre Qualification Report',
          },
        ],
        route: ['', 'modules', 'pre-qualification', 'pre-qualification-report'],
        icon: 'team_manage',
        iconType: 'SVG',
      },
      {
        name: 'Team Tasks',
        authority: 'ROLE_PRE_QUALFCTION_TEAM_TSK',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_TEAM_TSK',
            action: 'View team task',
          },
        ],
        route: ['', 'modules', 'pre-qualification', 'team-tasks'],
        icon: 'team_report',
        iconType: 'SVG',
      },
      {
        name: 'Pre Qualification Report Tasks',
        authority: 'ROLE_PRE_QUALFCTION_PRE_QUALFCTION_REPORT_TSK',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_PRE_QUALFCTION_REPORT_TSK',
            action: 'View pre qualification report tasks',
          },
        ],
        route: [
          '',
          'modules',
          'pre-qualification',
          'pre-qualification-report-tasks',
        ],
        icon: 'team_report',
        iconType: 'SVG',
      },
      {
        name: 'Additional Fields Settings',
        shortName: 'Additional Fields Settings',
        authority: 'ROLE_PRE_QUALFCTION_SETNG_ADDTNAL_FLDS_STNG',
        permission: [
          {
            key: 'ROLE_PRE_QUALFCTION_SETNG_ADDTNAL_FLDS_STNG',
            action: 'View additional fields settings',
          },
        ],
        route: ['', 'modules', 'pre-qualification'],
        pathRoute: [
          '',
          'modules',
          'pre-qualification',
          'additional-fields-setting',
        ],
        description: 'Additional Fields Settings',
        icon: 'settings',
        children: [
          {
            name: 'Form Steps',
            authority: 'ROLE_PRE_QUALFCTION_SETNG_FLDS_FRM_STP',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_SETNG_FLDS_FRM_STP',
                action: 'View Form Steps',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETNG_FLDS_FORM_STEPS_CREATE',
                action: 'Create form steps',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETNG_FLDS_FORM_STEPS_EDIT',
                action: 'Edit form steps',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETNG_FLDS_FORM_STEPS_DELETE',
                action: 'Delete form steps',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'additional-fields-setting',
              'form-steps',
              'PLANNED_TENDER',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Additional Fields',
            authority: 'ROLE_PRE_QUALFCTION_SETTINGS_ADDTNAL_FLDS',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_ADDTNAL_FLDS',
                action: 'View additional fields',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_ADDTNAL_FLDS_CREATE',
                action: 'Create additional details',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_ADDTNAL_FLDS_EDIT',
                action: 'Edit additional details',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_ADDTNAL_FLDS_DELETE',
                action: 'Delete additional details',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'additional-fields-setting',
              'additional-fields',
              'PLANNED_TENDER',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
        ],
      },
      {
        name: 'Settings',
        key: 'settings',
        authority: 'ROLE_PRE_QUALFCTION_SETTINGS',
        permission: [
          { key: 'ROLE_PRE_QUALFCTION_SETTINGS', action: 'View settings' },
        ],
        route: ['', 'modules', 'pre-qualification', 'settings'],
        icon: 'settings',
        children: [
          {
            name: 'Pre Selection Reasons',
            authority: 'ROLE_PRE_QUALFCTION_SETTINGS_PR_SLCTN_RSON',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PR_SLCTN_RSON',
                action: 'View Pre Selection Reasons',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PR_SLCTN_RSON_CRT',
                action: 'Create Pre Selection Reason',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PR_SLCTN_RSON_EDT',
                action: 'Edit Pre Selection Reason',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PR_SLCTN_RSON_DLT',
                action: 'Delete Pre Selection Reason',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'settings',
              'pre-selection-reason',
            ],
          },
          {
            name: 'Pre qualification modification reasons',
            authority: 'ROLE_PRE_QUALFCTION_SETTINGS_PRQLFCTN_MOD_RSON',
            permission: [
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PRQLFCTN_MOD_RSON',
                action: 'View pre-qualification modification reasons',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PRQLFCTN_MOD_RSON_CRT',
                action: 'Create pre-qualification modification reason',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PRQLFCTN_MOD_RSON_EDT',
                action: 'Edit pre-qualification modification reason',
              },
              {
                key: 'ROLE_PRE_QUALFCTION_SETTINGS_PRQLFCTN_MOD_RSON_DLT',
                action: 'Delete pre-qualification modification reason',
              },
            ],
            route: [
              '',
              'modules',
              'pre-qualification',
              'settings',
              'pre-qualification-modification-reasons',
            ],
          },
        ],
      },
    ],
  },
];
