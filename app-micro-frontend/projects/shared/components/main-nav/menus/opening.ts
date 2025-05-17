import { MenuOption } from '../menu-options';

export const Opening: MenuOption[] = [
  {
    name: 'Opening',
    shortName: 'Opening',
    authority: 'ROLE_MODULES_OPN',
    permission: [
      {
        key: 'ROLE_MODULES_OPN',
        action: 'View  Opening',
      },
    ],
    route: ['', 'modules', 'opening'],
    pathRoute: [
      '',
      'modules',
      'opening',
      'pre-qualification-opening',
      'opened',
    ],
    description: 'Opening',
    icon: 'tenderOpening',
    iconType: 'SVG',
    children: [
      {
        name: 'Pre Qualification Opening',
        icon: 'calendar_month',
        iconType: 'SVG',
        key: 'pre-qualification-opening',
        authority: 'ROLE_MODULES_PRE_OPN',
        permission: [
          { key: 'ROLE_MODULES_PRE_OPN', action: 'Pre Qualification Opening' },
        ],
        route: [
          '',
          'modules',
          'opening',
          'pre-qualification-opening',
          'opened',
        ],
        children: [
          {
            name: 'Pending Opening',
            authority: 'ROLE_PRE_OPN_PENDING_OPENING',
            permission: [
              {
                key: 'ROLE_PRE_OPN_PENDING_OPENING',
                action: 'View pre-qualifications pending opening',
              },
              {
                key: 'ROLE_PRE_OPN_CAN_OPEN',
                action: 'Can open pre qualification',
              },
            ],
            route: [
              '',
              'modules',
              'opening',
              'pre-qualification-opening',
              'pending',
            ],
            icon: 'closedTender',
            iconType: 'SVG',
          },
          {
            name: 'Opened',
            authority: 'ROLE_PRE_OPN_OPENED_PRE_QUALIFICATION',
            permission: [
              {
                key: 'ROLE_PRE_OPN_OPENED_PRE_QUALIFICATION',
                action: 'View opened Pre Qualifications',
              },
            ],
            route: [
              '',
              'modules',
              'opening',
              'pre-qualification-opening',
              'opened',
            ],
            icon: 'openedTender',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Framework Opening',
        icon: 'calendar_month',
        iconType: 'SVG',
        key: 'framework-opening',
        authority: 'ROLE_MODULES_FRM_OPN',
        permission: [
          { key: 'ROLE_MODULES_FRM_OPN', action: 'Framework Opening' },
        ],
        route: ['', 'modules', 'opening', 'framework-opening'],
        children: [
          {
            name: 'Pending Opening',
            authority: 'ROLE_FRM_OPN_PENDING_OPENING',
            permission: [
              {
                key: 'ROLE_FRM_OPN_PENDING_OPENING',
                action: 'View frameworks pending opening',
              },
              {
                key: 'ROLE_FRM_OPN_CAN_OPEN',
                action: 'Can open framework',
              },
            ],
            route: ['', 'modules', 'opening', 'framework-opening', 'pending'],
            icon: 'closedTender',
            iconType: 'SVG',
          },
          {
            name: 'Opened',
            authority: 'ROLE_FRM_OPN_OPENED_FRAMEWORKS',
            permission: [
              {
                key: 'ROLE_FRM_OPN_OPENED_FRAMEWORKS',
                action: 'View opened frameworks',
              },
            ],
            route: ['', 'modules', 'opening', 'framework-opening', 'opened'],
            icon: 'openedTender',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Tender Opening',
        icon: 'calendar_month',
        iconType: 'SVG',
        key: 'tender-opening',
        authority: 'ROLE_MODULES_TNDR_OPN',
        permission: [
          { key: 'ROLE_MODULES_TNDR_OPN', action: 'Tender Opening' },
        ],
        route: ['', 'modules', 'opening', 'tender-opening'],
        children: [
          {
            name: 'Pending Opening',
            authority: 'ROLE_TNDR_OPN_PENDING_OPENING',
            permission: [
              {
                key: 'ROLE_TNDR_OPN_PENDING_OPENING',
                action: 'View tenders pending opening',
              },
              {
                key: 'ROLE_TNDR_OPN_CAN_OPEN',
                action: 'Can open tender',
              },
            ],
            route: ['', 'modules', 'opening', 'tender-opening', 'pending'],
            icon: 'closedTender',
            iconType: 'SVG',
          },
          {
            name: 'Opened',
            authority: 'ROLE_TNDR_OPN_OPENED_TENDERS',
            permission: [
              {
                key: 'ROLE_TNDR_OPN_OPENED_TENDERS',
                action: 'View opened tenders',
              },
            ],
            route: ['', 'modules', 'opening', 'tender-opening', 'opened'],
            icon: 'openedTender',
            iconType: 'SVG',
          },
        ],
      },
    ],
  },
];
