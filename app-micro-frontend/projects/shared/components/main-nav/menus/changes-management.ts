import {MenuOption} from "../menu-options";

export const ChangeManagement:MenuOption[]=[
  {
    name: 'Changes Management',
    shortName: 'Changes Management',
    authority:'ROLE_MODULES_CHNG_MNGT',
    permission: [
      {
        key: "ROLE_MODULES_CHNG_MNGT",
        action: "View Changes Management (requests)"
      }
    ],
    route: ['', 'modules', 'changes-management'],
    pathRoute: ['', 'modules', 'changes-management', 'requests'],
    description: 'Change Management',
    icon: 'change_mngmnt',
    iconType: 'SVG',
    children: [
      {
        name: 'Change Requests',
        icon: 'change_mngmnt',
        iconType: 'SVG',
        key: 'changes-management-requests',
        authority:"ROLE_MODULES_CHNG_MNGT",
        permission: [
          {
            key:'ROLE_MODULES_CHNG_MNGT_VW',
            action: 'View Change Management (requests)'
          },
          {
            key:'ROLE_MODULES_CHNG_MNGT_CR_UP',
            action: 'Change Management (requests) Create/Edit'
          },
          {
            key:'ROLE_MODULES_CHNG_MNGT_DELETE',
            action: 'Change Management (requests) Delete'
          },
          {
            key:'ROLE_MODULES_CHNG_MNGT_INT_TSK',
            action: 'Initiate Change Management (requests) Task'
          }
        ],
        route: ['', 'modules', 'changes-management', 'requests'],
      },
      {
        name: 'Change Requests Tasks',
        icon: 'my_task',
        iconType: 'SVG',
        key: 'changes-management-requests-tasks',
        authority:"ROLE_MODULES_CHNG_MNGT_TSKS",
        permission: [
          {key:'ROLE_MODULES_CHNG_MNGT_PND_TSKS', action: 'Pending Change Management (requests) Tasks'},
          {key:'ROLE_MODULES_CHNG_MNGT_PREV_TSKS', action: 'Previous Change Management (requests) Tasks'}
        ],
        route: ['', 'modules', 'changes-management', 'request-tasks']
      },
    ],
  }
]
