import { MenuOption } from "../menu-options";

export const TenderEvaluation: MenuOption[] = [
  {
    name: 'Tender Evaluation',
    shortName: 'Tender Evaluation',
    authority: 'ROLE_MODULES_TNDR_EVL',
    permission: [
      {
        key: "ROLE_MODULES_TNDR_EVL",
        action: ""
      }
    ],
    route: ['', 'modules', 'tender-evaluation'],
    pathRoute: ['', 'modules', 'tender-evaluation', 'dashboard'],
    description: 'Tender Evaluation',
    icon: 'evaluate',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_TNDR_EVL_DASHBOARD',
        permission: [
          {
            key: "ROLE_TNDR_EVL_DASHBOARD",
            action: "View evaluation dashboard"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Tender Evaluation',
        authority: 'ROLE_TNDR_EVL_TENDER_EVAL',
        permission: [
          {
            key: "ROLE_TNDR_EVL_TENDER_EVAL",
            action: "View tender evaluation"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'evaluation'],
        icon: 'requisition',
        iconType: 'SVG',
      },
      {
        name: 'Appointment Letters',
        authority: 'ROLE_TNDR_EVL_TENDER_EVAL',
        permission: [
          {
            key: "ROLE_TNDR_EVL_TENDER_EVAL",
            action: "View Appointment letters"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'appointment-letters'],
        icon: 'fact_check',
        iconType: 'MATERIAL',
      },
      {
        name: 'Evaluation Management',
        authority: 'ROLE_TNDR_EVL_EVAL_MANGMNT',
        permission: [
          {
            key: "ROLE_TNDR_EVL_EVAL_MANGMNT",
            action: "View evaluation management"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'evaluation-team'],
        icon: 'team',
        iconType: 'SVG',
      },
      {
        name: 'Evaluation Progress',
        authority: 'ROLE_TNDR_EVL_EVAL_PROGRESS',
        permission: [
          {
            key: "ROLE_TNDR_EVL_EVAL_PROGRESS",
            action: "View evaluation progress"
          },

        ],
        route: ['', 'modules', 'tender-evaluation', 'evaluation-progress'],
        icon: 'settings',
        iconType: 'SVG',
      },
      {
        name: 'Team Management',
        authority: 'ROLE_TNDR_EVL_TEAM_MANAGEMENT',
        permission: [
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT",
            action: "View Team Management"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_CREATE",
            action: "Create Team"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_VW_PNDG_TASK",
            action: "View Pending Tasks"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_VW_PREV_TASK",
            action: "View Previous Task"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_UPDT_TM_MEMBR",
            action: "Update Team Information"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_PRAPR_APPTMNT_LETTER",
            action: "Prepare Appointment Letter"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_SIGN_APPTMNT_LETTER",
            action: "Sign Appointment Letter"
          },
          {
            key: "ROLE_TNDR_EVL_TEAM_MANAGEMENT_SEND_APPTMNT_LETTER",
            action: "Send Appointment Letter"
          },

        ],
        route: ['', 'modules', 'tender-evaluation', 'team-management'],
        icon: 'settings',
        iconType: 'SVG',
      },
      {
        name: 'Evaluation Reports',
        authority: 'ROLE_TNDR_EVL_EVAL_REPORTS',
        permission: [
          {
            key: "ROLE_TNDR_EVL_EVAL_REPORTS",
            action: "View participated evaluation reports"
          },
          {
            key: "ROLE_TNDR_EVL_EVAL_REPORTS_VW_ALL",
            action: "View all evaluation reports"
          },
          {
            key: "ROLE_TNDR_EVL_EVAL_REPORTS_APVD_TCHNCL_RPT_NT_NOTFD",
            action: "View all approved technical evaluation reports not notified"
          },
          {
            key: "ROLE_EVAL_REPORT_TNDR_BOARD_RESOLN_VIEW",
            action: "View tender board evaluation resolution"
          },
          {
            key: "ROLE_EVAL_REPORT_UPDT_NON_RESPO_REASON",
            action: "Rephrase non responsiveness reason"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'evaluation-reports'],
        icon: 'fact_check',
        iconType: 'MATERIAL',
      },
      {
        name: 'Financial Proposals',
        authority: 'ROLE_TNDR_FNC_PROP_VIEW',
        permission: [
          {
            key: "ROLE_TNDR_FNC_PROP_VIEW",
            action: "View Financial Proposal Opening Reports"
          },
          {
            key: "ROLE_TNDR_FNC_PROP_OPN",
            action: "Open Financial Proposals"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'financial-proposals'],
        icon: 'fact_check',
        iconType: 'MATERIAL',
      },
      {
        name: 'Joint Venture Consortium',
        authority: 'ROLE_TNDR_EVL_EVAL_REPORTS',
        permission: [
          {
            key: 'ROLE_TNDR_EVL_EVAL_REPORTS',
            action: 'View all JVC',
          },
        ],
        route: ['', 'modules', 'tender-evaluation', 'all-joint-venture'],
        icon: 'next_week',
        iconType: 'MATERIAL',
      },
      {
        name: 'CUIS Evaluation',
        shortName: 'Framework Evaluation',
        authority: 'ROLE_TNDR_EVL_FRAMEWORK_EVAL',
        permission: [
          {
            key: "ROLE_TNDR_EVL_FRAMEWORK_EVAL",
            action: "View evaluation tasks"
          }
        ],
        route: ['', 'modules', 'framework-evaluation'],
        pathRoute: ['', 'modules', 'tender-evaluation'],
        description: 'Evaluation',
        icon: 'requisition',
        key: 'framework-evaluation',
        iconType: 'SVG',
        children: [
          {
            name: 'Evaluation',
            authority: 'ROLE_TNDR_EVL_FRAMEWORK_EVALUATION',
            permission: [
              {
                key: "ROLE_TNDR_EVL_FRAMEWORK_EVALUATION",
                action: "View framework evaluation"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'framework-evaluation', 'evaluation'],
            icon: 'tasks',
            iconType: 'SVG',
          },
          // {
          //   name: 'Winner Requests',
          //   authority: 'ROLE_TNDR_EVL_WINNER_EVALUATION',
          //   permission: [
          //     {
          //       key: "ROLE_TNDR_EVL_WINNER_EVALUATION",
          //       action: "View Winner Requests"
          //     }
          //   ],
          //   route: ['', 'modules', 'tender-evaluation', 'framework-evaluation', 'winner-request'],
          //   icon: 'tasks',
          //   iconType: 'SVG',
          // },
          {
            name: 'Complete Evaluation',
            authority: 'ROLE_TNDR_EVL_COMPLETE_EVAL_REPORT',
            permission: [
              {
                key: "ROLE_TNDR_EVL_COMPLETE_EVAL_REPORT",
                action: "View Complete Evaluation"
              }
            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'framework-evaluation',
              'evaluation-reports',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Evaluation Reports',
            authority: 'ROLE_TNDR_EVL_FRAMEWORK_EVAL_REPORTS',
            permission: [
              {
                key: "ROLE_TNDR_EVL_FRAMEWORK_EVAL_REPORTS",
                action: "View evaluation reports"
              },
            ],
            route: ['', 'modules', 'tender-evaluation', 'framework-evaluation', 'framework-evaluation-reports'],
            icon: 'fact_check',
            iconType: 'MATERIAL',
          },
        ],
      },
      {
        name: 'Evaluation Tasks',
        shortName: 'Evaluation Tasks',
        authority: 'ROLE_TNDR_EVL_EVAL_TASKS',
        permission: [
          {
            key: "ROLE_TNDR_EVL_EVAL_TASKS",
            action: "View evaluation tasks"
          }
        ],
        route: ['', 'modules', 'tender-evaluation'],
        pathRoute: ['', 'modules', 'tender-evaluation', 'team-task'],
        description: 'Evaluation Tasks',
        icon: 'tasks',
        iconType: 'SVG',
        children: [
          {
            name: 'Team Tasks',
            authority: 'ROLE_TNDR_EVL_TASK_TEAM_TASKS',
            permission: [
              {
                key: "ROLE_TNDR_EVL_TASK_TEAM_TASKS",
                action: "View team tasks"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'team-task'],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Reports Tasks',
            authority: 'ROLE_TNDR_EVL_TASK_REPORT_TASKS',
            permission: [
              {
                key: "ROLE_TNDR_EVL_TASK_REPORT_TASKS",
                action: "View report tasks"
              }
            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'evaluation-reports-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      //ROLE_TNDR_EVL_SUPPORT_TOOLS
      // ROLE_TNDR_EVL_SUPPORT_TOOLS_FX_TC_RPT
      {
        name: 'Support Tools',
        shortName: 'Evaluation Tools',
        authority: 'ROLE_VIEW_SUBMSN_SUPPORT_TOOLS',
        permission: [
          {
            key: "ROLE_VIEW_SUBMSN_SUPPORT_TOOLS",
            action: "Handle Evaluation Support Tools"
          }
        ],
        route: ['', 'modules', 'tender-evaluation'],
        pathRoute: ['', 'modules', 'tender-evaluation', 'support-tools'],
        description: 'Evaluation Support Tools',
        icon: 'settings',
        iconType: 'SVG',
        children: [
          {
            name: 'Evaluation Tasks Fix(Tech Report)',
            authority: 'ROLE_VIEW_SUBMSN_FIX_EVALUATION_TASK',
            permission: [
              {
                key: "ROLE_VIEW_SUBMSN_FIX_EVALUATION_TASK",
                action: "Evaluation Tasks Fix(Tech Report)"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'support-tools', 'evaluation-tech-report-fix'],
            icon: 'settings',
            iconType: 'SVG',
          },
          {
            name: 'Winner modification Fix(Refresh winners)',
            authority: 'ROLE_VIEW_SUBMSN_FIX_WINNER_MODIFICATIONS',
            permission: [
              {
                key: "ROLE_VIEW_SUBMSN_FIX_WINNER_MODIFICATIONS",
                action: "Winner modification Fix(Refresh winners)"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'support-tools', 'evaluation-winner-modification-fix'],
            icon: 'settings',
            iconType: 'SVG',
          },
          {
            name: 'Cancelled Teams with shortlisted applicants',
            authority: 'ROLE_VIEW_SUBMSN_CANCEL_TEAMS_WITH_SHORTLISTED',
            permission: [
              {
                key: "ROLE_VIEW_SUBMSN_CANCEL_TEAMS_WITH_SHORTLISTED",
                action: "Cancelled Teams with shortlisted applicants"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'support-tools', 'evaluation-teams-with-shortlisted-bidders-fix'],
            icon: 'settings',
            iconType: 'SVG',
          },
          {
            name: 'Fix Report ( Duplicate Report )',
            authority: 'ROLE_VIEW_SUBMSN_DUPLICATE_REPORT',
            permission: [
              {
                key: "ROLE_VIEW_SUBMSN_DUPLICATE_REPORT",
                action: "Fix Report (Duplicate Report)"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'support-tools', 'duplicate-report-fix'],
            icon: 'settings',
            iconType: 'SVG',
          }, {
            name: 'Fix Tender (Duplicate Criteria)',
            authority: 'ROLE_FIX_TENDR_DUPLICATE_CRITERIA',
            permission: [
              {
                key: "ROLE_FIX_TENDR_DUPLICATE_CRITERIA",
                action: "Fix Tender (Duplicate Criteria)"
              }
            ],
            route: ['', 'modules', 'tender-evaluation', 'support-tools', 'duplicate-tender-criteria-fix'],
            icon: 'settings',
            iconType: 'SVG',
          }
        ],
      },
      {
        name: 'Evaluation Cancellation Reason',
        shortName: 'Settings',
        authority: 'ROLE_TNDR_EVL_SETTINGS_EVAL_CNLTN_RESN',
        permission: [
          {
            key: "ROLE_TNDR_EVL_SETTINGS_EVAL_CNLTN_RESN",
            action: "View evaluation cancellation reasons"
          },
          {
            key: "ROLE_TNDR_EVL_SETTINGS_ECR_CREATE",
            action: "Create evaluation cancellation reason"
          },
          {
            key: "ROLE_TNDR_EVL_SETTINGS_ECR_EDIT",
            action: "Edit evaluation cancellation reason"
          },
          {
            key: "ROLE_TNDR_EVL_SETTINGS_ECR_DELETE",
            action: "Delete evaluation cancellation reason"
          },
        ],
        route: [
          '',
          'modules',
          'tender-evaluation',
          'settings',
          'evaluation-cancellation-reason',
        ],
        description: 'Evaluation Cancellation Settings',
        icon: 'settings',
        iconType: 'SVG'
      },
      {
        name: 'Evaluation Conflict Settings',
        shortName: 'Settings',
        authority: 'ROLE_TNDR_EVL_CONFLCT_SETTINGS',
        permission: [
          {
            key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS",
            action: "View evaluation conflict settings"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'settings'],
        pathRoute: ['', 'modules', 'tender-evaluation', 'settings'],
        description: 'Evaluation Settings',
        icon: 'settings',
        children: [
          {
            name: 'Conflict of Interest Reason',
            authority: 'ROLE_TNDR_EVL_CONFLCT_SETTINGS_INTRST_RSN',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_INTRST_RSN",
                action: "View conflict of interest reason"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CIR_CREATE",
                action: "Create conflict of interest reason"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CIR_EDIT",
                action: "Edit conflict of interest reason"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CIR_DELETE",
                action: "Delete conflict of interest reason"
              },
            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'conflict-of-interest',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Conflict Category',
            authority: 'ROLE_TNDR_EVL_CONFLCT_SETTINGS_CONFLCT_CAT',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CONFLCT_CAT",
                action: "View conflict category"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CONFLCT_CAT_CREATE",
                action: "Create conflict category"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CONFLCT_CAT_EDIT",
                action: "Edit conflict category"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_CONFLCT_CAT_DELETE",
                action: "Delete conflict category"
              },

            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'conflict-category',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Team Replacement Reason',
            authority: 'ROLE_TNDR_EVL_CONFLCT_SETTINGS_TEAM_RPLCMNT_RESN',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_TEAM_RPLCMNT_RESN",
                action: "View team replacement reason"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_TEAM_RPLCMNT_RESN_CREATE",
                action: "Create team replacement reason"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_TEAM_RPLCMNT_RESN_EDIT",
                action: "Edit team replacement reason"
              },
              {
                key: "ROLE_TNDR_EVL_CONFLCT_SETTINGS_TEAM_RPLCMNT_RESN_DELETE",
                action: "Delete team replacement reason"
              },

            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'team-replacement-reason',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
        ],
      },
      {
        name: 'Evaluation Criteria settings',
        shortName: 'Settings',
        authority: 'ROLE_TNDR_EVL_CRTERIA_SETTINGS',
        permission: [
          {
            key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS",
            action: "View evaluation criteria settings"
          }
        ],
        route: ['', 'modules', 'tender-evaluation', 'settings'],
        pathRoute: ['', 'modules', 'tender-evaluation', 'settings'],
        description: 'Evaluation Settings',
        icon: 'settings',
        children: [
          {
            name: 'Criteria Group',
            authority: 'ROLE_TNDR_EVL_CRTERIA_SETTINGS_GROUP',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_GROUP",
                action: "View evaluation criteria group"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_GROUP_CREATE",
                action: "Create evaluation criteria group"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_GROUP_EDIT",
                action: "Edit evaluation criteria group"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_GROUP_DELETE",
                action: "Delete evaluation criteria group"
              },
              {
                key: "ROLE_DSMS_SAVE_ATTACHMENT",
                action: "Can Upload Attachment of Document Type"
              },
            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'criteria-group',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Criteria Sub Group',
            authority: 'ROLE_TNDR_EVL_CRTERIA_SETTINGS_SUB_GROUP',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_SUB_GROUP",
                action: "View evaluation criteria sub group"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_SUB_GROUP_CREATE",
                action: "Create evaluation criteria sub group"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_SUB_GROUP_EDIT",
                action: "Edit evaluation criteria sub group"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_SUB_GROUP_DELETE",
                action: "Delete evaluation criteria sub group"
              },

            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'criteria-sub-group',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Evaluation Criteria',
            authority: 'ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA",
                action: "View evaluation criteria"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_CREATE",
                action: "Create evaluation criteria"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_EDIT",
                action: "Edit evaluation criteria"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_DELETE",
                action: "Delete evaluation criteria"
              },

              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_VW_MORE",
                action: "Preview evaluation criteria"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_PE_REQ",
                action: "Can add PE requirement"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_PE_REQ_EDIT",
                action: "Can edit PE requirement"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_PE_REQ_DELETE",
                action: "Can delete PE requirement"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_TENDERER_REQ",
                action: "Can add tenderer requirement"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_CRITERIA_SUB_CRITERIA",
                action: "Can add/ delete sub-criteria"
              },
            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'evaluation-criteria',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Evaluation Mode',
            authority: 'ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE",
                action: "View evaluation mode"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE_CREATE",
                action: "Create evaluation mode"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE_EDIT",
                action: "Edit evaluation mode"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE_STAGES",
                action: "Evaluation mode (View stages)"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE_STAGES_CREATE",
                action: "Evaluation mode (Create stages)"
              },
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SETTINGS_EVAL_MODE_STAGES_EDIT",
                action: "Evaluation mode (Edit stages)"
              },
            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'evaluation-modes',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Evaluation Criteria Summary',
            authority: 'ROLE_TNDR_EVL_CRTERIA_SUMMARY',
            permission: [
              {
                key: "ROLE_TNDR_EVL_CRTERIA_SUMMARY",
                action: "View evaluation criteria summary"
              },

            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'evaluation-criteria-summary',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Submission Form Mapping',
            authority: 'ROLE_TNDR_EVL_SUBMISSION_FORM_MAPPING',
            permission: [
              {
                key: "ROLE_TNDR_EVL_SUBMISSION_FORM_MAPPING",
                action: "View submission form mapping"
              },
              {
                key: "ROLE_TNDR_EVL_SUBMISSION_FORM_MAPPING_CREATE",
                action: "Create submission form mapping"
              },
              {
                key: "ROLE_TNDR_EVL_SUBMISSION_FORM_MAPPING_EDIT",
                action: "Edit submission form mapping"
              },
              {
                key: "ROLE_TNDR_EVL_SUBMISSION_FORM_MAPPING_DELETE",
                action: "Delete submission form mapping"
              },

            ],
            route: [
              '',
              'modules',
              'tender-evaluation',
              'settings',
              'submission-form-mapping',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
        ],
      },
    ],
  }
]
