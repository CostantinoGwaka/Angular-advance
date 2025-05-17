import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


export interface EditableListItem {
  value: string;
  label: string;
  isSelected?: boolean;
  isEditable?: boolean;
}

@Component({
    selector: 'editable-list-item',
    templateUrl: './editable-list-item.component.html',
    standalone: true,
    imports: [
    MatButtonModule,
    MatIconModule
],
})
export class EditableListItemComponent implements OnInit {
  @Input()
  placeholderText: string = 'Search or add item';

  @Input()
  options: EditableListItem[];

  @Input()
  item: EditableListItem = {
    value: null,
    label: null,
  };

  @Input()
  editMode = false;

  @Input()
  isNewEntryEditor = false;

  filteredOptions: EditableListItem[] = [];

  @Output()
  onClose: EventEmitter<EditableListItem> = new EventEmitter();

  @Output()
  onSelect: EventEmitter<EditableListItem> = new EventEmitter();

  @Output()
  onAddNewItem: EventEmitter<any> = new EventEmitter();

  @Output()
  onItemRemove: EventEmitter<EditableListItem> = new EventEmitter();

  @ViewChild('inputRef') inputRef: ElementRef;
  @ViewChild('optionElementRef') optionElementRef: ElementRef;

  newItemToAdd: string = null;

  showOptions = true;

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
    this.setFocus();
  }

  onAccept() {
    this.toggleEditMode(false);
  }

  onCloseClick() {
    this.toggleEditMode(false);
  }

  onRemove(item: EditableListItem) {
    item.isSelected = false;
    this.onItemRemove.emit(item);
  }

  toggleEditMode(editMode: boolean, option: EditableListItem = null) {
    this.editMode = editMode;
    if (this.editMode) {
      this.setFocus();
      if (option) {
        this.suggestItems(option.label);
      }
    } else {
      if (this.onClose) this.onClose.emit();
    }
  }

  onKeyUup(event: any) {
    this.suggestItems(event.target.value);
  }

  setFocus() {
    setTimeout(() => {
      this.inputRef?.nativeElement.focus();
    }, 300);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (
      !this.optionElementRef?.nativeElement?.contains(event.target) &&
      !this.inputRef?.nativeElement?.contains(event.target)
    ) {
      this.toggleEditMode(false);
    }
  }

  suggestItems(keyword: string) {
    let suggestions = [...this.options];
    this.filteredOptions = suggestions.filter((suggestion) =>
      suggestion.label.toLowerCase().includes(keyword)
    );
    if (this.filteredOptions.length == 0) {
      this.newItemToAdd = keyword;
    } else {
      this.newItemToAdd = null;
    }
  }

  select(selectedOption: EditableListItem) {
    selectedOption.isSelected = true;
    this.onSelect.emit(selectedOption);
    this.toggleEditMode(false);
  }

  addNewItem() {

    this.onAddNewItem.emit(this.newItemToAdd);
    this.toggleEditMode(false);
  }
}
