import { MenuOption } from '../menu-options';

export const Reports: MenuOption[] = [
  {
    name: 'Reports ',
    shortName: 'Reports',
    route: ['', 'modules', 'reports'],
    pathRoute: ['', 'modules', 'reports', 'all-reports'],
    description: ' Report Management Modules',
    icon: 'reports',
    iconType: 'SVG',
    authority: 'ROLE_MODULES_RPRT',
    permission: [
      {
        key: 'ROLE_MODULES_RPRT',
        action: '',
      },
    ],
    children: [
      {
        name: 'All Reports',
        authority: 'ROLE_RPRT_ALL_RPRTS',
        permission: [
          {
            key: 'ROLE_RPRT_ALL_RPRTS',
            action: 'view All reports',
          },
          {
            action:
              'General Procurement Notice - Summary For All Procuring Entities',
            key: 'ROLE_REPORT_APP_GPN_SUM_CONS',
          },
          {
            action:
              'General Procurement Notice - Summary For Individual Procuring Entity',
            key: 'ROLE_REPORT_APP_GPN_INDV',
          },
          {
            action: 'List of Procuring Entities-GPN Status',
            key: 'ROLE_REPORT_APP_PUBLISH',
          },
          {
            action: 'List of Procuring Entities Registered',
            key: 'ROLE_REPORT_PE_LIST_REG',
          },
          {
            action: 'List of Active Users',
            key: 'REPORT_ROLE_UAA_ACTV_USR',
          },
          {
            action: 'Tenderers Summary',
            key: 'ROLE_REPORT_UAA_COMB_TNDR',
          },
          {
            action: 'Summary of Number of Planned Tenders by categories of PE',
            key: 'ROLE_REPORT_APP_TNDR_CAT_TAB',
          },
          {
            action: 'Procuring Entities Plans',
            key: 'ROLE_REPORT_APP_PE_PLN',
          },
          {
            action: 'List of Registered Special Group',
            key: 'ROLE_REPORT_UAA_REG_SPC_GRP',
          },
          {
            action: 'GPN Summary For Specific Organization',
            key: 'ROLE_REPORT_APP_GPN_SPE_ORG',
          },
          {
            action: 'GPN Summary-Data For Specific Organization',
            key: 'ROLE_REPORT_APP_GPN_SUM_DT_SPC_ORG',
          },
          {
            action:
              'CUIS Registered Tenderers as per Business Line in District Leve',
            key: 'ROLE_REPORT_UAA_CUIS_REGSTRD',
          },
          {
            action: 'Annual Procurement Plan',
            key: 'ROLE_REPORT_APP_ANN_PROC_PLN',
          },
          {
            action: 'Requisition Report for User Department',
            key: 'ROLE_REPORT_TENDER_RQST_RPT_USR_DEPT',
          },
          {
            action: 'Requisition Report for HPMU/IO/AU',
            key: 'ROLE_REPORT_TENDER_HPMU_IO_AU',
          },
          {
            action: 'Awarded Tenders Report for PPRA',
            key: 'ROLE_REPORT_TENDER_AWRD_TNDR_RPT_PPRA',
          },
          {
            action: 'Requisition Report for PPRA',
            key: 'ROLE_REPORT_TENDER_RQS_RPT_PPRA',
          },
          {
            action: 'Tender Opening Details',
            key: 'ROLE_REPORT_TENDER_TNDR_OPN_DTLS',
          },
          {
            action: 'Tender Opening Details for Prequalification',
            key: 'ROLE_REPORT_TENDER_TNDR_OPN_DTLS_PRQF',
          },
          {
            action: 'Tender Opening Details for Consultancy',
            key: 'ROLE_REPORT_TENDER_TNDR_OPN_DTL_CONS',
          },
          {
            action: 'Tender Evaluation Report',
            key: 'ROLE_REPORT_TENDER_TNDR_EVL_RPT',
          },
          {
            action: 'Prequalification Tender Evaluation Report',
            key: 'ROLE_REPORT_TENDER_PRQF_TNDR_EVLT_RPT',
          },
          {
            action: 'All Bills Generated',
            key: 'ROLE_REPORT_BILL_AL_BILL_GNRTD',
          },
          {
            action: 'Client Wallet Balance Report',
            key: 'ROLE_REPORT_BILL_CNT_WLT_BLC_RPT',
          },
          {
            action: 'Bill Collections Report',
            key: 'ROLE_REPORT_BILL_BIL_COL_RPT',
          },
          {
            action: 'PPRA Wallet Statement Report',
            key: 'ROLE_REPORT_BILL_PPRA_WLT_STMT_RPT',
          },
          {
            action: 'Collection Report By Service Type',
            key: 'ROLE_REPORT_BILL_CLT_RPT_SRV_TP',
          },
          {
            action: 'Bill Uncredited Report',
            key: 'ROLE_REPORT_BILL_BIL_UNCRD_RPT',
          },
          {
            action: 'Bill Reconciliation Report',
            key: 'ROLE_REPORT_BILL_BIL_RCTN_RPT',
          },
          {
            action: 'Tender Advertisement Report',
            key: 'ROLE_REPORT_TENDER_TNDR_ADVRMT_RPT',
          },
          {
            action: 'Tender Notice Of Intention To Award A Contract',
            key: 'ROLE_REPORT_TENDER_TDR_NTC_INT_AWR_CNTR',
          },
          {
            action: 'Awarded Tender Volume per Procurement Categories',
            key: 'ROLE_REPORT_APP_AWARD_BY_CATEG',
          },
          {
            action: 'Tenderers Registered Per Business Line',
            key: 'ROLE_REPORT_UAA_TNDERER_PER_BUSLN',
          },
          {
            action: 'Micro Value Procurement Report',
            key: 'ROLE_REPORT_APP_MICRO_PROCMNT',
          },
          {
            action: 'UnRegistered Procuring Entities Report',
            key: 'ROLE_REPORT_UAA_UNREGSTD_PE',
          },
          {
            action: 'General Procurement Notice - In District Level',
            key: 'ROLE_REPORT_APP_PBLSHD_GPN_DISTRCT',
          },
          {
            action: 'List of Non Active Procuring Entities',
            key: 'ROLE_REPORT_UAA_NONACTIVEPE',
          },
          {
            action: 'Procuring Entities That Have Not Published GPN',
            key: 'ROLE_REPORT_APP_NOTPUBLSHGPN',
          },
          {
            action: 'Awarded Tenders to Special Groups',
            key: 'ROLE_REPORT_UAA_AWRD_TNDR_SPCL_GRP',
          },
          {
            action: 'Awarded Tenderers Per Procurement Method',
            key: 'ROLE_REPORT_APP_AWARDEDTENDERERS',
          },
          {
            action: 'List of Registered Tenderers',
            key: 'ROLE_REPORT_UAA_LIST_RGSTRD_TENDRS',
          },
          {
            action: 'Awarded Tenders to Special Groups By Procuring Entities',
            key: 'ROLE_REPORT_UAA_AWRD_TNDR_SPCL_GRP_By_PEs',
          },
          {
            action: 'Procuring Entities That Published SPN',
            key: 'ROLE_REPORT_APP_PE_PUBLSHSPN',
          },
          {
            action: 'Tenders Specific To Special Group Report',
            key: 'ROLE_REPORT_APP_SPECIALGRP',
          },
          {
            action: 'Tenders Published in District Level',
            key: 'ROLE_REPORT_APP_PUBLISHED_TENDERDISTRICT',
          },
          {
            action: 'Awarded Tenders in District Level',
            key: 'ROLE_REPORT_APP_AWARDS_INDISTRICT',
          },
          {
            action: 'Tenders Published in Ministry Level',
            key: 'ROLE_REPORT_APP_PUBLISHED_TENDERMINISTRY',
          },
          {
            action: 'Awarded in Ministry Level Report',
            key: 'ROLE_REPORT_APP_AWARDSINMINISTRY',
          },
          {
            action: 'Qurterly Audit Report',
            key: 'ROLE_REPORT_APP_QTRLY_AUDT_RPT',
          },
          {
            action: 'Tenders Cancelled By Procuring Entity (PE)',
            key: 'ROLE_REPORT_APP_TNDR_CNCLD_BY_PE',
          },
          {
            action: 'Number Of Procuring Entity By PE Categories',
            key: 'ROLE_REPORT_APP_NMBR_OF_PE_BY_PECATEGRY',
          },
          {
            action: 'Average Cycle Time Report (Planned vs Actual)',
            key: 'ROLE_REPORT_AVG_CYCLE_TIME',
          },
          {
            action: 'Planned Tenders by Procuring Entity Categories',
            key: 'ROLE_REPORT_APP_PLNNED_TNDR_BY_CTGR',
          },
          {
            action: 'General Procurement Notice Summary Data For Specific Organization',
            key: 'ROLE_REPORT_APP_GPN_DT_SPCFC_PE',
          },
          {
            action: 'National Tenders Awarded to Local Firms',
            key: 'ROLE_REPORT_APP_NTNAL_TNDR_AWD_LC_FIRM',
          },
          {
            action: 'Specific Procurement Notice - Summary for Procuring Entity',
            key: 'ROLE_REPORT_APP_SPN_FOR_PE',
          },
          {
            action: 'Planned Awarded Budget For Non Cuis',
            key: 'ROLE_REPORT_APP_AWRD_BUDGT_NON_CUIS',
          },
          {
            action: 'Registered Procuring Entities in NeST',
            key: 'ROLE_REPORT_UAA_RGTRD_PE_IN_NEST',
          },
          {
            action: 'Awarded Local Fundi by Region',
            key: 'ROLE_REPORT_AWARD_AWRD_LOCAL_FUND',
          },
          {
            action: 'Client Wallet Balance Report',
            key: 'ROLE_REPORT_BILL_NEW_WLET_BLCE_RPT',
          },
          {
            action: 'Monthly/Yearly Procured Items (CUIS) Report',
            key: 'ROLE_REPORT_APP_MONTHLY_YEAR_CUIS_PROC',
          },
          {
            action: 'National Tenders Awarded To Local Firms',
            key: 'ROLE_REPORT_APP_AWARDEDTOLOCAL',
          },
        ],
        route: ['', 'modules', 'reports', 'all-reports'],
        icon: 'reports',
        iconType: 'SVG',
      },
      {
        name: 'All Reports(New)',
        authority: 'ROLE_RPRT_ALL_RPRTS_NEW',
        permission: [
          {
            key: 'ROLE_RPRT_ALL_RPRTS_NEW',
            action: 'view All reports',
          },
        ],
        route: ['', 'modules', 'reports', 'all-custom-reports'],
        icon: 'reports',
        iconType: 'SVG',
      },
      {
        name: 'Report Settings',
        key: 'settings',
        iconType: 'SVG',
        icon: 'settings',
        authority: 'ROLE_REPORT_SETTINGS',
        permission: [
          {
            key: 'ROLE_REPORT_SETTINGS',
            action: 'View Report Settings',
          },
        ],
        route: ['', 'modules', 'reports', 'settings'],
        children: [
          {
            name: 'Report Maker',
            authority: 'ROLE_REPORT_SETTINGS',
            permission: [
              { key: 'ROLE_REPORT_ENTITY_VIEW', action: 'View Report Entity' },
              {
                key: 'ROLE_REPORT_ENTITY_CREATE',
                action: 'Create Report Entity',
              },
              { key: 'ROLE_REPORT_ENTITY_EDIT', action: 'Edit Report Entity' },
              {
                key: 'ROLE_REPORT_ENTITY_DELETE',
                action: 'Delete Report Entity',
              },
            ],
            route: ['', 'modules', 'reports', 'settings', 'report-maker'],
          },
          {
            name: 'Report Entity',
            authority: 'ROLE_REPORT_ENTITY_VIEW',
            permission: [
              { key: 'ROLE_REPORT_ENTITY_VIEW', action: 'View Report Entity' },
              {
                key: 'ROLE_REPORT_ENTITY_CREATE',
                action: 'Create Report Entity',
              },
              { key: 'ROLE_REPORT_ENTITY_EDIT', action: 'Edit Report Entity' },
              {
                key: 'ROLE_REPORT_ENTITY_DELETE',
                action: 'Delete Report Entity',
              },
            ],
            route: ['', 'modules', 'reports', 'settings', 'report-entity'],
          },
          {
            name: 'Report Entity Column',
            authority: 'ROLE_REPORT_ENTITY_VIEW',
            permission: [
              {
                key: 'ROLE_REPORT_ENTITY_COLUMN_VIEW',
                action: 'View Report Entity Column',
              },
              {
                key: 'ROLE_REPORT_ENTITY_COLUMN_CREATE',
                action: 'Create Report Entity ',
              },
              {
                key: 'ROLE_REPORT_ENTITY_COLUMN_EDIT',
                action: 'Edit Report Entity Column',
              },
              {
                key: 'ROLE_REPORT_ENTITY_COLUMN_DELETE',
                action: 'Delete Report Entity Column',
              },
            ],
            route: [
              '',
              'modules',
              'reports',
              'settings',
              'report-entity-column',
            ],
          },
          {
            name: 'Report Group',
            authority: 'ROLE_REPORT_GROUP_VIEW',
            permission: [
              {
                key: 'ROLE_REPORT_GROUP_VIEW',
                action: 'View Report Group',
              },
              {
                key: 'ROLE_REPORT_GROUP_CREATE',
                action: 'Create Report Group ',
              },
              {
                key: 'ROLE_REPORT_GROUP_EDIT',
                action: 'Edit Report Group',
              },
              {
                key: 'ROLE_REPORT_GROUP_DELETE',
                action: 'Delete Report Group',
              },
            ],
            route: [
              '',
              'modules',
              'reports',
              'settings',
              'report-group',
            ],
          },
        ],
      },
      {
        name: 'Custom Reports',
        key: 'custom-reports',
        iconType: 'SVG',
        icon: 'reports',
        authority: 'ROLE_CUSTOM_REPORT_VIEW',
        permission: [
          {
            key: 'ROLE_CUSTOM_REPORT_VIEW',
            action: 'View Custom Report',
          },
          {
            key: 'ROLE_CUSTOM_REPORT_CREATE',
            action: 'Create Custom Report ',
          },
          {
            key: 'ROLE_CUSTOM_REPORT_EDIT',
            action: 'Edit Custom Report',
          },
          {
            key: 'ROLE_CUSTOM_REPORT_DELETE',
            action: 'Delete Custom Report',
          },
        ],
        route: ['', 'modules', 'reports', 'custom-report'],
      },
    ],
  },
];
