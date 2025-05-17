import { MenuOption } from '../menu-options';

export const PeAuditors: MenuOption[] = [
  {
    name: 'Procurement Audit',
    shortName: 'PE Auditing',
    authority: 'ROLE_MODULES_PE_AUDITORS_DASH',
    permission: [
      {
        key: 'ROLE_MODULES_PE_AUDITORS_DASH',
        action: 'View Dashboard for pe auditors',
      },
    ],
    route: ['', 'modules', 'pe-auditors'],
    pathRoute: ['', 'modules', 'pe-auditors', 'dashboard'],
    description: 'Audit Tools for Procuring Entity',
    icon: 'monitor',
    key: 'pe-auditors',
    iconType: 'SVG',
    children: [
      {
        name: 'PE Auditing Dashboard',
        authority: 'ROLE_MODULES_PE_AUDITORS_DASH',
        permission: [
          {
            key: 'ROLE_MODULES_PE_AUDITORS_DASH',
            action: 'View Dashboard for pe auditors',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'dashboard'],
        icon: 'ppraDashboard',
        iconType: 'SVG',
      },
      {
        name: 'Director General',
        key: 'dgaudit',
        iconType: 'SVG',
        icon: 'planIcon',
        authority: 'ROLE_AO_AUDIT',
        permission: [
          {
            key: 'ROLE_AO_AUDIT',
            action: 'View All Audit Plan',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'dgaudit'],
        children: [
          {
            name: 'Audit Plan by Section',
            authority: 'ROLE_AO_AUDIT_ITEM',
            permission: [
              {
                key: 'ROLE_AO_AUDIT_ITEM',
                action: 'View Audit Plan by Section',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'dgaudit',
              'all-audit-plan-item',
            ],
          },
          {
            name: 'Implementation Plan',
            authority: 'ROLE_AO_AUDIT_SPECIFIC',
            permission: [
              {
                key: 'ROLE_AO_AUDIT_SPECIFIC',
                action: 'View Audit Team Assignment',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'dgaudit',
              'all-audit-team-assignment',
            ],
          },
          {
            name: 'Pe Audit Management',
            authority: 'ROLE_AO_AUDIT_EXECUTION',
            permission: [
              {
                key: 'ROLE_AO_AUDIT_EXECUTION',
                action: 'View Audit Management',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'dgaudit',
              'ao-auditors-execution',
            ],
          },
        ],
      },
      {
        name: 'QA Manager',
        key: 'qamanager',
        iconType: 'SVG',
        icon: 'planIcon',
        authority: 'ROLE_QA_MANAGER',
        permission: [
          {
            key: 'ROLE_QA_MANAGER',
            action: 'View All Audit Plan',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'qamanager'],
        children: [
          {
            name: 'Audit Plan by Section',
            authority: 'ROLE_QA_MANAGER_ITEM',
            permission: [
              {
                key: 'ROLE_QA_MANAGER_ITEM',
                action: 'View Audit Plan by Section',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'qamanager',
              'all-audit-plan-item',
            ],
          },
          {
            name: 'Implementation Plan ',
            authority: 'ROLE_QA_MANAGER_SPECIFIC',
            permission: [
              {
                key: 'ROLE_QA_MANAGER_SPECIFIC',
                action: 'View Audit Team Assignment',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'qamanager',
              'all-audit-team-assignment',
            ],
          },
          {
            name: 'Audit Management',
            authority: 'ROLE_QA_MANAGER_EXECUTION',
            permission: [
              {
                key: 'ROLE_QA_MANAGER_EXECUTION',
                action: 'View Audit Management',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'qamanager',
              'qamanager-auditors-execution',
            ],
          },
        ],
      },
      {
        name: 'QA Auditor',
        key: 'qaauditor',
        iconType: 'SVG',
        icon: 'planIcon',
        authority: 'ROLE_QA_AUDITOR',
        permission: [
          {
            key: 'ROLE_QA_AUDITOR',
            action: 'View All Audit Plan',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'qaauditor'],
        children: [
          {
            name: 'Audit Plan by Section',
            authority: 'ROLE_QA_AUDITOR_ITEM',
            permission: [
              {
                key: 'ROLE_QA_AUDITOR_ITEM',
                action: 'View Audit Plan by Section',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'qaauditor',
              'all-audit-plan-item',
            ],
          },
          {
            name: 'Implementation Plan ',
            authority: 'ROLE_QA_AUDITOR_SPECIFIC',
            permission: [
              {
                key: 'ROLE_QA_AUDITOR_SPECIFIC',
                action: 'View Audit Team Assignment',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'qaauditor',
              'all-audit-team-assignment',
            ],
          },
          {
            name: 'Audit Management',
            authority: 'ROLE_QA_AUDITOR_EXECUTION',
            permission: [
              {
                key: 'ROLE_QA_AUDITOR_EXECUTION',
                action: 'View Audit Management',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'qaauditor',
              'qaauditor-auditors-execution',
            ],
          },
        ],
      },
      {
        name: 'Director Audit',
        key: 'hodaudit',
        iconType: 'SVG',
        icon: 'planIcon',
        authority: 'ROLE_HOD_AUDIT',
        permission: [
          {
            key: 'ROLE_HOD_AUDIT',
            action: 'View All Audit Plan',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'hodaudit'],
        children: [
          {
            name: 'Audit Plan',
            authority: 'ROLE_HOD_AUDIT_INITIATE',
            permission: [
              { key: 'ROLE_HOD_AUDIT_INITIATE', action: 'View Audit Plan' },
              {
                key: 'ROLE_HOD_AUDIT_INITIATE_CREATE',
                action: 'Create Audit Plan',
              },
              {
                key: 'ROLE_HOD_AUDIT_INITIATE_EDIT',
                action: 'Edit Audit Plan',
              },
              {
                key: 'ROLE_HOD_AUDIT_INITIATE_DELETE',
                action: 'Delete Audit Plan',
              },
            ],
            route: ['', 'modules', 'pe-auditors', 'audit', 'audit-plan'],
          },
          {
            name: 'Audit Plan by Section',
            authority: 'ROLE_HOD_AUDIT_ITEM',
            permission: [
              {
                key: 'ROLE_HOD_AUDIT_ITEM',
                action: 'View Audit Plan by Section',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'hodaudit',
              'all-audit-plan-item',
            ],
          },
          {
            name: 'Implementation Plan ',
            authority: 'ROLE_HOD_AUDIT_SPECIFIC',
            permission: [
              {
                key: 'ROLE_HOD_AUDIT_SPECIFIC',
                action: 'View Audit Team Assignment',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'hodaudit',
              'all-audit-team-assignment',
            ],
          },
          {
            name: 'Audit Management',
            authority: 'ROLE_HOD_AUDIT_EXECUTION',
            permission: [
              {
                key: 'ROLE_HOD_AUDIT_EXECUTION',
                action: 'View Audit Management',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'hodaudit',
              'hod-auditors-execution',
            ],
          },
          {
            name: 'Audit Summary Report',
            authority: 'ROLE_HOD_AUDIT_EXECUTION',
            permission: [
              {
                key: 'ROLE_HOD_AUDIT_EXECUTION',
                action: 'View Audit Summary Report',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'hodaudit',
              'hod-auditors-summary-report',
            ],
          },
          {
            name: 'Implementation Plan Task',
            authority: 'ROLE_AUDIT_TASK',
            permission: [
              {
                key: 'ROLE_AUDIT_TASK',
                action: 'View Audit Tasks',
              },
            ],
            route: ['', 'modules', 'pe-auditors', 'audit', 'audit-plan-task'],
            icon: 'assignment_turned_in',
            iconType: 'MATERIAL',
          },
        ],
      },
      {
        name: 'Manager Audit',
        key: 'audit',
        iconType: 'SVG',
        icon: 'planIcon',
        authority: 'ROLE_AUDIT_PLAN',
        permission: [
          {
            key: 'ROLE_AUDIT_PLAN',
            action: 'View Audit Plan',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'audit'],
        children: [
          {
            name: 'Audit Plan by Section',
            authority: 'ROLE_AUDIT_PLAN_ITEM',
            permission: [
              { key: 'ROLE_AUDIT_PLAN_ITEM', action: 'View Audit Items Plan' },
              {
                key: 'ROLE_AUDIT_PLAN_ITEM_CREATE',
                action: 'Create Audit Items Plan',
              },
              {
                key: 'ROLE_AUDIT_PLAN_ITEM_EDIT',
                action: 'Edit Audit Items Plan',
              },
              {
                key: 'ROLE_AUDIT_PLAN_ITEM_DELETE',
                action: 'Delete Audit Items Plan',
              },
            ],
            route: ['', 'modules', 'pe-auditors', 'audit', 'audit-plan-item'],
          },
          {
            name: 'Implementation Plan ',
            authority: 'ROLE_AUDIT_PLAN_SPECIFIC',
            permission: [
              {
                key: 'ROLE_AUDIT_PLAN_SPECIFIC',
                action: 'View Audit Team Assignment',
              },
              {
                key: 'ROLE_AUDIT_PLAN_SPECIFIC_CREATE',
                action: 'Create Audit Team Assignment',
              },
              {
                key: 'ROLE_AUDIT_PLAN_SPECIFIC_EDIT',
                action: 'Edit Audit Team Assignment',
              },
              {
                key: 'ROLE_AUDIT_PLAN_SPECIFIC_DELETE',
                action: 'Delete Audit Team Assignment',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'audit',
              'audit-team-assignment',
            ],
          },
          {
            name: 'Audit Management',
            authority: 'ROLE_AUDITORS_MANAGER_EXECUTIONS',
            permission: [
              {
                key: 'ROLE_AUDITORS_MANAGER_EXECUTIONS',
                action: 'View Audit Team Assignment',
              },
              {
                key: 'ROLE_AUDITORS_MANAGER_EXECUTIONS_VIEW',
                action: 'View Auditor Execution',
              },
              {
                key: 'ROLE_AUDITORS_MANAGER_EXECUTIONS_CREATE',
                action: 'Create Auditor Execution',
              },
              {
                key: 'ROLE_AUDITORS_MANAGER_EXECUTIONS_MANAGE',
                action: 'Manage Auditor Execution',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'audit',
              'auditors-execution-manage',
            ],
          },
          {
            name: 'Implementation Plan Task',
            authority: 'ROLE_AUDIT_TASK',
            permission: [
              {
                key: 'ROLE_AUDIT_TASK',
                action: 'View Audit Tasks',
              },
            ],
            route: ['', 'modules', 'pe-auditors', 'audit', 'audit-plan-task'],
            icon: 'assignment_turned_in',
            iconType: 'MATERIAL',
          },
        ],
      },
      {
        name: 'Auditors Audit',
        icon: 'tasks',
        key: 'execution',
        iconType: 'SVG',
        authority: 'ROLE_AUDIT_EXECUTION',
        permission: [
          {
            key: 'ROLE_AUDIT_PLAN',
            action: 'View Audit Plan',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'audit'],
        children: [
          {
            name: 'Execution Initiation',
            authority: 'ROLE_AUDIT_INITIATION',
            permission: [
              { key: 'ROLE_AUDIT_INITIATION', action: 'View Audit Execution' },
              {
                key: 'ROLE_AUDIT_INITIATION_CREATE',
                action: 'Create Audit Execution',
              },
              {
                key: 'ROLE_AUDIT_INITIATION_EDIT',
                action: 'Edit Audit Execution',
              },
              {
                key: 'ROLE_AUDIT_INITIATION_DELETE',
                action: 'Delete Audit Execution',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'execution',
              'audit-execution-initiation',
            ],
          },
          {
            name: 'Audit Execution',
            authority: 'ROLE_AUDIT_EXCUTION',
            permission: [
              { key: 'ROLE_AUDIT_EXCUTION', action: 'View Audit Execution' },
              {
                key: 'ROLE_AUDIT_EXCUTION_CREATE',
                action: 'Create Audit Execution',
              },
              {
                key: 'ROLE_AUDIT_EXCUTION_EDIT',
                action: 'Edit Audit Execution',
              },
              {
                key: 'ROLE_AUDIT_EXCUTION_DELETE',
                action: 'Delete Audit Execution',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'execution',
              'audit-execution',
            ],
          },
          // {
          //   name: 'Audit Execution Task',
          //   authority: 'ROLE_AUDIT_TASK',
          //   permission: [
          //     {
          //       key: 'ROLE_AUDIT_TASK',
          //       action: 'View Audit Tasks',
          //     },
          //   ],
          //   route: [
          //     '',
          //     'modules',
          //     'pe-auditors',
          //     'execution',
          //     'audit-execution-task',
          //   ],
          //   icon: 'assignment_turned_in',
          //   iconType: 'MATERIAL',
          // },
        ],
      },
      {
        name: 'Pe Audit Respond',
        icon: 'tasks',
        key: 'perespond',
        iconType: 'SVG',
        authority: 'ROLE_AUDIT_PE_RESPOND',
        permission: [
          {
            key: 'ROLE_AUDIT_PE_RESPOND',
            action: 'View Pe Audit Respond',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'perespond'],
        children: [
          {
            name: 'Audit Report(s)',
            authority: 'ROLE_AUDIT_PE_RESPOND',
            permission: [
              { key: 'ROLE_AUDIT_PE_RESPOND', action: 'View Pe Audit Respond' },
              {
                key: 'ROLE_AUDIT_PE_RESPOND_CREATE',
                action: 'Create Pe Audit Respond',
              },
              {
                key: 'ROLE_AUDIT_PE_RESPOND_EDIT',
                action: 'Edit Pe Audit Respond',
              },
              {
                key: 'ROLE_AUDIT_PE_RESPOND_DELETE',
                action: 'Delete Pe Audit Respond',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'perespond',
              'audit-pe-respond',
            ],
          },
        ],
      },
      {
        name: 'HPMU Audit Respond',
        icon: 'tasks',
        key: 'hpmurespond',
        iconType: 'SVG',
        authority: 'ROLE_AUDIT_HPMU_RESPOND',
        permission: [
          {
            key: 'ROLE_AUDIT_PE_RESPOND',
            action: 'View Pe Audit Respond',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'hpmurespond'],
        children: [
          {
            name: 'Audit Report(s)',
            authority: 'ROLE_AUDIT_HPMU_RESPOND',
            permission: [
              {
                key: 'ROLE_AUDIT_HPMU_RESPOND',
                action: 'View HPMU Audit Respond',
              },
              {
                key: 'ROLE_AUDIT_HPMU_RESPOND_CREATE',
                action: 'Create HPMU Audit Respond',
              },
              {
                key: 'ROLE_AUDIT_HPMU_RESPOND_EDIT',
                action: 'Edit HPMU Audit Respond',
              },
              {
                key: 'ROLE_AUDIT_HPMU_RESPOND_DELETE',
                action: 'Delete HPMU Audit Respond',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'hpmurespond',
              'audit-hpmu-respond',
            ],
          },
        ],
      },
      {
        name: 'Pe Auditors Settings',
        key: 'settings',
        iconType: 'SVG',
        icon: 'settings',
        authority: 'ROLE_COMPLAINT_SETTINGS',
        permission: [
          {
            key: 'ROLE_COMPLAINT_SETTINGS',
            action: 'View Pe Auditors Settings',
          },
        ],
        route: ['', 'modules', 'pe-auditors', 'settings'],
        children: [
          {
            name: 'Audit Category',
            authority: 'ROLE_AUDIT_CATEGORY_VIEW',
            permission: [
              {
                key: 'ROLE_AUDIT_CATEGORY_VIEW',
                action: 'View Audit Category',
              },
              {
                key: 'ROLE_AUDIT_CATEGORY_CREATE',
                action: 'Create Audit Category',
              },
              {
                key: 'ROLE_AUDIT_CATEGORY_EDIT',
                action: 'Edit Audit Category',
              },
              {
                key: 'ROLE_AUDIT_CATEGORY_DELETE',
                action: 'Delete Audit Category',
              },
            ],
            route: ['', 'modules', 'pe-auditors', 'settings', 'audit-category'],
          },
          {
            name: 'Audit Sections',
            authority: 'ROLE_AUDIT_SECTION_VIEW',
            permission: [
              { key: 'ROLE_AUDIT_SECTION_VIEW', action: 'View Audit Section' },
              {
                key: 'ROLE_AUDIT_SECTION_CREATE',
                action: 'Create Audit Section',
              },
              { key: 'ROLE_AUDIT_SECTION_EDIT', action: 'Edit Audit Section' },
              {
                key: 'ROLE_AUDIT_SECTION_DELETE',
                action: 'Delete Audit Section',
              },
            ],
            route: ['', 'modules', 'pe-auditors', 'settings', 'audit-section'],
          },
          {
            name: 'Audit Indicators',
            authority: 'ROLE_AUDIT_INDICATORS_VIEW',
            permission: [
              {
                key: 'ROLE_AUDIT_INDICATORS_VIEW',
                action: 'View Audit Indicators',
              },
              {
                key: 'ROLE_AUDIT_INDICATORS_CREATE',
                action: 'Create Audit Indicators',
              },
              {
                key: 'ROLE_AUDIT_INDICATORS_EDIT',
                action: 'Edit Audit Indicators',
              },
              {
                key: 'ROLE_AUDIT_INDICATORS_DELETE',
                action: 'Delete Audit Indicators',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'settings',
              'audit-indicators',
            ],
          },
          {
            name: 'Audit Requirements',
            authority: 'ROLE_AUDIT_REQUIREMENTS_VIEW',
            permission: [
              {
                key: 'ROLE_AUDIT_REQUIREMENTS_VIEW',
                action: 'View Audit Requirements',
              },
              {
                key: 'ROLE_AUDIT_REQUIREMENTS_CREATE',
                action: 'Create Audit Requirements',
              },
              {
                key: 'ROLE_AUDIT_REQUIREMENTS_EDIT',
                action: 'Edit Audit Requirements',
              },
              {
                key: 'ROLE_AUDIT_REQUIREMENTS_DELETE',
                action: 'Delete Audit Requirements',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'settings',
              'audit-requirements',
            ],
          },
          {
            name: 'Audit Checklist',
            authority: 'ROLE_AUDIT_CHECKLIST_VIEW',
            permission: [
              {
                key: 'ROLE_AUDIT_CHECKLIST_VIEW',
                action: 'View Audit Checklist',
              },
              {
                key: 'ROLE_AUDIT_CHECKLIST_CREATE',
                action: 'Create Audit Checklist',
              },
              {
                key: 'ROLE_AUDIT_CHECKLIST_EDIT',
                action: 'Edit Audit Checklist',
              },
              {
                key: 'ROLE_AUDIT_CHECKLIST_DELETE',
                action: 'Delete Audit Checklist',
              },
            ],
            route: [
              '',
              'modules',
              'pe-auditors',
              'settings',
              'audit-checklist',
            ],
          },
        ],
      },
    ],
  },
];
