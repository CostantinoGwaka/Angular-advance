import { MenuOption } from '../menu-options';

export const TenderAward: MenuOption[] = [
	{
		name: 'Tender Award',
		shortName: 'Tender Award',
		authority: 'ROLE_MODULES_TNDR_AWRD',
		permission: [
			{
				key: 'ROLE_MODULES_TNDR_AWRD',
				action: '',
			},
		],
		route: ['', 'modules', 'tender-award'],
		pathRoute: ['', 'modules', 'tender-award', 'intention-to-award'],
		description: 'Tender Award',
		icon: 'tenderAwards',
		iconType: 'SVG',
		children: [
			// {
			//   name: 'Dashboard',
			//   permission: [],
			//   route: ['', 'modules', 'tender-award', 'dashboard'],
			//   icon: 'dashboard',
			//   iconType: 'MATERIAL',
			// },pending-tender-award
			{
				name: 'Pending Intention - HPMU',
				authority: 'ROLE_TNDR_AWRD_INTC_AWARD',
				checkPermissionOnly: true,
				feature: [
					{
						key: 'FEATURE_INITIALIZE_NEGOTIATION',
						action: 'Use Negotiation Feature',
					},
				],
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_INTC_AWARD',
						action: 'Preview intention to awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_ISSUE_INTC_AWARD',
						action: 'Issue intention to awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_REQUEST_INTC_AWARD',
						action: 'Submit intention for Approval',
					},
					{
						key: 'ROLE_TNDR_AWRD_ATTACH_NEGOTIATION_MIN',
						action: 'Upload negotiation minute',
					},
					{
						key: 'ROLE_TNDR_AWRD_REVIEW_NEGOTIATION_MIN',
						action: 'Review negotiation minute',
					},
					{
						key: 'ROLE_TNDR_INTN_STRT_MOD_REQ',
						action: 'Initiate Winner modification request',
					},
					{
						key: 'ROLE_TNDR_AWRD_UPDT_NON_RESPO_REASON',
						action: 'Rephrase non responsiveness reason',
					},
				],
				route: ['', 'modules', 'tender-award', 'intention-to-award'],
				icon: 'pendingTenderAward',
				iconType: 'SVG',
			},
			{
				// name: 'Intention To Awards',
				name: 'Pending Intention - AO',
				authority: 'ROLE_TNDR_AWRD_INTC_AWARD_AO',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_INTC_AWARD_AO',
						action: 'View intention to awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_ISSUE_INTC_AWARD',
						action: 'Issue intention to awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_REQUEST_INTC_AWARD',
						action: 'Submit intention for Approval',
					},
					{
						key: 'ROLE_TNDR_AWRD_ATTACH_NEGOTIATION_MIN',
						action: 'Upload negotiation minute',
					},
					{
						key: 'ROLE_TNDR_AWRD_REVIEW_NEGOTIATION_MIN',
						action: 'Review negotiation minute',
					},
					{
						key: 'ROLE_TNDR_INTN_STRT_MOD_REQ',
						action: 'Initiate Winner modification request',
					},
					{
						key: 'ROLE_TNDR_AWRD_UPDT_NON_RESPO_REASON',
						action: 'Rephrase non responsiveness reason',
					},
				],
				route: ['', 'modules', 'tender-award', 'intention-to-award-ao'],
				icon: 'pendingTenderAward',
				iconType: 'SVG',
			},

			{
				name: 'Cancel Intention - No Winner',
				authority: 'ROLE_TNDR_AWRD_CANCEL_INTENTION',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_CANCEL_INTENTION',
						action: 'View Intention to be cancelled',
					},
				],
				route: ['', 'modules', 'tender-award', 'intention-to-award-no-winner'],
				icon: 'pendingTenderAward',
				iconType: 'SVG',
			},
			{
				name: 'Pending Awards',
				authority: 'ROLE_TNDR_AWRD_PNDNG_AWARD',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_PNDNG_AWARD',
						action: 'View pending awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_ISSUE_PNDNG_AWARD',
						action: 'Issue awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_ISSUE_AWARD_CANCEL',
						action: 'Cancel Intention to awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_ISSUE_AWARD_APPROVE',
						action: 'Approve Intention to awards',
					},
				],
				route: ['', 'modules', 'tender-award', 'pending-tender-award'],
				icon: 'pendingAward',
				iconType: 'SVG',
			},
			{
				name: 'Issued Awards',
				authority: 'ROLE_TNDR_AWRD_ISSUED_AWARD',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_ISSUED_AWARD',
						action: 'View issued awards',
					},
					{
						key: 'ROLE_TNDR_AWRD_ISSUED_AWARD_CONTRACT',
						action: 'Generate Contract Document',
					},
				],
				route: ['', 'modules', 'tender-award', 'issued-award'],
				icon: 'pre_qualification',
				iconType: 'SVG',
			},
			// {
			//   name: 'Winner Modification Requests',
			//   authority:'ROLE_TNDR_AWRD_MOD_REQ',
			//   permission: [
			//     {
			//       key: "ROLE_TNDR_AWRD_MOD_REQ",
			//       action: "View Tender winner modification request"
			//     }
			//   ],
			//   route: ['', 'modules', 'tender-award', 'modification-requests'],
			//   icon: 'pendingTenderAward',
			//   iconType: 'SVG',
			// },
			{
				name: 'Winner Modifications',
				shortName: 'Winner Modifications',
				authority: 'ROLE_TNDR_AWRD_MODS',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_MODS',
						action: 'View Modification Requests',
					},
				],
				route: ['', 'modules', 'tender-award'],
				pathRoute: ['', 'modules', 'tender-award', 'modification-requests'],
				description: 'Winner Modifications',
				icon: 'pre_qualification',
				iconType: 'SVG',
				children: [
					{
						name: 'Modification Request Tasks',
						authority: 'ROLE_TNDR_AWRD_MOD_TASK',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_MOD_TASK',
								action: 'View Winner Modification Tasks',
							},
						],
						route: [
							'',
							'modules',
							'tender-award',
							'modification-requests',
							'my-tasks',
						],
					},
					{
						name: 'All Modification Requests',
						authority: 'ROLE_TNDR_AWRD_ALL_MODS',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_ALL_MODS',
								action: 'View Winner Modification requests',
							},
						],
						route: [
							'',
							'modules',
							'tender-award',
							'modification-requests',
							'all-requests',
						],
					},
				],
			},

			{
				name: 'Award Cancellation',
				shortName: 'Award Cancellation',
				authority: 'ROLE_TNDR_AWRD_CANCELLATION',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_CANCELLATION',
						action: 'View Award Cancellation',
					},
				],
				route: ['', 'modules', 'tender-award'],
				pathRoute: [
					'',
					'modules',
					'tender-award',
					'award-cancellation-requests',
				],
				description: 'Award Cancellation',
				icon: 'pendingAward',
				iconType: 'SVG',
				children: [
					{
						name: 'Cancellation Request',
						authority: 'ROLE_TNDR_AWRD_CANCELLATION_REQUEST',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_REQUEST',
								action: 'View Cancellation Request Tasks',
							},
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_PREPARE_AWARD_CANCELLATION',
								action: 'Prepare award cancellation request letter',
							},
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_REQUEST_CREATE',
								action: 'Create Award Cancellation Request Tasks',
							},
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_REQUEST_EDIT',
								action: 'Edit Award Cancellation Request Tasks (HPMU only)',
							},
						],
						route: [
							'',
							'modules',
							'tender-award',
							'award-cancellation-requests',
							'request',
							'TENDER',
						],
					},
					{
						name: 'Cancelled Award',
						authority: 'ROLE_TNDR_AWRD_CANCELLED_AWARD',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_CANCELLED_AWARD',
								action: 'View cancelled Award',
							},
						],
						route: [
							'',
							'modules',
							'tender-award',
							'award-cancellation-requests',
							'previous',
							'TENDER',
						],
					},
				],
			},

			{
				name: 'Awards Logs',
				shortName: 'Awards Logs',
				authority: 'ROLE_TNDR_AWRD_REVERT_AWARD',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_REVERT_AWARD',
						action: 'View awards logs',
					},
				],
				route: ['', 'modules', 'tender-award'],
				pathRoute: ['', 'modules', 'tender-award', 'modification-requests'],
				description: 'Winner Modifications',
				icon: 'pre_qualification',
				iconType: 'SVG',
				children: [
					{
						name: 'Revert Award Logs',
						authority: 'ROLE_TNDR_AWRD_REVERT_AWARD',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_REVERT_AWARD',
								action: 'View awards logs',
							},
						],
						route: [
							'',
							'modules',
							'tender-award',
							'revert-tender-award',
							'TENDER',
						],
						icon: 'pendingTenderAward',
						iconType: 'SVG',
					},
					{
						name: 'Cancelled Intention Logs',
						authority: 'ROLE_TNDR_AWRD_CANCELLED_INTENTION',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_CANCELLED_INTENTION',
								action: 'Cancelled Intention Logs',
							},
						],
						route: [
							'',
							'modules',
							'tender-award',
							'canceled-intention-requests',
							'TENDER',
						],
						icon: 'pendingTenderAward',
						iconType: 'SVG',
					},
				],
			},
		],
	},
];
