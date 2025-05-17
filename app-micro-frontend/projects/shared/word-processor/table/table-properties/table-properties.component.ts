import { WordProcessorService } from 'src/app/shared/word-processor/word-processor.service';
import { StylesService } from './../../styles.service';
import { TableService } from './../table.service';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { FormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
    selector: 'app-table-properties',
    templateUrl: './table-properties.component.html',
    styleUrls: ['./table-properties.component.scss'],
    standalone: true,
    imports: [
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
],
})
export class TablePropertiesComponent implements OnInit {
  @Input()
  table: HTMLElement;

  form: UntypedFormGroup;

  tableAttributes: Map<string, string>;

  openProperties: boolean = false;
  mouseInProperties: boolean = false;

  widthType: 'auto' | 'value' = 'auto';
  width: number;
  borderSize: number;
  widthUnit: 'px' | 'pt' | '%' = '%';

  isMouseDownInTD = false;

  constructor(
    private wordProcessorService: WordProcessorService,
    private tableServices: TableService,
    private stylesService: StylesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      widthType: this.fb.control('', [Validators.required]),
      width: this.fb.control(''),
      borderSize: this.fb.control(''),
      widthUnit: this.fb.control(''),
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((val) => {
      this.setNewTablePropertiesFromForm();
    });
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: Event): void {
    if (!this.mouseInProperties) {
      this.openProperties = false;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: Event): void {
    this.isMouseDownInTD = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: Event): void {
    this.mouseInProperties = true;
  }

  async doAction(action: string) {
    switch (action) {
      case 'COPY':
        this.tableServices.copyTableToClipBoard(this.table);
        break;

      case 'DELETE':
        this.wordProcessorService.selectElement(this.table);
        document.execCommand('delete');
        break;

      case 'CUT':
        this.wordProcessorService.selectElement(this.table);
        document.execCommand('cut');
        break;
    }

    this.openProperties = false;
  }

  onPropertiesIconClick() {
    this.tableAttributes = this.stylesService.getTableTableAttributes(
      this.table
    );
    this.openProperties = true;
    this.mouseInProperties = true;
    this.setPropertiesForm();
  }

  setPropertiesForm() {
    let tableStyle = this.stylesService.getStyleFromAttributes(
      this.tableAttributes
    );
    if (tableStyle.has('width')) {
      let widthValue = this.stylesService.getValueAndItsUnitOfMeasure(
        tableStyle.get('width')
      );
      this.form.get('widthType').setValue('value');
      this.form.get('width').setValue(widthValue.value);
      this.form.get('widthUnit').setValue(widthValue.unit);
    } else {
      this.form.get('widthType').setValue('auto');
    }

    if (tableStyle.has('border')) {
      this.form
        .get('borderSize')
        .setValue(
          this.stylesService.getTableBorderFromStyleAttribute(tableStyle)
        );
    }
  }

  clearSelection() {
    var selection = window.getSelection();
    selection.removeAllRanges();
  }

  setNewTablePropertiesFromForm() {
    let tableStyle = this.stylesService.getStyleFromAttributes(
      this.tableAttributes
    );

    this.stylesService.setTableWidth(
      tableStyle,
      this.form.get('widthType').value,
      this.form.get('width').value,
      this.form.get('widthUnit').value
    );

    this.stylesService.setTableBorder(
      tableStyle,
      this.form.get('borderSize').value
    );

    this.tableAttributes.set(
      'style',
      this.stylesService.converStyleMapToStyleString(tableStyle)
    );

    this.stylesService.resetAllElementAttributes(
      this.table,
      this.tableAttributes
    );
  }
}
