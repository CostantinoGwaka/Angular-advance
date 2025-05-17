import { MenuOption } from '../menu-options';

export const MicroValueProcurement: MenuOption[] = [
	{
		name: 'Micro Value Procurement',
		shortName: 'Micro Value Procurement',
		authority: 'ROLE_MODULE_MPV',
		permission: [
			{
				key: 'ROLE_MODULE_MPV',
				action: 'View Micro Value Procurement',
			},
		],
		route: ['', 'modules', 'micro-value-procurement'],
		pathRoute: ['', 'modules', 'micro-value-procurement', 'dashboard'],
		description: 'Micro Value Procurement',
		icon: 'frameWorkAgreement',
		iconType: 'SVG',
		children: [
			// {
			//   name: 'Dashboard',
			//   authority: "ROLE_MCP_DASH",
			//   permission: [
			//     { key: 'ROLE_MCP_DASH', action: 'View Micro Value Dashboard ' }
			//   ],
			//   route: ['', 'modules', 'micro-value-procurement', 'dashboard'],
			//   icon: 'dashboard',
			//   iconType: 'MATERIAL',
			// },
			{
				name: 'Micro Procurement',
				icon: 'cart_icon',
				iconType: 'SVG',
				key: 'micro-procurement',
				authority: 'ROLE_APP_MNGT_MICRO_PROCUREMENT',
				permission: [
					{
						key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT',
						action: 'View Micro Procurement',
					},
				],
				route: ['', 'modules', 'micro-value-procurement', 'micro-procurement'],
				children: [
					{
						name: 'Micro Procurement Process',
						authority: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_TASK',
						permission: [
							{
								key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_TASK',
								action: 'View Micro Procurement Task',
							},
							{
								key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_CREATE',
								action: 'Create Micro Procurement Task',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'micro-procurement',
							'task-micro-procurement',
						],
					},
					{
						name: 'My Micro Procurement',
						authority: 'ROLE_APP_MNGT_MY_MICRO_PROCUREMENT',
						permission: [
							{
								key: 'ROLE_APP_MNGT_MY_MICRO_PROCUREMENT',
								action: 'View Only User Department Micro Procurement',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'micro-procurement',
							'my-micro-procurement',
						],
					},
					{
						name: 'Department Micro Procurement',
						authority: 'ROLE_APP_MNGT_MICRO_PROCUREMENT',
						permission: [
							{
								key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT',
								action: 'View All Department Micro Procurement for HODs',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'micro-procurement',
							'list-micro-procurement',
						],
					},
					{
						name: 'Approved Micro Procurement',
						authority: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_RITIRED',
						permission: [
							{
								key: 'ROLE_APP_MNGT_MICRO_PROCUREMENT_RITIRED',
								action: 'View Approved Micro Procurement Ritired',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'micro-procurement',
							'approved-micro-procurement',
						],
					},
					{
						name: 'All Micro Procurement',
						authority: 'ROLE_APP_MNGT_ALL_PROCUREMENT',
						permission: [
							{
								key: 'ROLE_APP_MNGT_ALL_PROCUREMENT',
								action: 'View All Micro Procurement',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'micro-procurement',
							'all-micro-procurement',
						],
					},
				],
			},
			{
				name: 'Retirement',
				icon: 'negotiation',
				iconType: 'SVG',
				key: 'retirement',
				authority: 'ROLE_APP_MNGT_RETIREMENT',
				permission: [
					{ key: 'ROLE_APP_MNGT_RETIREMENT', action: 'View Micro Procurement' },
					{
						key: 'ROLE_APP_MNGT_RETIREMENT_RESET',
						action: 'Reset Micro Procurement Retirement',
					},
					{
						key: 'ROLE_APP_MNGT_RETIREMENT_RESET_REQUEST',
						action: 'Reset Micro Procurement Request',
					},
				],
				route: ['', 'modules', 'micro-value-procurement', 'micro-procurement'],
				children: [
					{
						name: 'Retirement Process',
						authority: 'ROLE_APP_MNGT_RETIREMENT_TASK',
						permission: [
							{
								key: 'ROLE_APP_MNGT_RETIREMENT_TASK',
								action: 'View Retirement Task',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'retirement',
							'task-retirement',
						],
					},
					{
						name: 'Unretired Micro Procurement',
						authority: 'ROLE_APP_MNGT_RETIREMENT_LIST',
						permission: [
							{
								key: 'ROLE_APP_MNGT_RETIREMENT_LIST',
								action: 'View Unretired Micro Procurement',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'retirement',
							'unretired-procure',
						],
					},
					{
						name: 'Retired Micro Procurement',
						authority: 'ROLE_APP_MNGT_RITIRED_PROCUREMENT',
						permission: [
							{
								key: 'ROLE_APP_MNGT_RITIRED_PROCUREMENT',
								action: 'View Retired Micro Procurement',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'retirement',
							'retired-procure',
						],
					},
					{
						name: 'All Retired Micro Procurement',
						authority: 'ROLE_APP_MNGT_ALL_PROCUREMENT',
						permission: [
							{
								key: 'ROLE_APP_MNGT_ALL_PROCUREMENT',
								action: 'View All Micro Procurement',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'retirement',
							'all-retired-procure',
						],
					},
				],
			},
			{
				name: 'Settings',
				key: 'settings',
				authority: 'ROLE_MCP_MNGT_SETTINGS',
				permission: [
					{ key: 'ROLE_MCP_MNGT_SETTINGS', action: 'View settings' },
				],
				route: ['', 'modules', 'app-management', 'settings'],
				icon: 'settings',
				children: [
					{
						name: 'MVC Settings',
						authority: 'ROLE_MVC_MNGT_MVC',
						permission: [
							{
								key: 'ROLE_MVC_MNGT_MVC',
								action: 'View Micro Procurement Settings',
							},
							{
								key: 'ROLE_MVC_MNGT_MVC_CREATE_UPDATE',
								action: 'Create Micro Procurement Settings',
							},
						],
						route: [
							'',
							'modules',
							'micro-value-procurement',
							'settings',
							'settings',
						],
					},
				],
			},
		],
	},
];
