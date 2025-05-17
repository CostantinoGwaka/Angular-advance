import { MenuOption } from "../menu-options";

export const AppManagement: MenuOption[] = [
  {
    name: 'APP Management',
    shortName: 'APP Management',
    route: ['', 'modules', 'app-management'],
    pathRoute: ['', 'modules', 'app-management', 'dashboard'],
    description: 'Annual Procurement Plan management',
    icon: 'gisp_profile',
    iconType: 'SVG',
    authority: 'ROLE_MODULES_APP_MNGT',
    permission: [{ key: 'ROLE_MODULES_APP_MNGT', action: '' }],
    children: [
      {
        name: 'Dashboard',
        authority: "ROLE_APP_MNGT_DASHBOARD",
        permission: [
          { key: 'ROLE_APP_MNGT_DASHBOARD', action: 'View APP Dashboard' }
        ],
        route: ['', 'modules', 'app-management', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Departmental Needs',
        authority: "ROLE_APP_MNGT_DEPRTMNT_NDS",
        permission: [
          { key: 'ROLE_APP_MNGT_DEPRTMNT_NDS', action: 'View Department needs' },
          { key: 'ROLE_APP_MNGT_DEPRTMNT_NDS_CREATE', action: 'Add Department needs' },
          { key: 'ROLE_APP_MNGT_DEPRTMNT_NDS_EDIT', action: 'Edit Department needs' },
          { key: 'ROLE_APP_MNGT_DEPRTMNT_NDS_DELETE', action: 'Delete Department needs' },
        ],
        route: ['', 'modules', 'app-management', 'departmental-need'],
        icon: 'add_shopping_cart',
        iconType: 'SVG',
        // children: [
        //   {
        //     name: 'Departmental Need',
        // permission: [],
        // route: ['', 'modules', 'app-management', 'schedule-of-requirements', 'departmental-need'],
        //   },

        // ],
      },
      // {
      //   name: 'Schedule of Requirements',
      //permission: [],
      //route: ['', 'modules', 'app-management', 'schedule_requirement'],
      //   icon: 'add_shopping_cart',
      //   iconType: 'SVG',
      //   children: [
      //     {
      //       name: 'Departmental Need',
      //  permission: [],
      //route: ['', 'modules', 'app-management', 'schedule-of-requirements', 'departmental-need'],
      //     },

      //   ],
      // },

      {
        name: 'APP Formulation',
        authority: "ROLE_APP_MNGT_APP_FRMLTN",
        permission: [
          { key: 'ROLE_APP_MNGT_APP_FRMLTN', action: 'View APP formulation' },
          { key: 'ROLE_APP_MNGT_APP_CREATE', action: 'Create APP' },
          { key: 'ROLE_APP_MNGT_APP_EDIT', action: 'Edit APP' },
          { key: 'ROLE_APP_MNGT_APP_DELETE', action: 'Delete APP' },
          { key: 'ROLE_APP_MNGT_APP_VIEW_TNDR_TRCKR', action: 'View tender tracker' }
        ],
        route: ['', 'modules', 'app-management', 'tender-creation'],
        icon: 'data_base',
        iconType: 'SVG',
        // children: [
        //   {
        //     name: 'Annual Procurement Plans',
        // permission: [],
        // route: ['', 'modules', 'app-management', 'app-management', 'annual-procurement-plans'],
        //   },
        // ],
      },
      {
        name: 'APP Tasks',
        authority: "ROLE_APP_MNGT_APP_TASK",
        permission: [{ key: 'ROLE_APP_MNGT_APP_TASK', action: 'View APP task' }],
        route: ['', 'modules', 'app-management', 'my-task'],
        icon: 'my_task',
        iconType: 'SVG',
        // children: [
        // //   {
        // //     name: 'Annual Procurement Plans',
        // // permission: [],
        // // route: ['', 'modules', 'app-management', 'app-management', 'my-task'],
        // //   },
        // ],
      },
      {
        name: 'GPN Modification',
        icon: 'calendar_month',
        iconType: 'SVG',
        key: 'gpn-modification',
        authority: "ROLE_APP_MNGT_CDER_GPN",
        permission: [
          { key: 'ROLE_APP_MNGT_CDER_GPN', action: 'View GPN Modification' }
        ],
        route: ['', 'modules', 'app-management', 'gpn-modification'],
        children: [
          {
            name: 'Tender Allowed',
            authority: "ROLE_APP_MNGT_GPN_MODIFICATION",
            permission: [
              { key: 'ROLE_APP_MNGT_GPN_MODIFICATION', action: 'Modification GPN' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'gpn-modification',
              'tender-allowed',
            ],
          },
          {
            name: 'Tender Requested',
            authority: "ROLE_APP_MNGT_CDER_GPN_REQUESTED",
            permission: [
              { key: 'ROLE_APP_MNGT_CDER_GPN_REQUESTED', action: 'View Requested Tender to modify' },
              { key: 'ROLE_APP_MNGT_CDER_GPN_REQUEST_APPROVAL', action: 'Approval Requested Tender to modify' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'gpn-modification',
              'tender-requested',
            ],
          },
        ],
      },
      {
        name: 'Minor Modification',
        icon: 'calendar_month',
        iconType: 'SVG',
        key: 'minor-modification',
        authority: 'ROLE_APP_MNGT_MINOR_MODFCT',
        permission: [
          { key: 'ROLE_APP_MNGT_MINOR_MODFCT', action: 'View Tender Minor Modification' }
        ],
        route: ['', 'modules', 'app-management', 'minor-modification'],
        children: [
          {
            name: 'Modification Request',
            authority: "ROLE_APP_MNGT_MINOR_MODFCT",
            permission: [
              { key: 'ROLE_APP_MNGT_MINOR_MODFCT', action: 'Minor Modification' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'minor-modification',
              'modification-request',
            ],
          },
          {
            name: 'Modification Approval',
            authority: "ROLE_APP_MNGT_MODIFICATION_APPR",
            permission: [
              { key: 'ROLE_APP_MNGT_MODIFICATION_APPR', action: 'Minor Modification' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'minor-modification',
              'modification-approval',
            ],
          },
        ]
      },
      {
        name: 'Annual Procurement Plan',
        authority: "ROLE_APP_MNGT_ANNUAL_PRO_PLAN",
        permission: [
          { key: 'ROLE_APP_MNGT_ANNUAL_PRO_PLAN', action: 'View annual procurement plan' },
          { key: 'ROLE_APP_MNGT_PUBLISH_GPN', action: 'Publish GPN' },
        ],
        route: ['', 'modules', 'app-management', 'approved-tenders'],
        icon: 'approved_tender',
        iconType: 'SVG',
        // children: [
        // //   {
        // //     name: 'Annual Procurement Plans',
        // // permission: [],
        // // route: ['', 'modules', 'app-management', 'app-management', 'my-task'],
        // //   },
        // ],
      },
      {
        name: 'Update CUIS Tender',
        authority: "ROLE_APP_MNGT_UPD_CUIS_TNDR_LST",
        permission: [
          { key: 'ROLE_APP_MNGT_UPD_CUIS_TNDR_LST', action: 'View eligible Cuis tender list' },
          { key: 'ROLE_APP_MNGT_UPD_CUIS_TNDR', action: 'Update CUIS tender information' },
        ],
        route: ['', 'modules', 'app-management', 'update-cuis-tender'],
        icon: 'approved_tender',
        iconType: 'SVG',
        // children: [
        // //   {
        // //     name: 'Annual Procurement Plans',
        // // permission: [],
        // // route: ['', 'modules', 'app-management', 'app-management', 'my-task'],
        // //   },
        // ],
      },
      {
        name: 'General Procurement Notice',
        authority: "ROLE_APP_MNGT_GPN",
        permission: [{ key: 'ROLE_APP_MNGT_GPN', action: 'View GPN' }],
        route: ['', 'modules', 'app-management', 'gpn-summary'],
        icon: 'gpn',
        iconType: 'SVG',
        // children: [
        // //   {
        // //     name: 'Annual Procurement Plans',
        // // permission: [],
        // // route: ['', 'modules', 'app-management', 'app-management', 'my-task'],
        // //   },
        // ],
      },
      {
        name: 'Tender & Framework Mapping',
        authority: "ROLE_APP_MNGT_TENDERER_FRAMEWORK_MAPPING",
        permission: [{ key: 'ROLE_APP_MNGT_TENDERER_FRAMEWORK_MAPPING', action: 'Tender & Framework Mapping' }],
        route: ['', 'modules', 'app-management', 'tender-framework-mapping'],
        icon: 'my_task',
        iconType: 'SVG',
      },
      // {
      //   name: 'Micro Procurement',
      //   icon: 'cart_icon',
      //   iconType: 'SVG',
      //   key: 'micro-procurement',
      //   authority: "ROLE_APP_MNGT_MICRO_PROCUREMENT",
      //   permission: [
      //     { key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT', action: 'View Micro Procurement' }
      //   ],
      //   route: ['', 'modules', 'app-management', 'micro-procurement'],
      //   children: [
      //     {
      //       name: 'List Micro Procurement',
      //       authority: "ROLE_APP_MNGT_MICRO_PROCUREMENT",
      //       permission: [
      //         { key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT', action: 'View Micro Procurement' },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'app-management',
      //         'micro-procurement',
      //         'list-micro-procurement',
      //       ],
      //     },
      //     {
      //       name: 'Task Micro Procurement',
      //       authority: "ROLE_APP_MNGT_MICRO_PROCUREMENT_TASK",
      //       permission: [
      //         { key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_TASK', action: 'View Micro Procurement Task' },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'app-management',
      //         'micro-procurement',
      //         'task-micro-procurement',
      //       ],
      //     },
      //     {
      //       name: 'Approved Micro Procurement',
      //       authority: "ROLE_APP_MNGT_MICRO_PROCUREMENT_RITIRED",
      //       permission: [
      //         { key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_RITIRED', action: 'View Approved Micro Procurement Ritired' },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'app-management',
      //         'micro-procurement',
      //         'approved-micro-procurement',
      //       ],
      //     },
      //   ],
      // },
      // {
      //   name: 'Retirement',
      //   icon: 'negotiation',
      //   iconType: 'SVG',
      //   key: 'retirement',
      //   authority: "ROLE_APP_MNGT_RETIREMENT",
      //   permission: [
      //     { key: 'ROLE_APP_MNGT_RETIREMENT', action: 'View Micro Procurement' }
      //   ],
      //   route: ['', 'modules', 'app-management', 'micro-procurement'],
      //   children: [
      //     {
      //       name: 'Unretired Micro Procurement',
      //       authority: "ROLE_APP_MNGT_RETIREMENT_LIST",
      //       permission: [
      //         { key: 'ROLE_APP_MNGT_RETIREMENT_LIST', action: 'View Unretired Micro Procurement' },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'app-management',
      //         'retirement',
      //         'unretired-procure',
      //       ],
      //     },
      //     {
      //       name: 'Task Retirement',
      //       authority: "ROLE_APP_MNGT_RETIREMENT_TASK",
      //       permission: [
      //         { key: 'ROLE_APP_MNGT_RETIREMENT_TASK', action: 'View Retirement Task' },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'app-management',
      //         'retirement',
      //         'task-retirement',
      //       ],
      //     },
      //     {
      //       name: 'Retired Micro Procurement',
      //       authority: "ROLE_APP_MNGT_RITIRED_PROCUREMENT",
      //       permission: [
      //         { key: 'ROLE_APP_MNGT_RITIRED_PROCUREMENT', action: 'View Retired Micro Procurement' },
      //       ],
      //       route: [
      //         '',
      //         'modules',
      //         'app-management',
      //         'retirement',
      //         'retired-procure',
      //       ],
      //     },
      //   ],
      // },
      // {
      //   name: 'Annual Procurement Plans',
      //permission: [],
      //route: ['', 'modules', 'app-management', 'annual-procurement-plans'],
      //   icon: 'data_base',
      //   iconType: 'SVG',
      // children: [
      //   {
      //     name: 'Annual Procurement Plans',
      // permission: [],
      // route: ['', 'modules', 'app-management', 'app-management', 'annual-procurement-plans'],
      //   },
      // ],
      // },
      // {
      //   name: 'APP Management',
      //   icon: 'data_base',
      //   iconType: 'SVG',
      //   children: [
      //     {
      //       name: 'Annual Procurement Plans',
      // permission: [],
      // route: ['', 'modules', 'app-management', 'app-management', 'annual-procurement-plans'],
      //     },
      //   ],
      // },

      {
        name: 'GFS Code',
        authority: "ROLE_APP_MNGT_GFS_CD",
        permission: [
          { key: 'ROLE_APP_MNGT_GFS_CD', action: 'View GFS code' },
        ],
        icon: 'my_task',
        iconType: 'SVG',
        route: ['', 'modules', 'app-management', 'gfs-code'],
      },
      {
        name: 'Commodities',
        authority: "ROLE_APP_MNGT_UNSPC_COMMODITIES",
        permission: [
          { key: 'ROLE_APP_MNGT_UNSPC_COMMODITIES', action: 'View UNPSC Commodities' },
        ],
        route: ['', 'modules', 'app-management', 'commodities'],
        icon: 'attachment',
        iconType: 'MATERIAL',
      },
      {
        name: 'Specification',
        authority: 'ROLE_APP_MNGT_SPECIFICATION',
        permission: [
          {
            key: 'ROLE_APP_MNGT_SPECIFICATION',
            action: 'View specification',
          },
        ],
        route: ['', 'modules', 'app-management', 'specification'],
        icon: 'attachment',
        iconType: 'MATERIAL',
      },
      {
        name: 'Tender Categories and Business Lines',
        authority: 'ROLE_APP_MNGT_TENDER_CATEGORIES_AND_BUSINESS_LINES',
        permission: [
          {
            key: 'ROLE_APP_MNGT_TENDER_CATEGORIES_AND_BUSINESS_LINES',
            action: 'View specification',
          },
        ],
        route: ['', 'modules', 'app-management', 'tender-categories-and-business-lines'],
        icon: 'attachment',
        iconType: 'MATERIAL',
      },
      // {
      //   name: 'Tender Categories and Government services',
      //   authority: 'ROLE_APP_MNGT_TENDER_CATEGORIES_AND_GVMT_SERVICES',
      //   permission: [
      //     {
      //       key: 'ROLE_APP_MNGT_TENDER_CATEGORIES_AND_GVMT_SERVICES',
      //       action: 'View specification',
      //     },
      //   ],
      //   route: ['', 'modules', 'app-management', 'tender-categories-and-government-services'],
      //   icon: 'my_task',
      //   iconType: 'MATERIAL',
      // },
      {
        name: 'Settings',
        key: 'settings',
        authority: "ROLE_APP_MNGT_SETTINGS",
        permission: [{ key: 'ROLE_APP_MNGT_SETTINGS', action: 'View settings' }],
        route: ['', 'modules', 'app-management', 'settings'],
        icon: 'settings',
        children: [
          {
            name: 'SOR Groups',
            authority: "ROLE_APP_MNGT_SET_SOR_GRPS",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_SOR_GRPS', action: 'View SOR Group' },
              { key: 'ROLE_APP_MNGT_SET_SOR_GRPS_CREATE', action: 'Add SOR Groups' },
              { key: 'ROLE_APP_MNGT_SET_SOR_GRPS_EDIT', action: 'Edit SOR Group' },
              { key: 'ROLE_APP_MNGT_SET_SOR_GRPS_DELETE', action: 'Delete SOR Group' }
            ],
            route: ['', 'modules', 'app-management', 'settings', 'sor-groups'],
          },
          {
            name: 'Financial Year',
            authority: "ROLE_APP_MNGT_SET_FY",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_FY', action: 'View Financial year' },
              { key: 'ROLE_APP_MNGT_SET_FY_CREATE', action: 'Add Financial year' },
              { key: 'ROLE_APP_MNGT_SET_FY_EDIT', action: 'Edit Financial year' },
              { key: 'ROLE_APP_MNGT_SET_FY_DELETE', action: 'Delete Financial year' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'financial-year',
            ],
          },{
            name: 'PE Financial Year Category Settings',
            authority: "ROLE_APP_MNGT_SET_PE_FINANCIAL_YEAR_CATEGORY",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_PE_FINANCIAL_YEAR_CATEGORY', action: 'View PE Financial Year Category Settings' },
              { key: 'ROLE_APP_MNGT_SET_PE_FINANCIAL_YEAR_CATEGORY_CREATE', action: 'Add PE Financial Year Category Settings' },
              { key: 'ROLE_APP_MNGT_SET_PE_FINANCIAL_YEAR_CATEGORY_EDIT', action: 'Edit PE Financial Year Category Settings' },
              { key: 'ROLE_APP_MNGT_SET_PE_FINANCIAL_YEAR_CATEGORY_DELETE', action: 'Delete PE Financial Year Category Settings' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'pe-financial-year-category-settings',
            ],
          },
          {
            name: 'Tender Category Assignment',
            authority: "ROLE_APP_MNGT_SET_TNDR_CAT_ASSGN",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_TNDR_CAT_ASSGN', action: 'View tender category assignment' },
              { key: 'ROLE_APP_MNGT_SET_TNDR_CAT_ASSGN_CREATE', action: 'Create tender category assignment' },
              { key: 'ROLE_APP_MNGT_SET_TNDR_CAT_ASSGN_EDIT', action: 'Edit tender category assignment' },
              { key: 'ROLE_APP_MNGT_SET_TNDR_CAT_ASSGN_DELETE', action: 'Delete tender category assignment' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'tender-category-assignment',
            ],
          },
          {
            name: 'Procurement Methods',
            authority: "ROLE_APP_MNGT_SET_PRCMT_MTHDS",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_PRCMT_MTHDS', action: 'View procurement methods' },
              { key: 'ROLE_APP_MNGT_SET_PRCMT_MTHDS_CREATE', action: 'Create procurement methods' },
              { key: 'ROLE_APP_MNGT_SET_PRCMT_MTHDS_EDIT', action: 'Edit procurement methods' },
              { key: 'ROLE_APP_MNGT_SET_PRCMT_MTHDS_DELETE', action: 'Delete procurement methods' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'procurement-methods',
            ],
          },
          {
            name: 'Lower Level Procurement Methods',
            authority: "ROLE_APP_MNGT_SET_LWLV_PRCMT_MTHDS",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_LWLV_PRCMT_MTHDS', action: 'View Lower Level Procurement methods' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_PRCMT_MTHDS_CREATE', action: 'Create Lower Level Procurement methods' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_PRCMT_MTHDS_EDIT', action: 'Edit Lower Level Procurement methods' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_PRCMT_MTHDS_DELETE', action: 'Delete Lower Level Procurement methods' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'lower-level-procurement-methods',
            ],
          },
          {
            name: 'Selection Methods',
            authority: "ROLE_APP_MNGT_SET_SLCTN_MTHDS",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_SLCTN_MTHDS', action: 'View selection-proccess methods' },
              { key: 'ROLE_APP_MNGT_SET_SLCTN_MTHDS_CREATE', action: 'Create selection-proccess methods' },
              { key: 'ROLE_APP_MNGT_SET_SLCTN_MTHDS_EDIT', action: 'Edit selection-proccess methods' },
              { key: 'ROLE_APP_MNGT_SET_SLCTN_MTHDS_DELETE', action: 'Delete selection-proccess methods' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'selection-proccess-methods',
            ],
          },
          {
            name: 'Contract Types',
            authority: "ROLE_APP_MNGT_SET_CNTRCT_TYPS",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_CNTRCT_TYPS', action: 'View contract types' },
              { key: 'ROLE_APP_MNGT_SET_CNTRCT_TYPS_CREATE', action: 'Create contract types' },
              { key: 'ROLE_APP_MNGT_SET_CNTRCT_TYPS_EDIT', action: 'Edit contract types' },
              { key: 'ROLE_APP_MNGT_SET_CNTRCT_TYPS_DELETE', action: 'Delete contract types' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'contract-types',
            ],
          },
          {
            name: 'Source of Funds',
            authority: "ROLE_APP_MNGT_SET_SOF",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_SOF', action: 'View Source of funds' },
              { key: 'ROLE_APP_MNGT_SET_SOF_CREATE', action: 'Create Source of funds' },
              { key: 'ROLE_APP_MNGT_SET_SOF_EDIT', action: 'Edit Source of funds' },
              { key: 'ROLE_APP_MNGT_SET_SOF_DELETE', action: 'Delete Source of funds' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'source-of-funds',
            ],
          },
          {
            name: 'PE Threshold',
            authority: "ROLE_APP_MNGT_SET_PE_THRESHOLD",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_PE_THRESHOLD', action: 'View PE Threshold' },
              { key: 'ROLE_APP_MNGT_SET_PE_THRESHOLD_CREATE', action: 'Create PE Threshold' },
              { key: 'ROLE_APP_MNGT_SET_PE_THRESHOLD_EDIT', action: 'Edit PE Threshold' },
              { key: 'ROLE_APP_MNGT_SET_PE_THRESHOLD_DELETE', action: 'Delete PE Threshold' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'pe-threshold',
            ],
          },
          {
            name: 'GFS Code',
            authority: "ROLE_APP_MNGT_SET_GFS_CD",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_GFS_CD', action: 'View GFS code' },
              { key: 'ROLE_APP_MNGT_SET_GFS_CD_CREATE', action: 'Create GFS code' },
              { key: 'ROLE_APP_MNGT_SET_GFS_CD_EDIT', action: 'Edit GFS code' },
              { key: 'ROLE_APP_MNGT_SET_GFS_CD_DELETE', action: 'Delete GFS code' },
            ],
            route: ['', 'modules', 'app-management', 'settings', 'gfs-code'],
          },
          {
            name: 'Lower Level Family Commodity Mapping',
            authority: "ROLE_APP_MNGT_SET_LWLV_FMCM",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_LWLV_FMCM', action: 'View Lower Level Family Commodity Mapping' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_FMCM_CREATE', action: 'Create Lower Level Family Commodity Mapping' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_FMCM_EDIT', action: 'Edit Lower Level Family Commodity Mapping' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_FMCM_DELETE', action: 'Delete Lower Level Family Commodity Mapping' },
            ],
            route: ['', 'modules', 'app-management', 'settings', 'lower-level-family-commodity-mapping'],
          },
          {
            name: 'Lower Level GFS Code',
            authority: "ROLE_APP_MNGT_SET_LWLV_GFS_CD",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_LWLV_GFS_CD', action: 'View Lower Level GFS code' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_GFS_CD_CREATE', action: 'Create Lower Level GFS code' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_GFS_CD_EDIT', action: 'Edit Lower Level GFS code' },
              { key: 'ROLE_APP_MNGT_SET_LWLV_GFS_CD_DELETE', action: 'Delete Lower Level GFS code' },
            ],
            route: ['', 'modules', 'app-management', 'settings', 'lower-level-gfs-code'],
          },
          {
            name: 'Unit Of Measure',
            authority: "ROLE_APP_MNGT_SET_UOM",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_UOM', action: 'View unit of measure' },
              { key: 'ROLE_APP_MNGT_SET_UOM_CREATE', action: 'Create unit of measure' },
              { key: 'ROLE_APP_MNGT_SET_UOM_EDIT', action: 'Edit unit of measure' },
              { key: 'ROLE_APP_MNGT_SET_UOM_DELETE', action: 'Delete unit of measure' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'unit-of-mesure',
            ],
          },
          {
            name: 'Time Lines',
            authority: "ROLE_APP_MNGT_SET_TL",
            permission: [
              { key: 'ROLE_APP_MNGT_SET_TL', action: 'View time lines' },
              { key: 'ROLE_APP_MNGT_SET_TL_CREATE', action: 'Create time lines' },
              { key: 'ROLE_APP_MNGT_SET_TL_EDIT', action: 'Edit time lines' },
              { key: 'ROLE_APP_MNGT_SET_TL_DELETE', action: 'Delete time lines' }
            ],
            route: ['', 'modules', 'app-management', 'settings', 'time-lines'],
          },
          {
            name: 'Method Selection Reasons',
            authority: "ROLE_APP_MNGT_MTHD_SET_SLCTN_RSN",
            permission: [
              { key: 'ROLE_APP_MNGT_MTHD_SET_SLCTN_RSN', action: 'View selection-proccess reasons' },
              { key: 'ROLE_APP_MNGT_MTHD_SET_SLCTN_RSN_CREATE', action: 'Create selection-proccess reasons' },
              { key: 'ROLE_APP_MNGT_MTHD_SET_SLCTN_RSN_DELETE', action: 'Delete selection-proccess reasons' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'method-selection-proccess-reasons',
            ],
          },{
            name: 'Non Public Tender Reasons',
            authority: "ROLE_APP_MNGT_NPT_RSN",
            permission: [
              { key: 'ROLE_APP_MNGT_NPT_RSN', action: 'View Non Public Tender Reasons' },
              { key: 'ROLE_APP_MNGT_NPT_RSN_CREATE', action: 'Create Non Public Tender Reasons' },
              { key: 'ROLE_APP_MNGT_NPT_RSN_DELETE', action: 'Delete Non Public Tender Reasons' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'settings',
              'non-public-tender-reasons',
            ],
          },
        ],
      },

      {
        name: 'Calender Settings',
        icon: 'calendar_month',
        iconType: 'SVG',
        key: 'calendar-settings',
        authority: "ROLE_APP_MNGT_CDER_STGS",
        permission: [{ key: 'ROLE_APP_MNGT_CDER_STGS', action: 'View calendar settings' }],
        route: ['', 'modules', 'app-management', 'calendar-settings'],
        children: [
          {
            name: 'Holidays Setting',
            authority: "ROLE_APP_MNGT_CDER_STGS_HOLIDAY",
            permission: [
              { key: 'ROLE_APP_MNGT_CDER_STGS_HOLIDAY', action: 'View holiday' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_HOLIDAY_CREATE', action: 'Create holiday' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_HOLIDAY_EDIT', action: 'Edit holiday' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_HOLIDAY_DELETE', action: 'Delete holiday' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'calendar-settings',
              'holidays-setting',
            ],
          },
          {
            name: 'Special Days Setting',
            authority: "ROLE_APP_MNGT_CDER_STGS_SPECIAL_DAY",
            permission: [
              { key: 'ROLE_APP_MNGT_CDER_STGS_SPECIAL_DAY', action: 'View special day' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_SPECIAL_DAY_CREATE', action: 'Create special day' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_SPECIAL_DAY_EDIT', action: 'Edit special day' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_SPECIAL_DAY_DELETE', action: 'Delete special day' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'calendar-settings',
              'special-days-setting',
            ],
          },
          {
            name: 'Procurement Stages',
            authority: "ROLE_APP_MNGT_CDER_STGS_PRO_STAGES",
            permission: [
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_STAGES', action: 'View procurement stages' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_STAGES_CREATE', action: 'Create procurement stages' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_STAGES_EDIT', action: 'Edit procurement stages' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_STAGES_DELETE', action: 'Delete procurement stages' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'calendar-settings',
              'procurement-stages',
            ],
          },
          {
            name: 'Procurement Stage to Stage time',
            authority: "ROLE_APP_MNGT_CDER_STGS_PRO_TIME_STAGE",
            permission: [
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_TIME_STAGE', action: 'View procurement stage to stage time' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_TIME_STAGE_CREATE', action: 'Create procurement stage to stage time' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_TIME_STAGE_EDIT', action: 'Edit procurement stage to stage time' },
              { key: 'ROLE_APP_MNGT_CDER_STGS_PRO_TIME_STAGE_DELETE', action: 'Delete procurement stage to stage time' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'calendar-settings',
              'procurement-stage-to-stage-time',
            ],
          },
        ],
      },
      {
        name: 'Rules Configurations',
        icon: 'closed_lock',
        key: 'rules-configurations',
        iconType: 'SVG',
        authority: "ROLE_APP_MNGT_RU_CONFIG",
        permission: [{ key: 'ROLE_APP_MNGT_RU_CONFIG', action: 'View rules configurations' }],
        route: ['', 'modules', 'app-management', 'rules-configurations'],
        children: [
          {
            name: 'Procurement Category Vs Procurement Method vs Threshold',
            authority: "ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METHD_THE",
            permission: [
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METHD_THE', action: 'View Procurement Category Vs Procurement Method vs Threshold' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METHD_THE_CREATE', action: 'Create Procurement Category Vs Procurement Method vs Threshold' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METHD_THE_EDIT', action: 'Edit Procurement Category Vs Procurement Method vs Threshold' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METHD_THE_DELETE', action: 'Delete Procurement Category Vs Procurement Method vs Threshold' },
            ],
            route: [
              '',
              'modules',
              'app-management',
              'rules-configurations',
              'procurement-category-vs-procurement-vs-methods-vs-threshold',
            ],
          },
          {
            name: 'Tenderer Categories Vs Contract Type',
            authority: "ROLE_APP_MNGT_RU_CONFIG_TENDERER_CAT_CON",
            permission: [
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METH_THE', action: ' View tenderer categories vs contract type' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METH_THE_CREATE', action: ' Create tenderer categories vs contract type' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_CAT_METH_THE_DELETE', action: ' Delete tenderer categories vs contract type' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'rules-configurations',
              'tenderer-category-vs-contract-types',
            ],
          },
          {
            name: 'Procurement Methods Vs Eligible Tenderers',
            authority: "ROLE_APP_MNGT_RU_CONFIG_PRO_METHD_ELIGIBLE_TENDERER",
            permission: [
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_METHD_ELIGIBLE_TENDERER', action: 'View procurement methods vs eligible tenderers' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_METHD_ELIGIBLE_TENDERER_CREATE', action: 'Create procurement methods vs eligible tenderers' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_METHD_ELIGIBLE_TENDERER_EDIT', action: 'Edit procurement methods vs eligible tenderers' },
              { key: 'ROLE_APP_MNGT_RU_CONFIG_PRO_METHD_ELIGIBLE_TENDERER_DELETE', action: 'Delete procurement methods vs eligible tenderers' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'rules-configurations',
              'procurement-method-eligible-tenderer',
            ],
          },
          {
            name: 'Tender SubCategory Vs Selection Methods',
            authority: "ROLE_APP_MNGT_TENDER_SUBCAT_SELECTION_METHOD",
            permission: [
              { key: 'ROLE_APP_MNGT_TENDER_SUBCAT_SELECTION_METHOD', action: 'View Tender SubCategory Selection Methods' },
              { key: 'ROLE_APP_MNGT_TENDER_SUBCAT_SELECTION_METHOD_CREATE', action: 'Create Tender SubCategory Selection Methods' },
              { key: 'ROLE_APP_MNGT_TENDER_SUBCAT_SELECTION_METHOD_EDIT', action: 'Edit Tender SubCategory Selection Methods' },
              { key: 'ROLE_APP_MNGT_TENDER_SUBCAT_SELECTION_METHOD_DELETE', action: 'Delete Tender SubCategory Selection Methods' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'rules-configurations',
              'tender-sub-category-vs-selection-proccess-method'
            ],
          },
          // {
          //   name: 'Tenderer Categories Vs Selection Method',
          // permission: [],
          // route: [
          //     '',
          //     'modules',
          //     'app-management',
          //     'rules-configurations',
          //     'tenderer-category-vs-selection-proccess-methods',
          //   ],
          // },
        ],
      },

      {
        name: 'Assets Management',
        icon: 'my_task',
        iconType: 'SVG',
        key: 'assets-management',
        permission: [{ key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_GOVERNMENT_SERVICE_PROVIDER' || 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_FOR_PPRA', action: 'View Assets Management' }],
        route: ['', 'modules', 'app-management', 'calendar-settings'],
        children: [
          {
            name: 'Motor Vehicle ',
            authority: "ROLE_APP_MOTOVEHICLE_MANAGEMENT_GOVERNMENT_SERVICE_PROVIDER",
            permission: [
              { key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_CREATE', action: 'Create motor' },
              { key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_EDIT', action: 'Edit time lines' },
              { key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_DELETE', action: 'Delete time lines' }
            ],
            route: ['', 'modules', 'app-management', 'assets-management', 'motor-vehicle-management'],
          },
          {
            name: 'All Motor Vehicle',
            authority: "ROLE_APP_MOTOVEHICLE_MANAGEMENT_FOR_PPRA",
            permission: [
            ],
            route: ['', 'modules', 'app-management', 'assets-management', 'all-motor-vehicle-management'],
          },
        ],
      },

      {
        name: 'Tender Validity',
        icon: 'evaluate',
        key: 'tender-validity',
        iconType: 'SVG',
        authority: "ROLE_TENDER_VALIDITY_CHECKER",
        permission: [{ key: 'ROLE_TENDER_VALIDITY_CHECKER', action: 'View Tender Validity Notification' }],
        route: ['', 'modules', 'app-management', 'tender-validity'],
        children: [
          {
            name: 'Validity Archive',
            authority: "ROLE_TENDER_VALIDITY_CHECKER_VIEW",
            permission: [
              { key: 'ROLE_TENDER_VALIDITY_CHECKER_VIEW', action: 'View Tender Validity Notification' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'tender-validity',
              'validity-archive',
            ],
          },
          {
            name: 'Extension Requests',
            authority: "ROLE_TENDER_VALIDITY_CHECKER_REQUEST",
            permission: [
              { key: 'ROLE_TENDER_VALIDITY_CHECKER_REQUEST', action: ' Request Tender Validity Notification' }
            ],
            route: [
              '',
              'modules',
              'app-management',
              'tender-validity',
              'extension-requests',
            ],
          },

        ],
      },



      // {
      //   name: 'Motovehicle Management',
      //   authority: "ROLE_APP_MOTOVEHICLE_MANAGEMENT_GOVERNMENT_SERVICE_PROVIDER",
      //   icon: 'my_task',
      //   iconType: 'SVG',
      //   permission: [
      //     { key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_CREATE', action: 'Create motor' },
      //     { key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_EDIT', action: 'Edit time lines' },
      //     { key: 'ROLE_APP_MOTOVEHICLE_MANAGEMENT_DELETE', action: 'Delete time lines' }
      //   ],
      //   route: ['', 'modules', 'app-management', 'settings', 'motor-vehicle-management'],
      // },
      // {
      //   name: 'All Motovehicle',
      //   authority: "ROLE_APP_MOTOVEHICLE_MANAGEMENT_FOR_PPRA",
      //   icon: 'my_task',
      //   iconType: 'SVG',
      //   permission: [
      //   ],
      //   route: ['', 'modules', 'app-management', 'settings', 'all-motor-vehicle-management'],
      // },
      // {
      //   name: 'Rules Configurations',
      //   icon: 'closed_lock',
      //   iconType: 'SVG',
      // permission: [],
      //  route: ['', 'modules', 'app-management', 'rules-config'],
      //   children: [
      //     {
      //       name: 'Procurement Category Vs Procurement Method vs Threshold',
      // permission: [],
      // route: ['', 'modules', 'app-management', 'pcategory-pmethods'],
      //     },
      //     {
      //       name: 'Procurement Method Vs Tender Processing Time',
      //  permission: [],
      // route: ['', 'modules', 'app-management', 'pmethod-ptime'],
      //     },
      //     // {
      //     //   name: 'Procurement Method vs Threshold',
      // permission: [],     //
      // route: ['', 'modules', 'app-management', 'pmethod-threshold'],
      //     // },
      //     {
      //       name: 'Tenderer Categories Vs Contract Type',
      // permission: [],
      // route: ['', 'modules', 'app-management', 'tcategory-ctypes'],
      //     },
      //     {
      //       name: 'Tenderer Categories Vs Selection Method',
      // permission: [],
      // route: ['', 'modules', 'app-management', 'tcategory-smethods'],
      //     },
      //   ],
      // },
      // {
      //   name: 'Calender Settings',
      // permission: [],
      // route: ['', 'modules', 'app-management', 'calender-settings'],
      //   icon: 'rule',
      //   iconType: 'MATERIAL',
      // },
    ],
  }
]
