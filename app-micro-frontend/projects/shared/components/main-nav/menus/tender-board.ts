import { MenuOption } from "../menu-options";

export const TenderBoard: MenuOption[] = [
  {
    name: 'Tender Board',
    shortName: 'Tender Board',
    authority: 'ROLE_MODULES_TNDR_BORD',
    permission: [
      {
        key: "ROLE_MODULES_TNDR_BORD",
        action: ""
      }
    ],
    route: ['', 'modules', 'tender-board'],
    pathRoute: ['', 'modules', 'tender-board', 'dashboard'],
    description: 'Tender Board',
    icon: 'team_manage',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_TNDR_BORD_DASHBOARD',
        permission: [
          {
            key: "ROLE_TNDR_BORD_DASHBOARD",
            action: "View Tender Board Dashboard"
          }
        ],
        route: ['', 'modules', 'tender-board', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Composition',
        authority: 'ROLE_TNDR_BORD_TNDR_BORD_MNGMNT',
        permission: [
          {
            key: "ROLE_TNDR_BORD_TNDR_BORD_MNGMNT",
            action: "View tender board composition"
          },
          {
            key: "ROLE_CREATE_TENDER_BOARD",
            action: "Compose tender board"
          }
        ],
        route: ['', 'modules', 'tender-board', 'management'],
        icon: 'team_manage',
        iconType: 'SVG',
      },
      {
        name: 'Appointment Task',
        authority: 'ROLE_TNDR_BORD_TNDR_BORD_APPRVL',
        permission: [
          {
            key: "ROLE_TNDR_BORD_TNDR_BORD_APPRVL",
            action: "View Appointment Task"
          }
        ],
        route: ['', 'modules', 'tender-board', 'tasks'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Decision',
        authority: 'ROLE_TNDR_BORD_TNDR_BORD_EVAL_VIEW',
        permission: [
          {
            key: "ROLE_TNDR_BORD_TNDR_BORD_EVAL_VIEW",
            action: "View Decision"
          }
        ],
        route: ['', 'modules', 'tender-board', 'evaluation'],
        icon: 'gisp_profile',
        iconType: 'SVG',
      },
      {
        name: 'Decision Management',
        authority: 'ROLE_TNDR_BORD_TNDR_BORD_EVAL_MGMNT_VIEW',
        permission: [
          {
            key: "ROLE_TNDR_BORD_TNDR_BORD_EVAL_MGMNT_VIEW",
            action: "View decision management"
          }
        ],
        route: ['', 'modules', 'tender-board', 'evaluation-management'],
        icon: 'settings',
        iconType: 'SVG',
      },
      // {
      //   name: 'Tender Board Resolutions',
      //   authority:'ROLE_TNDR_BORD_TNDR_BORD_RSOLN',
      //   permission: [
      //     {
      //       key: "ROLE_TNDR_BORD_TNDR_BORD_RSOLN",
      //       action: "View tender board resolutions"
      //     }
      //   ],
      //   route: ['', 'modules', 'tender-board', 'resolutions'],
      //   icon: 'next_week',
      //   iconType: 'MATERIAL',
      // },
    ],
  }
]
