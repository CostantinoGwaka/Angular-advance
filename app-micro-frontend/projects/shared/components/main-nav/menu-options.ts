import { TendererManagement } from './menus/tenderer-management';
import { FrameworkAgreement } from './menus/framework-agreement';
import { AppManagement } from './menus/app-management';
import { PreQualification } from './menus/pre-qualification';
import { TenderInitiation } from './menus/tender-initiation';
import { Opening } from './menus/opening';
import { TenderEvaluation } from './menus/tender-evaluation';
import { PostQualification } from './menus/post-qualification';
import { Negotiation } from './menus/negotiation';
import { TenderAward } from './menus/tender-award';
import { TenderBoard } from './menus/tender-board';
import { PeManagement } from './menus/pe-management';
import { Bills } from './menus/bills';
import { TemplatesManagement } from './menus/templates-management';
import { Reports } from './menus/reports';
import { NestCommunicationTool } from './menus/nest-communication-tool';
import { Settings } from './menus/settings';
import { PeSelfRegistration } from './menus/pe-self-registration';
import { Account } from './menus/account';
import { MicroValueProcurement } from './menus/micro-procurement';
import { PpraDashboard } from './menus/ppra-dashboard';
import { PpaaManagement } from './menus/pppa-management';
import { PEDashboard } from './menus/pe-dashboard';
import { TenderLookup } from './menus/tender-lookup';
import { GovernmentProvider } from './menus/government-supplier';
import { CallOffOrder } from './menus/call-off-order';
import { PeAuditors } from './menus/pe-auditors';
import { ChangeManagement } from './menus/changes-management';
import { Statistics } from './menus/statistics';
import { ContractsCreationAndVetting } from './menus/contract-creation-and-vetting';
import { ContractsManagement } from './menus/contracts-management';
import { Monitoring } from './menus/monitoring';
import { SharedData } from './menus/shared-data';

export interface MenuOption {
  name: string;
  key?: string;
  image?: string;
  shortName?: string;
  authority?: string;
  hidden?: boolean;
  checkPermissionOnly?: boolean;
  permission: PermissionOption[];
  feature?: any[];//FeatureOption[];
  route?: string[];
  pathRoute?: string[];
  description?: string;
  icon?: string;
  iconType?: string;
  visible?: boolean;
  code?: string;
  children?: MenuOption[];
}

export interface PermissionOption {
  key: string;
  action: string;
}

export const peMenuOptions: MenuOption[] = [
  ...PpraDashboard,
  ...PEDashboard,
  ...PeAuditors,
  ...TendererManagement,
  ...FrameworkAgreement,
  ...CallOffOrder,
  ...AppManagement,
  ...PreQualification,
  ...TenderInitiation,
  ...Opening,
  ...MicroValueProcurement,
  ...TenderEvaluation,
  ...PostQualification,
  ...Negotiation,
  ...TenderAward,
  ...TenderLookup,
  ...ChangeManagement,
  ...PpaaManagement,
  ...GovernmentProvider,
  ...TenderBoard,
  ...ContractsCreationAndVetting,
  ...ContractsManagement,
  ...PeManagement,
  ...Bills,
  ...TemplatesManagement,
  ...Reports,
  ...NestCommunicationTool,
  ...Settings,
  ...PeSelfRegistration,
  ...Account,
  ...Statistics,
  ...Monitoring,
  ...SharedData,
];

/*TENDERER MENU OPTIONS AFTER REGISTRATION COMPLETION*/
export const tenderMenuOptions: MenuOption[] = [
  {
    name: 'SYSTEM_DASHBOARD',
    authority: 'ROLE_DASHBOARD_TNDRR',
    permission: [
      { key: 'ROLE_DASHBOARD_TNDRR', action: 'View dashboard' },
      {
        key: 'ROLE_DASHBOARD_TNDRR_UPDT_BUSNESLN',
        action: 'Update business line',
      },
    ],
    route: ['', 'nest-tenderer', 'dashboard'],
    icon: 'gisp_home',
    iconType: 'SVG',
  },
  {
    name: 'TENDER',
    authority: 'ROLE_MENU_TNDRR_TNDRS',
    permission: [{ key: 'ROLE_MENU_TNDRR_TNDRS', action: 'View tenders' }],
    route: ['', 'nest-tenderer', 'tenders'],
    icon: 'tenders',
    iconType: 'SVG',
    key: 'tenders',
    children: [
      {
        name: 'TENDERER_CURRENT_ADVERTISED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_CADV_TNDRS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_CADV_TNDRS',
            action: 'View current tenders',
          },
          {
            key: 'ROLE_TNDRR_BID_SUBMISSION_CREATE',
            action: 'Create Bid interest',
          },
          {
            key: 'ROLE_TNDRR_BID_PWR_OF_ATTORNEY_SUBMIT',
            action: 'Declare power of attorney',
          },
          {
            key: 'ROLE_TNDRR_BID_SUBMIMIT_TNDR_BID',
            action: 'Submit tender bid',
          },
          {
            key: 'ROLE_TNDRR_BID_MODIFY_TNDR_BID',
            action: 'Modify tender bid',
          },
          {
            key: 'ROLE_TNDRR_BID_WITHDRAW_TNDR_BID',
            action: 'Withdraw tender bid',
          },
          {
            key: 'ROLE_TNDRR_BID_CRITERIA_SUBMIT',
            action: 'Criteria submission',
          },
          {
            key: 'ROLE_TNDRR_BID_CRITERIA_COMPLETE_SUBMISSION',
            action: 'Complete criteria submission',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'submission'],
      },
      {
        name: 'TENDERER_CURRENT_INVITED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_CINV_TNDRS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_CINV_TNDRS',
            action: 'View invited tenders',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'invited-tenders'],
      },
      {
        name: 'TENDERER_SUBMITTED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_SUBMT_TNDRS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_SUBMT_TNDRS',
            action: 'View submitted tenders',
          },
          {
            key: 'ROLE_TNDRR_BID_SUBMISSION_CREATE',
            action: 'Create Bid interest',
          },
          {
            key: 'ROLE_TNDRR_BID_PWR_OF_ATTORNEY_SUBMIT',
            action: 'Declare power of attorney',
          },
          {
            key: 'ROLE_TNDRR_BID_SUBMIMIT_TNDR_BID',
            action: 'Submit tender bid',
          },
          {
            key: 'ROLE_TNDRR_BID_MODIFY_TNDR_BID',
            action: 'Modify tender bid',
          },
          {
            key: 'ROLE_TNDRR_BID_WITHDRAW_TNDR_BID',
            action: 'Withdraw tender bid',
          },
          {
            key: 'ROLE_TNDRR_BID_CRITERIA_SUBMIT',
            action: 'Criteria submission',
          },
          {
            key: 'ROLE_TNDRR_BID_CRITERIA_COMPLETE_SUBMISSION',
            action: 'Complete criteria submission',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'submitted-tenders'],
      },
      // {
      //   name: 'TENDERER_UNSUBMITTED_TENDERS',
      //   authority: 'ROLE_SMENU_TNDRR_PSUBMT_TNDRS',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_PSUBMT_TNDRS', action: 'View un-submitted tenders' },
      //     { key: 'ROLE_TNDRR_BID_SUBMISSION_CREATE', action: 'Create Bid interest'},
      //     { key: 'ROLE_TNDRR_BID_PWR_OF_ATTORNEY_SUBMIT', action: 'Declare power of attorney'},
      //     { key: 'ROLE_TNDRR_BID_SUBMIMIT_TNDR_BID', action: 'Submit tender bid'},
      //     { key: 'ROLE_TNDRR_BID_MODIFY_TNDR_BID', action: 'Modify tender bid'},
      //     { key: 'ROLE_TNDRR_BID_WITHDRAW_TNDR_BID', action: 'Withdraw tender bid'},
      //     { key: 'ROLE_TNDRR_BID_CRITERIA_SUBMIT', action: 'Criteria submission' },
      //     { key: 'ROLE_TNDRR_BID_CRITERIA_COMPLETE_SUBMISSION', action: 'Complete criteria submission' },
      //   ],
      //   route: ['', 'nest-tenderer', 'tenders', 'pending-submission'],
      // },
      {
        name: 'TENDERER_OPENED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_OPN_TNDRS',
        permission: [
          { key: 'ROLE_SMENU_TNDRR_OPN_TNDRS', action: 'View open tenders' },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'opened-tenders'],
      },
      {
        name: 'TENDERER_ALL_AWARDED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_ALL_AWRD_CNTRCTS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_ALL_AWRD_CNTRCTS',
            action: 'View awarded tenders',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'all-awarded-tenders'],
      },
      {
        name: 'TENDERER_MY_AWARDED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_MY_AWRD_CNTRCTS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_MY_AWRD_CNTRCTS',
            action: 'View my awarded tenders',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'my-awarded-tenders'],
      },
      {
        name: 'TENDERER_UNSUCCESSFULLY_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS',
            action: 'View unsuccessfully tenders',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'my-unsuccessfully-tenders'],
      },
      {
        name: 'TENDERER_INTENTION_TO_AWARDED_TENDERS',
        authority: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS',
            action: 'View Intention tenders',
          },
        ],
        route: ['', 'nest-tenderer', 'tenders', 'notice-of-intention-tenders'],
      },

      //************ TO BE IMPLEMENTED ****************

      // {
      //   name: 'TENDERER_WITHDRAWN_TENDERS',
      //   authority: 'ROLE_SMENU_TNDRR_MY_WTDRW_TNDRS',
      //   permission: [{ key: 'ROLE_SMENU_TNDRR_MY_WTDRW_TNDRS', action: 'View withdraw tenders' }],
      //   route: ['', 'nest-tenderer', 'tenders', 'withdraw-tenders'],
      // },
      // {
      //   name: 'TENDERER_CANCELLED_TENDERS',
      //   authority: 'ROLE_SMENU_TNDRR_CTNDRS',
      //   permission: [{ key: 'ROLE_SMENU_TNDRR_CTNDRS', action: 'View canceled tenders' }],
      //   route: ['', 'nest-tenderer', 'tenders', 'cancelled-tenders'],
      // },
    ],
  },
  {
    name: 'Pre Qualification',
    authority: 'ROLE_MENU_TNDRR_PRE_QLFCN',
    permission: [{ key: 'ROLE_MENU_TNDRR_PRE_QLFCN', action: 'View pre-qualifications' }],
    route: ['', 'nest-tenderer', 'pre-qualifications'],
    icon: 'pre_qualification',
    iconType: 'SVG',
    key: 'pre-qualifications',
    // children: [],
  },
  {
    name: 'Tender Negotiation',
    authority: 'ROLE_MENU_TENDERER_NEGOTIATION',
    permission: [
      { key: 'ROLE_MENU_TENDERER_NEGOTIATION', action: 'Tender negotiations' },
    ],
    route: ['', 'nest-tenderer', 'negotiation'],
    icon: 'tenders',
    iconType: 'SVG',
    key: 'negotiation',
    children: [
      {
        name: 'On Going Negotiation',
        authority: 'ROLE_SMENU_TENDERER_ONGOING_NEGO',
        permission: [
          {
            key: 'ROLE_SMENU_TENDERER_ONGOING_NEGO',
            action: 'View On Going Negotiations',
          },
        ],
        route: ['', 'nest-tenderer', 'negotiation', 'on-going-negotiation'],
      },
      {
        name: 'Negotiation Report',
        authority: 'ROLE_SMENU_TENDERER_NEGO_REPORT',
        permission: [
          {
            key: 'ROLE_SMENU_TENDERER_NEGO_REPORT',
            action: 'View Negotiation Report',
          },
        ],
        route: ['', 'nest-tenderer', 'negotiation', 'negotiation-report'],
      },
    ],
  },
  {
    name: 'Contracts Management',
    authority: 'ROLE_MENU_TNDRR_CONTRACTS_MANAGEMENT',
    permission: [{ key: 'ROLE_MENU_TNDRR_TNDRS', action: 'View tenders' }],
    route: ['', 'nest-tenderer', 'tenders'],
    icon: 'tenders',
    iconType: 'SVG',
    key: 'contracts',
    children: [
      {
        name: 'Contract Signing Tasks',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_SIGNING_TASKS',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_SIGNING_TASKS',
            action: 'View Contract Signing Tasks',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'pending-contracts-tasks'],
      },
      {
        name: 'Pending Contracts',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_PENDING',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_PENDING',
            action: 'View Pending Contracts',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'pending-contracts'],
      },
      {
        name: 'Active Contracts',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_ACITVE',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_ACITVE',
            action: 'View Active Contracts',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'active-contracts'],
      },
      {
        name: 'Completed Contracts',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_COMPLETED',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_COMPLETED',
            action: 'View Completed Contracts',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'completed-contracts'],
      },
      {
        name: 'Terminated Contracts',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_TERMINATED',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_TERMINATED',
            action: 'View Terminated Contracts',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'terminated-contracts'],
      },
      {
        name: 'Contract Payments',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_PYMNTS',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_PYMNTS',
            action: 'View Contract payments',
          },
          {
            key: 'ROLE_MENU_TNDRR_RQUEST_CONTRACT_PYMNTS',
            action: 'Request contract payments',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'contract-payments'],
      },
      {
        name: 'Contract Variations',
        authority: 'ROLE_MENU_TNDRR_CONTRACTS_VARIATION',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_CONTRACTS_VARIATION',
            action: 'View Contract variation',
          },
          {
            key: 'ROLE_MENU_TNDRR_RQUEST_CONTRACT_VARIATION',
            action: 'Request contract variation',
          },
        ],
        route: ['', 'nest-tenderer', 'contracts', 'contract-variations'],
      },
    ],
  },
  {
    name: 'Complaints & Appeals',
    authority: 'ROLE_MENU_TNDRR_COMPLAINTS',
    permission: [
      { key: 'ROLE_MENU_TNDRR_COMPLAINTS', action: 'View Tenders Complaints' },
    ],
    route: ['', 'nest-tenderer', 'complaints'],
    icon: 'appeal_tndr',
    iconType: 'SVG',
    key: 'complaints',
    children: [
      {
        name: 'Tenders',
        authority: 'ROLE_MENU_TNDRR_COMPLAINTS',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_VIEW',
            action: 'List Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_CREATE',
            action: 'Create Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_EDIT',
            action: 'Edit Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_DELETE',
            action: 'Delete Tenders Complaints',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'list-complaints'],
      },
      {
        name: 'Ongoing Complaints',
        authority: 'ROLE_MENU_TNDRR_COMPLAINTS_ONGOING',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_ONGOING_VIEW',
            action: 'Ongoing Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_ONGOING_CREATE',
            action: 'Ongoing Create Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_ONGOING_EDIT',
            action: 'Ongoing Edit Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_ONGOING_DELETE',
            action: 'Ongoing Delete Tenders Complaints',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'ongoing-complaints'],
      },
      {
        name: 'Join as Interested Apps',
        authority: 'ROLE_MENU_TNDRR_JOINT_AS_INTERESTED',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_JOINT_AS_INTERESTED_VIEW',
            action: 'Application List Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_JOINT_AS_INTERESTED_CREATE',
            action: 'Application Create Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_JOINT_AS_INTERESTED_EDIT',
            action: 'Application Edit Tenders Complaints',
          },
          {
            key: 'ROLE_MENU_TNDRR_JOINT_AS_INTERESTED_DELETE',
            action: 'Application Deletet Tenders Complaints',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'my-join-as-interested'],
        key: 'history-complaints',
      },
      {
        name: 'Closed Complaints',
        authority: 'ROLE_MENU_TNDRR_COMPLAINTS',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_VIEW',
            action: 'List Closed Tenderers Complaints',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'closed-complaints'],
      },
      {
        name: 'Withdrawn Complaints',
        authority: 'ROLE_MENU_WITHDRAWN_COMPLAINT',
        permission: [
          {
            key: 'ROLE_MENU_WITHDRAWN_COMPLAINT',
            action: 'List Withdrawn Tenderers Complaints',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'withdrawn-complaints'],
      },
      {
        name: 'Appeals Authority  Fees',
        authority: 'ROLE_MENU_TNDRR_SERVICES_FEE',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_SERVICES_FEE',
            action: 'View Appeals Authority  Fees',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'payment-fee'],
      },
      {
        name: 'Complaints Bills',
        authority: 'ROLE_MENU_TNDRR_COMPLAINTS_BILLS',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_BILLS_VIEW',
            action: 'View Bills Complaint',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_BILLS_CREATE',
            action: 'Create Bills Complaint',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_BILLS_EDIT',
            action: 'Edit Bills Complaint',
          },
          {
            key: 'ROLE_MENU_TNDRR_COMPLAINTS_BILLS_DELETE',
            action: 'Delete Bills Complaint',
          },
        ],
        route: ['', 'nest-tenderer', 'complaints', 'bills-complaints'],
      },
    ],
  },
  {
    name: 'Bank Details',
    authority: 'ROLE_SMENU_TNDRR_BANK_DETAILS',
    permission: [
      {
        key: 'ROLE_SMENU_TNDRR_BANK_DETAILS',
        action: 'View bank details',
      },
      {
        key: 'ROLE_SMENU_TNDRR_BANK_DETAILS_CREATE',
        action: 'Create bank details',
      },
      {
        key: 'ROLE_SMENU_TNDRR_BANK_DETAILS_EDIT',
        action: 'Edit bank details',
      },
      {
        key: 'ROLE_SMENU_TNDRR_BANK_DETAILS_DELETE',
        action: 'Delete bank details',
      },
    ],
    route: ['', 'nest-tenderer', 'bank-details'],
    icon: 'money',
    key: 'bank',
    iconType: 'SVG',
  },
  {
    name: 'Billing',
    authority: 'ROLE_MENU_TNDRR_WLLT',
    permission: [{ key: 'ROLE_MENU_TNDRR_WLLT', action: 'View Billing' }],
    route: ['', 'nest-tenderer', 'wallet'],
    icon: 'money_wallet',
    key: 'wallet',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_MENU_TNDRR_WLLT_DASBRD',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_WLLT_DASBRD',
            action: 'View wallet dashboard',
          },
        ],
        route: ['', 'nest-tenderer', 'wallet', 'dashboard'],
      },
      {
        name: 'Deposit',
        authority: 'ROLE_MENU_TNDRR_WLLT_DPST',
        permission: [
          { key: 'ROLE_MENU_TNDRR_WLLT_DPST', action: 'View wallet deposit' },
        ],
        route: ['', 'nest-tenderer', 'wallet', 'deposit'],
      },

      {
        name: 'Paid Bills',
        authority: 'ROLE_MENU_TNDRR_WLLT_PAID_BILLS',
        permission: [
          { key: 'ROLE_MENU_TNDRR_WLLT_PAID_BILLS', action: 'View Paid Bills' },
        ],
        route: ['', 'nest-tenderer', 'wallet', 'paid-bills'],
      },
      {
        name: 'Pending Bills',
        authority: 'ROLE_MENU_TNDRR_WLLT_PND_BILLS',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_WLLT_PND_BILLS',
            action: 'View Pending Bills',
          },
        ],
        route: ['', 'nest-tenderer', 'wallet', 'pending-bills'],
      },
      {
        name: 'Tender Charges',
        authority: 'ROLE_MENU_TNDRR_CHARGES',
        permission: [
          { key: 'ROLE_MENU_TNDRR_CHARGES', action: 'View Tender Charges' },
        ],
        route: ['', 'nest-tenderer', 'wallet', 'tender-charges'],
      },
      {
        name: 'Registration Charges',
        authority: 'ROLE_MENU_TNDRR_REGISTRATIONS_CHARGES',
        permission: [
          { key: 'ROLE_MENU_TNDRR_CHARGES', action: 'View Tender Charges' },
        ],
        route: ['', 'nest-tenderer', 'wallet', 'registration-charges'],
      },
    ],
  },
  {
    name: 'Group Members',
    authority: 'ROLE_MENU_TNDRR_GROUP',
    route: ['', 'nest-tenderer', 'group-members'],
    permission: [{ key: 'ROLE_MENU_TNDRR_GROUP', action: 'Manage Group' }],
    icon: 'add_users',
    key: 'group',
    iconType: 'SVG',
  },
  {
    name: 'Subscription',
    authority: 'ROLE_MENU_TNDRR_SUBSCRIPTION',
    permission: [
      { key: 'ROLE_MENU_TNDRR_SUBSCRIPTION', action: 'View Subscription' },
    ],
    route: ['', 'nest-tenderer', 'subscription'],
    icon: 'notification',
    key: 'subscription',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_MENU_TNDRR_SUBSCRIPTION',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_SUBSCRIPTION',
            action: 'View Subscription Dashboard',
          },
        ],
        route: ['', 'nest-tenderer', 'subscription', 'dashboard'],
      },
      {
        name: 'My Subscription',
        authority: 'ROLE_MENU_TNDRR_SUBSCRIPTION',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_SUBSCRIPTION',
            action: 'View Tenderer Subscription',
          },
          {
            key: 'ROLE_MENU_TNDRR_SUBSCRIPTION_CREATE',
            action: 'Create Tenderer Subscription',
          },
          {
            key: 'ROLE_SUBSCPTN_DELETE',
            action: 'Delete Tenderer Subscription',
          },
          {
            key: 'ROLE_MENU_TNDRR_SUBSCRIPTION_UPDATE',
            action: 'Edit Tenderer Subscription',
          },
        ],
        route: ['', 'nest-tenderer', 'subscription', 'my-subscription'],
      },
    ],
  },
  {
    name: 'TENDERER_USERS_SIDE_NAVIGATION',
    authority: 'ROLE_MENU_TNDRR_USRS',
    permission: [
      { key: 'ROLE_MENU_TNDRR_USRS', action: 'View  users' },
      {
        key: 'ROLE_MODULES_USR_MNGT_RESEND',
        action: 'Resend Activation Token',
      },
      {
        key: 'ROLE_MODULES_USR_MNGT_LOCK_UNLOCK_USER',
        action: 'Lock/Unlock User Account',
      },
    ],
    route: ['', 'nest-tenderer', 'tenderer-users'],
    icon: 'add_users',
    key: 'users',
    iconType: 'SVG',
  },

  {
    name: 'TENDERER_PROFILE_SPECIFICATIONS',
    authority: 'ROLE_MENU_TNDRR_SPECS',
    permission: [
      { key: 'ROLE_MENU_TNDRR_SPECS', action: 'View specification' },
    ],
    route: ['', 'nest-tenderer', 'specifications'],
    icon: 'tenders',
    key: 'specifications',
    iconType: 'SVG',
  },
  {
    name: 'Address',
    authority: 'ROLE_MENU_TNDRR_ADDRESS',
    permission: [
      { key: 'ROLE_MENU_TNDRR_ADDRESS', action: 'View address' },
      { key: 'ROLE_TENDERER_CREATE_TNDRR_ADDRS', action: 'Can add address' },
      { key: 'ROLE_TENDERER_EDIT_TNDRR_ADDRS', action: 'Can edit address' },
      { key: 'ROLE_TENDERER_REQUEST_OTP', action: 'Can Request OTP ' },
      { key: 'ROLE_TENDERER_MANAGE_ADDRS', action: 'Can manage address' },
      { key: 'ROLE_TENDERER_DELETE_ADDRS', action: 'Can delete address' },
    ],
    route: ['', 'nest-tenderer', 'address'],
    icon: 'gisp_project_1',
    key: 'address',
    iconType: 'SVG',
  },
  {
    name: 'Joint Venture Consortium',
    authority: 'ROLE_MENU_TNDRR_JVC',
    permission: [
      { key: 'ROLE_MENU_TNDRR_JVC', action: 'Joint Venture Consortium' },
    ],
    route: ['', 'nest-tenderer', 'joint-venture'],
    icon: 'tenders',
    iconType: 'SVG',
    key: 'joint-venture',
    children: [
      {
        name: 'My Joint Venture Consortium',
        authority: 'ROLE_MENU_TNDRR_JVC',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_JVC_LIST',
            action: 'List Joint Venture Consortium',
          },
          {
            key: 'ROLE_MENU_TNDRR_JVC_CREATE',
            action: 'Create Joint Venture Consortium',
          },
        ],
        route: ['', 'nest-tenderer', 'joint-venture', 'my-joint-venture'],
        key: 'my-joint-venture',
      },
      {
        name: 'Pending Joint Ventures',
        authority: 'ROLE_MENU_TNDRR_JVC',
        key: 'pending-joint-venture',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_JVC_LIST_PENDING_REQUEST',
            action: 'List Pending Joint Venture Consortium',
          },
          {
            key: 'ROLE_MENU_TNDRR_JVC_ACCEPT_REQUEST',
            action: 'Accept Joint Venture Request',
          },
        ],
        route: ['', 'nest-tenderer', 'joint-venture', 'pending-joint-venture'],
      },
      {
        name: 'Ongoing Joint Ventures',
        authority: 'ROLE_MENU_TNDRR_JVC',
        key: 'pending-joint-venture',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_JVC_LIST_ONGOING_REQUEST',
            action: 'List Ongoing Joint Venture Consortium',
          },
        ],
        route: ['', 'nest-tenderer', 'joint-venture', 'ongoing-joint-venture'],
      },
      {
        name: 'Rejected Joint Ventures',
        authority: 'ROLE_MENU_TNDRR_JVC',
        key: 'pending-joint-venture',
        permission: [
          {
            key: 'ROLE_MENU_TNDRR_JVC_LIST_ONGOING_REQUEST',
            action: 'List Rejected Joint Venture Consortium',
          },
        ],
        route: ['', 'nest-tenderer', 'joint-venture', 'reject-joint-venture'],
      },
    ],
  },
  {
    name: 'Profile',
    authority: 'ROLE_MENU_TNDRR_PROFILE',
    permission: [
      { key: 'ROLE_MENU_TNDRR_PROFILE', action: 'View profile' },
      { key: 'ROLE_TENDERER_UPDATE_PROFILE', action: 'Can update profile' },
      // {key: 'ROLE_TENDERER_MANAGE_ADDRS', action: 'Can manage address'},
      // {key: 'ROLE_TENDERER_DELETE_ADDRS', action: 'Can delete address'},
    ],
    route: ['', 'nest-tenderer', 'profile'],
    icon: 'user_account',
    iconType: 'SVG',
    key: 'profile',
  },
  {
    name: 'Frameworks',
    authority: 'ROLE_MENU_TNDRR_FRAMEWORK',
    permission: [
      { key: 'ROLE_MENU_TNDRR_FRAMEWORK', action: 'Tenderer Framework' },
    ],
    route: ['', 'nest-tenderer', 'tenderer-framework'],
    icon: 'frameWorkAgreement',
    iconType: 'SVG',
    key: 'tenderer-framework',
    children: [
      {
        name: 'Framework',
        authority: 'ROLE_MENU_TNDRR_FRAMEWORK',
        permission: [
          { key: 'ROLE_STNG_UAA_TENDR_FRMWRK_VIEW', action: 'List Framework' },
          {
            key: 'ROLE_STNG_UAA_TENDR_FRMWRK_CREATE',
            action: 'Create Framework',
          },
          { key: 'ROLE_STNG_UAA_TENDR_FRMWRK_EDIT', action: 'Edit Framework' },
          {
            key: 'ROLE_STNG_UAA_TENDR_FRMWRK_DELETE',
            action: 'Delete Framework',
          },
        ],
        route: ['', 'nest-tenderer', 'framework', 'tenderer-framework'],
        key: 'my-tenderer-framework',
      },
      {
        name: 'Business Lines',
        authority: 'ROLE_MENU_TNDRR_FRAMEWORK_BUSINESS_LINES',
        permission: [
          {
            key: 'ROLE_STNG_UAA_TENDR_FRMWRK_VIEW',
            action: 'List Business Line For Framework',
          },
        ],
        route: ['', 'nest-tenderer', 'framework', 'business-line-framework'],
        key: 'my-businessline-framework',
      },
      {
        name: 'History Framework',
        authority: 'ROLE_MENU_TNDRR_FRAMEWORK',
        permission: [
          {
            key: 'ROLE_STNG_UAA_TENDR_HISTORY_FRMWRK_VIEW',
            action: 'List History Framework',
          },
        ],
        route: ['', 'nest-tenderer', 'framework', 'history-framework'],
        key: 'history-framework',
      },
    ],
  },
  {
    name: 'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION',
    authority: 'ROLE_MENU_TNDRR_QLF_INFO',
    permission: [
      {
        key: 'ROLE_MENU_TNDRR_QLF_INFO',
        action: 'View Qualification information',
      },
    ],
    route: ['', 'nest-tenderer', 'profile-information'],
    icon: 'settings',
    iconType: 'MATERIAL',
    key: 'settings',
    children: [
      // {
      //   name: 'Annual Turnover',
      //   authority: 'ROLE_SMENU_TNDRR_ANN_TOVR',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_ANN_TOVR', action: 'View annual turnover' },
      //     { key: 'ROLE_SMENU_TNDRR_ANN_TOVR_CREATE', action: 'Create annual turnover' },
      //     { key: 'ROLE_SMENU_TNDRR_ANN_TOVR_EDIT', action: 'Edit annual turnover' },
      //     { key: 'ROLE_SMENU_TNDRR_ANN_TOVR_DELETE', action: 'Delete annual turnover' },
      //   ],
      //   code: 'ANNUAL_TURNOVER',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'average-turnover',
      //   ],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_FINANCIAL_RESOURCES_SOURCES_FUNDS_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_SRC_FND',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_SRC_FND', action: 'View financial resources' },
      //     { key: 'ROLE_SMENU_TNDRR_SRC_FND_CREATE', action: 'Create financial resources' },
      //     { key: 'ROLE_SMENU_TNDRR_SRC_FND_EDIT', action: 'Edit financial resources' },
      //     { key: 'ROLE_SMENU_TNDRR_SRC_FND_DELETE', action: 'Delete financial resources' },
      //   ],
      //   code: 'FINANCIAL_RESOURCES',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'financial-resources',
      //   ],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_LITIGATION_RECORDS_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_LTG_HIS',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_LTG_HIS', action: 'View litigation records' },
      //     { key: 'ROLE_SMENU_TNDRR_LTG_HIS_CREATE', action: 'Create litigation records' },
      //     { key: 'ROLE_SMENU_TNDRR_LTG_HIS_EDIT', action: 'Edit litigation records' },
      //     { key: 'ROLE_SMENU_TNDRR_LTG_HIS_DELETE', action: 'Delete litigation records' }
      //   ],
      //   code: 'LITIGATION_RECORDS',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'litigation-record',
      //   ],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_OFFICE_LOCATION_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_OFF_LCTN',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_OFF_LCTN', action: 'View office locations' },
      //     { key: 'ROLE_SMENU_TNDRR_OFF_LCTN_EDIT', action: 'Edit office locations' },
      //     { key: 'ROLE_SMENU_TNDRR_OFF_LCTN_CREATE', action: 'Create office locations' },
      //     { key: 'ROLE_SMENU_TNDRR_OFF_LCTN_DELETE', action: 'Delete office locations' },
      //   ],
      //   code: 'OFFICE_LOCATIONS',
      //   route: ['', 'nest-tenderer', 'profile-information', 'office-location'],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_PERSONNEL_INFORMATION_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_PRSNL_INFO',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_PRSNL_INFO', action: 'View personnel information' },
      //     { key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_CREATE', action: 'Create personnel information' },
      //     { key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_EDIT', action: 'Edit personnel information' },
      //     { key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_DELETE', action: 'Delete personnel information' },
      //     { key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_MANAGE', action: 'Manage personnel information' },
      //   ],
      //   code: 'PERSONNEL_INFORMATION',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'personnel-information',
      //   ],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_WORK_EXPERIENCE_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_WRK_EXPR',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_WRK_EXPR', action: 'View work experience' },
      //     { key: 'ROLE_SMENU_TNDRR_WRK_EXPR_CREATE', action: 'Create work experience' },
      //     { key: 'ROLE_SMENU_TNDRR_WRK_EXPR_EDIT', action: 'Edit work experience' },
      //     { key: 'ROLE_SMENU_TNDRR_WRK_EXPR_DELETE', action: 'Delete work experience' },
      //   ],
      //   code: 'TENDERER_WORK_EXPERIENCE',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'tenderer-work-experiences',
      //   ],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_KEY_ACTIVITY_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY', action: 'View key activities' },
      //     { key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY_CREATE', action: 'Create key activities' },
      //     { key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY_EDIT', action: 'Edit key activities' },
      //     { key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY_DELETE', action: 'Delete key activities' },
      //   ],
      //   code: 'TENDERER_KEY_ACTIVITY',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'tenderer-experience-key-activity',
      //   ],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_WORK_EQUIPMENT_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_WRK_EQP',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_WRK_EQP', action: 'View work equipment' },
      //     { key: 'ROLE_SMENU_TNDRR_WRK_CREATE', action: 'Create work equipment' },
      //     { key: 'ROLE_SMENU_TNDRR_WRK_EDIT', action: 'Edit work equipment' },
      //     { key: 'ROLE_SMENU_TNDRR_WRK_DELETE', action: 'Delete work equipment' },
      //   ],
      //   code: 'WORK_EQUIPMENT',
      //   route: ['', 'nest-tenderer', 'profile-information', 'equipments'],
      // },
      // {
      //   name: 'TENDERER_QUALI_INFO_FINANCIAL_CAPABILITY_STATEMENT_SIDE_NAV',
      //   authority: 'ROLE_SMENU_TNDRR_FIN_STMNT',
      //   permission: [
      //     { key: 'ROLE_SMENU_TNDRR_FIN_STMNT', action: 'View financial statement' },
      //     { key: 'ROLE_SMENU_TNDRR_FIN_STMNT_CREATE', action: 'Create financial statement' },
      //     { key: 'ROLE_SMENU_TNDRR_FIN_STMNT_EDIT', action: 'Edit financial statement' },
      //     { key: 'ROLE_SMENU_TNDRR_FIN_STMNT_DELETE', action: 'Delete financial statement' }
      //   ],
      //   code: 'FINANCIAL_CAPABILITY',
      //   route: [
      //     '',
      //     'nest-tenderer',
      //     'profile-information',
      //     'cash-flow',
      //   ],
      // },
    ],
  },
  {
    name: 'Call Off',
    authority: 'ROLE_VW_CFO',
    permission: [{ key: 'ROLE_VW_CFO', action: 'View Call Off' }],
    route: ['', 'nest-tenderer', 'calloff'],
    icon: 'tenders',
    iconType: 'SVG',
    key: 'calloff',
    children: [
      {
        name: 'Orders',
        authority: 'ROLE_VW_CFO',
        permission: [],
        route: ['', 'nest-tenderer', 'calloff', 'orders'],
      },
      {
        name: 'Delivery Notes',
        authority: 'ROLE_VW_CFO_DLNTS',
        permission: [
          {
            key: 'ROLE_VW_CFO_DLNTS',
            action: 'View Call Off Order Delivery Note',
          },
        ],
        route: ['', 'nest-tenderer', 'calloff', 'delivery-notes'],
      },
    ],
  },
];

/*TENDERER MENU OPTIONS AFTER REGISTRATION COMPLETION*/
export const embassyMenuOptions: MenuOption[] = [
  {
    name: 'Dashboard',
    authority: 'ROLE_MENU_EMBSY_DSHBRD',
    permission: [
      {
        key: 'ROLE_MENU_EMBSY_DSHBRD',
        action: 'View Dashboard',
      },
    ],
    route: ['', 'nest-embassys', 'dashboard'],
    icon: 'gisp_home',
    iconType: 'SVG',
  },
  {
    name: 'Embassy Tenderers',
    authority: 'ROLE_MENU_EMBSY_TNDRR',
    permission: [
      {
        key: 'ROLE_MENU_EMBSY_TNDRR',
        action: 'View embassy tenderer',
      },
    ],
    route: ['', 'nest-tenderer', 'tenderer'],
    icon: 'add_users',
    iconType: 'SVG',
    key: 'tenderer',
    children: [
      {
        name: 'Waiting for Approval',
        authority: 'ROLE_MENU_EMBSY_TNDRR_WTNG_APPRVL',
        permission: [
          {
            key: 'ROLE_MENU_EMBSY_TNDRR_WTNG_APPRVL',
            action: 'View tenderer waiting for approval',
          },
        ],
        route: [
          '',
          'nest-embassys',
          'embassy-tenderers',
          'tenderer',
          'wait-tenderer',
        ],
      },
      {
        name: 'Approved',
        authority: 'ROLE_MENU_EMBSY_TNDRR_APPRVD',
        permission: [
          {
            key: 'ROLE_MENU_EMBSY_TNDRR_APPRVD',
            action: 'View approved tenderer',
          },
        ],
        route: [
          '',
          'nest-embassys',
          'embassy-tenderers',
          'tenderer',
          'approved-tenderer',
        ],
      },
      {
        name: 'Rejected',
        authority: 'ROLE_MENU_EMBSY_TNDRR_RJCTD',
        permission: [
          {
            key: 'ROLE_MENU_EMBSY_TNDRR_RJCTD',
            action: 'View rejected tenderer',
          },
        ],
        route: [
          '',
          'nest-embassys',
          'embassy-tenderers',
          'tenderer',
          'rejected',
        ],
      },
    ],
  },
];
/*TENDERER MENU OPTIONS AFTER REGISTRATION COMPLETION*/
export const manufacturerMenuOptions: MenuOption[] = [
  // {
  //   name: 'Manufacturer',
  //   authority: 'ROLE_MENU_TNDRR_TNDRS',
  //   permission: [
  //     {
  //       key: 'ROLE_MENU_TNDRR_TNDRS',
  //       action: 'View embassy tenderer'
  //     }
  //   ],
  //   route: ['', 'nest-manufacturer', 'tenderer'],
  //   icon: 'add_users',
  //   iconType: 'SVG',
  //   key: 'tenderer',
  //   children: [
  //     {
  //       name: 'TENDERER_CURRENT_INVITED_TENDERS',
  //       authority: 'ROLE_SMENU_TNDRR_CINV_TNDRS',
  //       permission: [{ key: 'ROLE_SMENU_TNDRR_CINV_TNDRS', action: 'View invited tenders' }],
  //       route: ['', 'nest-tenderer', 'tenders', 'invited-tenders'],
  //     },
  //     {
  //       name: 'TENDERER_SUBMITTED_TENDERS',
  //       authority: 'ROLE_SMENU_TNDRR_SUBMT_TNDRS',
  //       permission: [
  //         { key: 'ROLE_SMENU_TNDRR_SUBMT_TNDRS', action: 'View submitted tenders' },
  //         { key: 'ROLE_TNDRR_BID_SUBMISSION_CREATE', action: 'Create Bid interest' },
  //         { key: 'ROLE_TNDRR_BID_PWR_OF_ATTORNEY_SUBMIT', action: 'Declare power of attorney' },
  //         { key: 'ROLE_TNDRR_BID_SUBMIMIT_TNDR_BID', action: 'Submit tender bid' },
  //         { key: 'ROLE_TNDRR_BID_MODIFY_TNDR_BID', action: 'Modify tender bid' },
  //         { key: 'ROLE_TNDRR_BID_WITHDRAW_TNDR_BID', action: 'Withdraw tender bid' },
  //         { key: 'ROLE_TNDRR_BID_CRITERIA_SUBMIT', action: 'Criteria submission' },
  //         { key: 'ROLE_TNDRR_BID_CRITERIA_COMPLETE_SUBMISSION', action: 'Complete criteria submission' },
  //       ],
  //       route: ['', 'nest-tenderer', 'tenders', 'submitted-tenders'],
  //     },
  //     {
  //       name: 'TENDERER_MY_AWARDED_TENDERS',
  //       authority: 'ROLE_SMENU_TNDRR_MY_AWRD_CNTRCTS',
  //       permission: [{ key: 'ROLE_SMENU_TNDRR_MY_AWRD_CNTRCTS', action: 'View my awarded tenders' }],
  //       route: ['', 'nest-tenderer', 'tenders', 'my-awarded-tenders'],
  //     },
  //     {
  //       name: 'TENDERER_UNSUCCESSFULLY_TENDERS',
  //       authority: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS',
  //       permission: [{ key: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS', action: 'View unsuccessfully tenders' }],
  //       route: ['', 'nest-tenderer', 'tenders', 'my-unsuccessfully-tenders'],
  //     },
  //     {
  //       name: 'TENDERER_INTENTION_TO_AWARDED_TENDERS',
  //       authority: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS',
  //       permission: [{ key: 'ROLE_SMENU_TNDRR_MY_UNSFLY_TNDRS', action: 'View Intention tenders' }],
  //       route: ['', 'nest-tenderer', 'tenders', 'notice-of-intention-tenders'],
  //     },
  //   ],
  // },
];
