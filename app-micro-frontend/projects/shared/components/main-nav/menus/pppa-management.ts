import { MenuOption } from "../menu-options";

export const PpaaManagement: MenuOption[] = [
  {
    name: 'Complaints & Appeals Management',
    shortName: 'Complaint Management',
    authority: 'ROLE_MODULES_COMPLAINT_DASH',
    permission: [
      {
        key: "ROLE_MODULES_COMPLAINT_DASH",
        action: "View Complaint Management"
      }
    ],
    route: ['', 'modules', 'complaint-management'],
    pathRoute: ['', 'modules', 'complaint-management', 'dashboard'],
    description: 'Complaint Management',
    icon: 'tracking_i',
    iconType: 'SVG',
    children: [
      {
        name: 'Complaint Management',
        authority: 'ROLE_MODULES_COMPLAINT_DASH',
        permission: [
          { key: 'ROLE_MODULES_COMPLAINT_DASH', action: 'View Complaint Management' }
        ],
        route: ['', 'modules', 'complaint-management', 'dashboard'],
        icon: 'dashboard',
        key: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Execution of Decree',
        key: 'execution',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_EXECUTION_DECREE",
        permission: [
          {
            key: "ROLE_EXECUTION_DECREE",
            action: "View Ex Parte Decision of Procuring Entities",
          }
        ],
        route: ['', 'modules', 'complaint-management', 'pe'],
        children: [
          {
            name: 'Assigned Execution of Decree',
            authority: 'ROLE_MODULES_PE_HPMU_EXECUTION_DECREE',
            permission: [
              { key: 'ROLE_MODULES_PE_HPMU_EXECUTION_DECREE', action: 'Manage Pe pending ex parte application' }
            ],
            route: ['', 'modules', 'complaint-management', 'execution', 'user-pe-execution-decree'],
          },
          {
            name: 'Execution of Decree - AO',
            authority: 'ROLE_MODULES_PE_AO_EXECUTION_DECREE',
            permission: [
              { key: 'ROLE_MODULES_PE_AO_EXECUTION_DECREE', action: 'View Pe pending ex parte application' }
            ],
            route: ['', 'modules', 'complaint-management', 'execution', 'ao-pe-execution-decree'],
          },
        ],
      },
      {
        name: 'Ex Parte Decision',
        key: 'pe',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_EX_PARTE_DECISION",
        permission: [
          {
            key: "ROLE_EX_PARTE_DECISION",
            action: "View Ex Parte Decision of Procuring Entities",
          }
        ],
        route: ['', 'modules', 'complaint-management', 'pe'],
        children: [
          // {
          //   name: 'Application to Set Aside Ex-Parte Decision',
          //   authority: 'ROLE_MODULES_PE_PMO_EX_PARTE_DECISION',
          //   permission: [
          //     { key: 'ROLE_MODULES_PE_PMO_EX_PARTE_DECISION', action: 'View Pe Tender and initiate ex parte application' }
          //   ],
          //   route: ['', 'modules', 'complaint-management', 'pe', 'pmo-ex-parte-decision'],
          // },
          {
            name: 'Assigned Ex Parte Decision',
            authority: 'ROLE_MODULES_PE_HPMU_EX_PARTE_DECISION',
            permission: [
              { key: 'ROLE_MODULES_PE_HPMU_EX_PARTE_DECISION', action: 'View Pe pending ex parte application' }
            ],
            route: ['', 'modules', 'complaint-management', 'pe', 'user-pe-ex-parte-decision'],
          },
          {
            name: 'Ex Parte Decision - AO',
            authority: 'ROLE_MODULES_PE_AO_EX_PARTE_DECISION',
            permission: [
              { key: 'ROLE_MODULES_PE_AO_EX_PARTE_DECISION', action: 'View Pe pending ex parte application' }
            ],
            route: ['', 'modules', 'complaint-management', 'pe', 'ao-pe-ex-parte-decision'],
          },
        ],
      },
      {
        name: 'Tender Complaints',
        key: 'accounting-officer',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_COMPLAINT_AO_PE",
        permission: [
          {
            key: "ROLE_COMPLAINT_AO_PE",
            action: "View Complaint of Procuring Entities",
          }
        ],
        route: ['', 'modules', 'complaint-management', 'accounting-officer'],
        children: [
          {
            name: 'Lodged Complaint',
            authority: 'ROLE_MODULES_PE_PENDING_AO_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_PENDING_AO_COMPLAINT', action: 'View Pe Pending Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-pending-complaint'],
          },
          {
            name: 'Ongoing Complaint',
            authority: 'ROLE_MODULES_PE_ONGOING_AO_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_ONGOING_AO_COMPLAINT', action: 'View/Manage Ongoing Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-ongoing-complaint'],
          },
          {
            name: 'Lodged PPAA Appeal',
            authority: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_COMPLAINT', action: 'View/Manage Logded Appeal' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-ppaa-appeal'],
          },
          {
            name: 'Lodged Written Submission',
            authority: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_WRITTEN_SUBMISSION',
            permission: [
              { key: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_WRITTEN_SUBMISSION', action: 'View/Manage Written Submission' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-written-submission'],
          },
          {
            name: 'Lodged EOT Application',
            authority: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_EOT_APPLICATION',
            permission: [
              { key: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_EOT_APPLICATION', action: 'View/Manage EOT Application' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-eot-application'],
          },
          {
            name: 'Lodged EOT Written Submission',
            authority: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_EOT_WRITTEN_SUBMISSION',
            permission: [
              { key: 'ROLE_MODULES_PE_PPAA_APPEAL_AO_EOT_WRITTEN_SUBMISSION', action: 'View/Manage EOT Written Submission' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-eot-written-submission'],
          },
          {
            name: 'Closed Complaint',
            authority: 'ROLE_MODULES_PE_CLOSED_AO_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_CLOSED_AO_COMPLAINT', action: 'View Pe Closed Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-closed-complaint'],
          },
          {
            name: 'Closed Appeal',
            authority: 'ROLE_MODULES_PE_CLOSED_AO_CLOSED',
            permission: [
              { key: 'ROLE_MODULES_PE_CLOSED_AO_CLOSED', action: 'View Pe Closed Appeal' }
            ],
            route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-closed-appeal'],
          },
          // {
          //   name: 'Closed EOT',
          //   authority: 'ROLE_MODULES_PE_CLOSED_AO_CLOSED',
          //   permission: [
          //     { key: 'ROLE_MODULES_PE_CLOSED_AO_CLOSED', action: 'View Pe Closed EOT' }
          //   ],
          //   route: ['', 'modules', 'complaint-management', 'accounting-officer', 'pe-closed-eot'],
          // },
        ],
      },
      {
        name: 'Assigned Complaints',
        key: 'officer',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_MODULES_COMPLAINT_ASSIGN_COMPLAINT",
        permission: [
          {
            key: "ROLE_MODULES_COMPLAINT_ASSIGN_COMPLAINT",
            action: "View Assign Complaint"
          }
        ],
        route: ['', 'modules', 'complaint-management', 'officer'],
        children: [
          {
            name: 'Team Assigned Complaints',
            authority: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_COMPLAINT', action: 'View/Manage Ongoing Assigned Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'assigned-complaint'],
          },
          {
            name: 'Ongoing Assigned Complaints',
            authority: 'ROLE_MODULES_PE_INDIVIDUAL_ASSIGNED_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_INDIVIDUAL_ASSIGNED_COMPLAINT', action: 'View/Manage Individual Assigned Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'individual-assigned-complaint'],
          },
          {
            name: 'Ongoing Assigned Appeal',
            authority: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_APPEAL',
            permission: [
              { key: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_APPEAL', action: 'View/Manage Ongoing Assigned Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'assigned-appeal'],
          },
          {
            name: 'Ongoing Appeal Written Submission',
            authority: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_WRITTEN_SUBMISSION',
            permission: [
              { key: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_WRITTEN_SUBMISSION', action: 'View/Manage Ongoing Assigned Written Submission' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'assigned-written-submission'],
          },
          {
            name: 'Ongoing EoT Application',
            authority: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_EOT_APPLICATION',
            permission: [
              { key: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_EOT_APPLICATION', action: 'View/Manage Ongoing Assigned EOT Written Submission' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'assigned-eot-application'],
          },
          {
            name: 'Ongoing EoT Written Submission',
            authority: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_EOT_WRITTEN_SUBMISSION',
            permission: [
              { key: 'ROLE_MODULES_PE_ONGOING_ASSIGNED_EOT_WRITTEN_SUBMISSION', action: 'View/Manage Ongoing Assigned EOT Written Submission' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'assigned-eot-written-submission'],
          },
          {
            name: 'Closed Complaints',
            authority: 'ROLE_MODULES_PE_CLOSED_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PE_CLOSED_COMPLAINT', action: 'View/Manage Ongoing Assigned Complaint' }
            ],
            route: ['', 'modules', 'complaint-management', 'officer', 'closed-complaint'],
          },
        ],
      },
      {
        name: 'Executive Secretary',
        key: 'executive-secretary',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_COMPLAINT_ES_PPAA",
        permission: [
          {
            key: "ROLE_COMPLAINT_ES_PPAA",
            action: "View PPAA Executive Secretary"
          }
        ],
        route: ['', 'modules', 'complaint-management', 'executive-secretary'],
        children: [
          {
            name: 'Lodged Appeal',
            authority: 'ROLE_MODULES_PPAA_PENDING_ES_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_ES_COMPLAINT', action: 'View Pending Appeal' }
            ],
            route: ['', 'modules', 'complaint-management', 'executive-secretary', 'ppaa-complaint'],
          },
          {
            name: 'Lodged EoT',
            authority: 'ROLE_MODULES_PPAA_PENDING_ES_EOT',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_ES_EOT', action: 'View Extension of time' }
            ],
            route: ['', 'modules', 'complaint-management', 'executive-secretary', 'eot-applications'],
          },
          {
            name: 'Lodged Ex Parte Decision',
            authority: 'ROLE_MODULES_PPAA_PENDING_ES_SSED',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_ES_SSED', action: 'View Ex Parte Decision' }
            ],
            route: ['', 'modules', 'complaint-management', 'executive-secretary', 'ex-parte-decision'],
          },
          {
            name: 'Lodged Execution',
            authority: 'ROLE_MODULES_PPAA_PENDING_ES_EXECUTION',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_ES_EXECUTION', action: 'View Execution' }
            ],
            route: ['', 'modules', 'complaint-management', 'executive-secretary', 'ppaa-execution'],
            key: 'es_execution',
          },
          {
            name: 'Administrative Review',
            authority: 'ROLE_MODULES_PPAA_PENDING_ES_SSED',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_ES_SSED', action: 'View Execution' },
            ],
            route: ['', 'modules', 'complaint-management', 'executive-secretary', 'administrative-review'],
          },
          // {
          //   name: 'Lodged Debarment Appeal',
          //   authority: 'ROLE_MODULES_PPAA_PENDING_ES_DEBARTMENT',
          //   permission: [
          //     { key: 'ROLE_MODULES_PPAA_PENDING_ES_DEBARTMENT', action: 'View Debarment Appeal' }
          //   ],
          //   route: ['', 'modules', 'complaint-management', 'es', 'ppaa-debarment'],
          //   key: 'es_debarment',
          // },
        ],
      },
      {
        name: 'DST',
        key: 'deputy-executive-secretary',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_COMPLAINT_DST_PPAA",
        permission: [
          {
            key: "ROLE_COMPLAINT_SETTINGS",
            action: "View Complaint Settings"
          }
        ],
        route: ['', 'modules', 'complaint-management', 'deputy-executive-secretary'],
        children: [
          {
            name: 'DST Appeal',
            authority: 'ROLE_MODULES_DST_PPAA_PENDING_DST_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_DST_PPAA_PENDING_DST_COMPLAINT', action: 'View Pending DST Appeal' },
              { key: 'ROLE_MODULES_DST_PPAA_PENDING_DST_UPDATE_LO_APPEAL', action: 'Change legal officer for Appeal' },
            ],
            route: ['', 'modules', 'complaint-management', 'deputy-executive-secretary', 'dst-ppaa-appeal'],
          },
          {
            name: 'DST EoT',
            authority: 'ROLE_MODULES_PPAA_PENDING_DST_EOT',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_EOT', action: 'View Extension of time' },
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_EOT_UPDATE_LO_EOT', action: 'Change legal officer for eot application' },
            ],
            route: ['', 'modules', 'complaint-management', 'deputy-executive-secretary', 'eot-applications'],
          },
          {
            name: 'Ex Parte Decision',
            authority: 'ROLE_MODULES_PPAA_PENDING_DST_SSED',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_SSED', action: 'View Set A Side Expert Decison' },
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_SSED_UPDATE_LO_EOT', action: 'Change legal officer for ex parte application' },
            ],
            route: ['', 'modules', 'complaint-management', 'deputy-executive-secretary', 'ex-parte-decision'],
          },
          {
            name: 'Execution',
            authority: 'ROLE_MODULES_PPAA_PENDING_DST_EXECUTION',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_EXECUTION', action: 'View Execution' },
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_EXECUTION_UPDATE_LO_EOT', action: 'Change legal officer for execution application' },
            ],
            route: ['', 'modules', 'complaint-management', 'deputy-executive-secretary', 'execution-application'],
          },
          {
            name: 'Administrative Review',
            authority: 'ROLE_MODULES_PPAA_PENDING_DST_EXECUTION',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_EXECUTION', action: 'View Execution' },
              { key: 'ROLE_MODULES_PPAA_PENDING_DST_EXECUTION_UPDATE_LO_EOT', action: 'Change legal officer for execution application' },
            ],
            route: ['', 'modules', 'complaint-management', 'deputy-executive-secretary', 'administrative-review'],
          },
          // {
          //   name: 'Debarment Appeal',
          //   authority: 'ROLE_MODULES_PPAA_PENDING_DST_DEBARTMENT',
          //   permission: [
          //     { key: 'ROLE_MODULES_PPAA_PENDING_DST_DEBARTMENT', action: 'View Debarment Appeal' }
          //   ],
          //   route: ['', 'modules', 'complaint-management', 'dst', 'ppaa-debarment'],
          //   key: 'dst_debarment',
          // },
        ],
      },
      {
        name: 'Legal Officer',
        key: 'legal-officer',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_COMPLAINT_LO_PPAA",
        permission: [
          {
            key: "ROLE_COMPLAINT_LO_PPAA",
            action: "View Complaint LO"
          }
        ],
        route: ['', 'modules', 'complaint-management', 'legal-officer'],
        children: [
          {
            name: 'LO Appeal',
            authority: 'ROLE_MODULES_DST_PPAA_PENDING_LO_COMPLAINT',
            permission: [
              { key: 'ROLE_MODULES_DST_PPAA_PENDING_LO_COMPLAINT', action: 'View Pending LO Appeal' }
            ],
            route: ['', 'modules', 'complaint-management', 'legal-officer', 'lo-ppaa-appeal'],
          },
          {
            name: 'LO EoT',
            authority: 'ROLE_MODULES_PPAA_PENDING_EOT',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_EOT', action: 'View Extension of time' }
            ],
            route: ['', 'modules', 'complaint-management', 'legal-officer', 'eot-applications'],
          },
          {
            name: 'Ex Parte Decision',
            authority: 'ROLE_MODULES_PPAA_PENDING_LO_SSED',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_LO_SSED', action: 'View Set A Side Expert Decison' }
            ],
            route: ['', 'modules', 'complaint-management', 'legal-officer', 'ex-parte-decision'],
          },
          {
            name: 'Execution',
            authority: 'ROLE_MODULES_PPAA_PENDING_LO_EXECUTION',
            permission: [
              { key: 'ROLE_MODULES_PPAA_PENDING_LO_EXECUTION', action: 'View Execution' }
            ],
            route: ['', 'modules', 'complaint-management', 'legal-officer', 'lo-execution'],
          },
          // {
          //   name: 'Debarment Appeal',
          //   authority: 'ROLE_MODULES_PPAA_PENDING_LO_DEBARTMENT',
          //   permission: [
          //     { key: 'ROLE_MODULES_PPAA_PENDING_LO_DEBARTMENT', action: 'View Debarment Appeal' }
          //   ],
          //   route: ['', 'modules', 'complaint-management', 'lo', 'lo-debarment'],
          //   key: 'lo_debartment',
          // },
        ],
      },
      // {
      //   name: 'Appeal Reviewer',
      //   key: 'appeal-reviewer',
      //   authority: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER',
      //   permission: [
      //     { key: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER', action: 'View Appeal Reviewer' }
      //   ],
      //   route: ['', 'modules', 'complaint-management', 'appeal-reviewer'],
      //   icon: 'list',
      //   iconType: 'SVG',
      // },
      {
        name: 'PPAA Appeal Reviewer',
        key: 'appeal-reviewer',
        icon: 'bill_compl',
        iconType: 'SVG',
        authority: "ROLE_MODULES_COMPLAINT_BOARD_MEMBER",
        permission: [
          {
            key: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER', action: 'View Appeal Reviewer'
          }
        ],
        route: ['', 'modules', 'complaint-management', 'appeal-reviewer'],
        children: [
          {
            name: 'Appeals',
            authority: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_APPEAL',
            permission: [
              { key: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_APPEAL', action: 'View Appeal' }
            ],
            route: ['', 'modules', 'complaint-management', 'appeal-reviewer', 'ppaa-appeal'],
          },
          {
            name: 'Ex Parte Decision',
            authority: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_EX_PARTE',
            permission: [
              { key: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_EX_PARTE', action: 'View Ex Parte Decision' }
            ],
            route: ['', 'modules', 'complaint-management', 'appeal-reviewer', 'ppaa-ex-parte'],
          },
          {
            name: 'Execution Application',
            authority: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_EXECUTION',
            permission: [
              { key: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_EXECUTION', action: 'View Execution Application' }
            ],
            route: ['', 'modules', 'complaint-management', 'appeal-reviewer', 'ppaa-execution'],
          },
          {
            name: 'Extension of time apps',
            authority: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_EOT',
            permission: [
              { key: 'ROLE_MODULES_COMPLAINT_BOARD_MEMBER_EOT', action: 'View Extension of time' }
            ],
            route: ['', 'modules', 'complaint-management', 'appeal-reviewer', 'ppaa-eot'],
          },
        ],
      },
      // {
      //   name: 'PE Closed Complaints',
      //   authority: 'ROLE_MODULES_COMPLAINT_PENDING_COMPLAINT',
      //   permission: [
      //     { key: 'ROLE_MODULES_COMPLAINT_PENDING_COMPLAINT', action: 'View Pending Complaint' }
      //   ],
      //   route: ['', 'modules', 'complaint-management', 'closed-complaint'],
      //   icon: 'closed_complaint',
      //   iconType: 'SVG',
      // },
      {
        name: 'Complaint Settings',
        key: 'settings',
        iconType: 'SVG',
        icon: 'settings',
        authority: "ROLE_COMPLAINT_SETTINGS",
        permission: [
          {
            key: "ROLE_COMPLAINT_SETTINGS",
            action: "View Complaint Settings"
          }
        ],
        route: ['', 'modules', 'complaint-management', 'settings'],
        children: [
          {
            name: 'Review Appeal Level',
            authority: "ROLE_COMPLAINT_APPEAL_LEVEL",
            permission: [
              { key: "ROLE_COMPLAINT_APPEAL_LEVEL", action: "View Appeal Level" },
            ],
            route: ['', 'modules', 'complaint-management', 'settings', 'review-level'],
          },
          {
            name: 'Review Complaint Level',
            authority: "ROLE_COMPLAINT_COMPLAIN_LEVEL",
            permission: [
              { key: "ROLE_COMPLAINT_COMPLAIN_LEVEL", action: "View Complain Level" },
            ],
            route: ['', 'modules', 'complaint-management', 'settings', 'review-complain-level'],
          },
          {
            name: 'Complaint Type',
            authority: "ROLE_COMPLAINT_TYPE_ROLE",
            key: 'team_members_role',
            permission: [
              { key: "ROLE_COMPLAINT_TYPE_ROLE", action: "Manage Complaint Type Role" },
            ],
            route: ['', 'modules', 'complaint-management', 'settings', 'complaint-type'],
          },
          {
            name: 'Fee Settings',
            authority: "ROLE_COMPLAINT_SETTING_ROLE",
            permission: [
              { key: "ROLE_COMPLAINT_SETTING_ROLE", action: "View Complaint Billing Setting" },
            ],
            route: ['', 'modules', 'complaint-management', 'settings', 'appeal-billing-setting'],
          },
        ],
      },
    ],
  }
]
