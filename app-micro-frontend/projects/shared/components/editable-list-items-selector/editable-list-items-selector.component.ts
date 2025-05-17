import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { EditableListItem, EditableListItemComponent } from './editable-list-item/editable-list-item.component';
import {
  EditableListProperties,
  SelectorConfiguration
} from "../vertical-steps-form/interfaces/vertical-steps-form-field";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';


export interface EditableListItemSelection {
  item: EditableListItem;
  list: EditableListItem[];
}

@Component({
    selector: 'editable-list-items-selector',
    templateUrl: './editable-list-items-selector.component.html',
    standalone: true,
    imports: [
    EditableListItemComponent,
    LoaderComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule
],
})
export class EditableListItemsSelectorComponent implements OnInit {
  @Input()
  item_name: string = 'Item';

  @Input()
  onAddNewItemFunction: (item: string, identifier: string, code: string) => any;

  @Input()
  options: EditableListItem[];

  @Input()
  selectorConfiguration: SelectorConfiguration;

  @Input()
  selectedValues: string[] = [];

  @Input()
  label: string = '';

  @ViewChild('itemRef') itemRef: ElementRef;

  @Output()
  onOptionSelect: EventEmitter<EditableListItemSelection> = new EventEmitter();

  @Output()
  onHintClicked: EventEmitter<boolean> = new EventEmitter();

  @Output()
  onRemove: EventEmitter<EditableListItemSelection> = new EventEmitter();

  @Output()
  onNewOptionCreated: EventEmitter<any> = new EventEmitter();

  showAddNew: boolean = false;
  loading: boolean = false;

  ngOnInit(): void {
    this.options = this.markSelected(this.options);
  }

  async onAddNewItem(value: string) {
    this.loading = true;
    if (this.onAddNewItemFunction) {
      let output = await this.onAddNewItemFunction(value, this.selectorConfiguration.identifierName, this.selectorConfiguration.code);

      if (output.success) {
        const option: EditableListItem = {
          value: output.results.uuid,
          label: output.results.value,
          isSelected: true,
          isEditable: false
        };
        this.options.push(option);
        this.onSelect(option);

        if (!this.selectedValues!.includes(output.results.value)) {
          this.selectedValues.push(output.results.value);
        }
      }
      this.loading = false;
    }
    //this.onNewOptionCreated.emit(itemName);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedValues?.length) {
      this.options = this.markSelected(this.options);
    }
  }

  markSelected(options: EditableListItem[]): EditableListItem[] {
    return options.map((option) => ({
      ...option,
      isSelected: this.selectedValues
        ? this.selectedValues.includes(option.value)
        : option.isSelected,
    }));
  }

  onSelect(option: EditableListItem) {
    option.isSelected = true;
    this.onOptionSelect.emit({ item: option, list: this.options });
  }

  hintClicked() {
    this.onHintClicked.emit(true);
  }

  onCloseAddNew(event) {
    this.addNew(false);
  }

  onItemRemove(item: EditableListItem) {
    this.onRemove.emit({ item, list: this.options });
  }

  addNew(add: boolean) {
    this.showAddNew = add;
  }
}
