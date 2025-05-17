import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { SettingsService } from '../../../../services/settings.service';
import {
  NestedSpecificationsViewMode,
  NestedSpecificationActionResults,
} from '../group-item/group-item.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ExcelUploaderComponent,
  ExcelUploaderData,
} from '../../excel-uploader/excel-uploader.component';
import {
  EditableSpecificationItem,
  EditableSpecificationItemBase,
} from '../store/model';
import { SpecificationImportDialogComponent } from '../specification-import-dialog/specification-import-dialog.component';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditableSpecsTableRowComponent } from './editable-specs-table-row/editable-specs-table-row.component';


export type specificationActions = 'add' | 'update' | 'delete';

export interface EditableSpecificationsTableAction {
  action: 'add' | 'update' | 'delete';
  item?: EditableSpecificationItem;
}

@Component({
    selector: 'app-editable-specs-table',
    templateUrl: './editable-specs-table.component.html',
    standalone: true,
    imports: [
    EditableSpecsTableRowComponent,
    MatButtonModule,
    MatIconModule
],
})
export class EditableSpecsTableComponent implements OnInit, OnChanges {
  @Input() addSpecificationText: string = 'Add Specification';

  @Input() specifications: EditableSpecificationItem[] = [];

  @Input() viewMode: NestedSpecificationsViewMode = 'edit';

  @Input() canAddSpecs: boolean = false;
  @Input() showImport: boolean = false;
  @Input() keyLabel = 'Feature';
  @Input() valueLabel = 'Description';

  @Input() excelUploaderData: ExcelUploaderData;

  @Output() onTableAction: EventEmitter<EditableSpecificationsTableAction> = new EventEmitter();

  @Output() onTotalCalculated: EventEmitter<EditableSpecificationsTableAction> = new EventEmitter();

  @Input() saveFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input() moveFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  @Input() deleteFunction: (
    args: EditableSpecificationItem
  ) => Promise<NestedSpecificationActionResults>;

  currentEditingItem: EditableSpecificationItemBase = null;

  constructor(
    private settingsService: SettingsService,
    public dialog: MatDialog
  ) { }

  add() {
    this.currentEditingItem = this.addSpecification();
  }

  addSpecification() {
    let item = this.blankSpecs();
    this.specifications.push(this.blankSpecs());
    return item;
  }

  _onTotalCalculated(event: any) {
    if (this.onTotalCalculated) {
      this.onTotalCalculated.emit(event);
    }
  }

  onItemEditing(item: EditableSpecificationItemBase) {
    if (item == null) {
      this.currentEditingItem = null;
    } else if (!this.currentEditingItem) {
      this.currentEditingItem = { ...item };
    } else {
      if (this.currentEditingItem.uuid != item.uuid) {
        this.currentEditingItem = null;
        this.currentEditingItem = { ...item };
      }
    }
  }

  blankSpecs(): EditableSpecificationItemBase {
    let rowId = this.settingsService.makeId();
    return {
      isNew: true,
      description: '',
      isEditable: true,
      rowId,
      uuid: rowId,
    };
  }

  onItemRemove = (uuid: string) => {
    this.removeItemByFieldName('uuid', uuid);
  };

  removeItemByFieldName(fieldName: string, fieldValue: any) {
    let foundItemIndex: number = null;
    for (let i = 0; i < this.specifications.length; i++) {
      if (
        fieldValue != null &&
        fieldValue != '' &&
        this.specifications[i][fieldName] == fieldValue
      ) {
        foundItemIndex = i;
        break;
      }
    }

    if (foundItemIndex != null) {
      this.specifications.splice(foundItemIndex, 1);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['specifications'] !== undefined &&
      changes['specifications'] !== null
    ) {
      this.specifications = changes['specifications'].currentValue;
    }
  }

  ngOnInit(): void {
  }

  async import() {
    let dialogRef = this.dialog.open(SpecificationImportDialogComponent, {
      width: '600px',
      data: this.excelUploaderData,
    });
    const specs: any[] = await lastValueFrom(dialogRef.afterClosed());
    specs.forEach(async i => await this.saveFunction(i))

  }
}
