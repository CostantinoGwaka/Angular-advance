import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
	MatCheckboxChange,
	MatCheckboxModule,
} from '@angular/material/checkbox';
import { NotificationService } from '../../../../services/notification.service';
import {
	EditableSpecificationItem,
	FlatNestedSpecificationItemView,
	FlatNestedSpecificationItemViewType,
	NestedSpecificationItem,
} from '../store/model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgTemplateOutlet, DecimalPipe } from '@angular/common';

export interface NestedSpecificationActionResults {
	isSuccessful: boolean;
	message?: string;
	itemId?: number;
	itemUuid?: string;
	sourceUuid?: string;
}

export type NestedSpecificationsViewMode =
	| 'view'
	| 'edit'
	| 'select'
	| 'manage'
	| 'readOnly'
	| 'tendererEditing'
	| 'initiation';

@Component({
	selector: 'specification-group-item',
	templateUrl: './group-item.component.html',
	animations: [
		trigger('widthAnimation', [
			state(
				'initial',
				style({
					border: '0px solid #043e53',
					boxSizing: 'border-box;',
					marginTop: '0px',
				}),
			),
			state(
				'final',
				style({
					boxSizing: 'border-box;',
					border: '5px solid #043e53',
					marginTop: '-15px',
				}),
			),
			transition(
				'initial => final',
				animate(
					'200ms',
					style({
						boxShadow: '0px 10px 35px #888888',
					}),
				),
			),
			transition(
				'final => initial',
				animate(
					'400ms',
					style({
						boxShadow: '0px 0px 0px #888888',
					}),
				),
			),
			transition('initial => final', animate('200ms')),
			transition('final => initial', animate('400ms')),
		]),
	],
	standalone: true,
	imports: [
		NgTemplateOutlet,
		MatProgressBarModule,
		MatCheckboxModule,
		FormsModule,
		MatButtonModule,
		MatTooltipModule,
		MatRippleModule,
		MatIconModule,
		MatMenuModule,
		DecimalPipe,
	],
})
export class GroupItemComponent implements OnInit {
	@Input()
	level: number = 0;

	@Input()
	isExpandable = false;

	@Input()
	expandedItemId: string = null;

	@Input() showUnitRateColumn: boolean = true;

	@Input()
	expandedGroupId: number = null;

	@Output()
	onSortChildren = new EventEmitter<{
		description: string;
		parentId: string;
		type: FlatNestedSpecificationItemViewType;
	}>();

	@Input()
	initialMode: NestedSpecificationsViewMode = 'view';

	mode: NestedSpecificationsViewMode = null;

	@Input()
	addSpecificationText: string;

	@Input()
	currentGroupEditingGroupId: number = null;

	isLoading: boolean = false;

	showDeleteConfirmation: boolean = false;

	@Input()
	item: NestedSpecificationItem;

	@Input()
	groupId: number = null;

	@Input()
	saveFunction: Function;

	@Input()
	onItemSelection: Function;

	@Input()
	isExpanded = false;

	@Input()
	canModifyChildItem = false;

	@Input()
	deleteFunction: Function;

	@Output()
	onSave = new EventEmitter<any>();

	@Output()
	onExpand = new EventEmitter<NestedSpecificationItem>();

	@Output()
	onEdit = new EventEmitter<NestedSpecificationItem>();

	@Input()
	currentEditingItem: NestedSpecificationItem = null;

	@Input()
	currentFocusedEditingItem: NestedSpecificationItem = null;

	@Input()
	currentGroup: number = null;

	@Input()
	onMenuAction: Function;

	@ViewChild('descriptionRef') descriptionRef: ElementRef;
	@ViewChild('codeRef') codeRef: ElementRef;

	@Input()
	onItemRemove: (itemId: string) => void;

	@Input()
	onItemEditing: (item: NestedSpecificationItem, groupId: number) => void;

	@Input()
	onItemSaved: (details: { rowId: string; uuid: string; id: any }) => void;

	@Input()
	onViewItemsFilter: (
		filter_type: string,
		itemUuid: string,
	) => FlatNestedSpecificationItemView[];

	widthState = 'initial';

	constructor(private notificationService: NotificationService) { }

	ngOnInit() {
		this.widthState = 'initial';
		this.mode = this.initialMode;
	}

	ngAfterViewInit() { }

	onSelectionChange(change: MatCheckboxChange) {
		if (this.level == 0) {
			if (change.checked) {
				this.expand(this.item);
			} else {
				this.expand(null);
			}
		}
		this.onItemSelection(this.item, change.checked);
	}

	scrollToItemByRowId(rowId: string) {
		const element = document.getElementById('item-' + rowId);
		element.scrollIntoView({ block: 'start', behavior: 'smooth' });
	}

	setItemsSelection(item: NestedSpecificationItem, isSelected: boolean) {
		item.isSelected = isSelected;
		this.setSpecificationSelection(item.specifications, isSelected);

		for (let i = 0; i < item.children.length; i++) {
			// this.setItemsSelection(item.children[i], isSelected);
		}
	}

	setSpecificationSelection(
		items: EditableSpecificationItem[],
		isSelected: boolean,
	) {
		for (let i = 0; i < items.length; i++) {
			items[i].isSelected = isSelected;
		}
	}

	animate() {
		this.widthState = 'final';
		setTimeout(() => {
			this.widthState = 'initial';
		}, 200);
	}

	expandItem(event: Event, item: NestedSpecificationItem) {
		this.expand(item);
		event.stopPropagation();
	}

	expand(item: NestedSpecificationItem) {
		this.onExpand.emit(item);
	}

	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			this.save();
		}
	}

	stopPropagation(e: Event) {
		e.stopPropagation();
	}

	editItem() {
		this.onEdit.emit(this.item);
	}

	async save() {
		if (this.currentEditingItem?.code == '') {
			this.notificationService.errorMessage('Please enter item code');
			return;
		}

		if (this.currentEditingItem?.description == '') {
			this.notificationService.errorMessage('Please enter item description');
			return;
		}

		this.item = { ...this.currentEditingItem };
		this.isLoading = true;
		if (this.saveFunction) {
			let res: NestedSpecificationActionResults = await this.saveFunction(
				this.item.level == 0 ? 'main_item' : 'sub_item',
				this.item,
			);

			this.isLoading = false;

			if (res.isSuccessful) {
				this.onItemEditing(null, this.groupId);
				this.mode = this.initialMode;
				this.onItemSaved({
					rowId: this.item.rowId,
					uuid: res.itemUuid,
					id: res.itemId,
				});

				this.item.rowId = res.itemUuid;
				this.item.uuid = res.itemUuid;
				this.item.id = res.itemId;

				this.notificationService.successMessage(res.message);
			} else {
				this.notificationService.errorMessage(
					res?.message
						? res?.message
						: 'Unknown error occured, please try again later',
				);
			}
		}
	}

	async delete(attempt: number) {
		let children = this.onViewItemsFilter('get_child_views', this.item.uuid);

		if (children.length > 0) {
			this.notificationService.errorMessage(
				'Please delete the sub items and/or specifications first',
			);
		} else {
			if (attempt == 2) {
				this.showDeleteConfirmation = false;
				this.isLoading = true;

				let res: NestedSpecificationActionResults = await this.deleteFunction(
					this.item,
				);

				this.isLoading = false;

				if (res.isSuccessful) {
					this.menuAction('delete_item');
					this.notificationService.successMessage(res.message);
				} else {
					this.notificationService.errorMessage(res.message);
				}
			} else {
				this.showDeleteConfirmation = true;
			}
		}
	}

	sortChildren(type: FlatNestedSpecificationItemViewType) {
		this.onSortChildren.emit({
			parentId: this.item.uuid,
			description: this.item.description,
			type,
		});
	}

	menuAction(action: string) {
		if (this.level == 0) {
			this.expand(this.item);
		}
		this.onMenuAction({
			action,
			item: this.item,
		});
	}

	setFocus(input: 'code' | 'description') {
		setTimeout(() => {
			switch (input) {
				case 'code':
					this.codeRef?.nativeElement.focus();
					break;

				default:
					this.descriptionRef?.nativeElement.focus();
			}
		}, 100);
	}
}
