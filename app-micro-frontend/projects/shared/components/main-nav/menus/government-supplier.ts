import {MenuOption} from "../menu-options";

export const GovernmentProvider: MenuOption[] = [
  {
    name: 'Government Services',
    shortName: 'Government Services',
    authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER',
    permission: [
      {
        key: "ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER",
        action: "Government Service Provider"
      }
    ],
    route: ['', 'modules', 'government-supplier'],
    pathRoute: ['', 'modules', 'government-supplier', 'dashboard'],
    description: 'Government to Government Business',
    icon: 'cartGovernment',
    iconType: 'SVG',
    children: [
      {
        name: 'Dashboard',
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DASH',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DASH', action: 'View Government Service Provider'}
        ],
        route: ['', 'modules', 'government-supplier', 'dashboard'],
        icon: 'dashboard',
        iconType: 'MATERIAL',
      },
      {
        name: 'Orders',
        key: 'pe-order',
        permission: [
          {
            key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_MN',
            action: 'Order from PE to Government Service Provider menu'
          },
        ],
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_MN',
        route: ['', 'modules', 'government-supplier', 'pe-order'],
        shortName: 'Orders',
        icon: 'shopping_cart',
        iconType: 'MATERIAL',
        children: [
          // TODO children link for gsp users
          {
            name: 'Initiation',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS',
            permission: [
              {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS', action: 'List of initiated orders (PE side)'},
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_VIEW',
                action: 'View order from PE to Government Service Provider'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_CRT',
                action: 'Create order from PE to Government Service Provider'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_EDT',
                action: 'Edit order from PE to Government Service Provider'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_DLT',
                action: 'Delete order from PE to Government Service Provider'
              },


            ],
            route: ['', 'modules', 'government-supplier', 'pe-order', 'pending'],
          },
          {
            name: 'On Progress',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_ON_PRGRS',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_ON_PRGRS',
                action: 'List of on progress orders (PE side)'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'pe-order', 'on-progress'],
          },
          {
            name: 'Submitted',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_SBMTTD',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_SBMTTD',
                action: 'List of submitted orders (PE side)'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'pe-order', 'submitted'],
          },
          {
            name: 'Completed',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_CMPLTD',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDERS_CMPLTD',
                action: 'List of completed orders (PE side)'
              },

            ],
            route: ['', 'modules', 'government-supplier', 'pe-order', 'completed'],
          },
          {
            name: 'Department Order (All)',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ALL_DPRTMNT_ORDERS',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ALL_DPRTMNT_ORDERS',
                action: 'List of department orders (all)'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ALL_DPRTMNT_ORDERS_RGNRT_DOC',
                action: 'Regenerate order document'
              },

            ],
            route: ['', 'modules', 'government-supplier', 'pe-order', 'all'],
          }
        ]
      },

      {
        name: 'Order Task',
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDER_TASKS',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_ORDER_TASKS', action: 'View order task'},
        ],
        route: ['', 'modules', 'government-supplier', 'pe-order-task'],
        icon: 'shopping_cart',
        iconType: 'MATERIAL',
      },
      {
        name: 'GSP Received Order',
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_GSP_RCVD_ORDRS',
        permission: [
          {
            key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_GSP_RCVD_ORDRS',
            action: 'List of Order received by Government Service Provider'
          },
        ],
        route: ['', 'modules', 'government-supplier', 'gsp-received-order'],
        icon: 'shopping_cart',
        iconType: 'MATERIAL',
      },
      {
        name: 'Delivery Advise (GSP)',
        key: 'delivery-advise-gsp',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_MN', action: 'Delivery advise for GSP menu'},
        ],
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_MN',
        route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp'],
        shortName: 'Delivery Advise',
        icon: 'shopping_cart',
        iconType: 'MATERIAL',
        children: [
          // TODO children link for gsp users
          {
            name: 'Initiation',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_DRFTD',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_DRFTD',
                action: 'List of draft delivery advise generated by service provider'
              },
              {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_CRT', action: 'Create delivery advise'},
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'draft'],
          },
          {
            name: 'Rejected',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_RJCTD',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_RJCTD',
                action: 'List of rejected delivery advise by pe to service provider'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'rejected'],
          },
          {
            name: 'Confirmed',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_CNFRMD',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_CNFRMD',
                action: 'List of confirmed delivery advise by pe to government service provider'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_ACCNTNT_ACT',
                action: 'Send delivery advise that are waiting for accountant confirmation (government service provider)'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'confirmed'],
          },
          {
            name: 'Accountant Confirmation',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_ACCNTNT_LST',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_ACCNTNT_LST',
                action: 'List of delivery advise waiting for accountant confirmation (government service provider)'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_GSP_ACCNTNT_PRCS',
                action: 'Process delivery advise that are waiting for accountant confirmation (government service provider)'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_CNTRCT',
                action: 'Generate government service contract'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'gsp-accountant-confirmation'],
          },
          {
            name: 'Waiting for payment approval',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_WAT_FR_PTMNT',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_WAT_FR_PTMNT',
                action: 'List of delivery advise waiting for payments by pe to government service provider'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_WAT_FR_PTMNT_CNFRM_PYMNT',
                action: 'Confirm delivery advise that are waiting for payments by government service provider'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'wait-for-payment'],
          },
          {
            name: 'Payment Confirmed',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PYMNT_CNFRMD',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PYMNT_CNFRMD',
                action: 'List of delivery advise that its payments  has been confirmed by service provider'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'payment-confirmed'],
          },
          {
            name: 'All',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS',
                action: 'List of all delivery advise generated by service provider'
              },

            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise-gsp', 'all'],
          },
        ]
      },
      {
        name: 'Delivery Advise (PE)',
        key: 'delivery-advise',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_MN', action: 'Delivery advise menu'},
        ],
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_MN',
        route: ['', 'modules', 'government-supplier', 'delivery-advise'],
        shortName: 'Delivery Advise',
        icon: 'shopping_cart',
        iconType: 'MATERIAL',
        children: [
          // TODO: list for PE
          {
            name: 'Await Confirmation',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_CNFRMTN',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_CNFRMTN',
                action: 'List of delivery advise await for PE Confirmation'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_CNFRMTN_CNFRM',
                action: 'Confirm or Reject delivery advise await for PE Confirmation'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise', 'await-confirmation'],
          },
          {
            name: 'Await Payment',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_PYMT',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_PYMT',
                action: 'List of delivery advise await for payment (PE)'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_AWIT_PYMT_CNFRM',
                action: 'Confirm delivery advise await for payment Confirmation (PE)'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise', 'await-payment'],
          },
          {
            name: 'All Advises',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_ALL',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_ALL',
                action: 'List of delivery advise of the procuring entity'
              }
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise', 'pe-all-delivery-advise'],
          },
          {
            name: 'All Advises (Department)',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_DPTMNT_ALL',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_ADVS_PE_DPTMNT_ALL',
                action: 'List of delivery advise of the procuring entity'
              }
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-advise', 'pe-all-delivery-advise-department'],
          },
        ]
      },
      {
        name: 'Delivery Note',
        key: 'delivery-note',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_MN', action: 'Delivery note menu'},
        ],
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_MN',
        route: ['', 'modules', 'government-supplier', 'delivery-note'],
        shortName: 'Delivery Note',
        icon: 'shopping_cart',
        iconType: 'MATERIAL',
        children: [
          // TODO children link for gsp users
          {
            name: 'Draft',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_DRFT',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_DRFT',
                action: 'List of draft delivery note generated by service provider'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_DRFT_MNG',
                action: 'Manage of delivery note generated by service provider'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-note', 'draft'],
          },
          {
            name: 'All',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT',
                action: 'List of all delivery note generated by service provider'
              },

            ],
            route: ['', 'modules', 'government-supplier', 'delivery-note', 'all'],
          },
          // TODO: list for PE
          {
            name: 'Await Delivery Confirmation',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_AWIT_CNFRMTN',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_AWIT_CNFRMTN',
                action: 'List of delivery note await for PE Confirmation'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_AWIT_CNFRMTN_CNFRM',
                action: 'Confirm or Reject delivery note await for PE Confirmation'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-note', 'await-delivery-confirmation'],
          },
          {
            name: 'Await User Department Confirmation',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_USR_AWIT_CNFRMTN',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_USR_AWIT_CNFRMTN',
                action: 'List of delivery note await for PE Confirmation'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_USR_AWIT_CNFRMTN_INSPCT',
                action: 'Manage delivery note inspection'
              },
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_USR_AWIT_CNFRMTN_CNFRM',
                action: 'Confirm or Reject delivery note await for PE Department User Confirmation'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-note', 'await-user-department-delivery-confirmation'],
          },
          {
            name: 'Confirmed Delivery',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_CNFRM_DLVRY',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_CNFRM_DLVRY',
                action: 'List of confirmed delivery note for PE'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-note', 'confirmed-delivery-note'],
          },
          {
            name: 'All',
            authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_ALL_DLVRY_NT',
            permission: [
              {
                key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_DLVRY_NT_PE_ALL_DLVRY_NT',
                action: 'PE - List of all delivery note of PE'
              },
            ],
            route: ['', 'modules', 'government-supplier', 'delivery-note', 'pe-all-delivery-note'],
          },
        ]
      },
      {
        name: 'Services Management',
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_CATALOG',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_CATALOG_CREATE', action: 'Create Service Catalog'},
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_CATALOG_EDIT', action: 'Edit Service Catalog'},
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_CATALOG_DELETE', action: 'Delete Service Catalog'},
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_CATALOG', action: 'View Service Catalog'},
          {key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_INVENTORY_CHANGE', action: 'Change Government Service Inventory'}
        ],
        route: ['', 'modules', 'government-supplier', 'government-catalog'],
        icon: 'list',
        iconType: 'SVG',
      },
      {
        name: 'Wallets Management',
        authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_WALLET',
        permission: [
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_WALLET_CREATE', action: 'Create wallet'},
          {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_WALLET_EDIT', action: 'Edit wallet'},
        ],
        route: ['', 'modules', 'government-supplier', 'wallets-managements'],
        icon: 'money_wallet',
        iconType: 'SVG',
      },
      // {
      //   name: 'Users Management',
      //   authority: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_USERS',
      //   permission: [
      //     { key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_USERS_CREATE', action: 'Create User Service Catalog' },
      //     { key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_USERS_EDIT', action: 'Edit User Service Catalog' },
      //     { key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_USERS_DELETE', action: 'Delete User Service Catalog' },
      //     { key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_USERS', action: 'View User Service Catalog' }
      //   ],
      //   route: ['', 'modules', 'government-supplier', 'government-users'],
      //   icon: 'users',
      //   iconType: 'SVG',
      // },
      // {
      //   name: 'Settings',
      //   key: 'settings',
      //   authority: "ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_SETTINGS",
      //   permission: [{key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER', action: 'View government service settings'}],
      //   route: ['', 'modules', 'government-supplier', 'settings'],
      //   icon: 'settings',
      //   children: [
      //     {
      //       name: 'Mapped SOR Service',
      //       authority: "ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_MAPPED_SOR_SRV",
      //       permission: [
      //         {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_MAPPED_SOR_SRV', action: 'View mapped SOR - service based on user department'},
      //       ],
      //       route: ['', 'modules', 'government-supplier', 'settings', 'mapped-sor-service'],
      //     },
      //     {
      //       name: 'SOR Service Mapping',
      //       authority: "ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_SOR_SRV_MPPNG",
      //       permission: [
      //         {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_SOR_SRV_MPPNG', action: 'View SOR service mapping'},
      //         {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_SOR_SRV_MPPNG_CREATE', action: 'Add SOR service mapping'},
      //         {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_SOR_SRV_MPPNG_EDIT', action: 'Edit SOR service mapping'},
      //         {key: 'ROLE_MODULES_GOVERNMENT_SERVICE_PROVIDER_SOR_SRV_MPPNG_DELETE', action: 'Delete SOR service mapping'}
      //       ],
      //       route: ['', 'modules', 'government-supplier', 'settings', 'sor-service-mapping'],
      //     }
      //   ]
      // }
    ],
  }
]
