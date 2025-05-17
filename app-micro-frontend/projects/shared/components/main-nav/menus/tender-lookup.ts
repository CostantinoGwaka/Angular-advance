import { MenuOption } from '../menu-options';

export const TenderLookup: MenuOption[] = [
  {
    name: 'Quick Tender Lookup',
    shortName: 'Quick Tender Lookup',
    authority: 'ROLE_MODULES_TNDR_LKUP',
    permission: [
      {
        key: 'ROLE_MODULES_TNDR_LKUP',
        action: '',
      },
    ],
    route: ['', 'modules', 'tender-lookup'],
    pathRoute: ['', 'modules', 'tender-lookup', 'tender-search'],
    description: 'Search and Check Tender Information',
    icon: 'lookup_icon',
    iconType: 'SVG',
    children: [
      {
        name: 'Tender Search',
        authority: 'ROLE_MODULES_TNDR_LKUP',
        permission: [
          {
            key: 'ROLE_MODULES_TNDR_LKUP',
            action: '',
          },
          {
            key: 'ROLE_MODIFY_PUBLISHED_TENDER_BOQ',
            action: 'Modify published tender BOQ',
          },
          {
            key: 'ROLE_ALLOW_TO_VIEW_PRIVATE_TENDER',
            action: 'Allow to view private tender',
          },
          {
            key: 'ROLE_ALLOW_TO_VIEW_AWARD_FOR_PRIVATE_TENDER',
            action: 'Allow to view award for private tender',
          },
          {
            key: 'ROLE_MODULES_TNDR_LKUP_FIX_TNDR_STATE',
            action: 'Revert to Previous Tender state (Cuis)',
          },
        ],
        route: ['', 'modules', 'tender-lookup', 'tender-search'],
        icon: 'searchIcon',
        iconType: 'SVG',
      },
      {
        name: 'Requisition Search',
        authority: 'ROLE_MODULES_TNDR_LKUP',
        permission: [
          {
            key: 'ROLE_MODULES_TNDR_LKUP',
            action: '',
          },
          {
            key: 'ROLE_ALLOW_TO_VIEW_REQ_FOR_PRIVATE_TENDER',
            action: 'Allow to view requisition for private tender',
          },
        ],
        route: ['', 'modules', 'tender-lookup', 'requisition-search'],
        icon: 'searchIcon',
        iconType: 'SVG',
      },
      {
        name: 'Framework Search',
        authority: 'ROLE_MODULES_TNDR_LKUP',
        permission: [
          {
            key: 'ROLE_MODULES_TNDR_LKUP',
            action: '',
          },
        ],
        route: ['', 'modules', 'tender-lookup', 'framework-search'],
        icon: 'searchIcon',
        iconType: 'SVG',
      },
      {
        name: 'Micro Procurement Search',
        authority: 'ROLE_MODULES_TNDR_LKUP',
        permission: [
          {
            key: 'ROLE_MODULES_TNDR_LKUP',
            action: '',
          },
        ],
        route: ['', 'modules', 'tender-lookup', 'micro-procurement-search'],
        icon: 'searchIcon',
        iconType: 'SVG',
      },
      {
        name: 'Cancellation And Re-advertised-Tenders',
        authority: 'ROLE_MODULES_CANCELLED_AND_RE_ADVERTISED_TENDERS',
        permission: [
          {
            key: 'ROLE_MODULES_CANCELLED_AND_RE_ADVERTISED_TENDERS',
            action: '',
          },
        ],
        route: ['', 'modules', 'tender-lookup', 'cancelled-and-re-advertised-tenders'],
        icon: 'searchIcon',
        iconType: 'SVG',
      },
      {
        name: 'Awards Lookup',
        shortName: 'Awards Lookup',
        authority: 'ROLE_MODULES_TNDR_LKUP',
        permission: [
          {
            key: 'ROLE_MODULES_TNDR_LKUP',
            action: 'View awards logs',
          },
        ],
        route: ['', 'modules', 'tender-lookup'],
        pathRoute: ['', 'modules', 'tender-lookup', 'revert-award-lookup'],
        description: 'Award Lookup',
        icon: 'pre_qualification',
        iconType: 'SVG',
        children: [
          {
            name: 'Winner Modification Logs',
            authority: 'ROLE_MODULES_TNDR_LKUP',
            permission: [
              {
                key: "ROLE_MODULES_TNDR_LKUP",
                action: "View winner modification logs"
              },
            ],
            route: ['', 'modules', 'tender-lookup', 'winner-modification-lookup'],
            icon: 'searchIcon',
            iconType: 'SVG',
          },
          {
            name: 'Revert Award Logs',
            authority: 'ROLE_MODULES_TNDR_LKUP',
            permission: [
              {
                key: "ROLE_MODULES_TNDR_LKUP",
                action: "View awards logs"
              },
            ],
            route: ['', 'modules', 'tender-lookup', 'revert-award-lookup'],
            icon: 'searchIcon',
            iconType: 'SVG',
          },
          {
            name: 'Cancelled Intention Logs',
            authority: 'ROLE_MODULES_TNDR_LKUP',
            permission: [
              {
                key: "ROLE_MODULES_TNDR_LKUP",
                action: "Cancelled Intention Logs"
              },
            ],
            route: ['', 'modules', 'tender-lookup', 'cancelled-intention-lookup'],
            icon: 'searchIcon',
            iconType: 'SVG',
          },
          {
            name: 'Review Submission Form',
            authority: 'ROLE_TNDR_SUBMISSION_FORM_REVIEW',
            permission: [
              {
                key: "ROLE_TNDR_SUBMISSION_FORM_REVIEW",
                action: "Review Submission Form"
              },
            ],
            route: ['', 'modules', 'tender-lookup', 'review-submission-form'],
            icon: 'searchIcon',
            iconType: 'SVG',
          },
          {
            name: 'Fix Award (State Mismatch)',
            authority: 'ROLE_TNDR_FIX_AWARD',
            permission: [
              {
                key: "ROLE_TNDR_FIX_AWARD",
                action: "Fix award - fix state mismatch"
              },
            ],
            route: ['', 'modules', 'tender-lookup', 'fix-award-mismatch'],
            icon: 'searchIcon',
            iconType: 'SVG',
          }
        ],
      },
    ],
  },
];
