import { MenuOption } from '../menu-options';

export const ContractsCreationAndVetting: MenuOption[] = [
	{
		name: 'Contracts Preparation & Vetting',
		shortName: 'Contracts Preparation & Vetting',
		authority: 'ROLE_MODULE_CONTRACTS_CRTN_N_VTN',
		permission: [
			{
				key: 'ROLE_MODULE_CONTRACTS_CTN_VTG',
				action: 'View created contracts and contract vetting',
			},
		],
		route: ['', 'modules', 'contracts-creation'],
		pathRoute: ['', 'modules', 'contracts-creation', 'contracts'],
		description: 'Contracts Preparation & Vetting',
		icon: 'contract',
		iconType: 'SVG',
		children: [
			{
				name: ' Dashboard',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_DSHBRD',
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_DSHBRD',
						action: 'View contract preparation and vetting dashboard',
					},
				],
				route: ['', 'modules', 'contracts-creation', 'contracts'],
				icon: 'contract',
				iconType: 'SVG',
			},
			{
				name: 'All Contracts',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_LST',
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_LST',
						action: 'View all contracts',
					},
					{
						key: 'ROLE_CONTRACT_CREATE',
						action: 'Create contract',
					},
					{
						key: 'ROLE_CONTRACT_DELETE',
						action: 'Delete contract',
					},
					{
						key: 'ROLE_CONTRACT_EDIT',
						action: 'Edit contract',
					},
				],
				route: ['', 'modules', 'contracts-creation', 'list'],
				icon: 'tasks',
				iconType: 'SVG',
			},
			{
				name: 'Contract In Draft Stage',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_DRAFT_VIEW',
				feature: [
					{
						key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
						action: 'Use Contract Vetting and Signing Feature',
					},
				],
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_DRFT_CNTCT_LST',
						action: 'View draft contracts',
					},
					{
						key: 'ROLE_CONTRACT_DRFT_CREATE',
						action: 'Create draft contract',
					},
					{
						key: 'ROLE_CONTRACT_DRFT__DELETE',
						action: 'Delete draft contract',
					},
					{
						key: 'ROLE_CONTRACT_DRFT__EDIT',
						action: 'Edit draft contract',
					},
				],
				route: ['', 'modules', 'contracts-creation', 'draft'],
				icon: 'tasks',
				iconType: 'SVG',
			},
			{
				name: 'Contract in Vetting Stage',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_VTTNG_VIEW',
				feature: [
					{
						key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
						action: 'Use Contract Vetting and Signing Feature',
					},
				],
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_LST',
						action: 'View contracts in vetting',
					},
				],
				route: ['', 'modules', 'contracts-creation', 'vetting'],
				icon: 'tasks',
				iconType: 'SVG',
			},
			{
				name: 'Contract in Signing Stage',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_SGNG_VIEW',
				feature: [
					{
						key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
						action: 'Use Contract Vetting and Signing Feature',
					},
				],
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_SIGNING_VIEW',
						action: 'View contracts in signing',
					},
				],
				route: ['', 'modules', 'contracts-creation', 'signing'],
				icon: 'tasks',
				iconType: 'SVG',
			},
			{
				name: 'Tasks',
				shortName: 'Tasks',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_TASKS',
				feature: [
					{
						key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
						action: 'Use Contract Vetting and Signing Feature',
					},
				],
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_TASKS',
						action: 'View tasks',
					},
				],
				route: ['', 'modules', 'contracts-creation'],
				pathRoute: ['', 'modules', 'contracts-creation'],
				description: 'Contract tasks',
				icon: 'tasks',
				children: [
					{
						name: 'Contract Preparation Tasks',
						authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_CRTN_TSKS',
						feature: [
							{
								key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
								action: 'Use Contract Vetting and Signing Feature',
							},
						],
						permission: [
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_CRTN_TSKS',
								action: 'View contract preparation tasks',
							},
						],
						route: ['', 'modules', 'contracts-creation', 'my-tasks'],
						icon: 'tasks',
						iconType: 'SVG',
					},
					{
						name: 'Contract Vetting Tasks',
						authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_VTTNG_TSKS',
						feature: [
							{
								key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
								action: 'Use Contract Vetting and Signing Feature',
							},
						],
						permission: [
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_VTTNG_TSKS',
								action: 'View contract vetting tasks',
							},
						],
						route: ['', 'modules', 'contracts-creation', 'my-vetting-tasks'],
						icon: 'tasks',
						iconType: 'SVG',
					},
					{
						name: 'Contract Signing Tasks',
						authority: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_SIGNING_TSKS',
						feature: [
							{
								key: 'FEATURE_CONTRACT_VETTING_AND_SIGNING',
								action: 'Use Contract Vetting and Signing Feature',
							},
						],
						permission: [
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_CNTCT_SIGNING_TSKS',
								action: 'View contract signing tasks',
							},
						],
						route: ['', 'modules', 'contracts-creation', 'signing-tasks'],
						icon: 'tasks',
						iconType: 'SVG',
					},
				],
			},
			{
				name: 'Additional Fields Settings',
				shortName: 'Additional Fields Settings',
				authority: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS',
				permission: [
					{
						key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS',
						action: 'View additional fields settings',
					},
				],
				route: ['', 'modules', 'contracts-creation'],
				pathRoute: [
					'',
					'modules',
					'contracts-creation',
					'additional-fields-setting',
				],
				description: 'Additional Fields Settings',
				icon: 'settings',
				children: [
					{
						name: 'Form Steps',
						authority: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_FRM_STP',
						permission: [
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_FRM_STP',
								action: 'View form steps',
							},
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_FRM_STP_CRT',
								action: 'Create form steps',
							},
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_FRM_STP_EDT',
								action: 'Edit form steps',
							},
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_FRM_STP_DLT',
								action: 'Delete form steps',
							},
						],
						route: [
							'',
							'modules',
							'contracts-creation',
							'additional-fields-setting',
							'form-steps',
							'CONTRACT',
						],
						icon: 'attachment',
						iconType: 'MATERIAL',
					},
					{
						name: 'Additional Fields',
						authority: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_ADD_FIELD',
						permission: [
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_ADD_FIELD',
								action: 'View additional fields',
							},
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_ADD_FIELD_CRT',
								action: 'Create additional fields',
							},
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_ADD_FIELD_EDT',
								action: 'Edit additional fields',
							},
							{
								key: 'ROLE_CONTRACTS_CRTN_N_VTN_ADDTNL_SETTINGS_ADD_FIELD_DLT',
								action: 'Delete additional fields',
							},
						],
						route: [
							'',
							'modules',
							'contracts-creation',
							'additional-fields-setting',
							'additional-fields',
							'CONTRACT',
						],
						icon: 'attachment',
						iconType: 'MATERIAL',
					},
				],
			},
		],
	},
];
