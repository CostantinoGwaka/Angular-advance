import { MenuOption } from '../menu-options';
import { GfsCodeComponent } from '../../../../modules/nest-app/app-settings/gfs-code/gfs-code.component';

export const TenderInitiation: MenuOption[] = [
  {
    name: 'Tender Initiation',
    shortName: 'Tender Initiation',
    authority: 'ROLE_MODULES_TNDR_INTN',
    permission: [
      {
        key: 'ROLE_MODULES_TNDR_INTN',
        action: '',
      },
    ],
    route: ['', 'modules', 'tender-initiation'],
    pathRoute: ['', 'modules', 'tender-initiation', 'dashboard'],
    description: 'Procurement Requisition management',
    icon: 'gisp_project_1',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_TNDR_INTN_DASHBOARD',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_DASHBOARD',
            action: 'View tender initiation dashboard',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Tenderer Filter',
        authority: 'ROLE_TNDR_INTN_TENDERER_FILTER',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_TENDERER_FILTER',
            action: 'View tenderer filter',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'tenderer-filter'],
        icon: 'requisition',
        iconType: 'SVG',
      },
      {
        name: 'Requisition',
        authority: 'ROLE_TNDR_INTN_REQUISITION',
        permission: [
          { key: 'ROLE_TNDR_INTN_REQUISITION', action: 'View requisitions' },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_CREATE',
            action: 'Create requisitions',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_EDIT',
            action: 'Edit requisitions',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_DELETE',
            action: 'Delete requisitions',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_VIEW_NEW_REQ',
            action: 'Can view new requisitions',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_PREV_REQ',
            action: 'Can view previous requisitions',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_PEND_PLAND_REQ',
            action: 'Can view pending planned items requisitions',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_SBMT_FR_APPRVL',
            action: 'Can submit requisition for approval',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'requisition'],
        icon: 'requisition',
        iconType: 'SVG',
      },
      {
        name: 'Requisition Tasks',
        authority: 'ROLE_TNDR_INTN_REQUISITION_TASK',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_TASK',
            action: 'View requisition task',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_PNDNG_TASK',
            action: 'View pending task',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_PREV_TASK',
            action: 'View previous task',
          },
          {
            key: 'ROLE_TNDR_INTN_REQUISITION_TASK_RESPONSE',
            action: 'Response to requisition task',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'requisition-tasks'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Goods Financial Form Design',
        authority: 'ROLE_TNDR_INTN_GOODS_FINANCIAL_FORM_DESIGN',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_VIEW_GOODS_FINANCIAL_FORM_DESIGN',
            action: 'View goods financial form design',
          },
          {
            key: 'ROLE_TNDR_INTN_ADD_GOODS_FINANCIAL_FORM_DESIGN',
            action: 'Add goods financial form design',
          },
          {
            key: 'ROLE_TNDR_INTN_EDIT_GOODS_FINANCIAL_FORM_DESIGN',
            action: 'View previous task',
          },
          {
            key: 'ROLE_TNDR_INTN_DELETE_GOODS_FINANCIAL_FORM_DESIGN',
            action: 'Delete goods financial form design',
          },
        ],
        route: [
          '',
          'modules',
          'tender-initiation',
          'goods-financial-form-design',
        ],
        icon: 'design',
        iconType: 'SVG',
      },
      {
        name: 'Tender Management',
        shortName: 'Tender Management',
        authority: 'ROLE_TNDR_INTN_TENDER_MANAGEMENT',
        checkPermissionOnly: true,
        feature: [
          { key: 'FEATURE_TNDR_INTN_BOQS_VIEW_UNIT_RATE_COLUMN', action: 'Feature View Unit Rate Column' },
          { key: 'FEATURE_TNDR_INTN_BOQS_VIEW_TOTAL_COLUMN', action: 'Feature View Total Column' },
        ],
        permission: [
          {
            key: 'ROLE_TNDR_INTN_TENDER_MANAGEMENT',
            action: 'View tender management',
          },
          {
            key: 'ROLE_TNDR_INTN_VIEW_ASSIGN_REQSTN',
            action: 'View assigned endorsed requisition',
          },
          {
            key: 'ROLE_TNDR_INTN_MERGE_ASSIGN_REQSTN',
            action: 'Merge assigned endorsed requisition',
          },
          {
            key: 'ROLE_TNDR_INTN_VIEW_ENDRSD_REQSTN',
            action: 'View endorsed requisition',
          },
          {
            key: 'ROLE_TNDR_INTN_CHNG_REQ_ASSGNEE',
            action:
              'Allow change of endorsed requisition assignee for not merged requisition',
          },
          {
            key: 'ROLE_TNDR_INTN_MERGE_ENRSD_REQSTN',
            action: 'Merge endorsed requisition',
          },
          {
            key: 'ROLE_TNDR_INTN_CREATE_TNDR_DOC',
            action: 'Manage tender document creation',
          },
          {
            key: 'ROLE_TNDR_INTN_VIEW_TNDR_DOC',
            action: 'View tender document',
          },
          {
            key: 'ROLE_TNDR_INTN_UNMERGE_TNDR_ITMS',
            action: 'Unmerge tender items',
          },
          { key: 'ROLE_TNDR_INTN_VIEW_TNDR_TRCKR', action: 'Track tender' },
          {
            key: 'ROLE_TNDR_INTN_VIEW_MY_PRVS_TENDR',
            action: 'View previous tenders',
          },
          {
            key: 'ROLE_TNDR_INTN_VIEW_OWN_CANCLD_TNDR',
            action: 'View cancelled tenders',
          }
        ],
        route: ['', 'modules', 'tender-initiation', 'approved-requisitions'],
        icon: 'approved-cart',
        iconType: 'SVG',
      },
      {
        name: 'Update Tender',
        shortName: 'Update Tender',
        authority: 'ROLE_TNDR_INTN_UPDATE_TENDER',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_UPDATE_TENDER',
            action: 'View update tender menu',
          },
          {
            key: 'ROLE_TNDR_INTN_EXALL_TND_OPN_TDY',
            action: 'Manage extension of all tenders opening today',
          },
          { key: 'ROLE_TNDR_INTN_UPDT_TNDR_MNG', action: 'Manage tender' },
        ],
        route: ['', 'modules', 'tender-initiation', 'update-tender'],
        icon: 'approved-cart',
        iconType: 'SVG',
      },
      {
        name: 'Tender Tasks',
        authority: 'ROLE_TNDR_INTN_TENDER_TASK',
        permission: [
          { key: 'ROLE_TNDR_INTN_TENDER_TASK', action: 'View tender task' },
          {
            key: 'ROLE_TNDR_INTN_TENDER_PNDNG_TASK',
            action: 'View pending task',
          },
          {
            key: 'ROLE_TNDR_INTN_TENDER_PREV_TASK',
            action: 'View previous task',
          },
          {
            key: 'ROLE_TNDR_INTN_TENDER_TASK_RESPONSE',
            action: 'Response to requisition task',
          },
          {
            key: 'ROLE_TNDR_INTN_TENDER_DLT_TNDRR_INVT',
            action: 'Delete Tenderer Invitation',
          },
          {
            key: 'ROLE_TNDR_INTN_TENDER_SV_TNDRR_INVT',
            action: 'Save Tenderer Invitation',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'my-req-tasks'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Tender Re-advertisement',
        shortName: 'Tender Re-advertisement',
        authority: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT_MENU',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT_MENU',
            action: 'Tender re-advertisement',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation'],
        description: 'Tender Re-advertisement',
        icon: 'requisition',
        iconType: 'SVG',
        children: [
          {
            name: 'Tender Re-advertisement',
            authority: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT',
                action: 'View tender re-advertisement',
              },
              {
                key: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT_CRT',
                action: 'Create tender re-advertisement',
              },
              {
                key: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT_RSRT_WRKFLW',
                action: 'Restart Workflow',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'tender-re-advertisement',
            ],
            icon: 'redo',
            iconType: 'MATERIAL',
          },
          {
            name: 'Tender Re-advertisement Tasks',
            authority: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_RE_ADVERTISEMENT_TASK',
                action: 'View tender re-advertisement tasks',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'tender-re-advertisement-tasks',
            ],
            icon: 'redo',
            iconType: 'MATERIAL',
          },
        ],
      },
      {
        name: 'Tender Cancellation',
        shortName: 'Tender Cancellation',
        authority: 'ROLE_TNDR_INTN_TENDER_CANCELLATION',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_TENDER_CANCELLATION',
            action: 'View tender cancellation',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation'],
        description:
          'Tender Cancellation, Termination, withdrawal & Modification',
        icon: 'tender-cancellation',
        iconType: 'SVG',
        children: [
          {
            name: 'Tender Cancellation Request',
            authority: 'ROLE_TNDR_INTN_TENDER_CNLTN_VIEW',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_TENDER_CNLTN_VIEW',
                action: 'View tender cancellation request',
              },
              {
                key: 'ROLE_TNDR_INTN_TENDER_CNLTN_CRT',
                action: 'Create tender cancellation',
              },
              {
                key: 'ROLE_TNDR_INTN_TENDER_CNLTN_RSRT_WRKFLW',
                action: 'Restart tender cancellation workflow',
              },
            ],
            route: ['', 'modules', 'tender-initiation', 'tender-cancellation'],
            icon: 'redo',
            iconType: 'MATERIAL',
          },
          {
            name: 'Tender Cancellation Tasks',
            authority: 'ROLE_TNDR_INTN_TENDER_CANCELLATION_TASK',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_TENDER_CANCELLATION_TASK',
                action: 'View tender cancellation task',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'tender-cancellation-req-tasks',
            ],
            icon: 'tender-cancellation',
            iconType: 'SVG',
          },
          // {
          //   name: 'Cancelled Tenders',
          //   authority: 'ROLE_TNDR_INTN_CANCELLED_TENDERS',
          //   permission: [
          //     {
          //       key: 'ROLE_TNDR_INTN_CANCELLED_TENDERS',
          //       action: 'View tender cancelled tender',
          //     },
          //   ],
          //   route: ['', 'modules', 'tender-initiation', 'cancelled-tenders'],
          //   icon: 'cancelled-options',
          //   iconType: 'SVG',
          // },
          // {
          //   name: 'Tender Termination Requests',
          //   authority: 'ROLE_TNDR_INTN_TERMINATION_REQUEST',
          //   permission: [
          //     {
          //       key: 'ROLE_TNDR_INTN_TERMINATION_REQUEST',
          //       action: 'View termination requests',
          //     },
          //   ],
          //   route: [
          //     '',
          //     'modules',
          //     'tender-initiation',
          //     'tender-termination-requests',
          //   ],
          //   icon: 'redo',
          //   iconType: 'MATERIAL',
          // },
          // {
          //   name: 'Tender Termination Requests Tasks',
          //   authority: 'ROLE_TNDR_INTN_TERMINATION_REQUEST_TASK',
          //   permission: [
          //     {
          //       key: 'ROLE_TNDR_INTN_TERMINATION_REQUEST_TASK',
          //       action: 'View termination request task',
          //     },
          //   ],
          //   route: [
          //     '',
          //     'modules',
          //     'tender-initiation',
          //     'tender-termination-requests-tasks',
          //   ],
          //   icon: 'redo',
          //   iconType: 'MATERIAL',
          // },
          // {
          //   name: 'Tender Rejection Requests',
          //   authority: 'ROLE_TNDR_INTN_TENDER_REJECTION_REQUESTS',
          //   permission: [
          //     {
          //       key: 'ROLE_TNDR_INTN_TENDER_REJECTION_REQUESTS',
          //       action: 'View tender rejection request',
          //     },
          //   ],
          //   route: [
          //     '',
          //     'modules',
          //     'tender-initiation',
          //     'tender-rejection-requests',
          //   ],
          //   icon: 'redo',
          //   iconType: 'MATERIAL',
          // },
          // {
          //   name: 'Tender Rejection Requests Tasks',
          //   authority: 'ROLE_TNDR_INTN_TENDER_REJECTION_REQUEST_TASK',
          //   permission: [
          //     {
          //       key: 'ROLE_TNDR_INTN_TENDER_REJECTION_REQUEST_TASK',
          //       action: 'View tender rejection request task',
          //     },
          //   ],
          //   route: [
          //     '',
          //     'modules',
          //     'tender-initiation',
          //     'tender-rejection-requests-tasks',
          //   ],
          //   icon: 'redo',
          //   iconType: 'MATERIAL',
          // },
        ],
      },
      {
        name: 'Requested Clarifications',
        authority: 'ROLE_TNDR_INTN_REQUESTED_CLARIFICATIONS',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_REQUESTED_CLARIFICATIONS',
            action: 'View requested clarifications',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'requested-clarification'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Published Tenders',
        authority: 'ROLE_TNDR_INTN_PUBLISHED_TENDERS',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_PUBLISHED_TENDERS',
            action: 'View published tenders',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'published-tenders'],
        icon: 'tenders',
        iconType: 'SVG',
      },
      {
        name: 'Tender Modifications',
        shortName: 'Tender Modifications',
        authority: 'ROLE_TNDR_INTN_TND_MOD',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_TND_MOD',
            action: 'View tender modifications',
          },
        ],
        route: ['', 'modules', 'tender-modification'],
        pathRoute: ['', 'modules', 'tender-modification'],
        description: 'Tender Modifications, Addendum',
        icon: 'requisition',
        iconType: 'SVG',
        children: [
          {
            name: 'Tender Modification Requests',
            authority: 'ROLE_TNDR_INTN_TND_MOD_REQ',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_REQ',
                action: 'View tender modification request',
              },
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_REQ_CRT',
                action: 'Create tender modification request',
              },
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_REQ_EDT',
                action: 'Edit tender modification request',
              },
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_REQ_DLT',
                action: 'Delete tender modification request',
              },
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_REQ_INT_TSK',
                action: 'Initiate tender modification task',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'tender-modification-requests',
            ],
            icon: 'redo',
            iconType: 'MATERIAL',
          },
          {
            name: 'Tender Modification Tasks',
            authority: 'ROLE_TNDR_INTN_TND_MOD_TSK',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_TSK',
                action: 'View tender modification task',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'tender-modification-req-tasks',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
          {
            name: 'Tenders For Modification',
            authority: 'ROLE_TNDR_INTN_TND_MOD_TNDRS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_TND_MOD_TNDRS',
                action: 'View Published Tenders For Modification',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'app-published-tenders-modification',
            ],
            icon: 'tasks',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Pre Bid Meeting',
        shortName: 'Pre Bid Meeting',
        authority: 'ROLE_TNDR_INTN_PRE_BID_MEETING',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_PRE_BID_MEETING',
            action: 'View pre bid meeting',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation'],
        description: 'Pre Bid Meeting Records and personnel',
        icon: 'bidMeeting',
        iconType: 'SVG',
        children: [
          {
            name: 'Assign Personnel',
            authority: 'ROLE_TNDR_INTN_PRE_BID_MEETING_ASSGN_PERSONEL',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_ASSGN_PERSONEL',
                action: 'View pre bid meeting assigned personnel',
              },
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_ASSGN_PERSONEL_CREATE',
                action: 'Can create pre bid meeting assigned personnel',
              },
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_ASSGN_PERSONEL_EDIT',
                action: 'Edit pre bid meeting personnel',
              },
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_ASSGN_PERSONEL_DELETE',
                action: 'Delete pre bid meeting personnel',
              },
            ],
            route: ['', 'modules', 'tender-initiation', 'pre-bid-personnel'],
            icon: 'bidMeeting',
            iconType: 'SVG',
          },
          {
            name: 'Pre Bid Meeting Records',
            authority: 'ROLE_TNDR_INTN_PRE_BID_MEETING_RECORDS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_RECORDS',
                action: 'View pre bid meeting records',
              },
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_RECORDS_CREATE',
                action: 'Can create pre bid meeting records',
              },
              {
                key: 'ROLE_TNDR_INTN_PRE_BID_MEETING_RECORDS_PUBLISH',
                action: 'Can publish pre bid meeting records',
              },
            ],
            route: ['', 'modules', 'tender-initiation', 'pre-bid-meeting'],
            icon: 'bidMeeting',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'Clarifications Tasks',
        authority: 'ROLE_TNDR_INTN_CLARIFICATION_TASK',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_CLARIFICATION_TASK',
            action: 'View clarification task',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'clarification-tasks'],
        icon: 'tasks',
        iconType: 'SVG',
      },
      {
        name: 'Bid Submissions Tracker',
        shortName: 'Bid Submissions Tracker',
        authority: 'ROLE_BID_SBMS_TRACKER',
        permission: [
          {
            key: 'ROLE_BID_SBMS_TRACKER',
            action: 'View Bid submissions tracker',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation'],
        description: 'Bid Submissions Tracker',
        icon: 'requisition',
        iconType: 'SVG',
        children: [
          {
            name: 'Submissions with Zero Amount',
            authority: 'ROLE_VIEW_SUBMSN_WITH_ZERO_BID',
            permission: [
              {
                key: 'ROLE_VIEW_SUBMSN_WITH_ZERO_BID',
                action: 'View Submissions with zero bid',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'submission-tracker',
              'submission-with-no-amount',
            ],
            icon: 'tenders',
            iconType: 'SVG',
          },
          {
            name: 'Published tender with zero lot',
            authority: 'ROLE_TNDR_INTN_TNDR_WTH_ZR_LTS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_TNDR_WTH_ZR_LTS',
                action: 'View published tender with zero lot',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'submission-tracker',
              'published-tender-with-no-lot',
            ],
            icon: 'tenders',
            iconType: 'SVG',
          },
          {
            name: 'Submissions with Conflicting Totals',
            authority: 'ROLE_VIEW_SUBMSN_WITH_CONFLICTING_TOTALS',
            permission: [
              {
                key: 'ROLE_VIEW_SUBMSN_WITH_CONFLICTING_TOTALS',
                action: 'View Submissions with conflicting totals',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'submission-tracker',
              'submission-with-conflicting-totals',
            ],
            icon: 'tenders',
            iconType: 'SVG',
          },
        ],
      },
      {
        name: 'GFS Code',
        authority: 'ROLE_TNDR_INTN_GFS_CD',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_GFS_CD',
            action: 'View GFS Code',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'gfs-code'],
        icon: 'requisition',
        iconType: 'SVG',
      },
      {
        name: 'Commodities',
        authority: 'ROLE_TNDR_INTN_UNSPC_COMMODITIES',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_UNSPC_COMMODITIES',
            action: 'View UNPSC Commodities',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'commodities'],
        icon: 'attachment',
        iconType: 'MATERIAL',
      },
      {
        name: 'Specification',
        authority: 'ROLE_TNDR_INTN_SPECIFICATION',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_SPECIFICATION',
            action: 'View specification',
          },
        ],
        route: ['', 'modules', 'tender-initiation', 'specification'],
        icon: 'attachment',
        iconType: 'MATERIAL',
      },
      {
        name: 'General Settings',
        shortName: 'Settings',
        permission: [
          { key: 'ROLE_TNDR_INTN_SETTING', action: 'View general settings' },
        ],
        authority: 'ROLE_TNDR_INTN_SETTING',
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation', 'settings'],
        description: 'General system settings',
        icon: 'settings',
        children: [
          {
            name: 'Associated Service',
            authority: 'ROLE_TNDR_INTN_SETTING_ASCT_SVC_MNG',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_ASCT_SVC_MNG',
                action: 'Manage Associated Service',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'associated-service',
            ],
          },
          {
            name: 'Commodities',
            authority: 'ROLE_APP_MNGT_UNSPC_COMMODITIES',
            permission: [
              {
                key: 'ROLE_APP_MNGT_UNSPC_COMMODITIES',
                action: 'UNPSC Commodities Menu',
              },
              {
                key: 'ROLE_APP_MNGT_UNSPC_COMMODITIES_VIEW',
                action: 'View UNPSC Commodities',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'commodities',
            ],
          },
          {
            name: 'Specification',
            authority: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION',
                action: 'View specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION_CREATE',
                action: 'Create specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION_EDIT',
                action: 'Edit specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION_DELETE',
                action: 'Delete specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION_CPY_SPEC',
                action: 'Copy specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_SPECIFICATION_ST_PRC_CAP',
                action: 'Set price cap for specification',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'specification',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Manage Specification',
            authority: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION',
                action: 'View PE specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION_CREATE',
                action: 'Create PE specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION_EDIT',
                action: 'Edit PE specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION_DELETE',
                action: 'Delete PE specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION_CPY_SPEC',
                action: 'Copy PE specification',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PE_SPECIFICATION_ST_PRC_CAP',
                action: 'Set price cap for PE specification',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'manage-specification',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'BOQs',
            authority: 'ROLE_TNDR_INTN_SETTING_BOQS',
            permission: [
              { key: 'ROLE_TNDR_INTN_SETTING_BOQS', action: 'View BOQs' },
              {
                key: 'ROLE_TNDR_INTN_SETTING_BOQS_CREATE',
                action: 'Create BOQ',
              },
              { key: 'ROLE_TNDR_INTN_SETTING_BOQS_EDIT', action: 'Edit BOQ' },
              {
                key: 'ROLE_TNDR_INTN_SETTING_BOQS_DELETE',
                action: 'Delete BOQ',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_BOQS_MANAGE',
                action: 'Manage BOQ items',
              },
            ],
            route: ['', 'modules', 'tender-initiation', 'settings', 'boqs'],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Currencies',
            authority: 'ROLE_TNDR_INTN_SETTING_CURRENCIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_CURRENCIES',
                action: 'View currencies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CURRENCIES_CREATE',
                action: 'Can create currencies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CURRENCIES_UPDATE',
                action: 'Can update currencies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CURRENCIES_DELETE',
                action: 'Can delete currencies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'currencies',
            ],
          },
          {
            name: 'Lower Level Additional Details',
            authority: 'ROLE_TNDR_INTN_LWLV_ADDT_VW',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_LWLV_ADDT_VW',
                action: 'View  Lower Level Additional Details',
              },
              {
                key: 'ROLE_TNDR_INTN_LWLV_ADDT_MNG',
                action: 'Can Manage Lower Level Additional Details',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'lower-level-additional-details',
            ],
          },
          {
            name: 'Deviation in Delivery Schedule Methodologies',
            authority:
              'ROLE_TNDR_INTN_SETTING_DEV_IN_DLVY_SCHEDULE_METHODOLOGIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_DLVY_SCHEDULE_METHODOLOGIES',
                action: 'View delivery schedule methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_DLVY_SCHEDULE_METHODOLOGIES_CREATE',
                action: 'Create delivery schedule methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_DLVY_SCHEDULE_METHODOLOGIES_EDIT',
                action: 'Edit delivery schedule methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_DLVY_SCHEDULE_METHODOLOGIES_DELETE',
                action: 'Delete delivery schedule methodologies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'deviation-in-delivery-schedule-methodologies',
            ],
          },
          {
            name: 'Deviation in Payment Schedule Methodologies',
            authority:
              'ROLE_TNDR_INTN_SETTING_DEV_IN_PAYMENT_SCHEDULE_METHODOLOGIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_PAYMENT_SCHEDULE_METHODOLOGIES_CREATE',
                action: 'View payment schedule methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_PAYMENT_SCHEDULE_METHODOLOGIES_EDIT',
                action: 'Edit payment schedule methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DEV_IN_PAYMENT_SCHEDULE_METHODOLOGIES_DELETE',
                action: 'Delete payment schedule methodologies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'deviation-in-payment-schedule-methodologies',
            ],
          },
          {
            name: 'Deviation in Equipment Performance and Productivity Methodologies',
            authority:
              'ROLE_TNDR_INTN_SETTING_EQUP_PERF_PRDCTIVTY_METHODOLOGIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_EQUP_PERF_PRDCTIVTY_METHODOLOGIES',
                action:
                  'View equipment performance and productivity methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_EQUP_PERF_PRDCTIVTY_METHODOLOGIES_CREATE',
                action:
                  'Create equipment performance and productivity methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_EQUP_PERF_PRDCTIVTY_METHODOLOGIES_EDIT',
                action:
                  'Edit equipment performance and productivity methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_EQUP_PERF_PRDCTIVTY_METHODOLOGIES_DELETE',
                action:
                  'Delete equipment performance and productivity methodologies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'deviation-in-equipment-performance-and-productivity-methodologies',
            ],
          },
          {
            name: 'Cost of Spare Parts Methodologies',
            authority: 'ROLE_TNDR_INTN_SETTING_CST_SPPART_METHODOLOGIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_SPPART_METHODOLOGIES',
                action: 'View setting for cost of spare parts methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_SPPART_METHODOLOGIES_CREATE',
                action: 'Create cost of spare parts methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_SPPART_METHODOLOGIES_EDIT',
                action: 'Edit cost of spare parts methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_SPPART_METHODOLOGIES_DELETE',
                action: 'Delete cost of spare parts methodologies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'cost-of-spare-parts-methodologies',
            ],
          },
          {
            name: 'Cost of After Sales Service Facilities Methodologies',
            authority:
              'ROLE_TNDR_INTN_SETTING_CST_AFT_SALE_SRVC_FCLT_METHODOLOGIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_AFT_SALE_SRVC_FCLT_METHODOLOGIES',
                action:
                  'View setting for cost of after sales service facilities methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_AFT_SALE_SRVC_FCLT_METHODOLOGIES_CREATE',
                action:
                  'Create cost of after sales service facilities methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_AFT_SALE_SRVC_FCLT_METHODOLOGIES_EDIT',
                action:
                  'Edit cost of after sales service facilities methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CST_AFT_SALE_SRVC_FCLT_METHODOLOGIES_DELETE',
                action:
                  'Delete cost of after sales service facilities methodologies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'cost-of-after-sales-service-facilities-methodologies',
            ],
          },
          {
            name: 'Operating and maintenance costs Methodologies',
            authority: 'ROLE_TNDR_INTN_SETTING_OPRT_MNTNC_CST_METHODOLOGIES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_OPRT_MNTNC_CST_METHODOLOGIES',
                action:
                  'View setting for Operating and maintenance costs methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_OPRT_MNTNC_CST_METHODOLOGIES_CREATE',
                action: 'Create Operating and maintenance costs methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_OPRT_MNTNC_CST_METHODOLOGIES_EDIT',
                action: 'Edit Operating and maintenance costs methodologies',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_OPRT_MNTNC_CST_METHODOLOGIES_DELETE',
                action: 'Delete Operating and maintenance costs methodologies',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'operating-and-maintenance-costs-methodologies',
            ],
          },
          {
            name: 'EXW Costs',
            authority: 'ROLE_TNDR_INTN_SETTING_EXW_COSTS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_EXW_COSTS',
                action: 'View EXW cost',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_EXW_COSTS_CREATE',
                action: 'Create EXW cost',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_EXW_COSTS_EDIT',
                action: 'Edit EXW cost',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_EXW_COSTS_DELETE',
                action: 'Delete EXW cost',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'exw-costs',
            ],
          },
          {
            name: 'Port or place of Loading Cost Imported Goods',
            authority: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_LOADNG_CST_IMPRT_GOODS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_LOADNG_CST_IMPRT_GOODS',
                action: 'View port or place of loading cost imported Goods',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_LOADNG_CST_IMPRT_GOODS_CREATE',
                action: 'Create port or place of loading cost imported Goods',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_LOADNG_CST_IMPRT_GOODS_EDIT',
                action: 'Edit port or place of loading cost imported Goods',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_LOADNG_CST_IMPRT_GOODS_DELETE',
                action: 'Delete port or place of loading cost imported Goods',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'port-or-place-of-loading-cost-imported-goods',
            ],
          },
          {
            name: 'Port or place of Entry or Destination Cost Imported Goods',
            authority:
              'ROLE_TNDR_INTN_SETTING_PRT_PLC_ENTRY_DSTNTION_CST_IMPRT_GOODS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_ENTRY_DSTNTION_CST_IMPRT_GOODS',
                action: 'View port or place of loading cost imported Goods',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_ENTRY_DSTNTION_CST_IMPRT_GOODS_CREATE',
                action: 'Create port or place of loading cost imported Goods',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_ENTRY_DSTNTION_CST_IMPRT_GOODS_EDIT',
                action: 'Edit port or place of loading cost imported Goods',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PRT_PLC_ENTRY_DSTNTION_CST_IMPRT_GOODS_DELETE',
                action: 'Delete port or place of loading cost imported Goods',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'port-or-place-of-entry-or-destination-cost-imported-goods',
            ],
          },
          {
            name: 'CIP Cost',
            authority: 'ROLE_TNDR_INTN_SETTING_CIP_COST',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_CIP_COST',
                action: 'View CIP Cost',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CIP_COST_CREATE',
                action: 'Create CIP Cost',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CIP_COST_EDIT',
                action: 'Edit CIP Cost',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CIP_COST_DELETE',
                action: 'Delete CIP Cost',
              },
            ],
            route: ['', 'modules', 'tender-initiation', 'settings', 'cip-cost'],
          },
          {
            name: 'Incoterms',
            authority: 'ROLE_TNDR_INTN_SETTING_INCORTERMS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCORTERMS',
                action: 'View incoterms',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCORTERMS_CREATE',
                action: 'Create incoterms',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCORTERMS_EDIT',
                action: 'Edit incoterms',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCORTERMS_DELETE',
                action: 'Delete incoterms',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'incoterms',
            ],
          },
          {
            name: 'Incidental services',
            authority: 'ROLE_TNDR_INTN_SETTING_INCIDENTIAL_SERVICES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCIDENTIAL_SERVICES',
                action: 'View incidental services',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCIDENTIAL_SERVICES_CREATE',
                action: 'Create incidental services',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCIDENTIAL_SERVICES_EDIT',
                action: 'Edit incidental services',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_INCIDENTIAL_SERVICES_DELETE',
                action: 'Delete incidental services',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'incidental-services',
            ],
          },
          {
            name: 'General Meta options',
            authority: 'ROLE_TNDR_INTN_SETTING_GNL_META_OPTN',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_GNL_META_OPTN',
                action: 'View general meta options',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_GNL_META_OPTN_CREATE',
                action: 'Create general meta options',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_GNL_META_OPTN_EDIT',
                action: 'Edit general meta options',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_GNL_META_OPTN_DELETE',
                action: 'Delete general meta options',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'general-meta-options',
            ],
          },
          {
            name: 'Requisition Input Constraint',
            authority: 'ROLE_TNDR_INTN_SETTING_REQSTN_INPT_CONSTRAINT',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_REQSTN_INPT_CONSTRAINT',
                action: 'View requisition input constraint',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_REQSTN_INPT_CONSTRAINT_CREATE',
                action: 'Create requisition input constraint',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_REQSTN_INPT_CONSTRAINT_EDIT',
                action: 'Edit requisition input constraint',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_REQSTN_INPT_CONSTRAINT_DELETE',
                action: 'Delete requisition input constraint',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'requisition-input-constraint',
            ],
          },
          {
            name: 'DARB Types',
            authority: 'ROLE_TNDR_INTN_SETTING_DARB_TYPES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_TYPES',
                action: 'View DARB types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_TYPES_CREATE',
                action: 'Create DARB types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_TYPES_EDIT',
                action: 'Edit DARB types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_TYPES_DELETE',
                action: 'Delete DARB types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'darb-types',
            ],
          },
          {
            name: 'DARB Appointing Authority',
            authority: 'ROLE_TNDR_INTN_SETTING_DARB_APPOINTING_AUTHORITY',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_APPOINTING_AUTHORITY',
                action: 'View DARB appointing authority',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_APPOINTING_AUTHORITY_CREATE',
                action: 'Create DARB appointing authority',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_APPOINTING_AUTHORITY_EDIT',
                action: 'Edit DARB appointing authority',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DARB_APPOINTING_AUTHORITY_DELETE',
                action: 'Delete DARB appointing authority',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'darb-appointing-authority',
            ],
          },
          {
            name: 'Donor Fund Type',
            authority: 'ROLE_TNDR_INTN_SETTING_DONR_FUND_TYPE',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_DONR_FUND_TYPE',
                action: 'View donor fund type',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DONR_FUND_TYPE_CREATE',
                action: 'Create donor fund type',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DONR_FUND_TYPE_EDIT',
                action: 'Edit donor fund type',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DONR_FUND_TYPE_DELETE',
                action: 'Delete donor fund type',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'donor-fund-type',
            ],
          },
          // {
          //   name: 'Contractor Type',
          //   permission: ['ROLE_PPRA_USER_ROLE'],
          //   route: [
          //     '',
          //     'modules',
          //     'tender-initiation',
          //     'settings',
          //     'contractor-type',
          //   ],
          // },
          // {
          //   name: 'Additional details fields hints',
          //   authority:'ROLE_TNDR_INTN_SETTING_ADTION_DTLS_FLD_HNT',
          //   permission: [
          //     {
          //       key: "ROLE_TNDR_INTN_SETTING_ADTION_DTLS_FLD_HNT",
          //       action: "View additional details fields hints"
          //     }
          //   ],
          //   route: [
          //     '',
          //     'modules',
          //     'tender-initiation',
          //     'settings',
          //     'additional-fields-hints',
          //   ],
          // },
          {
            name: 'Tender Reasons',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_CNCLATION_RSON',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_CNCLATION_RSON',
                action: 'View tender reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_CNCLATION_RSON_CREATE',
                action: 'Create tender reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_CNCLATION_RSON_EDIT',
                action: 'Edit tender reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_CNCLATION_RSON_DELETE',
                action: 'Delete tender reasons',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'tender-cancellation-reasons',
            ],
          },
          {
            name: 'Reasons for Rejection of all Tenders',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_AWARD_REJECT_RSON',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_AWARD_REJECT_RSON',
                action: 'View tender award reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_AWARD_REJECT_RSON_CREATE',
                action: 'Create tender award reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_AWARD_REJECT_RSON_EDIT',
                action: 'Edit tender award reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_AWARD_REJECT_RSON_DELETE',
                action: 'Delete tender award reasons',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'tender-reasons-not-awarded',
            ],
          },
          {
            name: 'Tender Withdraw Reasons',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON',
                action: 'View tender withdraw reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON_CREATE',
                action: 'Create tender withdraw reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON_EDIT',
                action: 'Edit tender withdraw reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON_DELETE',
                action: 'Delete tender withdraw reasons',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'tender-withdraw-reasons',
            ],
          },
          {
            name: 'Award Cancellation Reason',
            authority: 'ROLE_TNDR_INTN_SETTING_AWARD_CANCE_RSON',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_AWARD_CANCE_RSON',
                action: 'View award cancellation reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON_CREATE',
                action: 'Create award cancellation reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON_EDIT',
                action: 'Edit award cancellation reasons',
              },
              // {
              //   key: 'ROLE_TNDR_INTN_SETTING_TNDR_WTHDRW_RSON_DELETE',
              //   action: 'Delete tender withdraw reasons',
              // },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'award-cancellation-reasons',
            ],
          },
          {
            name: 'Submission Modification Reasons',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_MDFCTN_RSON',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_MDFCTN_RSON',
                action: 'View tender modification reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_MDFCTN_RSON_CREATE',
                action: 'Create tender modification reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_MDFCTN_RSON_EDIT',
                action: 'Edit tender modification reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_MDFCTN_RSON_DELETE',
                action: 'Delete tender modification reasons',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'submission-modification-reasons',
            ],
          },
          {
            name: 'Tender Invitation Reasons',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_INVT_RSON',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_INVT_RSON',
                action: 'View tender invitation reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_INVT_RSON_CREATE',
                action: 'Create tender invitation reasons',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_INVT_RSON_DELETE',
                action: 'Delete tender invitation reasons',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'tender-invitation-reasons',
            ],
          },
        ],
      },

      {
        name: 'Tender Details Matrix Settings',
        shortName: 'Settings',
        authority: 'ROLE_TNDR_INTN_SETTING_TNDR_DTLS_MTX',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_SETTING_TNDR_DTLS_MTX',
            action: 'View tender details matrix settings',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation', 'settings'],
        description: 'General system settings',
        icon: 'settings',
        children: [
          {
            name: 'Tender Security Types',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_SCRTY_TYPES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_SCRTY_TYPES',
                action: 'View tender security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_SCRTY_TYPES_CREATE',
                action: 'Create tender security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_SCRTY_TYPES_EDIT',
                action: 'Edit tender security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_SCRTY_TYPES_DELETE',
                action: 'Delete tender security types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'tender-security-types',
            ],
          },
          {
            name: 'Proposal Security Types',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_PROPSL_SCRTY_TYPES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PROPSL_SCRTY_TYPES',
                action: 'View proposal security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PROPSL_SCRTY_TYPES_CREATE',
                action: 'Create proposal security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PROPSL_SCRTY_TYPES_EDIT',
                action: 'Edit proposal security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PROPSL_SCRTY_TYPES_DELETE',
                action: 'Delete proposal security types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'proposal-security-types',
            ],
          },
          {
            name: 'Performance Security Type',
            authority: 'ROLE_TNDR_INTN_SETTING_TNDR_PERFMANCE_SCRTY_TYPES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PERFMANCE_SCRTY_TYPES',
                action: 'View performance security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PERFMANCE_SCRTY_TYPES_CREATE',
                action: 'Create performance security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PERFMANCE_SCRTY_TYPES_EDIT',
                action: 'Edit performance security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_TNDR_PERFMANCE_SCRTY_TYPES_DELETE',
                action: 'Delete performance security types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'tender-security-performance-type',
            ],
          },
          {
            name: 'Environmental and Social Performance Security Type',
            authority: 'ROLE_TNDR_INTN_SETTING_ENV_SCL_PERFMANCE_SCRTY_TYPES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_ENV_SCL_PERFMANCE_SCRTY_TYPES',
                action:
                  'View environment and social performance security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_ENV_SCL_PERFMANCE_SCRTY_TYPES_CREATE',
                action:
                  'Create environment and social performance security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_ENV_SCL_PERFMANCE_SCRTY_TYPES_EDIT',
                action:
                  'Edit environment and social performance security types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_ENV_SCL_PERFMANCE_SCRTY_TYPES_DELETE',
                action:
                  'Delete environment and social performance security types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'environmental-and-social-performance-security-type',
            ],
          },
          {
            name: 'Preference Scheme Type',
            authority: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE',
                action: 'View preference scheme type',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_CREATE',
                action: 'Create preference scheme type',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_EDIT',
                action: 'Edit preference scheme type',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_DELETE',
                action: 'Delete preference scheme type',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'preference-scheme-types',
            ],
          },
          {
            name: 'Preference Scheme Types Configuration',
            authority: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_CONFIG',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_CONFIG',
                action: 'View preference scheme types configuration',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_CONFIG_CREATE',
                action: 'Create preference scheme types configuration',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_CONFIG_EDIT',
                action: 'Edit preference scheme types configuration',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_PREF_SCHEME_TYPE_CONFIG_DELETE',
                action: 'Delete preference scheme types configuration',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'preference-scheme-type-configuration',
            ],
          },
          {
            name: 'Document Type',
            authority: 'ROLE_TNDR_INTN_SETTING_DOC_TYPE',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_DOC_TYPE',
                action: 'View document types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DOC_TYPE_CREATE',
                action: 'Create document types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DOC_TYPE_EDIT',
                action: 'Edit document types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_DOC_TYPE_DELETE',
                action: 'Delete document types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'document-types',
            ],
          },
        ],
      },

      {
        name: 'Contractor Matrix Settings',
        shortName: 'Contractor Matrix Settings',
        authority: 'ROLE_TNDR_INTN_CONTRCTR_MTRX',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_CONTRCTR_MTRX',
            action: 'View contractor matrix settings',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: ['', 'modules', 'tender-initiation', 'settings'],
        description: 'Contractor matrix settings',
        icon: 'settings',
        children: [
          {
            name: 'Contractor Types',
            authority: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPES',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPES',
                action: 'View contractor types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPES_CREATE',
                action: 'Create contractor types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPES_EDIT',
                action: 'Edit contractor types',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPES_DELETE',
                action: 'Delete contractor types',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'contractor-types',
            ],
          },
          {
            name: 'Contractor Type Class Mapping Configuration',
            authority: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPE_CLSS_MAPNG_CONFIG',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPE_CLSS_MAPNG_CONFIG',
                action: 'View contractor type class mapping configuration',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPE_CLSS_MAPNG_CONFIG_CREATE',
                action: 'Create contractor type class mapping configuration',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPE_CLSS_MAPNG_CONFIG_EDIT',
                action: 'Edit contractor type class mapping configuration',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTING_CONTRCTR_TYPE_CLSS_MAPNG_CONFIG_DELETE',
                action: 'Delete contractor type class mapping configuration',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'settings',
              'contractor-type-class-mapping',
            ],
          },
        ],
      },

      {
        name: 'Additional Fields Settings',
        shortName: 'Additional Fields Settings',
        authority: 'ROLE_TNDR_INTN_ADDTNAL_FLDS_SETNGS',
        permission: [
          {
            key: 'ROLE_TNDR_INTN_ADDTNAL_FLDS_SETNGS',
            action: 'View additional fields settings',
          },
        ],
        route: ['', 'modules', 'tender-initiation'],
        pathRoute: [
          '',
          'modules',
          'tender-initiation',
          'additional-fields-setting',
        ],
        description: 'Additional Fields Settings',
        icon: 'settings',
        children: [
          {
            name: 'Form Steps',
            authority: 'ROLE_TNDR_INTN_SETTINGS_FORM_STEPS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_FORM_STEPS',
                action: 'View form steps',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_FORM_STEPS_CREATE',
                action: 'Create form steps',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_FORM_STEPS_EDIT',
                action: 'Edit form steps',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_FORM_STEPS_DELETE',
                action: 'Delete form steps',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'additional-fields-setting',
              'form-steps',
              'TENDER',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
          {
            name: 'Additional Fields',
            authority: 'ROLE_TNDR_INTN_SETTINGS_ADDTNAL_FLDS',
            permission: [
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_ADDTNAL_FLDS',
                action: 'View additional details',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_ADDTNAL_FLDS_CREATE',
                action: 'Create additional details',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_ADDTNAL_FLDS_EDIT',
                action: 'Edit additional details',
              },
              {
                key: 'ROLE_TNDR_INTN_SETTINGS_ADDTNAL_FLDS_DELETE',
                action: 'Delete additional details',
              },
            ],
            route: [
              '',
              'modules',
              'tender-initiation',
              'additional-fields-setting',
              'additional-fields',
              'TENDER',
            ],
            icon: 'attachment',
            iconType: 'MATERIAL',
          },
        ],
      },
    ],
  },
];
