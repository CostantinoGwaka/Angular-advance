import {
  Component, EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';

import {
  fadeIn,
  fadeInOut,
  fadeSmooth,
} from '../../animations/router-animation';
import { UntypedFormGroup } from "@angular/forms";
import { DynamicFormService } from "../dynamic-forms-components/dynamic-form.service";
import { FieldConfig } from "../dynamic-forms-components/field.interface";
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MainDynamicFormComponent } from '../dynamic-forms-components/main-dynamic-form/main-dynamic-form.component';

@Component({
  selector: 'app-advanced-search-filter',
  templateUrl: './advanced-search-filter.component.html',
  styleUrls: ['./advanced-search-filter.component.scss'],
  animations: [fadeIn, fadeInOut, fadeSmooth],
  standalone: true,
  imports: [
    MainDynamicFormComponent,
    MatIconModule,
    NgTemplateOutlet,
    TranslatePipe
],
})
export class AdvancedSearchFilterComponent implements OnInit, OnChanges {

  @Input() loading: boolean = false;
  @Input() useCustomButton: boolean = false;
  @Input() customButtonTitle: string = '';
  @Input() backgroundColorClass: string = '!bg-[#fbfbfb]';
  @Input() advancedSearchFilterItems = [];
  @Input() searchFields: FieldConfig[] = [];
  @Input() advancedSearchFields: FieldConfig[] = [];
  @Output() searchParams = new EventEmitter<any>();
  @Output() clearSearchParams = new EventEmitter<any>();
  @Output() onCustomButtonClick = new EventEmitter<any>();

  formData = {};
  showAdvancedMenu: boolean = false;

  searchForm: UntypedFormGroup;
  advancedSearchForm: UntypedFormGroup;

  constructor(private dynamicFormService: DynamicFormService) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['advancedSearchFilterItems']) {
      console.log('in change detection');
      this.initForm();
    }
  }

  searchByInputFilters() {
    this.searchParams.emit({
      searchParams: this.searchForm.getRawValue(),
      advancedParams: this.advancedSearchForm.getRawValue()
    });
  }

  customButtonClicked() {
    this.onCustomButtonClick.emit();
  }

  initForm() {
    /** check if there is any advanced option */
    this.searchForm = this.dynamicFormService.createControl(
      this.searchFields,
      null
    );

    this.advancedSearchForm = this.dynamicFormService.createControl(
      this.advancedSearchFields,
      null
    );

  }

  clearFilter() {
    for (const key of Object.keys(this.formData)) {
      this.formData[key] = null;
    }
    this.clearSearchParams.emit();
    this.initForm();
  }

  closeAdvancedSearch() {
    this.showAdvancedMenu = false;
  }

  onSelectAction(event, key) {
    this.formData[key] = event?.object?.uuid
  }
}
