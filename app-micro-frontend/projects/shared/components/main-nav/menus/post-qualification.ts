import { MenuOption } from "../menu-options";

export const PostQualification: MenuOption[] = [
  {
    name: 'Tender Post Qualification',
    shortName: 'Post Qualification',
    authority: 'ROLE_MODULES_TENDER_POST_QLFCTN',
    permission: [
      {
        key: "ROLE_MODULES_TENDER_POST_QLFCTN",
        action: "View post qualification"
      }
    ],
    route: ['', 'modules', 'post-qualification'],
    pathRoute: ['', 'modules', 'post-qualification', 'dashboard'],
    description: 'Post Qualification',
    icon: 'post-qualification',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: "ROLE_TENDER_POST_QLFCTN_DASH",
        permission: [{ key: 'ROLE_TENDER_POST_QLFCTN_DASH', action: 'View Post Qualification Dashboard' }],
        route: ['', 'modules', 'post-qualification', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Post Qualification',
        authority: "ROLE_TENDER_POST_QLFCTN_PST_QUA",
        permission: [{ key: 'ROLE_TENDER_POST_QLFCTN_PST_QUA', action: 'View post qualification' }],
        route: ['', 'modules', 'post-qualification', 'post-qualification'],
        icon: 'approved-cart',
        iconType: 'SVG',
      },
      {
        name: 'Post Qualification Team',
        authority: "ROLE_TENDER_POST_QLFCTN_PST_QUA_TEAM",
        permission: [{ key: 'ROLE_TENDER_POST_QLFCTN_PST_QUA_TEAM', action: 'View post qualification team ' }],
        route: ['', 'modules', 'post-qualification', 'post-qualification-team'],
        icon: 'team',
        iconType: 'SVG',
      },
      {
        name: 'Team Management',
        authority: "ROLE_TENDER_POST_QLFCTN_TEAN_MNGMT",
        permission: [{ key: 'ROLE_TENDER_POST_QLFCTN_TEAN_MNGMT', action: 'View team management' }],
        route: ['', 'modules', 'post-qualification', 'team-management'],
        icon: 'settings',
        iconType: 'SVG',
      },
      {
        name: 'Team Qualification Report Tasks',
        authority: "ROLE_TENDER_POST_QLFCTN_TEAM_QUA_RPT_TASK",
        permission: [{ key: 'ROLE_TENDER_POST_QLFCTN_TEAM_QUA_RPT_TASK', action: 'View team qualification report tasks' }],
        route: [
          '',
          'modules',
          'post-qualification',
          'post-qualification-report-tasks',
        ],
        icon: 'tasks',
        iconType: 'SVG',
      },
    ],
  }
]
