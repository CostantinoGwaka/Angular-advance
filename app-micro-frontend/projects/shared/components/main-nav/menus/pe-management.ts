import { MenuOption } from '../menu-options';

export const PeManagement: MenuOption[] = [
	{
		name: 'PE Management',
		shortName: 'PE Management',
		route: ['', 'modules', 'pe-management'],
		pathRoute: ['', 'modules', 'pe-management'],
		description: 'Procuring Entities Management',
		icon: 'gisp_home',
		iconType: 'SVG',
		authority: 'ROLE_MODULES_PE_MNGT',
		permission: [
			{
				key: 'ROLE_MODULES_PE_MNGT',
				action: 'View PE management',
			},
		],
		children: [
			{
				name: 'Dashboard',
				authority: 'ROLE_PE_MNGT_DASHBOARD',
				permission: [
					{
						key: 'ROLE_PE_MNGT_DASHBOARD',
						action: 'View PE Management Dashboard',
					},
				],
				route: ['', 'modules', 'pe-management', 'dashboard'],
				icon: 'dashboard',
				iconType: 'MATERIAL',
			},
			{
				name: 'PE Tenders Dashboard',
				authority: 'ROLE_PE_MNGT_PE_TENDERS_DASHBRD',
				permission: [
					{
						key: 'ROLE_PE_MNGT_PE_TENDERS_DASHBRD',
						action: 'View PE tenders dashboard',
					},
				],
				route: ['', 'modules', 'pe-management', 'pe-tenders-dashboard'],
				icon: 'dashboard',
				iconType: 'MATERIAL',
			},
			{
				name: 'PE List',
				key: 'peList',
				route: ['', 'modules', 'pe-management', 'pe-list'],
				icon: 'assignment',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_LIST',
				permission: [
					{ key: 'ROLE_PE_MNGT_PE_LIST', action: 'View PE list' },
					{
						key: 'ROLE_PE_MNGT_PE_LIST_VIEW_ONLY',
						action: 'View Only PE list',
					},
					{ key: 'ROLE_PE_MNGT_PE_CREATE', action: 'Create PE' },
					{ key: 'ROLE_PE_MNGT_PE_EDIT', action: 'Edit PE' },
					{ key: 'ROLE_PE_MNGT_PE_MANAGE', action: 'Manage PE list' },
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_CTRL_NMBR',
						action: 'Manage PE control number',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_BILL_SMRY',
						action: 'Manage PE billing summary',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_STRCTR',
						action: 'Manage PE (PE Structure)',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_STRCTR_CRT',
						action: 'Manage PE (PE Structure) Add',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_STRCTR_EDT',
						action: 'Manage PE (PE Structure) Edit',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_STRCTR_DLT',
						action: 'Manage PE (PE Structure) Delete',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_STRCTR_UPDATE',
						action: 'Manage PE (PE Structure) Advance Upload',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_USERS',
						action: 'Manage PE (PE users)',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_USERS_CRT',
						action: 'Manage PE (PE users) Create',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_USERS_EDIT',
						action: 'Manage PE (PE users) Edit',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_USERS_DELETE',
						action: 'Manage PE (PE users) Delete',
					},
					{
						key: 'ROLE_PPRA_UPDATE_USR_DTLS',
						action: 'Manage PE (PE users) Update Already Activate',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_USERS_RSND_EMAIL',
						action: 'Manage PE (PE users) Resend activation email',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MANAGE_PE_USERS_MNG_ROLE',
						action: 'Manage PE (PE users) - Manage roles',
					},
					{
						key: 'ROLE_PE_MNGT_DELETE_AO_HPMU',
						action: 'Delete Account for Account Officer and HPMU',
					},
				],
			},
			{
				name: 'PE Assigned Business Lines',
				route: ['', 'modules', 'pe-management', 'assigned-business-lines'],
				icon: 'list',
				iconType: 'MATERIAL',
				authority: 'ROLE_MNGT_PE_BUSNESS_LINES',
				permission: [
					{ key: 'ROLE_MNGT_PE_BUSNESS_LINES', action: 'View Business Lines' },
					{
						key: 'ROLE_MNGT_PE_BUSNESS_LINES_CREATE',
						action: 'Create Business Lines',
					},
					{ key: 'ROLE_MNGT_PE_BUSNESS_LINES_EDIT', action: 'Edit Business Lines' },
					{
						key: 'ROLE_MNGT_PE_BUSNESS_LINES_DELETE',
						action: 'Delete Business Lines',
					},
				],
			},
			{
				name: 'Parent Ministry',
				key: 'parentMinistry',
				route: ['', 'modules', 'pe-management', 'parent-ministry'],
				icon: 'lower_level',
				iconType: 'SVG',
				authority: 'ROLE_MNGT_PARENT_MINISTY',
				permission: [
					{
						key: 'ROLE_VIEW_MNGT_PARENT_MINISTY',
						action: 'View Parent Ministry',
					},
					{
						key: 'ROLE_ADD_MNGT_PARENT_MINISTY',
						action: 'Add Parent Ministry',
					},
				],
			},
			{
				name: 'Lower Level PE',
				key: 'lowerLevelPe',
				route: ['', 'modules', 'pe-management', 'lower-level-pe-list'],
				icon: 'lower_level',
				iconType: 'SVG',
				authority: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MENU',
				permission: [
					{
						key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MENU',
						action: 'View Lower Level Menu',
					},
				],
				children: [
					{
						name: 'Lower Level',
						key: 'lowerLevelPe',
						authority: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_LIST',
						permission: [
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_LIST',
								action: 'View Lower Level PE list',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_CREATE',
								action: 'Create Lower Level PE',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_EDIT',
								action: 'Lower Level Edit PE',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE',
								action: 'Lower Level Manage PE list',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_CTRL_NMBR',
								action: 'Lower Level Manage PE control number',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_BILL_SMRY',
								action: 'Lower Level Manage PE billing summary',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR',
								action: 'Lower Level Manage PE (PE Structure',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_CRT',
								action: 'Lower Level Manage PE (PE Structure) Add',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_EDT',
								action: 'Lower Level Manage PE (PE Structure) Edit',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_DLT',
								action: 'Lower Level Manage PE (PE Structure) Delete',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS',
								action: 'Lower Level Manage PE (PE users)',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_CRT',
								action: 'Lower Level Manage PE (PE users) Create',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_EDIT',
								action: 'Lower Level Manage PE (PE users) Edit',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_DELETE',
								action: 'Lower Level Manage PE (PE users) Delete',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_UPDATE_USR_DTLS',
								action:
									'Lower Level Manage PE (PE users) Update Already Activate',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_RSND_EMAIL',
								action:
									'Lower Level Manage PE (PE users) Resend activation email',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_MNG_ROLE',
								action: 'Lower Level Manage PE (PE users) - Manage roles',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_DELETE_AO_HPMU',
								action:
									'Lower Level Delete Account for Account Officer and HPMU',
							},
						],
						route: [
							'',
							'modules',
							'pe-management',
							'lower-level-pe-list',
							'lower-level',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
					{
						name: 'Assigned Lower Level',
						key: 'lowerLevelPeAdmin',
						authority: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_LIST_ADMIN',
						permission: [
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_LIST_ADMIN',
								action: 'View Lower Level PE list',
							},
							// {
							//   key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_EDIT_ADMIN',
							//   action: 'Edit Assigned Lower Level PE',
							// },
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_ADMIN',
								action: 'Manage Lower Level',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_CTRL_NMBR_ADMIN',
								action: 'Lower Level Manage PE control number',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_BILL_SMRY_ADMIN',
								action: 'Lower Level Manage PE billing summary',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_ADMIN',
								action: 'Lower Level Manage PE (PE Structure',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_CRT_ADMIN',
								action: 'Lower Level Manage PE (PE Structure) Add',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_EDT_ADMIN',
								action: 'Lower Level Manage PE (PE Structure) Edit',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_STRCTR_DLT_ADMIN',
								action: 'Lower Level Manage PE (PE Structure) Delete',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_ADMIN',
								action: 'Lower Level Manage PE (PE users)',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_CRT_ADMIN',
								action: 'Lower Level Manage PE (PE users) Create',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_EDIT_ADMIN',
								action: 'Lower Level Manage PE (PE users) Edit',
							},
							{
								key: 'ROLE_LOWER_LEVEL_PE_MNGT_PE_MANAGE_PE_USERS_DELETE_ADMIN',
								action: 'Lower Level Manage PE (PE users) Delete',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_UPDATE_USR_DTLS_ADMIN',
								action:
									'Lower Level Manage PE (PE users) Update Already Activate',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_RSND_EMAIL_ADMIN',
								action:
									'Lower Level Manage PE (PE users) Resend activation email',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_MNG_ROLE_ADMIN',
								action: 'Lower Level Manage PE (PE users) - Manage roles',
							},
							{
								key: 'ROLE_ROLE_LOWER_LEVEL_PE_MNGT_PE_DELETE_AO_HPMU_ADMIN',
								action:
									'Lower Level Delete Account for Account Officer and HPMU',
							},
						],
						route: [
							'',
							'modules',
							'pe-management',
							'lower-level-pe-list',
							'pe-lower-level',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
					{
						name: 'Financial Year',
						key: 'lowerLevelFinancialYear',
						authority: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_FNC_YR',
						permission: [
							{
								key: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_FNC_YR',
								action: 'Set lower level financial year',
							},
						],
						route: [
							'',
							'modules',
							'pe-management',
							'lower-level-pe-list',
							'financial-year',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
					{
						name: 'Department Setting',
						key: 'lowerLevelDepartment',
						authority: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_VIEW',
						permission: [
							{
								key: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_CREATE',
								action: 'Create Department Level',
							},
							{
								key: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_VIEW',
								action: 'View Department Level',
							},
							{
								key: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_EDIT',
								action: 'Edit Department Level',
							},
							{
								key: 'ROLE_LOWER_LEVEL_DEPARTMENT_MNGT_PE_LIST_DELETE',
								action: 'Delete Department Level',
							},
						],
						route: [
							'',
							'modules',
							'pe-management',
							'lower-level-pe-list',
							'lower-department',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
				],
			},
			{
				name: 'PE Expert List',
				route: ['', 'modules', 'pe-management', 'expert-list'],
				icon: 'person',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_EXPERT_LIST',
				permission: [
					{ key: 'ROLE_PE_MNGT_PE_EXPERT_LIST', action: 'View PE Expert list' },
					{
						key: 'ROLE_PE_MNGT_PE_EXPERT_LIST_EDIT',
						action: 'Verify PE admin list',
					},
				],
			},
			{
				name: 'PE Stats Viewer Mappings',
				route: ['', 'modules', 'pe-management', 'pe-mapping-viewer'],
				icon: 'person',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_MAPPING_VIEWER',
				permission: [
					{
						key: 'ROLE_PE_MNGT_PE_MAPPING_VIEWER',
						action: 'View PE Stats Viewer Mappings',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MAPPING_VIEWER_CREATE',
						action: 'Create PE Stats Viewer Mappings',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MAPPING_VIEWER_UPDATE',
						action: 'Update PE Stats Viewer Mappings',
					},
					{
						key: 'ROLE_PE_MNGT_PE_MAPPING_VIEWER_DELETE',
						action: 'Delete PE Stats Viewer Mappings',
					},
				],
			},
			{
				name: 'CAG Auditors Management',
				route: ['', 'modules', 'pe-management', 'pe-auditors-management'],
				icon: 'person',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_AUDITOR_MANAGEMENT',
				permission: [
					{
						key: 'ROLE_PE_MNGT_PE_AUDITOR_MANAGEMENT',
						action: 'View PE CAG Auditors Management',
					},
					{
						key: 'ROLE_PE_MNGT_PE_AUDITOR_MANAGEMENT_CREATE',
						action: 'Create PE CAG Auditors Management',
					},
					{
						key: 'ROLE_PE_MNGT_PE_AUDITOR_MANAGEMENT_UPDATE',
						action: 'Update PE CAG Auditors Management',
					},
					{
						key: 'ROLE_PE_MNGT_PE_AUDITOR_MANAGEMENT_DELETE',
						action: 'Delete PE CAG Auditors Management',
					},
				],
			},
			{
				name: 'PE Admin List',
				route: ['', 'modules', 'pe-management', 'admin-list'],
				icon: 'person',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_ADMIN_LIST',
				permission: [
					{ key: 'ROLE_PE_MNGT_PE_ADMIN_LIST', action: 'View PE admin list' },
					{
						key: 'ROLE_PE_MNGT_PE_ADMIN_LIST_EDIT',
						action: 'Edit PE admin list',
					},
					{
						key: 'ROLE_PE_MNGT_PE_ADMIN_LIST_RESEND_CD',
						action: 'Resend activation code',
					},
				],
			},
			{
				name: 'PE User List',
				route: ['', 'modules', 'pe-management', 'pe-user-list'],
				icon: 'person',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_USER_LIST',
				permission: [
					{ key: 'ROLE_PE_MNGT_PE_USER_LIST', action: 'View PE User list' },
					{
						key: 'ROLE_PE_MNGT_PE_USER_LIST_EDIT',
						action: 'Edit PE User list',
					},
					{
						key: 'ROLE_PE_MNGT_PE_USER_LIST_VIEW_MORE',
						action: 'View user details',
					},
				],
			},
			{
				name: 'Delete Approval',
				route: ['', 'modules', 'pe-management', 'delete-approval'],
				icon: 'delete',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_DELETE_APPROVAL',
				permission: [
					{
						key: 'ROLE_PE_MNGT_DELETE_APPROVAL',
						action: 'View delete approval',
					},
					{
						key: 'ROLE_PE_MNGT_DELETE_APPROVAL_CNFRM_DLT',
						action: 'Confirm deletion',
					},
				],
			},
			{
				name: 'Administrative Areas',
				authority: 'ROLE_PE_MNGT_ADMNSTRTV_AREA',
				permission: [
					{
						key: 'ROLE_PE_MNGT_ADMNSTRTV_AREA',
						action: 'View administrative areas',
					},
				],
				route: ['', 'modules', 'pe-management', 'administrative-area'],
				icon: 'account_balance',
				iconType: 'MATERIAL',
			},
			{
				name: ' Sub-Warranty Codes Management',
				authority: 'ROLE_PE_MNGT_SUB_WARRANTY',
				permission: [
					{ key: 'ROLE_PE_MNGT_SUB_WARRANTY', action: 'View PE Sub Warranty' },
					{
						key: 'ROLE_PE_MNGT_SUB_WARRANTY_EDIT',
						action: 'Edit PE Sub Warranty',
					},
					{
						key: 'ROLE_PE_MNGT_SUB_WARRANTY_CREATE',
						action: 'Create PE Sub Warranty',
					},
				],
				route: ['', 'modules', 'pe-management', 'pe-sub-warranty-codes'],
				icon: 'category',
				iconType: 'MATERIAL',
			},
			{
				name: 'PE Category',
				authority: 'ROLE_PE_MNGT_CATEGORY',
				permission: [
					{ key: 'ROLE_PE_MNGT_CATEGORY', action: 'View PE category' },
					{ key: 'ROLE_PE_MNGT_CATEGORY_EDIT', action: 'Edit PE category' },
					{ key: 'ROLE_PE_MNGT_CATEGORY_CREATE', action: 'Create PE category' },
				],
				route: ['', 'modules', 'pe-management', 'pe-category'],
				icon: 'category',
				iconType: 'MATERIAL',
			},
			{
				name: 'Specifications Authority',
				authority: 'ROLE_PE_MNGT_SPCFCTN_AUTHRT',
				permission: [
					{
						key: 'ROLE_PE_MNGT_SPCFCTN_AUTHRT',
						action: 'View specifications authority',
					},
					{
						key: 'ROLE_PE_MNGT_SPCFCTN_AUTHRT_CREATE',
						action: 'Create specifications authority',
					},
					{
						key: 'ROLE_PE_MNGT_SPCFCTN_AUTHRT_EDIT',
						action: 'Edit specifications authority',
					},
					{
						key: 'ROLE_PE_MNGT_SPCFCTN_AUTHRT_DELETE',
						action: 'Delete specifications authority',
					},
				],
				route: ['', 'modules', 'pe-management', 'competent-authority'],
				icon: 'assessment',
				iconType: 'MATERIAL',
			},
			{
				name: 'BOQs Authority',
				authority: 'ROLE_PE_MNGT_BOQS_AUTHRT',
				permission: [
					{ key: 'ROLE_PE_MNGT_BOQS_AUTHRT', action: 'View BOQs authority' },
					{
						key: 'ROLE_PE_MNGT_BOQS_AUTHRT_CREATE',
						action: 'Create BOQs authority',
					},
					{
						key: 'ROLE_PE_MNGT_BOQS_AUTHRT_EDIT',
						action: 'Edit BOQs authority',
					},
					{
						key: 'ROLE_PE_MNGT_BOQS_AUTHRT_DELETE',
						action: 'Delete BOQs authority',
					},
				],
				route: ['', 'modules', 'pe-management', 'boq-authority'],
				icon: 'assessment',
				iconType: 'MATERIAL',
			},
			{
				name: 'Hand Over',
				authority: 'ROLE_PE_MNGT_HAND_OVR',
				permission: [
					{ key: 'ROLE_PE_MNGT_HAND_OVR', action: 'View hand over' },
				],
				route: ['', 'modules', 'pe-management', 'hand-over'],
				icon: 'work_off',
				iconType: 'MATERIAL',
			},
			{
				name: 'Embassy List',
				route: ['', 'modules', 'pe-management', 'embassy-list'],
				icon: 'assignment',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_EMBASSY_LIST',
				permission: [
					{ key: 'ROLE_PE_MNGT_EMBASSY_LIST', action: 'View embassy list' },
					{ key: 'ROLE_PE_MNGT_EMBASSY_CREATE', action: 'Create embassy list' },
					{ key: 'ROLE_PE_MNGT_EMBASSY_EDIT', action: 'Edit embassy list' },
					{
						key: 'ROLE_PE_MNGT_EMBASSY_MANAGE',
						action: 'Manage embassy details',
					},
				],
			},
			{
				name: 'Donor Type',
				route: ['', 'modules', 'pe-management', 'donor-type'],
				icon: 'credit_card',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_DONOR_TYP',
				permission: [
					{ key: 'ROLE_PE_MNGT_DONOR_TYP', action: 'View donor type' },
					{ key: 'ROLE_PE_MNGT_DONOR_TYP_CREATE', action: 'Create donor type' },
					{ key: 'ROLE_PE_MNGT_DONOR_TYP_EDIT', action: 'Edit donor type' },
					{ key: 'ROLE_PE_MNGT_DONOR_TYP_DELETE', action: 'Delete donor type' },
				],
			},
			{
				name: 'Donor List',
				route: ['', 'modules', 'pe-management', 'donor-list'],
				icon: 'list',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_DONOR_LIST',
				permission: [
					{ key: 'ROLE_PE_MNGT_DONOR_LIST', action: 'View donor list' },
					{
						key: 'ROLE_PE_MNGT_DONOR_LIST_CREATE',
						action: 'Create donor list',
					},
					{ key: 'ROLE_PE_MNGT_DONOR_LIST_EDIT', action: 'Edit donor list' },
					{
						key: 'ROLE_PE_MNGT_DONOR_LIST_DELETE',
						action: 'Delete donor list',
					},
				],
			},
			{
				name: 'Global Settings',
				key: 'versionSettings',
				route: ['', 'modules', 'pe-management', 'version-setting-admin'],
				icon: 'assignment',
				iconType: 'MATERIAL',
				authority: 'ROLE_PE_MNGT_PE_LIST_VERSION_SETTING',
				permission: [],
			},
		],
	},
];
