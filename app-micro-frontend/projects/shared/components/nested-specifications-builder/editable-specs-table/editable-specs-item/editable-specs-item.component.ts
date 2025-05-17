import { NestUtils } from './../../../../utils/nest.utils';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { NotificationService } from '../../../../../services/notification.service';
import {
  NestedSpecificationActionResults,
  NestedSpecificationsViewMode,
} from '../../group-item/group-item.component';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  TableItemPickerComponent,
  TableItemPickerDialogData,
} from '../table-item-picker/table-item-picker.component';
import { MatDialog } from '@angular/material/dialog';

import { NestedSpecificationsService } from '../../nested-specifications.service';
import {
  EditableSpecificationItem,
  FlatNestedSpecificationItemView,
  FlatNestedSpecificationItemViewChangeTypes,
  Formula,
  FormulaNames,
  ItemsStateCodes,
  NestedSpecificationItem,
} from '../../store/model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { DigitOnlyDirective } from '../../../../directives/digit-only.directive';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgTemplateOutlet, DecimalPipe } from '@angular/common';

export enum EditableSpecsTableActioEnums {
  onAddIte,
  onUpdateItem,
  onDeleteItem,
}

export interface EditableSpecsItemSizes {
  codeWidth: string;
  descriptionWidth: string;
  unitOfMeasureWidth: string;
  quantityWidth: string;
  unitRateWidth: string;
  totalWidth: string;
}

export type focusableFields =
  | 'description'
  | 'tendererQuantity'
  | 'unit-of-measure'
  | 'code'
  | 'unit-rate'
  | 'value'
  | 'quantity';

@Component({
  selector: 'app-editable-specs-item',
  templateUrl: './editable-specs-item.component.html',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule,
    NgTemplateOutlet,
    DigitOnlyDirective,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    DecimalPipe
],
})
export class EditableSpecsItemComponent implements OnInit {
  @Input()
  onTotalCalculated: (args: EditableSpecificationItem, groupId: number) => void;

  @Input()
  getPercentItemSource: (
    itemId: string,
    sourceId: string,
    groupId: number
  ) => EditableSpecificationItem;

  @Input()
  initialMode: NestedSpecificationsViewMode = 'view';

  @Input()
  allItemsView: FlatNestedSpecificationItemView[] = [];

  @Input()
  usedFor: NestedSpecificationsViewMode = 'view';

  mode: NestedSpecificationsViewMode = 'view';

  @Input()
  parentItem: NestedSpecificationItem = null;

  @Input()
  specification: EditableSpecificationItem;

  @Input()
  groupId: number = null;

  focusedInput: focusableFields;

  @Input()
  level: number = 0;

  @Input()
  collapseDescriptionFunction: (sourceId: string) => void;

  @Input()
  onAction: Function;

  @Input()
  onItemSelection: (
    item: EditableSpecificationItem,
    isSelected: boolean
  ) => void;

  @Input()
  showValueColumn: boolean = true;

  @Input()
  showUnitOfMeasureColumn: boolean = true;

  @Input()
  showCodeOrSNColumn: boolean = false;

  @Input()
  showUnitRateColumn: boolean = false;

  @Input()
  showTotalColumn: boolean = false;

  @Input()
  saveFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  deleteFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  onViewItemsFilter: (
    filter_type: string,
    itemUuid: string
  ) => FlatNestedSpecificationItemView[];

  @Input()
  saveCustomSubBOQItemFunction: (
    item: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input()
  onItemRemove: (itemId: string) => void;

  @Input()
  onItemEdit: (item: EditableSpecificationItem) => void;

  @Input()
  items: EditableSpecificationItem[];

  isLoading: boolean = false;

  showDeleteConfirmation: boolean = false;

  formula: Formula;

  editTendererQuantity = false;

  itemStateCodes = ItemsStateCodes;

  @Input()
  editableSpecsItemSizes: EditableSpecsItemSizes = {
    codeWidth: 'w-36',
    descriptionWidth: '',
    unitOfMeasureWidth: 'w-44',
    quantityWidth: 'w-44',
    unitRateWidth: 'w-44',
    totalWidth: 'w-44',
  };

  @Input()
  currentEditingItem: EditableSpecificationItem = null;

  @Input()
  currentFocusedEditingItem: EditableSpecificationItem = null;

  @Input()
  currentGroupEditingGroupId: number = null;

  @Input()
  onItemEditing: (item: EditableSpecificationItem, groupId: number) => void;

  @Input()
  onItemSaved: (details: { rowId: string; uuid: string; id: any }) => void;

  @ViewChild('parentEditorElement') parentEditorElement: ElementRef;

  @ViewChild('descriptionInputRef') descriptionInputRef: ElementRef;
  @ViewChild('codeInputRef') codeInputRef: ElementRef;
  @ViewChild('unitOfMeasureInputRef') unitOfMeasureInputRef: ElementRef;
  @ViewChild('tendererQuantity') tendererQuantity: ElementRef;
  @ViewChild('unitRateInputRef') unitRateInputRef: ElementRef;
  @ViewChild('valueInputRef') valueInputRef: ElementRef;

  // @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (this.mode != 'select') {
      if (!this.parentEditorElement?.nativeElement?.contains(event.target)) {
        if (this.specification.isNew && this.mode == 'edit') {
          this.onItemRemove(this.specification.rowId);
        }
        this.mode = this.initialMode;
      }
    }
  }

  debounceTimer = null;

  showFull = false;
  descriptionLimit = 120;

  constructor(
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private nestedSpecificationsService: NestedSpecificationsService
  ) {}

  ngOnInit(): void {
    this.mode = this.initialMode;
  }

  ngOnChanges() {
    this.mode = this.initialMode;
    if (this.currentEditingItem?.rowId != this.specification.rowId) {
      this.mode = 'view';
    }
  }

  ngAfterViewInit() {
    if (this.specification.isNew) {
      this.switchMode(null, 'edit', 'code');
    }
  }

  hasFormular() {
    //return this.currentEditingItem?.formula ? true : false;
    return this.specification.formula ? true : false;
  }

  allowInputEdit(): boolean {
    return (
      this.specification.formula?.formulaName ==
      FormulaNames.PROVISION_SUM_PERCENT
    );
  }

  setItemAsModified() {
    this.nestedSpecificationsService.updateItemState(
      this.specification,
      ItemsStateCodes.MODIFIED,
      'This item has been modified but not saved'
    );
  }

  async removePSLink() {
    this.specification.formula = null;
    this.saveItem();
  }

  saveItem = async () => {
    let _saveFunction = this.saveFunction || this.saveCustomSubBOQItemFunction;

    this.nestedSpecificationsService.updateItemState(
      this.specification,
      ItemsStateCodes.LOADING,
      'This item is being saved'
    );

    if (_saveFunction) {
      let res: NestedSpecificationActionResults = await _saveFunction(
        this.specification
      );
      this.isLoading = false;
      if (res.isSuccessful) {
        this.nestedSpecificationsService.updateItemState(
          this.specification,
          ItemsStateCodes.SUCCESS,
          'This item has been saved'
        );
        if (res.message) {
          this.notificationService.successMessage(res.message);
        }
      } else {
        this.nestedSpecificationsService.updateItemState(
          this.specification,
          ItemsStateCodes.SAVE_ERROR,
          'This item has not been saved'
        );

        this.notificationService.errorMessage(
          res?.message
            ? res?.message
            : 'Unknown error occurred, please try again later'
        );
      }
    }
  };

  showMoreOrLessDescription() {
    this.collapseDescriptionFunction(this.specification.uuid);
  }

  showDescriptionText(): string {
    if (this.collapseDescriptionFunction) {
      if (!this.specification?.showFullDescription) {
        if (this.descriptionExceedsLimit()) {
          return (
            this.specification.description.substring(0, this.descriptionLimit) +
            '...'
          );
        } else {
          return this.specification.description;
        }
      }
    }
    return this.specification.description;
  }

  descriptionExceedsLimit() {
    return (
      this.specification.description.length > this.descriptionLimit &&
      this.collapseDescriptionFunction
    );
  }

  canEdit(
    item: EditableSpecificationItem,
    identifier: focusableFields | 'save_button' = null
  ) {
    let results = this.currentEditingItem?.rowId == item.rowId;
    return this.fieldIsEditable(identifier) && results;
  }

  isClickable(indentifier: focusableFields = null) {
    return this.fieldIsEditable(indentifier);
  }

  fieldIsEditable(field: focusableFields | 'save_button' = null) {
    let results = true;
    switch (field) {
      case 'code':
      case 'description':
      case 'unit-of-measure':
        results =
          results &&
          (this.specification.isEditable || this.initialMode == 'manage');
        break;
      case 'value':
        results =
          (results && this.initialMode == 'initiation') ||
          (this.initialMode == 'tendererEditing' &&
            this.specification.formula?.formulaName ==
              FormulaNames.PROVISION_SUM_PERCENT);
        break;
      case 'unit-rate':
        results =
          results &&
          (this.initialMode == 'initiation' ||
            this.initialMode == 'manage' ||
            this.initialMode == 'tendererEditing') &&
          this.specification.formula?.formulaName !=
            FormulaNames.PROVISION_SUM_PERCENT;

        if (
          this.initialMode == 'tendererEditing' &&
          (this.specification.formula?.formulaName ==
            FormulaNames.PROVISION_SUM_AMOUNT ||
            this.specification.formula?.formulaName ==
              FormulaNames.PROVISION_SUM_PERCENT)
        ) {
          results = false;
        }

        break;

      case 'save_button':
        results =
          results &&
          (this.specification.isEditable || this.initialMode == 'manage');
        break;
    }

    return results;
  }

  showProvisionSumSelector = () => {
    let dialogData: TableItemPickerDialogData = {
      selectedItem: this.specification,
      pickedItemId: null,
      items: this.allItemsView.filter(
        (item) =>
          item.parentId == this.specification.parentId &&
          item?.editableSpecificationItem &&
          item.uuid != this.specification.uuid &&
          NestUtils.isProvisionSumItem(item?.editableSpecificationItem)
      ),
    };

    let dialogRef = this.dialog.open(TableItemPickerComponent, {
      width: '40%',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(async (psItemId: string) => {
      if (psItemId) {
        this.specification.formula = this.setPSPercentFormula(psItemId);

        this.setPercentFormula();

        this.nestedSpecificationsService.updateItemState(
          this.specification,
          ItemsStateCodes.LOADING,
          'This item is being saved'
        );

        let _saveFunction =
          this.saveFunction || this.saveCustomSubBOQItemFunction;

        if (_saveFunction) {
          let res: NestedSpecificationActionResults = await _saveFunction(
            this.specification
          );
          this.isLoading = false;
          if (res.isSuccessful) {
            this.nestedSpecificationsService.updateItemState(
              this.specification,
              ItemsStateCodes.SUCCESS,
              'This item has been saved'
            );
            if (res.message) {
              this.notificationService.successMessage(res.message);
            }
          } else {
            this.nestedSpecificationsService.updateItemState(
              this.specification,
              ItemsStateCodes.SAVE_ERROR,
              'This item has not been saved'
            );

            this.notificationService.errorMessage(
              res?.message
                ? res?.message
                : 'Unknown error occured, please try again later'
            );
          }
        }

        this.onTotalCalculated(this.specification, this.groupId);
      }
    });
  };

  setPSPercentFormula(psItemId: string): Formula {
    let formula: Formula = {
      formulaName: FormulaNames.PROVISION_SUM_PERCENT,
      inputFields: [
        {
          itemId: psItemId,
        },
      ],
    };
    return formula;
  }

  hasFormula(specification: EditableSpecificationItem, formula: FormulaNames) {
    return specification.formula?.formulaName?.trim() == formula;
  }

  setPercentFormula() {
    let quantity = parseFloat(this.specification.value);
    let sourceItem = this.getPercentItemSource(
      this.specification.uuid,
      this.specification.formula.inputFields[0].itemId,
      this.groupId
    );
    if (sourceItem) {
      this.specification.unitRate = sourceItem.total;
      this.specification =
        this.nestedSpecificationsService.calculatePercentTotalByFormValue(
          this.specification,
          sourceItem,
          quantity
        );
    }
  }

  calculateTotal() {
    if (this.currentEditingItem != null) {
      this.setItemAsModified();
      let _currentEditingItem = Object.assign({}, this.currentEditingItem);
      this.specification.value = _currentEditingItem.value;
      this.specification.unitRate = _currentEditingItem.unitRate;
      this.specification.formula = this.currentEditingItem.formula;
      this.specification.unitOfMeasure = this.currentEditingItem.unitOfMeasure;

      let quantity = parseFloat(this.specification.value);
      let unitRate = this.specification.unitRate;

      let total = null;

      if (!isNaN(this.specification.total)) {
        total = this.specification.total;
      }

      if (NestUtils.isProvisionSumItem(this.specification)) {
        this.putPSFormula(this.specification, unitRate);
      }

      if (
        this.hasFormula(this.specification, FormulaNames.PROVISION_SUM_AMOUNT)
      ) {
        if (!NestUtils.isProvisionSumItem(this.specification)) {
          this.removeFormula(this.specification);
        }
      }

      if (
        this.hasFormula(this.specification, FormulaNames.PROVISION_SUM_PERCENT)
      ) {
        let sourceItem = this.getPercentItemSource(
          this.specification.uuid,
          this.specification.formula.inputFields[0].itemId,
          this.groupId
        );
        if (sourceItem) {
          this.currentEditingItem =
            this.nestedSpecificationsService.calculatePercentTotalByFormValue(
              this.specification,
              sourceItem,
              quantity
            );
          this.currentEditingItem.value = _currentEditingItem.value;

          if (this.initialMode != 'tendererEditing') {
            this.currentEditingItem.unitRate = this.specification.unitRate;
          }
        }
      } else {
        if (this.specification?.unitOfMeasure?.trim() == '%') {
          //if items has % as unit of measure and has no formula, then divide by 100
          //very unlikely to happen
          quantity = quantity ? (quantity || 0) / 100 : null;
        }

        if (
          quantity != null &&
          unitRate != null &&
          !isNaN(quantity) &&
          !isNaN(unitRate)
        ) {
          total = quantity * unitRate;
        } else {
          total = null;
        }

        if (isNaN(total)) {
          total = null;
        }

        this.specification.total = total;
        this.currentEditingItem.total = total;
        this.currentEditingItem.formula = this.currentEditingItem.formula;
      }

      if (this.onTotalCalculated) {
        this.debounce(() => {
          this.onTotalCalculated(this.specification, this.groupId);
        }, 2000);
      }
    }
  }

  removeFormula(item: EditableSpecificationItem) {
    item.formula = null;
  }

  putPSFormula(item: EditableSpecificationItem, amount: number = null) {
    let formula = this.nestedSpecificationsService.setPSFormula(amount);
    this.specification.formula = formula;
  }

  debounce(func, delay: number) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      func();
    }, delay);
  }

  retrySave() {
    this.currentEditingItem = this.specification;
    this.calculateTotal();
    //this.saveItem();
  }

  retryDelete() {
    this.delete(2);
  }

  findAndCalculatePercentTotalFromSource(
    sourceItem: EditableSpecificationItem,
    unitRate: number,
    total: number
  ) {
    let uuid: string = sourceItem.uuid;
    let sourceUuid: string = sourceItem.sourceUuid;
    // for (let i = 0; i < this.items.length; i++) {
    //   if (this.items[i].formula?.inputFields[0]?.itemId) {
    //     if (
    //       (this.items[i].formula.inputFields[0].itemId == uuid ||
    //         this.items[i].formula.inputFields[0].itemId == sourceUuid) &&
    //       this.items[i].value != null
    //     ) {
    //       this.calculatePercentTotal(unitRate, total, this.items[i]);
    //       break;
    //     }
    //   }
    // }
  }

  calculatePercentTotal(
    unitRate: number,
    total: number,
    percentItem: EditableSpecificationItem
  ): EditableSpecificationItem {
    percentItem.unitRate = (unitRate * parseFloat(percentItem.value)) / 100;
    percentItem.total = (total * parseFloat(percentItem.value)) / 100;

    return percentItem;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.save();
    }
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

    this.isLoading = true;

    this.specification.description = this.currentEditingItem.description;
    this.specification.value = this.currentEditingItem.value;
    this.specification.unitOfMeasure = this.currentEditingItem.unitOfMeasure;
    this.specification.code = this.currentEditingItem.code;
    this.specification.unitRate = this.currentEditingItem.unitRate;

    if (this.saveFunction) {
      let res: NestedSpecificationActionResults = await this.saveFunction(
        this.specification
      );
      this.isLoading = false;
      if (res.isSuccessful) {
        this.onItemEditing(null, this.groupId);
        this.onItemSaved({
          rowId: this.specification.rowId,
          uuid: res.itemUuid,
          id: res.itemId,
        });
        this.specification.isNew = false;
        this.specification.id = res.itemId;
        this.specification.uuid = res.itemUuid;
        if (res.sourceUuid) {
          this.specification.sourceUuid = res.sourceUuid;
        }
        if (res.itemUuid) {
          this.specification.rowId = res.itemUuid;
        }
        this.currentEditingItem.total = this.currentEditingItem.total;
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
      this.onTotalCalculated(this.specification, this.groupId);
    } else {
    }
  }

  async delete(attempt: number) {
    if (attempt == 2) {
      this.showDeleteConfirmation = false;
      this.setItemAsModified();

      this.nestedSpecificationsService.broadcastChange({
        changeType: FlatNestedSpecificationItemViewChangeTypes.REMOVE,
        item: this.specification,
      });
    } else {
      this.showDeleteConfirmation = true;
    }
  }

  onSelectChange(change: MatCheckboxChange) {
    if (this.onItemSelection) {
      this.onItemSelection(this.specification, change.checked);
    }
  }

  switchMode(
    event: MouseEvent,
    mode: NestedSpecificationsViewMode,
    focusTo: focusableFields
  ) {
    if (event) {
      event.stopPropagation();
    }
    if (this.fieldIsEditable(focusTo)) {
      this.mode = mode;
      if (
        mode == 'edit' ||
        mode == 'tendererEditing' ||
        this.specification.isEditable
      ) {
        if (
          !this.currentEditingItem ||
          (this.currentEditingItem.rowId != this.specification.rowId &&
            this.groupId == this.currentGroupEditingGroupId)
        ) {
          if (this.onItemEditing) {
            this.onItemEditing(this.specification, this.groupId);
            if (this.currentEditingItem) {
              this.setFocus(focusTo);
            }
          }
        }
      }
    }
  }

  showTendererQuantityEditor(show: boolean) {
    if (this) this.editTendererQuantity = show;
    if (show) {
      this.setFocus('tendererQuantity');
    }
  }

  setFocus(item: focusableFields) {
    setTimeout(() => {
      switch (item) {
        case 'description':
          this.descriptionInputRef?.nativeElement.focus();
          break;

        case 'unit-of-measure':
          this.unitOfMeasureInputRef?.nativeElement.focus();
          break;

        case 'code':
          this.codeInputRef?.nativeElement.focus();
          break;

        case 'tendererQuantity':
          this.tendererQuantity?.nativeElement.focus();
          break;

        case 'unit-rate':
          this.unitRateInputRef?.nativeElement.focus();
          break;

        case 'value':
          this.valueInputRef?.nativeElement.focus();
      }
    }, 100);
  }
}
