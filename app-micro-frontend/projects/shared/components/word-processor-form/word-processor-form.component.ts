import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdditionalOption, TOOL_BAR_POSITION, WordProcessorComponent } from '../../word-processor/word-processor.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-word-processor-form',
  templateUrl: './word-processor-form.component.html',
  styleUrls: ['./word-processor-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: WordProcessorFormComponent,
    },
  ],
  standalone: true,
  imports: [WordProcessorComponent],
})
export class WordProcessorFormComponent
  implements ControlValueAccessor, OnInit {
  @Input()
  selectedToolBarButtons: any = [
    ['bold', 'italic', 'underline', 'strike'],
    ['justifyLeft', 'justifyCenter', 'justifyRight'],
    ['orderedList', 'unOrderedList'],
    ['insertTable'],
    ['removeFormat'],
  ];

  @Input()
  toolBarPosition: TOOL_BAR_POSITION = TOOL_BAR_POSITION.BOTTOM;

  @Input()
  editorContent: string = '';

  @Input()
  customClassTopContainer: string = '';

  @Input()
  customClassBottomContainer: string = '';

  @Input()
  additionalOptions: AdditionalOption = {
    toolBarPosition: TOOL_BAR_POSITION.TOP,
    editAreaBorder: false,
  };

  @Output() onInputChange: EventEmitter<any> = new EventEmitter();

  @Input() message: string = '';
  constructor() { }

  ngOnInit(): void {
    if (this.message) {
      this.editorContent = this.message;
    }
  }

  onChange = (text) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

  onKeyPressEvent(event: any) { }

  onEditorChanged(event: any) {
    this.message = event;
    this.onChange(this.message);
    this.onInputChange.emit({ target: { value: this.message } });
  }

  writeValue(text: string) {
    this.editorContent = text;
    this.message = text;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
