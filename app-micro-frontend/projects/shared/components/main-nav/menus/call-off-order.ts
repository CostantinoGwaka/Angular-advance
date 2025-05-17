import { MenuOption } from "../menu-options";

export const CallOffOrder: MenuOption[] = [
  {
    name: 'Call off',
    shortName: 'Call Off',
    authority: 'ROLE_MODULES_CALLOFF',
    permission: [
      {
        key: "ROLE_MODULES_CALLOFF",
        action: "View  Call Off"
      }
    ],
    route: ['', 'modules', 'calloff'],
    pathRoute: ['', 'modules', 'calloff', 'dashboard'],
    description: 'Call off  order',
    icon: 'calloff_icon',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_MODULES_CALLOFF_DASH',
        permission: [
          {
            key: "ROLE_MODULES_CALLOFF_DASH",
            action: "View Call Off Dashboard"
          }
        ],
        route: ['', 'modules', 'calloff', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Call Off Requisitions',
        authority: 'ROLE_MODULES_CALLOFF_RQSTN',
        permission: [
          {
            key: "ROLE_MODULES_CALLOFF_RQSTN",
            action: "View Call Off Requisitions"
          }
        ],
        route: ['', 'modules', 'calloff', 'requisitions'],
        icon: 'settings',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'Call Off Requisitions',
            icon: 'manage_order_icon',
            iconType: 'SVG',
            key: 'requisitions',
            authority: "ROLE_MODULES_CALLOFF_RQSTN",
            permission: [
              {
                key: "ROLE_MODULES_CALLOFF_RQSTN_VW",
                action: "View Call Off Requisitions"
              },
              {
                key: "ROLE_MODULES_CALLOFF_RQSTN_ADD",
                action: "Add Call Off Requisitions"
              },
              {
                key: "ROLE_MODULES_CALLOFF_RQSTN_DLT",
                action: "Delete Call Off Requisition"
              },
              {
                key: 'ROLE_MODULES_CALLOFF_RQSTN_CHNG_ASSGNEE',
                action: 'Allow change of endorsed requisition assignee for call off requisition',
              },

            ],
            route: ['', 'modules', 'calloff', 'requisitions'],

          },
          {
            name: 'Requisition Tasks',
            authority: "ROLE_MODULES_CALLOFF_RQSTN_TASKS",
            permission: [{ key: 'ROLE_MODULES_CALLOFF_RQSTN_TASKS', action: 'View Call Off Order tasks' }],
            route: ['', 'modules', 'calloff', 'requisition-tasks'],
            icon: 'my_task',
            iconType: 'SVG',
          },
        ],
      },


      {
        name: 'Call Off Order',
        authority: 'ROLE_MODULES_CALLOFF_ODR',
        permission: [
          {
            key: "ROLE_MODULES_CALLOFF_ODR",
            action: "View Call Off Order"
          }
        ],
        route: ['', 'modules', 'calloff', 'orders'],
        icon: 'settings',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'Call Off Order',
            icon: 'manage_order_icon',
            iconType: 'SVG',
            key: 'orders',
            authority: "ROLE_MODULES_CALLOFF_ODR",
            permission: [
              {
                key: "ROLE_MODULES_CALLOFF_ODR_VW",
                action: "View Call Off Order"
              },
              {
                key: "ROLE_MODULES_CALLOFF_ODR_ADD",
                action: "Add Call Off Order"
              },
              {
                key: "ROLE_MODULES_CALLOFF_ODR_DLT",
                action: "Delete Call Off Order"
              },

            ],
            route: ['', 'modules', 'calloff', 'orders'],

          },
          {
            name: 'Order Tasks',
            authority: "ROLE_MODULES_CALLOFF_ODR_TASKS",
            permission: [{ key: 'ROLE_MODULES_CALLOFF_ODR_TASKS', action: 'View Call Off Order Tasks' }],
            route: ['', 'modules', 'calloff', 'order-tasks'],
            icon: 'my_task',
            iconType: 'SVG',
          },
        ],
      },




    ],
  }
]
