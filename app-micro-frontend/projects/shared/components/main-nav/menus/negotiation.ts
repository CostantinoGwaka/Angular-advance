import { MenuOption } from '../menu-options';
import {
  AbnomallyHighComponent
} from "../../../../modules/nest-tenderer-negotiation/abnomally-high/price-confirmation/abnomally-high.component";

export const Negotiation: MenuOption[] = [
  {
    name: 'Negotiations',
    shortName: 'Negotiations',
    authority: 'ROLE_MODULES_NGTN',
    permission: [
      {
        key: 'ROLE_MODULES_NGTN',
        action: 'View Negotiation',
      },
    ],
    feature: [
      { key: 'FEATURE_NEGOTIATION', action: 'View Main Menu Negotiation' },
    ],
    route: ['', 'modules', 'negotiation'],
    pathRoute: ['', 'modules', 'negotiation', 'dashboard'],
    description: 'Negotiations',
    icon: 'negotiation',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_NGTN_DASHBOARD',
        permission: [
          { key: 'ROLE_NGTN_DASHBOARD', action: 'View Negotiation Dashboard' },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_DASHBOARD', action: 'View Negotiation Dashboard' },
        ],
        route: ['', 'modules', 'negotiation', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Team Management',
        authority: 'ROLE_NGTN_TEAM_MNGMT',
        permission: [
          { key: 'ROLE_NGTN_TEAM_MNGMT', action: 'View team management' },
          { key: 'ROLE_ADD_NGTN_TEAM', action: 'Add Negotiation Team' },
          { key: 'ROLE_EDIT_NGTN_TEAM', action: 'Edit Negotiation Team' },
          { key: 'ROLE_DELETE_NGTN_TEAM', action: 'Delete Negotiation Team' },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_TEAM_MANAGEMENT', action: 'View Team Management' },
        ],
        route: ['', 'modules', 'negotiation', 'team-management'],
        icon: 'settings',
        iconType: 'SVG',
      },
      {
        name: 'Negotiation Team Tasks',
        authority: 'ROLE_NGTN_TEAM_TASK_MNGMT',
        permission: [
          {
            key: 'ROLE_NGTN_TEAM_TASK_MNGMT',
            action: 'View negotiation team task ',
          },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_TEAM_TASK', action: 'View Team Tasks' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation-team-tasks'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Negotiation Plan',
        authority: 'ROLE_NGTN_NEGOTIATION_PLAN',
        permission: [
          { key: 'ROLE_NGTN_VIEW_NEGOTIATION_PLAN', action: 'View negotiation plan' },
          { key: 'ROLE_NGTN_CREATE_NEGOTIATION_PLAN', action: 'Create negotiation plan' },
          { key: 'ROLE_NGTN_DELETE_NEGOTIATION_PLAN', action: 'Delete negotiation plan' },
          { key: 'ROLE_NGTN_ALLOW_EDITING_NEGOTIATION_PLAN', action: 'Allow Editing Already approved negotiation plan' },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_PLAN', action: 'View Negotiation Plan' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation-plan'],
        icon: 'team',
        iconType: 'SVG',
      },
      {
        name: 'Negotiation Plan Task',
        authority: 'ROLE_NGTN_NEGOTIATION_PLAN_TASK',
        permission: [
          {
            key: 'ROLE_NGTN_NEGOTIATION_PLAN_TASK',
            action: 'View negotiation',
          },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_PLAN_TASK', action: 'View Negotiation Plan Task' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation-plan-tasks'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Negotiation',
        authority: 'ROLE_NGTN_NEGOTIATION',
        permission: [
          { key: 'ROLE_NGTN_NEGOTIATION', action: 'View negotiation' },
          { key: 'ROLE_NGTN_OPEN_RENEGOTIATION', action: 'Open Renegotiation' },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_VIEW', action: 'View Negotiation Reports' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation'],
        icon: 'team',
        iconType: 'SVG',
      },
      {
        name: 'Negotiation Task',
        authority: 'ROLE_NGTN_NEGOTIATION_TASK',
        permission: [
          {
            key: 'ROLE_NGTN_NEGOTIATION_TASK',
            action: 'View negotiation Task',
          }, {
            key: 'ROLE_NGTN_NEGOTIATION_MINUTE_UPLOAD_TB_APPROVAL',
            action: 'Upload Negotiation Minute Tender Board Approval',
          },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_TASK', action: 'View Negotiation Task' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation-task'],
        icon: 'team',
        iconType: 'SVG',
      },
      {
        name: 'Negotiation Minutes',
        authority: 'ROLE_NGTN_NEGOTIATION_MINUTES',
        permission: [
          {
            key: 'ROLE_NGTN_NEGOTIATION_MINUTES',
            action: 'View negotiation minutes',
          },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_MINUTES', action: 'View Negotiation Minutes' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation-minutes'],
        icon: 'fact_check',
        iconType: 'MATERIAL',
      },
      {
        name: 'Negotiation Area',
        authority: 'ROLE_NGTN_NEGOTIATION_AREA',
        permission: [
          {
            key: 'ROLE_NGTN_NEGOTIATION_VIEW_AREA',
            action: 'View negotiation Areas',
          },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_VIEW_AREA', action: 'View Negotiation Minutes' },
        ],
        route: ['', 'modules', 'negotiation', 'negotiation-area'],
        icon: 'fact_check',
        iconType: 'MATERIAL',
      },
      {
        name: 'Abnormally High',
        authority: 'ROLE_NGTN_ABNOMALLY_HIGH',
        permission: [
          {
            key: 'ROLE_NGTN_ABNOMALLY_HIGH',
            action: 'View Abnomally High',
          },
        ],
        feature: [
          { key: 'FEATURE_NEGOTIATION_ABNOMALLY_HIGH', action: 'View Abnormally High' },
        ],
        route: ['', 'modules', 'negotiation', 'abnormally-high'],
        icon: 'team',
        iconType: 'MATERIAL',
        children: [
          {
            name: 'Price Confirmation',
            authority: 'ROLE_NGTN_ABNOMALLY_HIGH_CONFIRMATION',
            permission: [
              { key: 'ROLE_NGTN_ABNOMALLY_HIGH_CONFIRMATION', action: 'Price Abnormality High Price Confirmation' },
            ],
            feature: [
              { key: 'FEATURE_NEGOTIATION_HIGH_CONFIRMATION', action: 'View Price Abnormality High Price Confirmation' },
            ],
            route: ['', 'modules', 'negotiation', 'abnormally-high', 'price-confirmation'],
            icon: 'fact_check',
            iconType: 'MATERIAL',
          },
          {
            name: 'Task Management',
            authority: 'ROLE_NGTN_ABNOMALLY_HIGH_TASK',
            permission: [
              { key: 'ROLE_NGTN_ABNOMALLY_HIGH_TASK', action: 'Price Abnormality High Task Management' },
            ],
            feature: [
              { key: 'FEATURE_NEGOTIATION_ABNOMALLY_HIGH_TASK', action: 'View Price Abnormality High Task Management' },
            ],
            route: ['', 'modules', 'negotiation', 'abnormally-high', 'price-abnormality-tasks'],
            icon: 'fact_check',
            iconType: 'MATERIAL',
          },
        ]
      },
    ],
  },
];

// {
//   path: 'abnormally-high/price-confirmation',
//     component: AbnomallyHighComponent,
// },{
//   path: 'abnormally-high/price-abnormality-tasks',
