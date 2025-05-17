import { MenuOption } from '../menu-options';

export const Statistics: MenuOption[] = [
  {
    name: 'Statistics',
    shortName: 'Statistics',
    authority: 'ROLE_MODULES_STATS',
    permission: [
      {
        key: 'ROLE_MODULES_STATS',
        action: 'Can read NeST statistics',
      },
      {
        key: 'ROLE_VIEW_ALL_PES_STATS',
        action: 'Can view all PEs statistics',
      },
    ],
    route: ['', 'modules', 'statistics'],
    pathRoute: ['', 'modules', 'statistics', 'main-dashboard'],
    description: 'NeST Tender Statistics',
    icon: 'statsDashboard',
    iconType: 'SVG',
    children: [
      {
        name: 'Main Dashboard',
        authority: 'ROLE_MODULES_STATS_MAIN_DASHBOARD',
        permission: [
          {
            key: 'ROLE_MODULES_STATS_MAIN_DASHBOARD',
            action: 'Can view main NeST statistics dashboard',
          },
        ],
        route: ['', 'modules', 'statistics', 'main-dashboard'],
        icon: 'statsDashboard',
        iconType: 'SVG',
      },
      {
        name: 'Annual Procurement Plans',
        authority: 'ROLE_MODULES_STATS_APP',
        permission: [
          {
            key: 'ROLE_MODULES_STATS_APP',
            action: 'Can view NeST APP statistics',
          },
        ],
        route: ['', 'modules', 'statistics', 'app'],
        icon: 'statsDashboard',
        iconType: 'SVG',
      },
      {
        name: 'Published Tenders',
        authority: 'ROLE_MODULES_STATS_PUBLISHED_TENDERS',
        permission: [
          {
            key: 'ROLE_MODULES_STATS__PUBLISHED_TENDERS',
            action: 'Can view NeST Published Tenders statistics',
          },
        ],
        route: ['', 'modules', 'statistics', 'published-tenders'],
        icon: 'statsDashboard',
        iconType: 'SVG',
      },
      {
        name: 'Awarded Tenders',
        authority: 'ROLE_MODULES_STATS_PUBLISHED_TENDERS',
        permission: [
          {
            key: 'ROLE_MODULES_STATS_PUBLISHED_TENDERS',
            action: 'Can view NeST Awarded Tenders statistics',
          },
        ],
        route: ['', 'modules', 'statistics', 'awarded-tenders'],
        icon: 'statsDashboard',
        iconType: 'SVG',
      },
      {
        name: 'NeST Usage',
        authority: 'ROLE_MODULES_STATS_USAGE',
        permission: [
          {
            key: 'ROLE_MODULES_STATS_USAGE',
            action: 'Can view NeST Usage statistics',
          },
        ],
        route: ['', 'modules', 'statistics', 'usage'],
        icon: 'statsDashboard',
        iconType: 'SVG',
      },
      // {
      //   name: 'Contracts',
      //   authority: 'ROLE_MODULES_STATS_CONTRACTS',
      //   permission: [
      //     {
      //       key: 'ROLE_MODULES_STATS_APP',
      //       action: 'Can view NeST Contracts statistics',
      //     },
      //   ],
      //   route: ['', 'modules', 'statistics', 'contracts'],
      //   icon: 'statsDashboard',
      //   iconType: 'SVG',
      // },
    ],
  },
];
