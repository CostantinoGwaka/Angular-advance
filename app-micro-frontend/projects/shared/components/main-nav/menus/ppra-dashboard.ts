import { MenuOption } from "../menu-options";

export const PpraDashboard: MenuOption[] = [
  {
    name: 'PPRA Dashboard',
    shortName: 'PPRA Dashboard',
    authority: 'ROLE_MODULES_PPRA_DASH',
    permission: [
      {
        key: "ROLE_MODULES_PPRA_DASH",
        action: "View  PPRA Dashboard"
      }
    ],
    route: ['', 'modules', 'ppra-dashboard'],
    pathRoute: ['', 'modules', 'ppra-dashboard', 'billing-details'],
    description: 'PPRA Dashboard',
    icon: 'ppraDashboard',
    iconType: 'SVG',
    children: [
      {
        name: 'Billing Details',
        // icon: 'calendar_month',
        // iconType: 'SVG',
        key: 'billing-details',
        authority: "ROLE_MODULES_PPRA_DASH_BLL_DTLS",
        permission: [
          { key: 'ROLE_MODULES_PPRA_DASH_BLL_DTLS', action: 'View Bill Details' }
        ],
        route: ['', 'modules', 'ppra-dashboard', 'billing-details'],

      },
      {
        name: 'Daily Summary',
        key: 'daily-summary',
        // icon: 'calendar_month',
        // iconType: 'SVG',
        authority: "ROLE_MODULES_PPRA_DASH_DLY_SUMRY",
        permission: [
          {
            key: 'ROLE_MODULES_PPRA_DASH_DLY_SUMRY',
            action: 'View Tenderer Summary'
          }
        ],
        route: ['', 'modules', 'ppra-dashboard', 'daily-summary',],
      },

      {
        name: 'Approvers Summary',
        authority: "ROLE_MODULES_PPRA_DASH_APPROVER_SUMMARY",
        permission: [
          { key: 'ROLE_MODULES_PPRA_DASH_APPROVER_SUMMARY', action: 'View approvers summary' },
        ],
        route: ['', 'modules', 'ppra-dashboard', 'approval-summary'],
        // icon: 'people',
        // iconType: 'MATERIAL',
      },
      {
        name: 'Tender Summary',
        authority: "ROLE_MODULES_PPRA_DASH_TNDR_SUMMARY",
        permission: [
          { key: 'ROLE_MODULES_PPRA_DASH_TNDR_SUMMARY', action: 'View tender summary' },
          { key: 'ROLE_PPRA_DASH_VIEW_BOQ', action: 'View BOQ summary' },
          { key: 'ROLE_PPRA_DASH_VIEW_ESTIMATED_BUDGET', action: 'View Estimated Budget' },


        ],
        route: ['', 'modules', 'ppra-dashboard', 'merged-main-req-summary'],
      },
      {
        name: 'Lower Level Statistics',
        authority: "ROLE_MODULES_PPRA_DASH_LOWER_LEVEL_STATISTICS",
        permission: [
          { key: 'ROLE_MODULES_PPRA_DASH_LOWER_LEVEL_STATISTICS', action: 'View tender lower level statistics' },
        ],
        route: ['', 'modules', 'ppra-dashboard', 'lower-level-statistics'],
      },
      {
        name: 'Framework Summary',
        authority: "ROLE_MODULES_PPRA_DASH_TNDR_SUMMARY",
        permission: [],
        route: ['', 'modules', 'ppra-dashboard', 'framework-summary'],
      },
      {
        name: 'Tenderer Cuis Bids Items',
        authority: "ROLE_MODULES_PPRA_DASH_CUIS_BIDS_ITEM",
        permission: [
          {
            key: 'ROLE_MODULES_PPRA_DASH_CUIS_BIDS_ITEM',
            action: 'View Tenderer Cuis Bids Item'
          },
        ],
        route: ['', 'modules', 'ppra-dashboard', 'cuis-bids-item'],
      },
      {
        name: 'Bidder & PE Tender Metrics',
        authority: "ROLE_MODULES_PPRA_DASH_TNDR_STASTICS",
        permission: [
          {
            key: 'ROLE_MODULES_PPRA_DASH_TNDR_STASTICS',
            action: 'View Bidder & PE Tender Metrics'
          },
        ],
        route: ['', 'modules', 'ppra-dashboard', 'tender-statistics'],
      },
      {
        name: 'Tenderer Profile',
        key: 'approved',
        authority: "ROLE_TNDRR_MNGT_PROFILE",
        permission: [
          {
            key: 'ROLE_TNDRR_MNGT_PROFILE',
            action: 'View profile tenderer'
          }
        ],
        route: [
          '',
          'modules',
          'ppra-dashboard',
          'pe-profile-tenderer',
        ],
      },
      {
        name: 'Nest Feedbacks',
        key: 'feedback',
        authority: "ROLE_NEST_FEEDBACKS",
        permission: [
          {
            key: 'ROLE_NEST_FEEDBACKS',
            action: 'View nest feedbacks'
          }
        ],
        route: [
          '',
          'modules',
          'ppra-dashboard',
          'nest-feedback',
        ],
      },

    ],
  }
]
