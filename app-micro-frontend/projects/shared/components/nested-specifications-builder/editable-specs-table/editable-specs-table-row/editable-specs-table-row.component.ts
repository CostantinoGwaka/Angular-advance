import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../../services/notification.service';
import {
  NestedSpecificationActionResults,
  NestedSpecificationsViewMode,
} from '../../group-item/group-item.component';

import { NestedSpecificationsService } from '../../nested-specifications.service';
import {
  EditableSpecificationItem,
  EditableSpecificationItemBase,
  FlatNestedSpecificationItemView,
} from '../../store/model';
import { focusableFields } from '../editable-specs-item/editable-specs-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-editable-specs-table-row',
    templateUrl: './editable-specs-table-row.component.html',
    styleUrls: ['./editable-specs-table-row.component.scss'],
    standalone: true,
    imports: [
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule
],
})
export class EditableSpecsTableRowComponent implements OnInit {
  @Input()
  initialMode: NestedSpecificationsViewMode = 'view';

  @Input()
  allItemsView: FlatNestedSpecificationItemView[] = [];

  mode: NestedSpecificationsViewMode = 'view';

  @Input()
  specification: EditableSpecificationItem;

  focusedInput: focusableFields;

  @Input()
  onAction: Function;

  @Input()
  onItemSelection: (
    item: EditableSpecificationItemBase,
    isSelected: boolean
  ) => void;

  @Input()
  showValueColumn: boolean = true;

  @Input()
  showUnitOfMeasureColumn: boolean = true;

  @Input()
  showCodeOrSNColumn: boolean = false;

  @Input()
  saveFunction: (
    args: EditableSpecificationItemBase
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  deleteFunction: (
    args: EditableSpecificationItemBase
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  onViewItemsFilter: (
    filter_type: string,
    itemUuid: string
  ) => FlatNestedSpecificationItemView[];

  @Input()
  onItemRemove: (itemId: string) => void;

  @Input()
  items: EditableSpecificationItemBase[];

  isLoading: boolean = false;

  showDeleteConfirmation: boolean = false;

  editTendererQuantity = false;

  @Input()
  currentEditingItem: EditableSpecificationItemBase = {
    description: '',
    value: '',
  };

  @Input()
  onItemSaved: (details: { rowId: string; uuid: string; id: any }) => void;

  @ViewChild('parentEditorElement') parentEditorElement: ElementRef;

  @ViewChild('descriptionInputRef') descriptionInputRef: ElementRef;
  @ViewChild('valueInputRef') valueInputRef: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (!this.parentEditorElement?.nativeElement?.contains(event.target)) {
      if (this.specification.isNew && this.mode == 'edit') {
        this.onItemRemove(this.specification.rowId);
      }
      this.mode = this.initialMode;
    }
  }

  debounceTimer = null;

  showFull = false;
  descriptionLimit = 120;

  constructor(
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private nestedSpecificationsService: NestedSpecificationsService
  ) { }

  ngOnInit(): void {
    this.mode = this.initialMode;
    if (this.specification.isNew) {
      this.switchMode('edit', 'description');
    }
  }

  canEdit(
    item: EditableSpecificationItemBase,
    identifier: focusableFields | 'save_button' = null
  ) {
    return this.currentEditingItem?.uuid == item.uuid;
  }

  isClickable(indentifier: focusableFields = null) {
    return this.initialMode == 'manage' || this.specification.isEditable;
  }

  fieldIsEditable(field: focusableFields = null) {
    return this.initialMode == 'manage' || this.specification.isEditable;
  }

  debounce(func, delay: number) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      func();
    }, delay);
  }

  async save() {
    if (this.currentEditingItem?.description == '') {
      this.notificationService.errorMessage(
        'Please enter specification description'
      );
      return;
    }

    if (this.currentEditingItem?.value == '') {
      this.notificationService.errorMessage(
        'Please enter specification quantity/value'
      );
      return;
    }

    this.isLoading = true;

    this.specification.description = this.currentEditingItem.description;
    this.specification.value = this.currentEditingItem.value;

    if (this.saveFunction) {
      let res: NestedSpecificationActionResults = await this.saveFunction(
        this.specification
      );

      this.isLoading = false;

      if (res.isSuccessful) {
        this.mode = this.initialMode;

        this.specification.isNew = false;
        this.specification.id = res.itemId;
        if (res.itemUuid) {
          this.specification.uuid = res.itemUuid;
          this.specification.rowId = res.itemUuid;
        }

        if (res.message) {
          this.notificationService.successMessage(res.message);
        }
      } else {
        this.notificationService.errorMessage(
          res?.message
            ? res?.message
            : 'Unknown error occured, please try again later'
        );
      }
    } else {
      /// TODO Handle else statement if needed
    }
  }

  async delete(attempt: number) {
    if (attempt == 2) {
      this.showDeleteConfirmation = false;
      this.isLoading = true;

      let res: NestedSpecificationActionResults = await this.deleteFunction(
        this.specification
      );

      this.isLoading = false;

      if (res.isSuccessful) {
        this.onItemRemove(this.specification.uuid || this.specification.rowId);
        if (res.message) this.notificationService.successMessage(res.message);
      } else if (res.message) {
        this.notificationService.errorMessage(res.message);
      }
    } else {
      this.showDeleteConfirmation = true;
    }
  }

  switchMode(mode: NestedSpecificationsViewMode, focusTo: focusableFields) {
    if (mode == 'edit') {
      if (this.specification.isEditable) {
        if (!this.currentEditingItem.isNew) {
          this.currentEditingItem = { ...this.specification };
        }
        this.mode = mode;
        this.setFocus(focusTo);
      }
    }
  }

  setFocus(item: focusableFields) {
    setTimeout(() => {
      switch (item) {
        case 'description':
          this.descriptionInputRef?.nativeElement.focus();
          break;

        case 'value':
          this.valueInputRef?.nativeElement.focus();
      }
    }, 100);
  }

  onOptionChange(event) {
    this.currentEditingItem = {
      ...this.currentEditingItem
    }
    this.specification.value = this.currentEditingItem.value
  }
}
