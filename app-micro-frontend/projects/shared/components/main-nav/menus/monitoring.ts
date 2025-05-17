import { MenuOption } from '../menu-options';

export const Monitoring: MenuOption[] = [
  {
    name: 'Monitoring',
    shortName: 'Monitoring',
    authority: 'ROLE_MODULE_MONITORING',
    permission: [
      {
        key: 'ROLE_MODULE_MONITORING',
        action: 'View monitoring logs',
      },
    ],
    route: ['', 'modules', 'monitoring'],
    pathRoute: ['', 'modules', 'monitoring', 'dashboard'],
    description: 'View monitoring logs',
    icon: 'warning',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_MODULE_MONITORING_DASHBOARD',
        permission: [
          {
            key: 'ROLE_MODULE_MONITORING_DASHBOARD',
            action: 'View monitoring dashboard',
          },
        ],
        route: ['', 'modules', 'monitoring', 'dashboard'],
        icon: 'monitoring',
        iconType: 'SVG',
      },
      {
        name: 'Error Logs',
        authority: 'ROLE_MODULE_MONITORING_ERROR_LOGS',
        permission: [
          {
            key: 'ROLE_MODULE_MONITORING_ERROR_LOGS',
            action: 'View error logs',
          },
        ],
        route: ['', 'modules', 'monitoring', 'error-logs'],
        icon: 'warning',
        iconType: 'SVG',
      },
      {
        name: 'Slow endpoints',
        authority: 'ROLE_MODULE_MONITORING_SLOW_ENDPOINTS',
        permission: [
          {
            key: 'ROLE_MODULE_MONITORING_SLOW_ENDPOINTS',
            action: 'View slow endpoints',
          },
        ],
        route: ['', 'modules', 'monitoring', 'slow-endpoints'],
        icon: 'tortoise',
        iconType: 'SVG',
      },
      {
        name: 'User(s) Login History',
        authority: 'ROLE_MODULE_MONITORING_USER_LOGIN_HISTORY',
        permission: [
          {
            key: 'ROLE_MODULE_MONITORING_USER_LOGIN_HISTORY',
            action: 'View users login history',
          },
        ],
        route: ['', 'modules', 'monitoring', 'users-login-history'],
        icon: 'user_account',
        iconType: 'SVG',
      },
    ],
  },
];
