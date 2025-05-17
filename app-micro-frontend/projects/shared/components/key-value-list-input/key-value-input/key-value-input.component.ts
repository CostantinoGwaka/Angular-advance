import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VerticalStepsFormField } from "../../vertical-steps-form/interfaces/vertical-steps-form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


export interface KeyValueItem {
  description: string;
  value: string;
  uuid?: string;
  label?: string;
  isSelected?: boolean;
}


@Component({
    selector: 'key-value-input',
    templateUrl: './key-value-input.component.html',
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderComponent,
    MatButtonModule,
    MatIconModule
],
})
export class KeyValueInputComponent implements OnInit {
  @Input()
  placeholderText: string = 'Search or add item';

  @Input()
  field: VerticalStepsFormField = null;

  @Input()
  options: KeyValueItem[];

  @Input()
  item: KeyValueItem = {
    description: null,
    value: null,
    label: null,
  };

  @Input()
  editMode = false;

  @Input()
  isNewEntryEditor = false;

  filteredOptions: KeyValueItem[] = [];
  form: UntypedFormGroup;

  @Output()
  onClose: EventEmitter<KeyValueItem> = new EventEmitter();

  @Output()
  onSelect: EventEmitter<KeyValueItem> = new EventEmitter();

  @Output()
  onAddNewItem: EventEmitter<any> = new EventEmitter();

  @Output()
  onItemRemove: EventEmitter<KeyValueItem> = new EventEmitter();

  // @ViewChild('inputRef') inputRef: ElementRef;
  @ViewChild('optionElementRef') optionElementRef: ElementRef;


  @Input()
  loading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      description: [null, []],
      value: [null, []],
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']?.currentValue?.length) {
      if (this.form.get('description')) {
        this.form.get('description').setValue('');
        this.form.controls['description'].markAsUntouched();
      }

      if (this.form.get('value')) {
        this.form.get('value').setValue('');
        this.form.controls['value'].markAsUntouched();
      }
    }

    if (changes['loading']) {
      this.loading = changes['loading'].currentValue;
    }
  }


  onRemove(item: KeyValueItem) {
    item.isSelected = false;
    this.onItemRemove.emit(item);
  }

  addNewItem() {
    let formValues = {
      ...this.form.value,
    };
    this.loading = true;
    this.onAddNewItem.emit(formValues);
  }
}
