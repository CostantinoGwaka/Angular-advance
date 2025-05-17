import { MenuOption } from '../menu-options';

export const TemplatesManagement: MenuOption[] = [
  {
    name: 'Templates Management',
    shortName: 'Templates Management',
    route: ['', 'modules', 'templates-management'],
    pathRoute: ['', 'modules', 'templates-management', 'templates'],
    description: 'Standard Procurement documents editor',
    icon: 'clipboard',
    iconType: 'SVG',
    authority: 'ROLE_MODULES_TMPL_MNGT',
    permission: [
      {
        key: 'ROLE_MODULES_TMPL_MNGT',
        action: '',
      },
    ],
    children: [
      {
        name: 'Templates',
        authority: 'ROLE_TMPL_MNGT_TEMPLATES',
        permission: [
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES',
            action: 'View tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_CREATE',
            action: 'Can create tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_VIEW_ALL',
            action: 'View all tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_DRAFT',
            action: 'View draft tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_PUBLISHED',
            action: 'View published tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_ARCHIVED',
            action: 'View archived tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_UPDATE',
            action: 'Can update tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_DELETE',
            action: 'Can delete tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_ARCHIVE',
            action: 'Can archive tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_UNARCHIVE',
            action: 'Can un-archive tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_PUBLISH',
            action: 'Can publish tender template',
          },
          {
            key: 'ROLE_TMPL_MNGT_TEMPLATES_CREATE',
            action: 'Can copy tender template',
          },
        ],
        route: ['', 'modules', 'templates-management', 'templates'],
        icon: 'description',
        iconType: 'MATERIAL',
      },
      {
        name: 'Placeholders',
        authority: 'ROLE_TMPL_MNGT_PLACEHOLDER_READ',
        permission: [
          {
            key: 'ROLE_TMPL_MNGT_PLACEHOLDER_READ',
            action: 'View placeholder',
          },
          {
            key: 'ROLE_TMPL_MNGT_PLACEHOLDER_CREATE',
            action: 'Can create placeholder',
          },
          {
            key: 'ROLE_TMPL_MNGT_PLACEHOLDER_UPDATE',
            action: 'Can update placeholder',
          },
          {
            key: 'ROLE_TMPL_MNGT_PLACEHOLDER_DELETE',
            action: 'Can delete placeholder',
          },

        ],
        route: ['', 'modules', 'templates-management', 'placeholders'],
        icon: 'data_object',
        iconType: 'MATERIAL',
      },
      {
        name: 'Non-STD Template Categories',
        authority: 'ROLE_TMPL_MNGT_NON_STD_TMPL_CTGRY',
        permission: [
          {
            key: 'ROLE_TMPL_MNGT_NON_STD_TMPL_CTGRY',
            action: 'View Non-STD template categories',
          },
          {
            key: 'ROLE_TMPL_MNGT_CATEGORY_CREATE',
            action: 'Can create template categories',
          },{
            key: 'ROLE_TMPL_MNGT_CATEGORY_UPDATE',
            action: 'Can update template categories',
          },{
            key: 'ROLE_TMPL_MNGT_CATEGORY_DELETE',
            action: 'Can delete template categories',
          },
        ],
        route: [
          '',
          'modules',
          'templates-management',
          'non-std-template-categories',
        ],
        icon: 'data_object',
        iconType: 'MATERIAL',
      },
    ],
  },
];
