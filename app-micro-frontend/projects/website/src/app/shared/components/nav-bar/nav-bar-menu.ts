export interface NavBarMenu {
  translation_key?: string;
  id: string;
  link?: string;
  href?: string;
  queryParams?: any;
  icon?: any;
  children?: NavBarMenu[];
  isExpanded?: boolean;
}

const publishedTendersLink = '/tenders/published-tenders';

export const navBarMenu: NavBarMenu[] = [
  {
    translation_key: 'HOME',
    id: 'home',
    link: '/',
  },
  {
    translation_key: 'TENDERS',
    id: 'tenders',
    link: publishedTendersLink,
    children: [
      {
        translation_key: 'All Tenders',
        id: 'ALL_TENDERS',
        link: publishedTendersLink,
      },
      {
        translation_key: 'GOODS_TENDERS',
        id: 'GOODS_TENDERS',
        link: publishedTendersLink,
        queryParams: { category: 'G' },
      },
      {
        translation_key: 'WORKS_TENDERS',
        id: 'WORKS_TENDERS',
        link: publishedTendersLink,
        queryParams: { category: 'W' },
      },
      {
        translation_key: 'CONSULTANCY_TENDERS',
        id: 'CONSULTANCY_TENDERS',
        link: publishedTendersLink,
        queryParams: { category: 'C' },
      },
      {
        translation_key: 'NON_CONSULTANCY_TENDERS',
        id: 'NON_CONSULTANCY_TENDERS',
        link: publishedTendersLink,
        queryParams: { category: 'NC' },
      },
      {
        translation_key: null,
        id: 'DIVIDER',
      },
      {
        translation_key: 'CURRENT_OPENING',
        id: 'OPENED_TENDERS',
        link: '/tenders/opened-tenders',
      },
      {
        translation_key: 'AWARDED_CONTRACTS',
        id: 'AWARDED_TENDERS',
        link: '/tenders/awarded-tenders',
      },
      {
        translation_key: 'Specia Groups',
        id: 'SPECIAL_GROUPS',
        link: '/special-groups',
      },
    ],
  },
  {
    translation_key: 'PROCURING_ENTITIES',
    id: 'PROCURING_ENTITIES',
    link: '/procuring-entities',
  },
  //   {
  //     translation_key: 'DEBARMENT',
  //     id: 'DEBARMENT',
  //     children: [
  //       {
  //         translation_key: 'DEBARRED_BIDDER',
  //         id: 'DEBARRED_BIDDER',
  //       },
  //       {
  //         translation_key: 'REVOCATED_LIST',
  //         id: 'REVOCATED_LIST',
  //       },
  //       {
  //         translation_key: 'DEBARMENT_MANUAL',
  //         id: 'DEBARMENT_MANUAL',
  //       },
  //     ],
  //   },
  {
    translation_key: 'LAWS_AND_REGULATION',
    id: 'LAWS_AND_REGULATION',
    children: [
      {
        translation_key: 'PUBLIC_PROCUREMENT_ACT',
        id: 'PUBLIC_PROCUREMENT_ACT',
        link: '/documents',
        queryParams: { code: 'PUBLIC_PROCUREMENT_ACT' },
      },
      {
        translation_key: 'PROCUREMENT_REGULATION',
        id: 'PROCUREMENT_REGULATION',
        link: '/documents',
        queryParams: { code: 'PROCUREMENT_REGULATION' },
      },
    ],
  },
  {
    translation_key: 'VERIFYDOCUMENT',
    id: 'VERIFYDOCUMENT',
    link: '/verify',
  },

  {
    translation_key: 'NEST_TRAINING',
    id: 'NEST_TRAINING',
    children: [
      {
        translation_key: 'TRAINING_PORTAL',
        id: 'TRAINING_PORTAL',
        href: 'https://tsms.ppra.go.tz/',
      },
      {
        translation_key: 'SUPPLIER_TRAINING_VIDEO',
        id: 'SUPPLIER_TRAINING_VIDEO',
        href: 'https://www.youtube.com/watch?v=zhNaeWnwFH4&list=PL0xdBmzPXCeGgX720ipgt2M2rQxyqGQ73',
      },
      // {
      //   translation_key: 'PE_TRAINING_VIDEO',
      //   id: 'PE_TRAINING_VIDEO',
      //   href: 'https://www.youtube.com/watch?v=UWSiguvU0fE&list=PL0xdBmzPXCeGVk1ZddyeHXAl8Dyz4EME8',
      // },
      {
        translation_key: 'USER_GUIDES',
        id: 'USER_GUIDES',
        link: '/documents',
        queryParams: { code: 'USER_GUIDE' },
      },
    ],
  },

  //   {
  //     translation_key: 'HELP',
  //     id: 'HELP',
  //     children: [
  //       {
  //         translation_key: 'FAQ',
  //         id: 'FAQ',
  //       },
  //       {
  //         translation_key: 'SUPPLIER_TRAINING_VIDEO',
  //         id: 'SUPPLIER_TRAINING_VIDEO',
  //       },
  //     ],
  //   },
];
