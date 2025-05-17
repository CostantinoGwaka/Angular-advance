import { MenuOption } from '../menu-options';

export const PEDashboard: MenuOption[] = [
	{
		name: 'PE Dashboard',
		shortName: 'PE Dashboard',
		authority: 'ROLE_MODULES_PE_DASH',
		permission: [
			{
				key: 'ROLE_MODULES_PE_DASH',
				action: 'View  PE Dashboard',
			},
		],
		route: ['', 'modules', 'pe-dashboard'],
		pathRoute: ['', 'modules', 'pe-dashboard', 'merged-main-req-summary'],
		description: 'PE Dashboard',
		icon: 'ppraDashboard',
		iconType: 'SVG',
		children: [
			{
				name: 'Tender Summary',
				authority: 'ROLE_MODULES_PE_DASH_TNDR_SUMMARY',
				permission: [
					{
						key: 'ROLE_MODULES_PE_DASH_TNDR_SUMMARY',
						action: 'View PE tender summary',
					},
				],
				route: ['', 'modules', 'pe-dashboard', 'merged-main-req-summary'],
				// icon: 'calendar_month',
				// iconType: 'SVG',
			},
			{
				name: 'Framework Summary',
				authority: 'ROLE_MODULES_PE_DASH_TNDR_SUMMARY',
				permission: [],
				route: ['', 'modules', 'pe-dashboard', 'framework-summary'],
			},
		],
	},
];
