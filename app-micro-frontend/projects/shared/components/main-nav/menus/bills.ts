import { MenuOption } from "../menu-options";

export const Bills: MenuOption[] = [
  {
    name: 'Billing Service',
    shortName: 'Billing Service',
    route: ['', 'modules', 'bills'],
    pathRoute: ['', 'modules', 'bills', 'bills-wallet'],
    description: 'Manage All bills and payment services',
    icon: 'credit_card',
    authority: "ROLE_MODULES_BIL_SRVC",
    iconType: 'SVG',
    permission: [
      {
        key: "ROLE_MODULES_BIL_SRVC",
        action: "View billing service"
      }
    ],
    children: [

      {
        name: 'Billing',
        authority: "ROLE_BIL_SRVC_WALLET",
        permission: [
          {
            key: "ROLE_BIL_SRVC_WALLET",
            action: "View Billing Details"
          }
        ],
        route: ['', 'modules', 'bills', 'bills-wallet'],
        icon: 'money_wallet',
        iconType: 'SVG',
      },

      {
        name: 'Accounts',
        authority: "ROLE_BIL_SRVC_ACCOUNT",
        permission: [
          {
            key: "ROLE_BIL_SRVC_ACCOUNT",
            action: "View accounts "
          }
        ],
        route: ['', 'modules', 'bills', 'bills-accounts'],
        icon: 'wallet_account',
        iconType: 'SVG',
      },
      {
        name: 'Transactions',
        authority: "ROLE_BIL_SRVC_TRNSTN",
        permission: [
          {
            key: "ROLE_BIL_SRVC_TRNSTN",
            action: "View all transactions (PPRA)"
          }
        ],
        route: ['', 'modules', 'bills', 'transactions'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'Reconciliation',
        authority: "ROLE_BIL_SRVC_RECNCLTN",
        permission: [
          {
            key: "ROLE_BIL_SRVC_RECNCLTN",
            action: "View reconciliation"
          },
          {
            key: "ROLE_BIL_SRVC_RECNCLTN_REC_PYMT",
            action: "Reconcile payment (for ppra administrator)"
          }
        ],
        route: ['', 'modules', 'bills', 'reconciliation'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'Revoke Reconciliation',
        authority: "ROLE_BIL_SRVC_RECNCLTN",
        permission: [
          {
            key: "ROLE_BIL_SRVC_RECNCLTN",
            action: "View test reconciliation"
          },
          {
            key: "ROLE_BIL_SRVC_RECNCLTN_REC_PYMT",
            action: "Reconcile payment Test(for ppra administrator)"
          }
        ],
        route: ['', 'modules', 'bills', 'test-reconciliation'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'Bill Payments',
        authority: "ROLE_BIL_SRVC_BLL_PYMNT",
        permission: [
          {
            key: "ROLE_BIL_SRVC_BLL_PYMNT",
            action: "View bill payments"
          }
        ],
        route: ['', 'modules', 'bills', 'bill-payments'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'Paid Bills',
        authority: "ROLE_BIL_SRVC_PAID_BLL",
        permission: [
          {
            key: "ROLE_BIL_SRVC_PAID_BLL",
            action: "View pe paid bills"
          }
        ],
        route: ['', 'modules', 'bills', 'paid-bills'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'Pending Bills',
        authority: "ROLE_BIL_SRVC_PNDG_BLL",
        permission: [
          {
            key: "ROLE_BIL_SRVC_PNDG_BLL",
            action: "View pe pending bills"
          },
          {
            key: "ROLE_BIL_SRVC_STTL_PNDG_BLL",
            action: "Settle pending bills"
          }
        ],
        route: ['', 'modules', 'bills', 'pending-bills'],
        icon: 'transcations',
        iconType: 'SVG',
      },

      {
        name: 'CUIS Tender Paid Bills',
        authority: "ROLE_BIL_SRVC_TNDR_PAID_BLL",
        permission: [
          {
            key: "ROLE_BIL_SRVC_TNDR_PAID_BLL",
            action: "View all tender paid bills (PPRA)"
          }
        ],
        route: ['', 'modules', 'bills', 'tender-paid-bills'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'CUIS Lower Level Paid Bills',
        authority: "ROLE_BIL_SRVC_LWR_LVL_PAID_BLL",
        permission: [
          {
            key: "ROLE_BIL_SRVC_LWR_LVL_PAID_BLL",
            action: "View all lower level paid bills (PPRA)"
          }
        ],
        route: ['', 'modules', 'bills', 'lower-level-paid-bills'],
        icon: 'transcations',
        iconType: 'SVG',
      },
      {
        name: 'Taneps Payments',
        authority: "ROLE_BIL_SRVC_TANEPS_BLL",
        permission: [
          {
            key: "ROLE_BIL_SRVC_TANEPS_BLL",
            action: "View Taneps payments"
          },
          {
            key: "ROLE_BIL_SRVC_TANEPS_BLL_CRT",
            action: "Create Taneps payment"
          }
        ],
        route: ['', 'modules', 'bills', 'taneps-bills'],
        icon: 'taneps_payments',
        iconType: 'SVG',
      },
      {
        name: 'Custom Bill',
        authority: "ROLE_BIL_SRVC_CUSTOM_BLL",
        permission: [
          {
            key: "ROLE_BIL_SRVC_CUSTOM_BLL",
            action: "View Custom bill"
          },
          { key: "ROLE_BIL_SRVC_CUSTOM_BLL_CRT", action: "Create Custom payment" },
          { key: "ROLE_BIL_SRVC_CUSTOM_BLL_EDT", action: "Edit Custom payment" },
          { key: "ROLE_BIL_SRVC_CUSTOM_BLL_DLT", action: "Delete Custom payment" },
        ],
        route: ['', 'modules', 'bills', 'custom-bills'],
        icon: 'custom_bill',
        iconType: 'SVG',
      },
      {
        name: 'User Balance Transfer',
        authority: "ROLE_BIL_USR_BLNC_TRNSFR",
        permission: [
          { key: "ROLE_BIL_USR_BLNC_TRNSFR", action: "View users balance transfer" },
        ],
        route: ['', 'modules', 'bills', 'users-balance-transfer'],
        icon: 'custom_bill',
        iconType: 'SVG',
        children: [
          {
            name: 'Authority Balance Transfer',
            authority: "ROLE_BIL_USR_BLNC_TRNSFR_BY_PPRA",
            permission: [
              { key: "ROLE_BIL_USR_BLNC_TRNSFR_BY_PPRA", action: "View users balance transferred by PPRA" },
              { key: "ROLE_BIL_USR_BLNC_TRNSFR_BY_PPRA_CRT", action: "Create user balance transfer (PPRA)" },
            ],
            route: ['', 'modules', 'bills', 'users-balance-transfer', 'ppra'],
          },
          {
            name: 'User balance Transfer',
            authority: "ROLE_BIL_USR_BLNC_TRNSFR_BY_USR",
            permission: [
              { key: "ROLE_BIL_USR_BLNC_TRNSFR_BY_USR", action: "View users balance transfer" },
            ],
            route: ['', 'modules', 'bills', 'users-balance-transfer', 'user'],
          },
        ]
      },
      {
        name: 'Balance Transfer',
        key: 'balance_transfer',
        iconType: 'SVG',
        icon: 'settings',
        authority: "ROLE_BIL_BLNC_TRNSFR",
        permission: [
          {
            key: "ROLE_BIL_BLNC_TRNSFR",
            action: "View Balance Transfer"
          }
        ],
        route: ['', 'modules', 'bills', 'balance-transfer'],
        children: [
          {
            name: 'All Requests',
            authority: "ROLE_BIL_BLNC_TRNSFR_ALL",
            permission: [
              { key: "ROLE_BIL_BLNC_TRNSFR_ALL", action: "View balance transfer all request" },
            ],
            route: ['', 'modules', 'bills', 'balance-transfer', 'all'],
          },
          {
            name: 'Transfer Requests',
            authority: "ROLE_BIL_BLNC_TRNSFR_SBMTD",
            permission: [
              { key: "ROLE_BIL_BLNC_TRNSFR_SBMTD", action: "View balance transfer request" },
              { key: "ROLE_BIL_BLNC_TRNSFR_SBMTD_CRT", action: "Create balance transfer request to AO" },
              { key: "ROLE_BIL_BLNC_TRNSFR_SBMTD_REQST_FND", action: "Send fund request to another PE-AO" },
            ],
            route: ['', 'modules', 'bills', 'balance-transfer', 'submitted'],
          },
          {
            name: 'Waiting for approval Requests',
            authority: "ROLE_BIL_BLNC_TRNSFR_WFAR",
            permission: [
              { key: "ROLE_BIL_BLNC_TRNSFR_WFAR", action: "View waiting for approval balance transfer request" },
              { key: "ROLE_BIL_BLNC_TRNSFR_WFAR_ATTND", action: "Attend waiting for approval balance transfer request" },
            ],
            route: ['', 'modules', 'bills', 'balance-transfer', 'waiting-for-approval'],
          },
        ]
      },
      {
        name: 'Taneps Balance Transfer',
        key: 'taneps_balance_transfer',
        iconType: 'SVG',
        icon: 'settings',
        authority: "ROLE_BIL_TNPS_BLNC_TRNSFR",
        permission: [
          {
            key: "ROLE_BIL_TNPS_BLNC_TRNSFR",
            action: "View Taneps Balance Transfer"
          },
          {
            key: "ROLE_BIL_TNPS_BLNC_TRNSFR_CRT",
            action: "Create Taneps Balance Transfer"
          }
        ],
        route: ['', 'modules', 'bills', 'taneps-balance-transfer'],
      },
      {
        name: 'Services Charges',
        key: 'charges_services',
        iconType: 'SVG',
        icon: 'settings',
        authority: "ROLE_BIL_SRVC_CHARGES",
        permission: [
          {
            key: "ROLE_BIL_SRVC_CHARGES",
            action: "View Service Charges"
          }
        ],
        route: ['', 'modules', 'bills', 'services-charges'],
        children: [
          {
            name: 'GPN Charges',
            authority: "ROLE_BIL_SRVC_GPN_CHARGES",
            permission: [
              { key: "ROLE_BIL_SRVC_GPN_CHARGES", action: "View GPN Charges" },
            ],
            route: ['', 'modules', 'bills', 'services-charges', 'gpn-charges'],
          },
          {
            name: 'SPN Charges',
            authority: "ROLE_BIL_SRVC_SETTINGS_PYC",
            permission: [
              { key: "ROLE_BIL_SRVC_SPN_CHARGES", action: "View SPN Charges" },
            ],
            route: ['', 'modules', 'bills', 'services-charges', 'spn-charges'],
          },
        ],
      },
      {
        name: 'Bills',
        authority: "ROLE_BIL_SRVC_BILLS",
        permission: [
          {
            key: "ROLE_BIL_SRVC_BILLS",
            action: "View bills"
          },
          {
            key: "ROLE_BIL_SRVC_BILLS_RVK_BLLS",
            action: "Revoke bills"
          },
          {
            key: "ROLE_BIL_SRVC_BILLS_DLT_BLLS",
            action: "Delete bill"
          }
        ],
        route: ['', 'modules', 'bills', 'all-bills'],
        icon: 'bill_receipts',
        iconType: 'SVG',
      },
      {
        name: 'Refunded Transactions',
        authority: "ROLE_BIL_SRVC_RFNDED_TRNSCTN",
        permission: [
          {
            key: "ROLE_BIL_SRVC_RFNDED_TRNSCTN",
            action: "View refunded transactions"
          }
        ],
        route: ['', 'modules', 'bills', 'refunded-transaction'],
        icon: 'bill_receipts',
        iconType: 'SVG',
      },
      {
        name: 'Reversed GePG payment',
        authority: "ROLE_BIL_SRVC_RVS_GEPG_PYMNT",
        permission: [
          {
            key: "ROLE_BIL_SRVC_RVS_GEPG_PYMNT",
            action: "View reversed GePG payments"
          }
        ],
        route: ['', 'modules', 'bills', 'reversed-gepg-payment'],
        icon: 'bill_receipts',
        iconType: 'SVG',
      },
      {
        name: 'Waivers',
        authority: "ROLE_BIL_SRVC_WAIVERS",
        permission: [
          {
            key: "ROLE_BIL_SRVC_WAIVERS",
            action: "View waivers"
          },
          {
            key: "ROLE_BIL_SRVC_WAIVERS_ACTVT_DACTV",
            action: "Activate or deactivate waiver"
          }
        ],
        route: ['', 'modules', 'bills', 'waivers'],
        icon: 'waiver',
        iconType: 'SVG',
      },
      {
        name: 'Settings',
        key: 'settings',
        iconType: 'SVG',
        icon: 'settings',
        authority: "ROLE_BIL_SRVC_SETTINGS",
        permission: [
          {
            key: "ROLE_BIL_SRVC_SETTINGS",
            action: "View settings"
          }
        ],
        route: ['', 'modules', 'bills', 'settings'],
        children: [
          {
            name: 'Payment Code',
            authority: "ROLE_BIL_SRVC_SETTINGS_PYC",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_PYC", action: "View payment code" },
              { key: "ROLE_BIL_SRVC_SETTINGS_PYC_CRT", action: "Create payment code" },
              { key: "ROLE_BIL_SRVC_SETTINGS_PYC_EDT", action: "Edit payment code" },
              { key: "ROLE_BIL_SRVC_SETTINGS_PYC_DLT", action: "Delete payment code" }
            ],
            route: ['', 'modules', 'bills', 'settings', 'payment-code'],
          },
          {
            name: 'Fee Version',
            authority: "ROLE_BIL_SRVC_SETTINGS_FEVRSN",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_FEVRSN", action: "View fee version" },
              { key: "ROLE_BIL_SRVC_SETTINGS_FEVRSN_CRT", action: "Create fee version" },
              { key: "ROLE_BIL_SRVC_SETTINGS_FEVRSN_EDT", action: "Edit fee version" },
              { key: "ROLE_BIL_SRVC_SETTINGS_FEVRSN_DLT", action: "Delete fee version" }
            ],
            route: ['', 'modules', 'bills', 'settings', 'fee-version'],
          },
          {
            name: 'Services to Bill',
            authority: "ROLE_BIL_SRVC_SETTINGS_SERV_TO_BILL",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_SERV_TO_BILL", action: "View service to bill" },
              { key: "ROLE_BIL_SRVC_SETTINGS_SERV_TO_BILL_CRT", action: "Create service to bill" },
              { key: "ROLE_BIL_SRVC_SETTINGS_SERV_TO_BILL_EDT", action: "Edit service to bill" },
              { key: "ROLE_BIL_SRVC_SETTINGS_SERV_TO_BILL_DLT", action: "Delete service to bill" },
            ],
            route: ['', 'modules', 'bills', 'settings', 'services'],
          },
          {
            name: 'Charge Category',
            authority: 'ROLE_BIL_SRVC_SETTINGS_CHRG_VW_CHRG_CTGY',
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_CHRG_VW_CHRG_CTGY", action: "View charge category" },
              { key: "ROLE_BIL_SRVC_SETTINGS_CHRG_ADD_CHRG_CTGY", action: "Add charge category" },
              { key: "ROLE_BIL_SRVC_SETTINGS_CHRG_EDT_CHRG_CTGY", action: "Edit charge category" },
              { key: "ROLE_BIL_SRVC_SETTINGS_CHRG_DLT_CHRG_CTGY", action: "Delete charge category" }
            ],
            route: ['', 'modules', 'bills', 'settings', 'charge-category'],
          },
          {
            name: 'PE Charge Category',
            authority: "ROLE_BIL_SRVC_SETTINGS_PE_CHRG_CTG",
            permission: [
              { key: 'ROLE_BIL_SRVC_SETTINGS_PE_CHRG_CTG', action: 'View PE charge category' },
              { key: 'ROLE_BIL_SRVC_SETTINGS_PE_CHRG_CTG_EDT', action: 'Edit PE charge category' },
              { key: 'ROLE_BIL_SRVC_SETTINGS_PE_CHRG_CTG_CRT', action: 'Create PE charge category' },
              { key: 'ROLE_BIL_SRVC_SETTINGS_PE_CHRG_CTG_DLT', action: 'Delete PE charge category' },
            ],
            route: ['', 'modules', 'bills', 'settings', 'pe-charge-category'],
            icon: 'category',
            iconType: 'MATERIAL',
          },
          // {
          //   name: 'Charge Type',
          //   authority:"ROLE_BIL_SRVC_SETTINGS_CHRG_TYP",
          //   permission: [
          //     {
          //       key: "ROLE_BIL_SRVC_SETTINGS_CHRG_TYP",
          //       action: "View charge type"
          //     }
          //   ],
          //   route: ['', 'modules', 'bills', 'settings', 'charge-type'],
          // },
          // {
          //   name: 'Billing Charges',
          //   authority:"ROLE_BIL_SRVC_SETTINGS_BILLNG_CHRG",
          //   permission: [
          //     {
          //       key: "ROLE_BIL_SRVC_SETTINGS_BILLNG_CHRG",
          //       action: "View billing charges"
          //     }
          //   ],
          //   route: ['', 'modules', 'bills', 'settings', 'billing-charge'],
          // },

          // {
          //   name: 'Bundle Charges',
          //   authority:"ROLE_BIL_SRVC_SETTINGS_BUNDLE_CHRG",
          //   permission: [
          //     {
          //       key: "ROLE_BIL_SRVC_SETTINGS_BUNDLE_CHRG",
          //       action: "View bundle charges"
          //     }
          //   ],
          //   route: ['', 'modules', 'bills', 'settings', 'bundle-charge'],
          // },
          {
            name: 'Tender Application Charges',
            authority: "ROLE_BIL_SRVC_SETTINGS_PROCUREMENT_CHRG",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_PROCUREMENT_CHRG", action: "View tender application charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_PROCUREMENT_CHRG_CRT", action: "Create tender application charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_PROCUREMENT_CHRG_EDT", action: "Edit tender application charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_PROCUREMENT_CHRG_DLT", action: "Delete tender application charges" },
            ],
            route: ['', 'modules', 'bills', 'settings', 'tender-application-charges'],
          },
          {
            name: 'Tenderer Registration Charges',
            authority: "ROLE_BIL_SRVC_SETTINGS_TNDRR_TYP_CHRG",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_TNDRR_TYP_CHRG", action: "View tenderer registration charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_TNDRR_TYP_CHRG_CRT", action: "Create tenderer registration charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_TNDRR_TYP_CHRG_EDT", action: "Edit tenderer registration charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_TNDRR_TYP_CHRG_DLT", action: "Delete tenderer registration charges" },
            ],
            route: ['', 'modules', 'bills', 'settings', 'tenderer-registration-charges'],
          },
          {
            name: 'SPN Charges',
            authority: "ROLE_BIL_SRVC_SETTINGS_SPN_CHRG",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_SPN_CHRG", action: "View SPN charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_SPN_CHRG_CRT", action: "Create SPN charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_SPN_CHRG_EDT", action: "Edit SPN charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_SPN_CHRG_DLT", action: "Delete SPN charges" },
            ],
            route: ['', 'modules', 'bills', 'settings', 'spn-charges'],
          },
          {
            name: 'GPN Charges',
            authority: "ROLE_BIL_SRVC_SETTINGS_GPN_CHRG",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_GPN_CHRG", action: "View GPN charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_GPN_CHRG_CRT", action: "Create GPN charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_GPN_CHRG_EDT", action: "Edit GPN charges" },
              { key: "ROLE_BIL_SRVC_SETTINGS_GPN_CHRG_DLT", action: "Delete GPN charges" },
            ],
            route: ['', 'modules', 'bills', 'settings', 'gpn-charges'],
          },
          {
            name: 'Global Setting',
            authority: "ROLE_BIL_SRVC_SETTINGS_GLB_STTNG",
            permission: [
              { key: "ROLE_BIL_SRVC_SETTINGS_GLB_STTNG", action: "View global setting" },
              { key: "ROLE_BIL_SRVC_SETTINGS_GLB_STTNG_CRT", action: "Create global setting" },
              { key: "ROLE_BIL_SRVC_SETTINGS_GLB_STTNG_EDT", action: "Edit global setting" },
              // {key: "ROLE_BIL_SRVC_SETTINGS_GLB_STTNG_DLT", action: "Delete global setting"},
            ],
            route: ['', 'modules', 'bills', 'settings', 'billing-global-settings'],
          },
          // {
          //   name: 'Procurement Volume Charges',
          //   authority:"ROLE_BIL_SRVC_SETTINGS_PRCRMNT_VLM_CHRG",
          //   permission: [
          //     {
          //       key: "ROLE_BIL_SRVC_SETTINGS_PRCRMNT_VLM_CHRG",
          //       action: "View procurement volume charges"
          //     }
          //   ],
          //   route: ['', 'modules', 'bills', 'settings', 'procurement-volume-charges'],
          // },

          // {
          //   name: 'Waiver Type',
          // permission: [],
          // route: ['', 'modules', 'bills', 'settings', 'waiver-type'],
          // },
        ],
      },

    ],
  }
]
