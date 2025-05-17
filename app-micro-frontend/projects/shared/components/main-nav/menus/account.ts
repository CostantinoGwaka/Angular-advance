import {MenuOption} from "../menu-options";

export const Account: MenuOption[] = [
  {
    name: 'Account',
    shortName: 'Account',
    authority: 'ROLE_MODULE_ACCOUNT',
    permission: [
      {key:'ROLE_MODULE_ACCOUNT', action: 'View Account'},
      {key:'ROLE_MODULE_ACCOUNT_MNG_DPTY_AC_OFCR', action: 'Manage Deputy Accounting Officer'},
    ],
    route: ['', 'modules', 'account', 'profile'],
    pathRoute: ['', 'modules', 'account', 'profile'],
    description: 'Account Profile details',
    icon: 'user_account',
    iconType: 'SVG',
    children: [
      {
        name: 'Profile',
        authority:"ROLE_ACCOUNT_PROFILE",
        permission: [{key:'ROLE_ACCOUNT_PROFILE',action:'View Profile'}],
        route: ['', 'modules', 'account', 'profile'],
        icon: 'user_account',
        iconType: 'SVG',
      },
      {
        name: 'Hand Over',
        authority:"ROLE_ACCOUNT_HAND_OVER",
        permission: [{key:'ROLE_ACCOUNT_HAND_OVER',action:'View hand over'}],
        route: ['', 'modules', 'account', 'handover'],
        icon: 'handover',
        iconType: 'SVG',
      },
      {
        name: 'Digital Signature',
        authority:"ROLE_ACCOUNT_DIGITAL_SIGNATURE",
        permission: [{key:'ROLE_ACCOUNT_DIGITAL_SIGNATURE',action:'View digital signature'}],
        route: ['', 'modules', 'account'],
        icon: 'closed_lock',
        iconType: 'SVG',
        children: [
          {
            name: 'Verify Document',
            authority:"ROLE_ACCOUNT_VERIFY_DOCUMENT",
            permission: [{key:'ROLE_ACCOUNT_VERIFY_DOCUMENT',action:'View verify document'}],
            route: ['', 'modules', 'account', 'verify-document'],
          },
          {
            name: 'Test Digital Signature',
            authority:"ROLE_ACCOUNT_TEST_DIGITAL_SIGNATURE",
            permission: [{key:'ROLE_ACCOUNT_TEST_DIGITAL_SIGNATURE',action:'View test digital signature'}],
            route: ['', 'modules', 'account', 'test-digital-signature'],
          },
          {
            name: 'Change Key Phrase',
            authority:"ROLE_ACCOUNT_CHANGE_KEY_PHRASE",
            permission: [{key:'ROLE_ACCOUNT_CHANGE_KEY_PHRASE',action:'View key phrase'}],
            route: ['', 'modules', 'account', 'change-key-phrase'],
          },
        ],
      },
    ],
  }
]
