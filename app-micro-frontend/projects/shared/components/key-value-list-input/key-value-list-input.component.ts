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
import {
  SelectorConfiguration, VerticalStepsFormField
} from "../vertical-steps-form/interfaces/vertical-steps-form-field";
import { KeyValueItem, KeyValueInputComponent } from "./key-value-input/key-value-input.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

export interface KeyValueItemSelection {
  item: KeyValueItem;
  list: KeyValueItem[];
}

@Component({
    selector: 'key-value-list-input',
    templateUrl: './key-value-list-input.component.html',
    standalone: true,
    imports: [
        KeyValueInputComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
export class KeyValueListInputComponent implements OnInit {
  @Input()
  item_name: string = 'Item';

  @Input()
  loading: boolean = false;

  @Input()
  onAddNewKeyValueItemFunction: (item: string, identifier: string, code: string) => any;

  @Input()
  options: KeyValueItem[];

  @Input()
  selectorConfiguration: SelectorConfiguration;

  @Input()
  selectedValues: string[] = [];

  @Input()
  label: string = '';

  @Input()
  field: VerticalStepsFormField = null;

  @ViewChild('itemRef') itemRef: ElementRef;

  @Output()
  onOptionSelect: EventEmitter<KeyValueItemSelection> = new EventEmitter();

  @Output()
  onHintClicked: EventEmitter<boolean> = new EventEmitter();

  @Output()
  onRemove: EventEmitter<KeyValueItemSelection> = new EventEmitter();

  @Output()
  onNewKeyValueInputCreated: EventEmitter<any> = new EventEmitter();

  // showAddNew: boolean = false;

  ngOnInit(): void {
    this.options = this.markSelected(this.options);
  }

  async onAddNewItem(formValues) {
    this.loading = true;
    if (this.onAddNewKeyValueItemFunction) {
      let output = await this.onAddNewKeyValueItemFunction(formValues, this.selectorConfiguration.identifierName, this.selectorConfiguration.code);
      //
      if (output.success) {
        const option: KeyValueItem = {
          value: output.results.value,
          description: output.results.description,
          uuid: output.results.uuid,
          // isSelected: true,
        };
        this.options.push(option);
        this.selectorConfiguration.options = this.options;
        this.onSelect(option);
        if (!this.selectedValues) {
          this.selectedValues = [];
        }
        this.selectedValues.push(output.results.uuid);
        this.onNewKeyValueInputCreated.emit(option);
      }
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedValues?.length) {
      this.options = this.markSelected(this.options);
    }
  }

  markSelected(options: KeyValueItem[]): KeyValueItem[] {
    return options.map((option) => ({
      ...option,
      isSelected: this.selectedValues
        ? this.selectedValues.includes(option.value)
        : option.isSelected,
    }));
  }

  onSelect(option: KeyValueItem) {
    option.isSelected = false;
    this.onOptionSelect.emit({ item: option, list: this.options });
  }

  hintClicked() {
    this.onHintClicked.emit(true);
  }

  onCloseAddNew(event) {
    this.addNew(false);
  }

  onItemRemove(item: KeyValueItem) {
    this.onRemove.emit({ item, list: this.options });
  }

  addNew(add: boolean) {
    // this.showAddNew = add;
  }
}
