import { MenuOption } from '../menu-options';

export const FrameworkAgreement: MenuOption[] = [
	{
		name: 'Framework Agreements',
		shortName: 'Framework Agreements',
		authority: 'ROLE_MODULE_FRWKA',
		permission: [
			{
				key: 'ROLE_MODULE_FRWKA',
				action: 'View Framework Agreements',
			},
		],
		route: ['', 'modules', 'framework-agreement'],
		pathRoute: ['', 'modules', 'framework-agreement', 'dashboard'],
		description: 'Framework Agreements/ Contracts',
		icon: 'frameWorkAgreement',
		iconType: 'SVG',
		children: [
			{
				name: 'Dashboard',
				authority: 'ROLE_FRWKA_DASH',
				permission: [
					{ key: 'ROLE_FRWKA_DASH', action: 'View Framework Dashboard ' },
				],
				route: ['', 'modules', 'framework-agreement', 'dashboard'],
				icon: 'dashboard',
				iconType: 'MATERIAL',
			},
			{
				name: 'Framework Initiation',
				authority: 'ROLE_FRWKA_AGRMNT',
				permission: [
					{ key: 'ROLE_FRWKA_AGRMNT_CREATE', action: 'Can create agreements ' },
					{
						key: 'ROLE_FRWKA_AGRMNT_NEW_AGRMNT',
						action: 'Can view new agreements ',
					},
					{ key: 'ROLE_FRWKA_AGRMNT_DLT', action: 'Can Delete Agreement ' },
					{
						key: 'ROLE_FRWKA_AGRMNT_PREV_AGRMNT',
						action: 'Can view previous agreements ',
					},
					{
						key: 'ROLE_FRWKA_AGRMNT_PUB_AGRMNT',
						action: 'Can Publish agreements ',
					},
				],
				route: ['', 'modules', 'framework-agreement', 'initiation'],
				icon: 'handover',
				iconType: 'SVG',
			},
			// {
			//   name: 'Framework Agreement',
			//   authority: "ROLE_FRWKA_AGRMNT_INIT",
			//   permission: [
			//     { key: 'ROLE_FRWKA_AGRMNT_VIEW_AGRMNT', action: 'Can view framework aggreement ' },
			//     { key: 'ROLE_FRWKA_AGRMNT_GEN_DOCUMENT', action: 'Can Generate Document ' },
			//   ],
			//   route: ['', 'modules', 'framework-agreement-', 'agreements'],
			//   icon: 'tenders',
			//   iconType: 'SVG',
			//   children: [
			//     {
			//       name: 'Framework Agreement',
			//       authority: 'ROLE_FRWKA_AGRMNT_VIEW_AGRMNT',
			//       permission: [
			//         {
			//           key: "ROLE_FRWKA_AGRMNT_VIEW_AGRMNT",
			//           action: "View Framework Agreement"
			//         },

			//       ],
			//       route: [
			//         '',
			//         'modules',
			//         'framework-agreement',
			//         'agreements',
			//       ],
			//       icon: 'redo',
			//       iconType: 'MATERIAL',
			//     },
			//     {
			//       name: 'Framework Agreement Tasks',
			//       authority: 'ROLE_FRWKA_AGRMNT_AGREEMENT_TASK',
			//       permission: [
			//         {
			//           key: "ROLE_FRWKA_AGRMNT_AGREEMENT_TASK",
			//           action: "View framework agreement tasks"
			//         }
			//       ],
			//       route: [
			//         '',
			//         'modules',
			//         'framework-agreement',
			//         'framework-agreement-task',
			//       ],
			//       icon: 'workflow',
			//       iconType: 'SVG',
			//     },
			//   ]
			// },
			{
				name: 'Tasks',
				authority: 'ROLE_FRWKA_TASKS',
				permission: [{ key: 'ROLE_FRWKA_TASKS', action: 'View tasks ' }],
				route: ['', 'modules', 'framework-agreement', 'tasks'],
				icon: 'my_task',
				iconType: 'SVG',
			},
			{
				name: 'Framework Re-advertisement',
				shortName: 'Framework Re-advertisement',
				authority: 'ROLE_FR_INTN_RE_ADVERTISEMENT_MENU',
				permission: [
					{
						key: 'ROLE_FR_INTN_RE_ADVERTISEMENT_MENU',
						action: 'Framework re-advertisement',
					},
				],
				route: ['', 'modules', 'framework-agreement'],
				pathRoute: ['', 'modules', 'framework-agreement'],
				description: 'Framework Re-advertisement',
				icon: 'requisition',
				iconType: 'SVG',
				children: [
					{
						name: 'Framework Re-advertisement',
						authority: 'ROLE_FR_INTN_RE_ADVERTISEMENT',
						permission: [
							{
								key: 'ROLE_FR_INTN_RE_ADVERTISEMENT',
								action: 'View framework re-advertisement',
							},
							{
								key: 'ROLE_FR_INTN_RE_ADVERTISEMENT_CRT',
								action: 'Create framework re-advertisement',
							},
							{
								key: 'ROLE_FR_INTN_RE_ADVERTISEMENT_RSRT_WRKFLW',
								action: 'Restart Workflow',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'tender-re-advertisement',
						],
						icon: 'redo',
						iconType: 'MATERIAL',
					},
					{
						name: 'Framework Re-advertisement Tasks',
						authority: 'ROLE_FR_INTN_RE_ADVERTISEMENT_TASK',
						permission: [
							{
								key: 'ROLE_FR_INTN_RE_ADVERTISEMENT_TASK',
								action: 'View framework re-advertisement tasks',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'tender-re-advertisement-tasks',
						],
						icon: 'redo',
						iconType: 'MATERIAL',
					},
				],
			},
			{
				name: 'Published Frameworks',
				authority: 'ROLE_FRWKA_PUBLISHED_FRAMEWORK',
				permission: [
					{
						key: 'ROLE_FRWKA_PUBLISHED_FRAMEWORK',
						action: 'View published frameworks',
					},
				],
				route: ['', 'modules', 'framework-agreement', 'published-frameworks'],
				icon: 'tenders',
				iconType: 'SVG',
			},
			{
				name: 'Update Framework Price',
				authority: 'ROLE_FRWKA_UPDT_FRAMEWORK_PRC_LST',
				permission: [
					{
						key: 'ROLE_FRWKA_UPDT_FRAMEWORK_PRC_LST',
						action: 'View framework for price update list',
					},
					{
						key: 'ROLE_FRWKA_UPDT_FRAMEWORK_PRC',
						action: 'Update framework price',
					},
				],
				route: ['', 'modules', 'framework-agreement', 'update-framework-price'],
				icon: 'tenders',
				iconType: 'SVG',
			},
			{
				name: 'Framework Modifications',
				shortName: 'Framework Modifications',
				authority: 'ROLE_FRWKA_TND_MOD',
				permission: [
					{
						key: 'ROLE_FRWKA_TND_MOD',
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
						name: 'Framework Modification Requests',
						authority: 'ROLE_FRWKA_TND_MOD_REQ',
						permission: [
							{
								key: 'ROLE_FRWKA_TND_MOD_REQ',
								action: 'View Framework modification request',
							},
							{
								key: 'ROLE_FRWKA_TND_MOD_REQ_CRT',
								action: 'Create Framework modification request',
							},
							{
								key: 'ROLE_FRWKA_TND_MOD_REQ_EDT',
								action: 'Edit Framework modification request',
							},
							{
								key: 'ROLE_FRWKA_TND_MOD_REQ_DLT',
								action: 'Delete Framework modification request',
							},
							{
								key: 'ROLE_FRWKA_TND_MOD_REQ_INT_TSK',
								action: 'Initiate Framework modification task',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'tender-modification-requests',
						],
						icon: 'redo',
						iconType: 'MATERIAL',
					},
					{
						name: 'Frameworks Modification Tasks',
						authority: 'ROLE_FRWKA_TND_MOD_TSK',
						permission: [
							{
								key: 'ROLE_FRWKA_TND_MOD_TSK',
								action: 'View Framework modification task',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'tender-modification-req-tasks',
						],
						icon: 'tasks',
						iconType: 'SVG',
					},
					{
						name: 'Frameworks For Modification',
						authority: 'ROLE_FRWKA_TND_MOD_TNDRS',
						permission: [
							{
								key: 'ROLE_FRWKA_TND_MOD_TNDRS',
								action: 'View Published Frameworks For Modification',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'app-published-tenders-modification',
						],
						icon: 'tasks',
						iconType: 'SVG',
					},
				],
			},
			{
				name: 'Framework Cancellation',
				shortName: 'Framework Cancellation',
				authority: 'ROLE_FRWKA_CANCELLATION',
				permission: [
					{
						key: 'ROLE_FRWKA_CANCELLATION',
						action: 'View Framework cancellation',
					},
				],
				route: ['', 'modules', 'framework-agreement'],
				pathRoute: ['', 'modules', 'framework-agreement'],
				description:
					'Framework Cancellation, Termination, withdrawal & Modification',
				icon: 'tender-cancellation',
				iconType: 'SVG',
				children: [
					{
						name: 'Framework Cancellation Request',
						authority: 'ROLE_FRWKA_CNLTN_VIEW',
						permission: [
							{
								key: 'ROLE_FRWKA_CNLTN_VIEW',
								action: 'View Framework cancellation request',
							},
							{
								key: 'ROLE_FRWKA_CNLTN_CRT',
								action: 'Create Framework cancellation',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'tender-cancellation',
						],
						icon: 'redo',
						iconType: 'MATERIAL',
					},
					{
						name: 'Framework Cancellation Tasks',
						authority: 'ROLE_FRWKA_CANCELLATION_TASK',
						permission: [
							{
								key: 'ROLE_FRWKA_CANCELLATION_TASK',
								action: 'View Framework cancellation task',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'tender-cancellation-req-tasks',
						],
						icon: 'tender-cancellation',
						iconType: 'SVG',
					},
				],
			},

			{
				name: 'Additional Fields Settings',
				shortName: 'Additional Fields Settings',
				authority: 'ROLE_FRWKA_ADDTNL_SETTINGS',
				permission: [
					{
						key: 'ROLE_FRWKA_ADDTNL_SETTINGS',
						action: 'View additional fields settings',
					},
				],
				route: ['', 'modules', 'framework-agreement'],
				pathRoute: [
					'',
					'modules',
					'framework-agreement',
					'additional-fields-setting',
				],
				description: 'Additional Fields Settings',
				icon: 'settings',
				children: [
					{
						name: 'Form Steps',
						authority: 'ROLE_FRWKA_ADDTNL_SETTINGS_FRM_STPS',
						permission: [
							{
								key: 'ROLE_FRWKA_ADDTNL_SETTINGS_FRM_STPS',
								action: 'View form steps',
							},
							{
								key: 'ROLE_FRAMEWORK_MANGMNT_ADDTNL_SETTINGS_FRM_STP_CRT',
								action: 'Create form steps',
							},
							{
								key: 'ROLE_FRAMEWORK_MANGMNT_ADDTNL_SETTINGS_FRM_STP_EDT',
								action: 'Edit form steps',
							},
							{
								key: 'ROLE_FRAMEWORK_MANGMNT_ADDTNL_SETTINGS_FRM_STP_DLT',
								action: 'Delete form steps',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'additional-fields-setting',
							'form-steps',
							'FRAMEWORK',
						],
						icon: 'attachment',
						iconType: 'MATERIAL',
					},
					{
						name: 'Additional Fields',
						authority: 'ROLE_FRWKA_ADDTNL_SETTINGS_ADD_FIELD',
						permission: [
							{
								key: 'ROLE_FRWKA_ADDTNL_SETTINGS_ADD_FIELD',
								action: 'View additional details',
							},
							{
								key: 'ROLE_FRAMEWORK_MANGMNT_ADDTNL_SETTINGS_ADD_FIELD_CRT',
								action: 'Create additional details',
							},
							{
								key: 'ROLE_FRAMEWORK_MANGMNT_ADDTNL_SETTINGS_ADD_FIELD_EDT',
								action: 'Edit additional details',
							},
							{
								key: 'ROLE_FRAMEWORK_MANGMNT_ADDTNL_SETTINGS_ADD_FIELD_DLT',
								action: 'Delete additional details',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'additional-fields-setting',
							'additional-fields',
							'FRAMEWORK',
						],
						icon: 'attachment',
						iconType: 'MATERIAL',
					},
				],
			},
			// AWARD MENU
			{
				name: 'Framework Awards',
				shortName: 'Award',
				authority: 'ROLE_TNDR_AWRD_FRAMEWORK',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_FRAMEWORK',
						action: 'View Framework Awards',
					},
				],
				route: ['', 'modules', 'framework-agreement'],
				pathRoute: ['', 'modules', 'framework-agreement'],
				description: 'Awards',
				icon: 'pre_qualification',
				iconType: 'SVG',
				children: [
					{
						// name: 'Pending Notification To Awards',
						name: 'Pending Intention - HPMU',
						authority: 'ROLE_TNDR_AWRD_INTC_AWARD',
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
						route: ['', 'modules', 'framework-agreement', 'intention-to-award'],
						icon: 'pendingTenderAward',
						iconType: 'SVG',
					},
					{
						name: 'Pending Intention - AO',
						authority: 'ROLE_TNDR_AWRD_INTC_AWARD_AO',
						checkPermissionOnly: true,
						feature: [
							{ key: 'FEATURE_COMBINE_TNDR_AWRD_INTC_MULTPLE_INTENTION_AO', action: 'Combine Multiple Intention' },
						],
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_INTC_AWARD_AO',
								action: 'View intention to awards',
							},
							{
								key: 'ROLE_TNDR_AWRD_INTC_MULTPLE_INTENTION_AO',
								action: 'Allow to  issue multiple intention to awards',
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
						route: [
							'',
							'modules',
							'framework-agreement',
							'intention-to-award-ao',
						],
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
						route: [
							'',
							'modules',
							'framework-agreement',
							'intention-to-award-no-winner',
						],
						icon: 'pendingTenderAward',
						iconType: 'SVG',
					},
					{
						name: 'Pending Awards',
						authority: 'ROLE_TNDR_AWRD_PNDNG_AWARD',
						checkPermissionOnly: true,
						feature: [
							{ key: 'FEATURE_COMBINE_TNDR_AWRD_PNDNG_AWARD', action: 'Combine Multiple Award' },
						],
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_PNDNG_AWARD',
								action: 'View pending awards',
							},
							{
								key: 'ROLE_TNDR_AWRD_ISSUE_PNDNG_AWARD_MULTIPLE',
								action: 'Issue awards multiple',
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
						route: [
							'',
							'modules',
							'framework-agreement',
							'pending-tender-award',
						],
						icon: 'pendingTenderAward',
						iconType: 'SVG',
					},
					{
						name: 'Issued Frameworks Awards',
						authority: 'ROLE_TNDR_AWRD_ISSUED_FRAMEWORK',
						checkPermissionOnly: true,
						feature: [
							{ key: 'FEATURE_COMBINE_AWRD_ISSUED_FRAMEWORK', action: 'Combine Framework Agreement' },
						],
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_ISSUED_FRAMEWORK',
								action: 'View frameworks awards',
							},
							{
								key: 'ROLE_TNDR_AWRD_ISSUED_AWARD_CONTRACT',
								action: 'Generate Framework Agreement',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'issued-award-framework',
						],
						icon: 'pre_qualification',
						iconType: 'SVG',
					},
				],
			},
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
							}
						],
						route: [
							'',
							'modules',
							'framework-agreement',
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
							}
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'modification-requests',
							'all-requests',
						],
					}
				],
			},
			{
				name: 'Framework Award Cancellation',
				shortName: 'Framework Award Cancellation',
				authority: 'ROLE_TNDR_AWRD_CANCELLATION',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_CANCELLATION',
						action: 'View Framework Award Cancellation',
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
								action: 'View Framework Cancellation Request Tasks',
							},
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_PREPARE_AWARD_CANCELLATION',
								action: 'Prepare framework award cancellation request letter',
							},
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_REQUEST_CREATE',
								action: 'Create framework Award Cancellation Request Tasks',
							},
							{
								key: 'ROLE_TNDR_AWRD_CANCELLATION_REQUEST_EDIT',
								action:
									'Edit Framework Award Cancellation Request Tasks (HPMU only)',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'framework-award-cancellation-requests',
							'request',
							'FRAMEWORK',
						],
					},
					{
						name: 'Cancelled Framework Award',
						authority: 'ROLE_TNDR_AWRD_CANCELLED_AWARD',
						permission: [
							{
								key: 'ROLE_TNDR_AWRD_CANCELLED_AWARD',
								action: 'View Framework cancelled Award',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'framework-award-cancellation-requests',
							'previous',
							'FRAMEWORK',
						],
					},
				],
			},
			{
				name: 'Framework Awards Logs',
				shortName: 'Framework Awards Logs',
				authority: 'ROLE_TNDR_AWRD_REVERT_AWARD',
				permission: [
					{
						key: 'ROLE_TNDR_AWRD_REVERT_AWARD',
						action: 'View awards logs',
					},
				],
				route: ['', 'modules', 'framework-agreement'],
				pathRoute: ['', 'modules', 'framework-agreement'],
				description: 'Framework Awards Logs',
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
							'framework-agreement',
							'revert-tender-award',
							'FRAMEWORK',
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
							'framework-agreement',
							'canceled-intention-requests',
							'FRAMEWORK',
						],
						icon: 'pendingTenderAward',
						iconType: 'SVG',
					},
				],
			},

			{
				name: 'Call Off Orders',
				authority: 'ROLE_FRWKA_VW_CALLOFF',
				permission: [
					{
						key: 'ROLE_FRWKA_VW_CALLOFF',
						action: 'View Call Off Orders',
					},
					{
						key: 'ROLE_FRWKA_ADD_CALLOFF',
						action: 'Add Call Off Orders',
					},
					{
						key: 'ROLE_FRWKA_DLT_CALLOFF',
						action: 'Delete Call Off Orders',
					},
				],
				route: ['', 'modules', 'framework-agreement', 'call-off-orders'],
				icon: 'contract',
				iconType: 'SVG',
			},

			{
				name: 'Established Agreements',
				shortName: 'Agreements',
				authority: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS',
				permission: [
					{
						key: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS',
						action: 'Established Agreement',
					},
				],
				route: ['', 'modules', 'framework-agreement'],
				pathRoute: ['', 'modules', 'framework-agreement'],
				description: 'Agreements',
				icon: 'frameWorkAgreement',
				iconType: 'SVG',
				children: [
					{
						name: 'Established Agreements',
						authority: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS_VIEW',
						permission: [
							{
								key: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS_VIEW',
								action: 'View Established Agreement',
							},
							{
								key: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS_CREATE',
								action: 'Create Framework Agreement',
							},
							{
								key: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS_EDIT',
								action: 'Edit Established Agreement',
							},
							{
								key: 'ROLE_FRWKA_ESTABLISHED_AGREEMWNTS_DELETE',
								action: 'Delete Established Agreement',
							},
						],
						route: [
							'',
							'modules',
							'framework-agreement',
							'established-agreement',
						],
						icon: 'contract',
						iconType: 'SVG',
					},

					// {
					//   name: 'Pending Awards',
					//   authority: 'ROLE_TNDR_AWRD_PNDNG_AWARD',
					//   permission: [
					//     {
					//       key: "ROLE_TNDR_AWRD_PNDNG_AWARD",
					//       action: "View pending awards"
					//     },
					//     {
					//       key: "ROLE_TNDR_AWRD_ISSUE_PNDNG_AWARD",
					//       action: "Issue awards"
					//     },
					//     {
					//       key: "ROLE_TNDR_AWRD_ISSUE_AWARD_CANCEL",
					//       action: "Cancel Intention to awards"
					//     },
					//     {
					//       key: "ROLE_TNDR_AWRD_ISSUE_AWARD_APPROVE",
					//       action: "Approve Intention to awards"
					//     },
					//   ],
					//   route: ['', 'modules', 'framework-agreement', 'pending-tender-award'],
					//   icon: 'pendingTenderAward',
					//   iconType: 'SVG',
					// },
					// {
					//   name: 'Issued Frameworks Awards',
					//   authority: 'ROLE_TNDR_AWRD_ISSUED_FRAMEWORK',
					//   permission: [
					//     {
					//       key: "ROLE_TNDR_AWRD_ISSUED_FRAMEWORK",
					//       action: "View frameworks awards"
					//     },
					//     {
					//       key: "ROLE_TNDR_AWRD_ISSUED_AWARD_CONTRACT",
					//       action: "Generate Framework Agreement"
					//     }
					//   ],
					//   route: ['', 'modules', 'framework-agreement', 'issued-award-framework'],
					//   icon: 'pre_qualification',
					//   iconType: 'SVG',
					// },
				],
			},
		],
	},
];
