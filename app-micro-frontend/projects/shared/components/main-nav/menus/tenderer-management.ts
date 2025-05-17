import { MenuOption } from '../menu-options';

export const TendererManagement: MenuOption[] = [
	{
		name: 'Tenderer Management',
		shortName: 'Tenderer Management',
		route: ['', 'modules', 'tenderer-management'],
		pathRoute: ['', 'modules', 'tenderer-management', 'dashboard'],
		description: 'Manage Tenderer Registration and Subscriptions',
		icon: 'briefcase',
		iconType: 'SVG',
		authority: 'ROLE_MODULES_TNDRR_MNGT',
		permission: [
			{
				key: 'ROLE_MODULES_TNDRR_MNGT',
				action: '',
			},
		],
		children: [
			{
				name: 'Dashboard',
				authority: 'ROLE_TNDRR_MNGT_DASHBOARD',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_DASHBOARD',
						action: 'View Tenderer Dashboard',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'dashboard'],
				icon: 'dashboard',
				iconType: 'MATERIAL',
			},
			{
				name: 'Search Information',
				authority: 'ROLE_TNDRR_MNGT_DASHBOARD',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_DASHBOARD',
						action: 'Fetch Tender Information',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'search-tenderer'],
				icon: 'search',
				iconType: 'MATERIAL',
			},
			{
				name: 'Tenderer Registration',
				key: 'tenderer',
				authority: 'ROLE_TNDRR_MNGT_TENDERER_REG',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_TENDERER_REG',
						action: 'View Tenderer Registration',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'tenderer'],
				icon: 'users',
				iconType: 'SVG',
				children: [
					{
						name: 'Waiting for Approval',
						key: 'waiting_for_approval',
						authority: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL',
								action: 'View Tenderer waiting for approval',
							},
							{
								key: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL_REVIEW',
								action: 'Review tenderer waiting for approval',
							},
							{
								key: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL_BLACKLIST',
								action: 'Blacklist tenderer waiting for approval',
							},
							{
								key: 'ROLE_TNDRR_MNGT_VIEW_NAME',
								action: 'View Approver Email',
							},
							{
								key: 'ROLE_TNDRR_MNGT_RETURNED_ALL_BUSINESS_LINES',
								action: 'Return All Business Lines',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'all-registration',
						],
					},
					{
						name: 'Business Line Expired',
						key: 'businessLineExpired',
						authority: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL',
								action: 'View Tenderer Business Line Expired',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'all-business-expired',
						],
					},
					{
						name: 'Returned for Correction',
						key: 'returned_for_correction',
						authority: 'ROLE_TNDRR_MNGT_WAITING_APPROVAL',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_RETURN_COLLECTION',
								action: 'View Tenderer return for collection',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'return-collection',
						],
					},
					{
						name: 'Partially Approved',
						key: 'partially_approved',
						authority: 'ROLE_TNDRR_MNGT_PARTIALLY_APPROVED',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_PARTIALLY_APPROVED',
								action: 'View Tenderer partial approved',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'partial-approved',
						],
					},
					{
						name: 'Approved Registrations',
						key: 'approved',
						authority: 'ROLE_TNDRR_MNGT_APPROVED',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_APPROVED',
								action: 'View approved tenderer',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'approved-tenderer',
						],
					},

					{
						name: 'Approval Management',
						key: 'approved',
						authority: 'ROLE_TNDRR_BLINE_REVOKE',
						permission: [
							{
								key: 'ROLE_TNDRR_BLINE_REVOKE',
								action: 'Manage approved tenderer',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'approval-management',
						],
					},
					{
						name: 'All Tenderer',
						key: 'all-tenderer',
						authority: 'ROLE_MODULES_TNDRR_MNGT_ALL_TNDRR',
						permission: [
							{
								key: 'ROLE_MODULES_TNDRR_MNGT_ALL_TNDRR',
								action: 'View all tenderer',
							},
							{
								key: 'ROLE_MODULES_TNDRR_MNGT_ALL_TNDRR_BILL_SMRY',
								action: 'View tenderer billing summary',
							},
							{
								key: 'ROLE_CHANGE_TNDR_PROFILE',
								action:
									'Reset Tenderer Registration/Reset email if tenderer not receive notification',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'all-tenderer',
						],
					},
					{
						name: 'Tenderer TIN Mismatch',
						key: 'tenderer-tin-mismatch',
						authority: 'ROLE_MODULES_TNDRR_MNGT_TIN_MSMTCH',
						permission: [
							{
								key: 'ROLE_MODULES_TNDRR_MNGT_TIN_MSMTCH',
								action: 'View tenderer tin mismatch',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'tenderer',
							'tenderer-tin-mismatch',
						],
					},
				],
			},
			{
				name: 'BlackListed Tenderers',
				key: 'blacklist',
				authority: 'ROLE_TNDRR_MNGT_BLACKLIST',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_BLACKLIST',
						action: 'View blacklisted tenderer',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'blacklist'],
				icon: 'users',
				iconType: 'SVG',
				children: [
					{
						name: 'Active',
						key: 'blacklist',
						authority: 'ROLE_TNDRR_MNGT_ACTIVE_BLACKLIST',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_ACTIVE_BLACKLIST',
								action: 'View active blacklisted tenderer',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'blacklist',
							'blacklisted-tenderers',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
					{
						name: 'Archive',
						key: 'archive',
						authority: 'ROLE_TNDRR_MNGT_ARCHIVED_BLACKLIST',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_ARCHIVED_BLACKLIST',
								action: 'View archived  blacklisted tenderer',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'blacklist',
							'blacklisted-archive',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
				],
			},
			{
				name: 'Approver Assignment',
				key: 'assignment',
				authority: 'ROLE_TNDRR_MNGT_APPROVER_ASSIGNMENT',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_APPROVER_ASSIGNMENT',
						action: 'View approver assignment menu',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'assignment'],
				icon: 'users',
				iconType: 'SVG',
				children: [
					{
						name: 'Assigned Users',
						key: 'assignment',
						authority: 'ROLE_TNDRR_MNGT_ASSIGNED_USERS',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_ASSIGNED_USERS',
								action: 'View assigned staff for approval',
							},
							{
								key: 'ROLE_TNDRR_MNGT_ASSIGNED_USERS_CREATE',
								action: 'Create assigned staff for approval',
							},

							{
								key: 'ROLE_TNDRR_MNGT_ASSIGNED_USERS_DELETE',
								action: 'Delete assigned staff for approval',
							},
							{
								key: 'ROLE_TNDRR_MNGT_ASSIGNED_USERS_ASSGND_BUSNSSLNES',
								action: 'Manage staff assigned business line',
							},
							{
								key: 'ROLE_TNDRR_MNGT_ASSIGNED_USERS_ASSGNDf_BUSNSSLNES_DELETE',
								action: 'Can delete assigned business line',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'assignment',
							'assigned-users',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
				],
			},
			{
				name: 'Joint Venture Consortium',
				authority: 'ROLE_TNDRR_MNGT_JVC',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_JVC',
						action: 'View all JVC',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'all-joint-venture'],
				icon: 'next_week',
				iconType: 'MATERIAL',
			},
			{
				name: 'Special Groups',
				authority: 'ROLE_TNDRR_MNGT_SPECIAL_GROUP',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_SPECIAL_GROUP',
						action: 'View special groups',
					},
					{
						key: 'ROLE_TNDRR_MNGT_SPECIAL_GROUP_CREATE',
						action: 'Create special groups',
					},
					{
						key: 'ROLE_TNDRR_MNGT_SPECIAL_GROUP_EDIT',
						action: 'Edit special groups',
					},
					{
						key: 'ROLE_TNDRR_MNGT_SPECIAL_GROUP_DELETE',
						action: 'Delete special groups',
					},
					{
						key: 'ROLE_TNDRR_MNGT_SPECIAL_GROUP_MEMBERS',
						action: 'Manage special group members',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'special-groups'],
				icon: 'people',
				iconType: 'MATERIAL',
			},
			{
				name: 'Government Enterprise',
				authority: 'ROLE_TNDRR_MNGT_GOVERNMENT_ENTERPRISE',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_GOVERNMENT_ENTERPRISE',
						action: 'View Government Enterprise',
					},
					{
						key: 'ROLE_TNDRR_MNGT_GOVERNMENT_ENTERPRISE_CREATE',
						action: 'Create Government Enterprise',
					},
					{
						key: 'ROLE_TNDRR_MNGT_GOVERNMENT_ENTERPRISE_EDIT',
						action: 'Edit Government Enterprise',
					},
					{
						key: 'ROLE_TNDRR_MNGT_GOVERNMENT_ENTERPRISE_DELETE',
						action: 'Delete Government Enterprise',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'government-enterprise'],
				icon: 'people',
				iconType: 'MATERIAL',
			},
			{
				name: 'Government Service',
				authority: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE',
						action: 'Manage Government Service',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'government-service'],
				icon: 'people',
				iconType: 'MATERIAL',
				children: [
					{
						name: 'Dashboard',
						authority: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICES',
								action: 'View Government Services',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICES_CREATE',
								action: 'Create Government Services',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICES_EDIT',
								action: 'Edit Government Services',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICES_DELETE',
								action: 'Delete Government Services',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'government-service',
							'government-services',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
					{
						name: 'Government Service Catalogue Group',
						authority: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_CTLGUE_GRP',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_CTLGUE_GRP',
								action: 'View Government Service Catalogue Group',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_CTLGUE_GRP_CREATE',
								action: 'Create Government Service Catalogue Group',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_CTLGUE_GRP_EDIT',
								action: 'Edit Government Service Catalogue Group',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_CTLGUE_GRP_DELETE',
								action: 'Delete Government Service Catalogue Group',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'government-service',
							'government-service-catalogue-group',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
					{
						name: 'Government Service Provider',
						authority: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_PROVIDER',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_PROVIDER',
								action: 'View Government Service Provider',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_PROVIDER_CREATE',
								action: 'Create Government Service Provider',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_PROVIDER_EDIT',
								action: 'Edit Government Service Provider',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_PROVIDER_DELETE',
								action: 'Delete Government Service Provider',
							},
							{
								key: 'ROLE_TNDRR_MNGT_GOVERNMENT_SERVICE_PROVIDER_MNG_SRVC',
								action: 'Manage Government Service Provider Services',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'government-service',
							'government-service-provider',
						],
						icon: 'people',
						iconType: 'MATERIAL',
					},
				],
			},
			{
				name: 'Manufacturers',
				authority: 'ROLE_TNDRR_MNGT_MANUFACTURER',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_MANUFACTURER',
						action: 'View Manufacturer Enterprise',
					},
					{
						key: 'ROLE_TNDRR_MNGT_MANUFACTURER_CREATE',
						action: 'Create Manufacturer Enterprise',
					},
					{
						key: 'ROLE_TNDRR_MNGT_MANUFACTURER_EDIT',
						action: 'Edit Manufacturer Enterprise',
					},
					{
						key: 'ROLE_TNDRR_MNGT_MANUFACTURER_DELETE',
						action: 'Delete Manufacturer Enterprise',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'manufacturers'],
				icon: 'people',
				iconType: 'MATERIAL',
			},
			{
				name: 'Setting',
				key: 'settings',
				authority: 'ROLE_TNDRR_MNGT_SETTING',
				permission: [
					{
						key: 'ROLE_TNDRR_MNGT_SETTING',
						action: 'Manage tenderer management settings',
					},
				],
				route: ['', 'modules', 'tenderer-management', 'settings'],
				icon: 'settings',
				iconType: 'MATERIAL',
				children: [
					{
						name: 'Tender Categories',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDER_CATEGORIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_CATEGORIES',
								action: 'View tender categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_CATEGORIES_CREATE',
								action: 'Create tender categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_CATEGORIES_EDIT',
								action: 'Edit tender categories',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tender-categories',
						],
					},
					{
						name: 'Tender Sub Categories',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDER_SUB_CATEGORIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_SUB_CATEGORIES',
								action: 'View tender sub categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_SUB_CATEGORIES_CREATE',
								action: 'Create tender sub categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_SUB_CATEGORIES_EDIT',
								action: 'Edit tender sub categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDER_SUB_CATEGORIES_DELETE',
								action: 'Delete tender sub categories',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tender-sub-category',
						],
					},
					{
						name: 'Gov Compliance',
						authority: 'ROLE_TNDRR_MNGT_SETTING_GOV_COMPLIANCE',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_GOV_COMPLIANCE',
								action: 'View Government Compliance',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_GOV_COMPLIANCE_CREATE',
								action: 'Create Government Compliance',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_GOV_COMPLIANCE_EDIT',
								action: 'Edit Government Compliance',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'gov-compliance',
						],
					},
					{
						name: 'Sector',
						authority: 'ROLE_TNDRR_MNGT_SETTING_SECTOR',
						permission: [
							{ key: 'ROLE_TNDRR_MNGT_SETTING_SECTOR', action: 'View sector' },
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SECTOR_CREATE',
								action: 'Create sector',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SECTOR_EDIT',
								action: 'Edit sector',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SECTOR_DELETE',
								action: 'Delete sector',
							},
						],
						route: ['', 'modules', 'tenderer-management', 'settings', 'sector'],
					},
					{
						name: 'Sub Sector',
						authority: 'ROLE_TNDRR_MNGT_SETTING_SUB_SECTOR',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SUB_SECTOR',
								action: 'View sub sector',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SUB_SECTOR_CREATE',
								action: 'Create sub sector',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SUB_SECTOR_EDIT',
								action: 'Edit sub sector',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SUB_SECTOR_DELETE',
								action: 'Delete sub sector',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'sub-sector',
						],
					},
					{
						name: 'Business Lines',
						authority: 'ROLE_TNDRR_MNGT_SETTING_BUSINESS_LINES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BUSINESS_LINES',
								action: 'View business line',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BUSINESS_LINES_COMMODITIES',
								action: 'View business line commodities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BUSINESS_LINES_CREATE',
								action: 'Create business line',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BUSINESS_LINES_EDIT',
								action: 'Edit business line',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BUSINESS_LINES_DELETE',
								action: 'Delete business line',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'business-lines',
						],
					},
					{
						name: 'Commodities',
						authority: 'ROLE_TNDRR_MNGT_SETTING_COMMODITIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COMMODITIES',
								action: 'View commodities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COMMODITIES_CREATE',
								action: 'Create commodities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COMMODITIES_EDIT',
								action: 'Edit commodities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COMMODITIES_ST_PRC_CP',
								action: 'Set commodities price cap',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COMMODITIES_ST_GFS_CD',
								action: 'Set commodities GFS code',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'commodities',
						],
					},
					{
						name: 'Statutory Boards',
						authority: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD',
								action: 'View statutory boards',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD_CREATE',
								action: 'Create statutory boards',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD_EDIT',
								action: 'Edit statutory boards',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD_DELETE',
								action: 'Delete statutory boards',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD_VLDTN_TYPE',
								action: 'Manage statutory board validation type',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD_USER_MNGMNT',
								action: 'View Statutory board user managements',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_STATUTORY_BOARD_USER_MNGMNT_CREATE',
								action: 'Create statutory board user',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'statutory-board',
						],
					},
					// {
					//   name: 'Licence Authority',
					// permission: [],
					// route: [
					//     '',
					//     'modules',
					//     'tenderer-management',
					//     'settings',
					//     'licence-authority',
					//   ],
					// },
					{
						name: 'Line Configuration',
						authority: 'ROLE_TNDRR_MNGT_SETTING_LINE_CONFIGURATION',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_LINE_CONFIGURATION',
								action: 'View line configuration',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_LINE_CONFIGURATION_CREATE',
								action: 'Create line configuration',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_LINE_CONFIGURATION_EDIT',
								action: 'Edit line configuration',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_LINE_CONFIGURATION_DELETE',
								action: 'Delete line configuration',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_LINE_CONFIGURATION_DELETE_INDV',
								action: 'Delete individual business line configuration',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'business-line-configuration',
						],
					},
					{
						name: 'Tenderer Attachment',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_ATTACHMENT',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_ATTACHMENT',
								action: 'View Tenderer Attachment',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_ATTACHMENT_CREATE',
								action: 'Create Tenderer Attachment',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_ATTACHMENT_EDIT',
								action: 'Edit Tenderer Attachment',
							},
							// {key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_ATTACHMENT_DELETE', action: 'Delete Tenderer Attachment'},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'attachment-type',
						],
					},
					{
						name: 'Tenderer Category Type Mapping',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORY_MAPPING',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORY_MAPPING',
								action: 'View tenderer category mapping',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORY_MAPPING_CREATE',
								action: 'Create tenderer category mapping',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORY_MAPPING_EDIT',
								action: 'Edit tenderer category mapping',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORY_MAPPING_DELETE',
								action: 'Delete tenderer category mapping',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tenderer-type-category-mapping',
						],
					},
					// {
					//   name: 'Global Line Configuration',
					//   authority:"ROLE_TNDRR_MNGT_SETTING_GLOBAL_LINE_CONFIG",
					//   permission: [
					//     {key: 'ROLE_TNDRR_MNGT_SETTING_GLOBAL_LINE_CONFIG', action: 'View global line configuration'},
					//     {key: 'ROLE_TNDRR_MNGT_SETTING_GLOBAL_LINE_CONFIG_CREATE', action: 'Create global line configuration'},
					//     {key: 'ROLE_TNDRR_MNGT_SETTING_GLOBAL_LINE_CONFIG_EDIT', action: 'Edit global line configuration'},
					//   ],
					//   route: [
					//     '',
					//     'modules',
					//     'tenderer-management',
					//     'settings',
					//     'global-business-line-configuration',
					//   ],
					// },
					{
						name: 'Countries Settings',
						authority: 'ROLE_TNDRR_MNGT_SETTING_C0UNTRIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_C0UNTRIES',
								action: 'View country settings',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_C0UNTRIES_CREATE',
								action: 'Create country settings',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_C0UNTRIES_EDIT',
								action: 'Edit country settings',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'countries',
						],
					},
					{
						name: 'Validation Types',
						authority: 'ROLE_TNDRR_MNGT_SETTING_VALIDATION_TYPES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_VALIDATION_TYPES',
								action: 'View validation types',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_VALIDATION_TYPES_CREATE',
								action: 'Create validation types',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_VALIDATION_TYPES_EDIT',
								action: 'Edit validation types',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_VALIDATION_TYPES_DELETE',
								action: 'Delete validation types',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'validation-types',
						],
					},
					{
						name: 'Tenderer Categories',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORIES',
								action: 'View tenderer categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORIES_CREATE',
								action: 'Create tenderer categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORIES_EDIT',
								action: 'Edit tenderer categories',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_CATEGORIES_DELETE',
								action: 'Delete tenderer categories',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tenderer-management',
						],
					},
					{
						name: 'Tenderer Source of Fund',
						authority: 'ROLE_TNDRR_MNGT_SETTING_SOURCE_FUND',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SOURCE_FUND',
								action: 'View tenderer source of fund',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SOURCE_FUND_CREATE',
								action: 'Create tenderer source of fund',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SOURCE_FUND_EDIT',
								action: 'Edit tenderer source of fund',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_SOURCE_FUND_DELETE',
								action: 'Delete tenderer source of fund',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tenderer-source-of-fund',
						],
					},
					{
						name: 'Tenderer Types',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_TYPES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_TYPES',
								action: 'View tenderer types',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_TYPES_CREATE',
								action: 'Create tenderer types',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_TYPES_EDIT',
								action: 'Edit tenderer types',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDERER_TYPES_DELETE',
								action: 'Delete tenderer types',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tenderer-type',
						],
					},
					{
						name: 'Countries Business Registration Authorities',
						authority: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_BUS_REG_AUTHORITIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_BUS_REG_AUTHORITIES',
								action: 'View countries business registration authorities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_BUS_REG_AUTHORITIES_CREATE',
								action: 'Create countries business registration authorities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_BUS_REG_AUTHORITIES_EDIT',
								action: 'Edit countries business registration authorities',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'countries-business-authority-data',
						],
					},
					{
						name: 'Countries Tax Authorities',
						authority: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_TAX_AUTHORITIES',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_TAX_AUTHORITIES',
								action: 'View countries tax authorities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_TAX_AUTHORITIES_CREATE',
								action: 'Create countries tax authorities',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_COUNTRIES_TAX_AUTHORITIES_EDIT',
								action: 'Edit countries tax authorities',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'countries-tax-authority-data',
						],
					},
					{
						name: 'Bank Settings',
						authority: 'ROLE_TNDRR_MNGT_SETTING_BANK_DETAILS',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BANK_DETAILS',
								action: 'View tenderer profile',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BANK_DETAILS_CREATE',
								action: 'create tenderer profile',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BANK_DETAILS_EDIT',
								action: 'Edit tenderer profile',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_BANK_DETAILS_DELETE',
								action: 'Delete tenderer profile',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'bank-settings',
						],
					},
					{
						name: 'Tenderer Profile',
						authority: 'ROLE_TNDRR_MNGT_SETTING_TENDNERER_PROFILE',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDNERER_PROFILE',
								action: 'View tenderer profile',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDNERER_PROFILE_CREATE',
								action: 'create tenderer profile',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDNERER_PROFILE_EDIT',
								action: 'Edit tenderer profile',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_TENDNERER_PROFILE_DELETE',
								action: 'Delete tenderer profile',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'tenderer-profile',
						],
					},
					{
						name: 'Contract roles',
						authority: 'ROLE_TNDRR_MNGT_SETTING_CONTRACT_ROLE',
						permission: [
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_CONTRACT_ROLE',
								action: 'View contract role',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_CONTRACT_ROLE_CREATE',
								action: 'View contract role',
							},
							{
								key: 'ROLE_TNDRR_MNGT_SETTING_CONTRACT_ROLE_EDIT',
								action: 'View contract role',
							},
						],
						route: [
							'',
							'modules',
							'tenderer-management',
							'settings',
							'contract-role',
						],
					},
				],
			},
			// {
			//   name: 'Profile Setting',
			//   key: 'profile-settings',
			//   permission: ['ROLE_PPRA_USER_ROLE'],
			//   route: ['', 'modules', 'tenderer-management', 'profile-settings'],
			//   icon: 'settings',
			//   iconType: 'SVG',
			//   children: [
			//     {
			//       name: 'Academic Qualification',
			//       permission: [],
			//       route: [
			//         '',
			//         'modules',
			//         'tenderer-management',
			//         'profile-settings',
			//         'academic-qualification',
			//       ],
			//     },
			//     {
			//       name: 'Professional Certification',
			//       permission: [],
			//       route: [
			//         '',
			//         'modules',
			//         'tenderer-management',
			//         'profile-settings',
			//         'professional-certification',
			//       ],
			//     },
			//     {
			//       name: 'Equipment Types',
			//       permission: [],
			//       route: [
			//         '',
			//         'modules',
			//         'tenderer-management',
			//         'profile-settings',
			//         'equipment-types',
			//       ],
			//     },
			//     {
			//       name: 'Profile Section Visibility',
			//       permission: [],
			//       route: [
			//         '',
			//         'modules',
			//         'tenderer-management',
			//         'profile-settings',
			//         'profile-section-visibility',
			//       ],
			//     },
			//   ],
			// },
		],
	},
];
