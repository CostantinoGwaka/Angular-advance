export interface TableConfiguration {
	tableColumns: TableColumn[];
	exportColumns?: TableColumn[];
	tableCaption?: string;
	allowPagination?: boolean;
	allowCheckbox?: boolean;
	useRowClick?: boolean;
	tableNotifications?: any;
	actionIcons: TableAction;
	doneLoading?: any;
	selectedType?: any;
	deleting: { [id: string | number]: boolean };
	showSearch?: boolean;
	showBorder?: boolean;
	allowDataEdition?: boolean;
	showNumbers?: boolean;
	empty_msg?: string;
	customPrimaryMessage?: string;
	useFullObject?: boolean;
	active: { [id: string | number]: boolean };
	error?: any;
	loading?: any;
	hideExport?: any;
	tableList?: any[];
	hideSorting?: boolean;
	tableWrapperClass?: string;
	tableClass?: string;
	disableHasError?: boolean;
}

export interface TableColumn {
	name: string;
	label: string;
	type?: string;
	id?: string;
	info?: string;
	link?: string;
	disabled?: boolean;
	case?: 'titlecase' | 'uppercase' | 'lowercase' | string;
	align?: string;
	width?: string;
	isHidden?: boolean;
}

export interface TableAction {
	edit?: boolean;
	print?: boolean;
	more?: boolean;
	moreAction?: boolean;
	cancel?: boolean;
	download?: boolean;
	customPrimary?: boolean;
	chipColor?: 'green' | 'yellow' | 'red' | 'gray';
	delete?: boolean;
	expandable?: boolean;
	checkBox?: boolean;
}
