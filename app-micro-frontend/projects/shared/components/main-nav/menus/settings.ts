import { MenuOption } from "../menu-options";

export const Settings: MenuOption[] = [
  {
    name: 'Settings',
    shortName: 'Settings',
    authority: 'ROLE_MODULES_STNG',
    permission: [
      {
        key: "ROLE_MODULES_STNG",
        action: ""
      }],
    route: ['', 'modules', 'settings'],
    pathRoute: ['', 'modules', 'settings', 'dashboard'],
    description: 'General system settings',
    icon: 'settings',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_STNG_DASHBOARD',
        permission: [
          {
            key: "ROLE_STNG_DASHBOARD",
            action: "View Settings Dashboard"
          }
        ],
        route: ['', 'modules', 'settings', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'UAA Settings',
        key: 'uaa-settings',
        iconType: 'MATERIAL',
        icon: 'people',
        authority: 'ROLE_STNG_UAA_STNG',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG",
            action: "View UAA Settings"
          }
        ],
        route: ['', 'modules', 'settings', 'uaa-settings'],
        children: [
          {
            name: 'Roles',
            authority: 'ROLE_STNG_UAA_STNG_ROLES',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_ROLES_CREATE",
                action: "Create role"
              },
              {
                key: "ROLE_STNG_UAA_STNG_ROLES_EDIT",
                action: "Edit role"
              },
              {
                key: "ROLE_STNG_UAA_STNG_ROLES",
                action: "View roles"
              },
              {
                key: "ROLE_STNG_UAA_STNG_ROLES_ASSIGN_ROLE",
                action: "Assign permission to role"
              },
              {
                key: "ROLE_ASSIGN_SPECFC_USR_ROLE",
                action: "Assign specific role to user"
              },
              {
                key: "ROLE_STNG_UAA_STNG_ROLES_ASSIGN_ROLE",
                action: "Remove specific role from user"
              }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'roles'],
          },
          {
            name: 'Users',
            authority: 'ROLE_STNG_UAA_STNG_USERS',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_USERS",
                action: "View users"
              },
              {
                key: "ROLE_STNG_UAA_STNG_USERS_DLT",
                action: "Delete users"
              }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'users'],
          },
          {
            name: 'All Users',
            authority: 'ROLE_STNG_UAA_STNG_ALL_USERS',
            permission: [
              { key: "ROLE_STNG_UAA_STNG_ALL_USERS", action: "View all users" }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'all-users'],
          },
          {
            name: 'Designations',
            authority: 'ROLE_STNG_UAA_STNG_DSGNTINS',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_DSGNTINS",
                action: "View designations"
              }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'designations'],
          },
          {
            name: 'Roles Mapping',
            authority: 'ROLE_STNG_UAA_STNG_RLS_MPPNGS',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_RLS_MPPNGS",
                action: "View roles mapping"
              }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'roles-mapping'],
          },
          // {
          //   name: 'Departments',
          //   authority:'ROLE_STNG_UAA_STNG_DEPARTMENT',
          //   permission: [
          //     {
          //       key: "ROLE_STNG_UAA_STNG_DEPARTMENT",
          //       action: "View departments"
          //     },
          //     {
          //       key: "ROLE_STNG_UAA_STNG_DEPARTMENT_CREATE",
          //       action: "Create departments"
          //     },
          //     {
          //       key: "ROLE_STNG_UAA_STNG_DEPARTMENT_EDIT",
          //       action: "Edit departments"
          //     },
          //     {
          //       key: "ROLE_STNG_UAA_STNG_DEPARTMENT_DELETE",
          //       action: "Delete departments"
          //     },
          //
          //   ],
          //   route: ['', 'modules', 'settings', 'uaa-settings', 'departments'],
          // },
          {
            name: 'Countries Group',
            authority: 'ROLE_STNG_UAA_STNG_CNTRIES_GRP',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP",
                action: "View countries group"
              },
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP_CREATE",
                action: "Create countries group"
              },
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP_EDIT",
                action: "Edit countries group"
              },
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP_DELETE",
                action: "Delete countries group"
              },
            ],
            route: [
              '',
              'modules',
              'settings',
              'uaa-settings',
              'groups-country',
            ],
          },

          {
            name: 'Countries Group Assignment',
            authority: 'ROLE_STNG_UAA_STNG_CNTRIES_GRP_ASSGNMNT',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP_ASSGNMNT",
                action: "View countries group assignment"
              },
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP_ASSGNMNT_CREATE",
                action: "Create countries group assignment"
              },
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES_GRP_ASSGNMNT_EDIT",
                action: "Edit countries group assignment"
              },

            ],
            route: [
              '',
              'modules',
              'settings',
              'uaa-settings',
              'countries-group',
            ],
          },
          {
            name: 'Countries',
            authority: 'ROLE_STNG_UAA_STNG_CNTRIES',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_CNTRIES",
                action: "View countries"
              }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'countries'],
          },
          {
            name: 'Financial years',
            authority: 'ROLE_STNG_UAA_STNG_FNCL_YR',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_FNCL_YR",
                action: "View financial years"
              },
              {
                key: "ROLE_STNG_UAA_STNG_FNCL_YR_CRT",
                action: "Create financial year"
              },
              {
                key: "ROLE_STNG_UAA_STNG_FNCL_YR_EDIT",
                action: "Edit financial year"
              }
            ],
            route: ['', 'modules', 'settings', 'uaa-settings', 'financial-years'],
          },
          // {
          //   name: 'Reset Password',
          //   permission: [],
          //   route: [
          //     '',
          //     'modules',
          //     'settings',
          //     'uaa-settings',
          //     'reset-password',
          //   ],
          // },
        ],
      },
      {
        name: 'Profile Settings',
        key: 'person',
        iconType: 'MATERIAL',
        icon: 'document_download',
        authority: 'ROLE_STNG_UAA_STNG_PROFILE_STNG',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_PROFILE_STNG",
            action: "View profile settings"
          }
        ],
        route: ['', 'modules', 'settings', 'profile-settings'],
        children: [
          {
            name: 'Sections',
            authority: "",
            permission: [{ key: 'ROLE_STNG_UAA_STNG_PROFILE_STNG_SECTIONS', action: 'View sections' }],
            route: ['', 'modules', 'settings', 'profile-settings', 'sections'],
          },
        ],
      },
      {
        name: 'Addendum Settings',
        authority: 'ROLE_STNG_ADDENDUM_STNG_VIEW',
        permission: [],
        route: ['', 'modules', 'settings'],
        icon: 'settings',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'Tender Modification Settings',
            authority: 'ROLE_STNG_ADDENDUM_STNG_VIEW',
            permission: [
              {
                key: "ROLE_STNG_ADDENDUM_STNG_VIEW",
                action: "View Addendum Settings"
              },
              {
                key: "ROLE_STNG_ADDENDUM_STNG_CREATE",
                action: "Create Addendum Settings"
              },
              {
                key: "ROLE_STNG_ADDENDUM_STNG_EDIT",
                action: "Edit Addendum Settings"
              }
            ],
            route: ['', 'modules', 'settings', 'addendum-settings'],
          },
          {
            name: 'Tender Modification Reasons',
            authority: 'ROLE_STNG_ADDENDUM_RSN_VIEW',
            permission: [
              {
                key: "ROLE_STNG_ADDENDUM_RSN_VIEW",
                action: "View Tender Modification Reasons"
              },
              {
                key: "ROLE_STNG_ADDENDUM_RSN_CRT",
                action: "Create Addendum Reasons"
              },
              {
                key: "ROLE_STNG_ADDENDUM_RSN_DLT",
                action: "Delete Addendum Reasons"
              },
            ],
            route: [
              '',
              'modules',
              'settings',
              'addendum-reasons',
            ],
          },
        ],
      },
      {
        name: 'GOVESB',
        authority: 'ROLE_STNG_GOVESB',
        permission: [],
        route: ['', 'modules', 'settings', 'govesb'],
        icon: 'govesb',
        iconType: 'SVG',
        children: [
          {
            name: 'Dashboard',
            authority: 'ROLE_STNG_GOVESB',
            permission: [],
            route: ['', 'modules', 'settings', 'govesb', 'dashboard'],
            icon: 'settings',
            iconType: 'MATERIAL',
          },
          {
            name: 'Clients',
            authority: 'ROLE_STNG_GOVESB',
            permission: [],
            route: ['', 'modules', 'settings', 'govesb', 'clients'],
            icon: 'settings',
            iconType: 'MATERIAL',
          },
          {
            name: 'Subscription',
            authority: 'ROLE_STNG_GOVESB',
            permission: [],
            route: ['', 'modules', 'settings', 'govesb', 'subscriptions'],
            icon: 'settings',
            iconType: 'MATERIAL',
          },
          {
            name: 'Consumption',
            authority: 'ROLE_STNG_GOVESB',
            permission: [],
            route: ['', 'modules', 'settings', 'govesb', 'consumptions'],
            icon: 'settings',
            iconType: 'MATERIAL',
          },
          {
            name: 'Sibscription Types',
            authority: 'ROLE_STNG_GOVESB',
            permission: [],
            route: ['', 'modules', 'settings', 'govesb', 'subscription-types'],
            icon: 'settings',
            iconType: 'MATERIAL',
          },
          {
            name: 'Sibscription Review Types',
            authority: 'ROLE_STNG_GOVESB',
            permission: [],
            route: ['', 'modules', 'settings', 'govesb', 'subscription-review-types'],
            icon: 'settings',
            iconType: 'MATERIAL',
          },
        ]
      },
      {
        name: 'Global Settings',
        authority: 'ROLE_STNG_UAA_STNG_GLBL_STNG',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_GLBL_STNG",
            action: "View global settings"
          },
          {
            key: "ROLE_STNG_UAA_STNG_GLBL_STNG_EDIT",
            action: "Edit global settings"
          },
        ],
        route: ['', 'modules', 'settings', 'global-settings'],
        icon: 'settings',
        iconType: 'MATERIAL',
      },
      {
        name: 'Workflow Setup',
        authority: 'ROLE_STNG_UAA_STNG_WORKFLW_STP',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_WORKFLW_STP",
            action: "View workflow setup"
          }
        ],
        route: ['', 'modules', 'settings', 'workflow-setup'],
        icon: 'workflow',
        iconType: 'SVG',
        children: [
          {
            name: 'APP',
            authority: 'ROLE_STNG_UAA_STNG_WORKFLW_STP_APP',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_WORKFLW_STP_APP",
                action: "Manage workflow setup for APP service"
              },
            ],
            route: ['', 'modules', 'settings', 'workflow-setup', 'app'],
          },
          {
            name: 'SUBMISSION',
            authority: 'ROLE_STNG_UAA_STNG_WORKFLW_STP_SUBMISSION',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_WORKFLW_STP_SUBMISSION",
                action: "Manage workflow setup for Submission service"
              },
            ],
            route: ['', 'modules', 'settings', 'workflow-setup', 'submission'],
          },
          {
            name: 'CONTRACT',
            authority: 'ROLE_STNG_UAA_STNG_WORKFLW_STP_CONTRACT',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_WORKFLW_STP_CONTRACT",
                action: "Manage workflow setup for Contract service"
              },
            ],
            route: ['', 'modules', 'settings', 'workflow-setup', 'contract'],
          },
          {
            name: 'AUDIT',
            authority: 'ROLE_STNG_UAA_STNG_WORKFLW_STP_AUDIT',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_WORKFLW_STP_AUDIT",
                action: "Manage workflow setup for Audit service"
              },
            ],
            route: ['', 'modules', 'settings', 'workflow-setup', 'audit'],
          },
          {
            name: 'CHANNGES MANAGENENT',
            authority: 'ROLE_STNG_UAA_STNG_WORKFLW_STP_CHNG_MNGT',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_WORKFLW_STP_CHNG_MNGT",
                action: "Manage workflow setup for Change management(service) service"
              },
            ],
            route: ['', 'modules', 'settings', 'workflow-setup', 'changes-management'],
          },
        ]
      },
      {
        name: 'SMTP Settings',
        authority: 'ROLE_STNG_UAA_STNG_STMP_STNG',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_STMP_STNG",
            action: "View SMTP settings"
          }
        ],
        route: ['', 'modules', 'settings'],
        icon: 'settings',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'SMTP Servers',
            authority: 'ROLE_STNG_UAA_STNG_STMP_SERVERS',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_STMP_SERVERS",
                action: "View SMTP server"
              }
            ],
            route: ['', 'modules', 'settings', 'smtp-settings', 'smtp-servers'],
          },
          {
            name: 'SMTP Sequence',
            authority: 'ROLE_STNG_UAA_STNG_STMP_SEQUENCE',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_STMP_SEQUENCE",
                action: "View SMTP sequence"
              },
              {
                key: "ROLE_RESET_AWARD_COOL_OFF",
                action: "Reset Cool Off"
              }
            ],
            route: [
              '',
              'modules',
              'settings',
              'smtp-settings',
              'smtp-sequence',
            ],
          },
        ],
      },
      // {
      //   name: 'Message Setup',
      //   authority:'ROLE_STNG_UAA_STNG_MSG_STP',
      //   permission: [
      //     {
      //       key: "ROLE_STNG_UAA_STNG_MSG_STP",
      //       action: "View message setup"
      //     }
      //   ],
      //   route: ['', 'modules', 'settings'],
      //   icon: 'settings',
      //   iconType: 'MATERIAL',
      //   children: [
      //     {
      //       name: 'Alert',
      //       authority:'ROLE_STNG_UAA_STNG_MSG_STP_ALT',
      //       permission: [
      //         {
      //           key: "ROLE_STNG_UAA_STNG_MSG_STP_ALT",
      //           action: "View alert"
      //         }
      //       ],
      //       route: ['', 'modules', 'settings', 'alerts'],
      //     },
      //     {
      //       name: 'Topics',
      //       authority:'ROLE_STNG_UAA_STNG_MSG_STP_TPCS',
      //       permission: [
      //         {
      //           key: "ROLE_STNG_UAA_STNG_MSG_STP_TPCS",
      //           action: "View topics"
      //         }
      //       ],
      //       route: ['', 'modules', 'settings', 'topics'],
      //     },
      //   ],
      // },
      {
        name: 'Translation Settings',
        authority: 'ROLE_STNG_UAA_STNG_TRNSLTN_STNG',
        permission: [
          { key: "ROLE_STNG_UAA_STNG_TRNSLTN_STNG", action: "View translation settings" },
          { key: "ROLE_STNG_UAA_STNG_TRNSLTN_STNG_CREATE", action: "Create translation settings" },
          { key: "ROLE_STNG_UAA_STNG_TRNSLTN_STNG_EDIT", action: "Edit translation settings" },
          { key: "ROLE_STNG_UAA_STNG_TRNSLTN_STNG_DELETE", action: "Delete translation settings" },
          { key: "ROLE_STNG_UAA_STNG_TRNSLTN_STNG_IMPORT", action: "Import translation settings" },
          { key: "ROLE_STNG_UAA_STNG_TRNSLTN_STNG_EXPORT", action: "Export translation settings" },
        ],
        route: ['', 'modules', 'settings', 'translations'],
        icon: 'language',
        iconType: 'SVG',
      },
      {
        name: 'View Refresh',
        authority: 'ROLE_STNG_UAA_STNG_VIEW_REFRESH_MAT_VIEW',
        permission: [
          { key: "ROLE_STNG_UAA_STNG_VIEW_REFRESH_MAT_VIEW", action: "View Refresh" },
          { key: "ROLE_STN_REFRESH_PUB_OPN_TENDERS_MAT_VIEW", action: "Refresh Published Tenders/ Opened Tenders" },
        ],
        route: ['', 'modules', 'settings', 'view-refresh'],
        icon: 'settings',
        iconType: 'SVG',
      },
      {
        name: 'Exchange Rates Import',
        authority: 'ROLE_STNG_UAA_STNG_VIEW_EXCHANGE_RATE_IMPORT',
        permission: [
          { key: "ROLE_STNG_UAA_STNG_VIEW_EXCHANGE_RATE_IMPORT", action: "Exchange Rates Import" },
        ],
        route: ['', 'modules', 'settings', 'exchange-rate-import'],
        icon: 'exchange_rate',
        iconType: 'SVG',
      },
      // {
      //   name: 'Document Search',
      //   authority: 'ROLE_STNG_UAA_STNG_VIEW_REFRESH',
      //   permission: [
      //     { key: "ROLE_STNG_UAA_STNG_VIEW_REFRESH", action: "Document Search" },
      //   ],
      //   route: ['', 'modules', 'settings', 'document-search'],
      //   icon: 'settings',
      //   iconType: 'SVG',
      // },
      {
        name: 'Notification Templates',
        authority: 'ROLE_STNG_UAA_STNG_NTFCTION_TMPL',
        permission: [
          { key: "ROLE_STNG_UAA_STNG_NTFCTION_TMPL", action: "Can view notification template" },
          { key: "ROLE_STNG_UAA_STNG_NTFCTION_TMPL_EDIT", action: "Can edit notification template" }
        ],
        route: ['', 'modules', 'settings', 'notification-templates'],
        icon: 'g_translate',
        iconType: 'MATERIAL',
      },
      {
        name: 'Notification Histories',
        authority: 'ROLE_STNG_UAA_STNG_NTFCTION_HSTRY',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_NTFCTION_HSTRY",
            action: "View notification histories"
          }
        ],
        route: ['', 'modules', 'settings', 'notification-history'],
        icon: 'email',
        iconType: 'MATERIAL',
      },
      {
        key: 'nest-feature',
        name: 'NeST Features Mapping',
        authority: 'ROLE_STNG_UAA_STNG_NEST_FEATURE_MENU',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_NEST_FEATURE_MENU",
            action: "View guide video menu"
          }
        ],
        route: ['', 'modules', 'settings', 'nest-feature'],
        icon: 'settings',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'NeST Features',
            authority: 'ROLE_STNG_UAA_STNG_NEST_FEATURES_APP',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_NEST_FEATURES_APP",
                action: "View NeST Features"
              },
              {
                key: "ROLE_STNG_UAA_STNG_NEST_FEATURES_APP_CREATE",
                action: "Create NeST Features"
              },
              {
                key: "ROLE_STNG_UAA_STNG_NEST_FEATURES_APP_DELETE",
                action: "Delete NeST Features"
              },
              {
                key: "ROLE_STNG_UAA_STNG_NEST_FEATURES_APP_EDIT",
                action: "Edit NeST Features"
              }
            ],
            route: ['', 'modules', 'settings', 'nest-feature', 'nest-features', 'nest-features-app'],
          },
          {
            name: 'Mapping NeST Feature',
            authority: 'ROLE_STNG_UAA_STNG_MAP_NEST_FEATURES_APP',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_MAP_NEST_FEATURES_APP",
                action: "View NeST Features"
              },
              {
                key: "ROLE_STNG_UAA_STNG_MAP_NEST_FEATURES_APP_CREATE",
                action: "Create NeST Features"
              },
              {
                key: "ROLE_STNG_UAA_STNG_MAP_NEST_FEATURES_APP_EDIT",
                action: "Edit NeST Features"
              },
              {
                key: "ROLE_STNG_UAA_STNG_MAP_NEST_FEATURES_APP_DELETE",
                action: "Delete NeST Features"
              }

            ],
            route: ['', 'modules', 'settings', 'nest-feature', 'nest-features', 'mapping-nest-features-app'],
          },
        ],
      },
      {
        key: 'video',
        name: 'Guide Video',
        authority: 'ROLE_STNG_UAA_STNG_GUIDE_VIDEO_MENU',
        permission: [
          {
            key: "ROLE_STNG_UAA_STNG_GUIDE_VIDEO_MENU",
            action: "View guide video menu"
          }
        ],
        route: ['', 'modules', 'settings', 'video'],
        icon: 'settings',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'Guide Videos',
            authority: 'ROLE_STNG_UAA_STNG_GUIDE_VIDEO',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_GUIDE_VIDEO",
                action: "View guide video"
              },
              {
                key: "ROLE_STNG_UAA_STNG_GUIDE_CREATE",
                action: "Create guide video"
              },
              {
                key: "ROLE_STNG_UAA_STNG_GUIDE_DELETE",
                action: "Delete guide video"
              },
              {
                key: "ROLE_STNG_UAA_STNG_GUIDE_EDIT",
                action: "Edit guide video"
              }
            ],
            route: ['', 'modules', 'settings', 'video', 'guide-video'],
          },
          {
            name: 'Mapping Video',
            authority: 'ROLE_STNG_UAA_STNG_MAP_GUIDE_VIDEO',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_MAP_GUIDE_VIDEO",
                action: "View guide video"
              },
              {
                key: "ROLE_STNG_UAA_STNG_MAP_GUIDE_CREATE",
                action: "Create guide video"
              },
              {
                key: "ROLE_STNG_UAA_STNG_MAP_GUIDE_EDIT",
                action: "Edit guide video"
              },
              {
                key: "ROLE_STNG_UAA_STNG_MAP_GUIDE_DELETE",
                action: "Delete guide video"
              }

            ],
            route: ['', 'modules', 'settings', 'video', 'mapping-guide-video'],
          },
        ],
      },
      {
        key: 'shared',
        name: 'Shared Documents',
        authority: 'ROLE_STNG_UAA_SHARED_DOCUMENTS',
        permission: [
          {
            key: "ROLE_STNG_UAA_SHARED_DOCUMENTS",
            action: "View shared Documents"
          }
        ],
        route: ['', 'modules', 'settings', 'video'],
        icon: 'document_download',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'Documents Categories',
            authority: 'ROLE_STNG_UAA_SHARED_DOCUMENTS_CAT',
            permission: [
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_CAT",
                action: "View document categories"
              },
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_CAT_CREATE",
                action: "Create document categories"
              },
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_CAT_VIEW",
                action: "Edit document categories"
              },
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_CAT_DELETE",
                action: "Delete document categories"
              },

            ],
            route: ['', 'modules', 'settings', 'shared-documents', 'categories'],
          },
          {
            name: 'Documents',
            authority: 'ROLE_STNG_UAA_SHARED_DOCUMENTS_DOC',
            permission: [
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_DOC",
                action: "View shared document"
              },
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_CREATE",
                action: "Create shared document"
              },
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_VIEW",
                action: "Edit shared document"
              },
              {
                key: "ROLE_STNG_UAA_SHARED_DOCUMENTS_DELETE",
                action: "Delete shared document"
              },

            ],
            route: ['', 'modules', 'settings', 'shared-documents', 'documents'],
          },
        ],
      },

      {
        name: 'Advertisements',
        authority: 'ROLE_STNG_UAA_ADVRTSMNT',
        permission: [
          {
            key: "ROLE_STNG_UAA_ADVRTSMNT",
            action: "View advertisements"
          },
          {
            key: "ROLE_STNG_UAA_ADVRTSMNT_CRT",
            action: "Create advertisement"
          },
          {
            key: "ROLE_STNG_UAA_ADVRTSMNT_EDT",
            action: "Edit advertisement"
          },
          {
            key: "ROLE_STNG_UAA_ADVRTSMNT_DLT",
            action: "Delete advertisement"
          }
        ],
        route: ['', 'modules', 'settings', 'advertisement'],
        icon: 'email',
        iconType: 'MATERIAL',
      },
      {
        name: 'SVG Icon',
        authority: 'ROLE_STNG_UAA_ADVRTSMNT',
        permission: [
          {
            key: "ROLE_STNG_UAA_SVG_ICON",
            action: "View Icon Setting"
          }
        ],
        route: ['', 'modules', 'settings', 'svg-icon-viewer'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        key: 'Feedback',
        name: 'Feedback Settings',
        authority: 'ROLE_STNG_UAA_FEEDBACK_SETTINGS',
        permission: [
          {
            key: "ROLE_STNG_UAA_FEEDBACK_SETTINGS",
            action: "View Feedback Areas"
          }
        ],
        route: ['', 'modules', 'settings', 'feedback-settings'],
        icon: 'inbox',
        iconType: 'SVG',
        children: [
          {
            name: 'Feedback Areas',
            authority: 'ROLE_STNG_UAA_STNG_FEEDBACK_AREA_SETTINGS_VIEW',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_FEEDBACK_AREA_SETTINGS_VIEW",
                action: "View Feedback Areas"
              },
              {
                key: "ROLE_STNG_UAA_STNG_FEEDBACK_AREA_SETTINGS_CREATE",
                action: "Create Feedback Areas"
              },
              {
                key: "ROLE_STNG_UAA_STNG_FEEDBACK_AREA_SETTINGS_EDIT",
                action: "Edit Feedback Areas"
              },
              {
                key: "ROLE_STNG_UAA_STNG_FEEDBACK_AREA_SETTINGS_DELETE",
                action: "Delete Feedback Areas"
              },

            ],
            route: ['', 'modules', 'settings','feedback-settings','feedback-areas'],
          },
          {
            name: 'Recommendations',
            authority: 'ROLE_STNG_UAA_STNG_RECOMMEND_SETTINGS_VIEW',
            permission: [
              {
                key: "ROLE_STNG_UAA_STNG_RECOMMEND_SETTINGS_VIEW",
                action: "View feedback-recommendations"
              },
              {
                key: "ROLE_STNG_UAA_STNG_RECOMMEND_SETTINGS_CREATE",
                action: "Create feedback-recommendations"
              },
              {
                key: "ROLE_STNG_UAA_STNG_RECOMMEND_SETTINGS_EDIT",
                action: "Edit feedback-recommendations"
              },
              {
                key: "ROLE_STNG_UAA_STNG_RECOMMEND_SETTINGS_DELETE",
                action: "Delete feedback-recommendations"
              },

            ],
            route: ['', 'modules', 'settings','feedback-settings','feedback-recommendations'],
          },
        ],
      },
    ],

}
]
