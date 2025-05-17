import { MenuOption } from '../menu-options';

export const SharedData: MenuOption[] = [
	{
		name: 'Shared Data',
		shortName: 'Shared Data',
		authority: 'ROLE_MODULE_SHARED_DATA',
		permission: [
			{
				key: 'ROLE_MODULE_SHARED_DATA',
				action: 'View NeST shared data',
			},
		],
		route: ['', 'modules', 'shared-data'],
		pathRoute: ['', 'modules', 'shared-data', 'works-awards'],
		description: 'NeST shared data',
		icon: 'shared_data',
		iconType: 'SVG',
		children: [
			{
				name: 'Works Awards',
				authority: 'ROLE_MODULE_SHARED_DATA_AWARDS',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_DATA_AWARDS',
						action: 'View works shared award data',
					},
				],
				route: ['', 'modules', 'shared-data', 'works-awards'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'All Awards',
				authority: 'ROLE_MODULE_SHARED_DATA_ALL_AWARDS',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_DATA_ALL_AWARDS',
						action: 'View all shared awards data',
					},
				],
				route: ['', 'modules', 'shared-data', 'all-awards'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'Signed Framework Tenderers',
				authority: 'ROLE_MODULE_SHARED_SIG_FW_TNDRS',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_SIG_FW_TNDRS',
						action: 'View signed frameworks tenderer',
					},
				],
				route: ['', 'modules', 'shared-data', 'signed-framework-tenderer'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'PE Procurements',
				authority: 'ROLE_MODULE_SHARED_PE_PRCMENTS',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_PE_PRCMENTS',
						action: 'View pe procurement',
					},
				],
				route: ['', 'modules', 'shared-data', 'pe-procurement'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'PE Not Using Nest',
				authority: 'ROLE_MODULE_SHARED_PE_NT_USN_NST',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_PE_NT_USN_NST',
						action: 'View pe not using NeST',
					},
				],
				route: ['', 'modules', 'shared-data', 'pe-not-using-nest'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'Bill Fee Collection',
				authority: 'ROLE_MODULE_SHARED_BLL_FEE_CLL',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_BLL_FEE_CLL',
						action: 'View Bill Fee CollectionT',
					},
				],
				route: ['', 'modules', 'shared-data', 'bill-fee-collection'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'Frequency Of Procurement',
				authority: 'ROLE_MODULE_SHARED_FREQ_OF_PROC',
				permission: [
					{
						key: 'ROLE_MODULE_SHARED_FREQ_OF_PROC',
						action: 'View Frequency Of Procurement',
					},
				],
				route: ['', 'modules', 'shared-data', 'frequency-of-procurement'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
			{
				name: 'Awarded Tenders By Business Lines',
				authority: 'ROLE_MODULE_AWARDED_TENDERS_BY_BL',
				permission: [
					{
						key: 'ROLE_MODULE_AWARDED_TENDERS_BY_BL',
						action: 'View Awarded Tenders By Business Lines',
					},
				],
				route: ['', 'modules', 'shared-data', 'awarded-tenders-by-business-lines'],
				icon: 'tenderAwards',
				iconType: 'SVG',
			},
		],
	},
];
