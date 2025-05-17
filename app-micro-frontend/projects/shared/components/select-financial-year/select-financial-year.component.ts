import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from '../../../services/graphql.service';
import { LoaderComponent } from '../loader/loader.component';
import { MatDividerModule } from '@angular/material/divider';
import { GET_THREE_RECENT_FINANCIAL_YEARS } from 'src/app/modules/nest-reports/store/reports/reports.graphql';
import { StorageService } from "../../../services/storage.service";
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-financial-year',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    LoaderComponent,
    MatDividerModule,
  ],
  templateUrl: './select-financial-year.component.html',
  styleUrl: './select-financial-year.component.scss'
})
export class SelectFinancialYearComponent implements OnInit {
  @Input() useUuid: boolean = false;
  @Output() selectedFinancialYearUuid = new EventEmitter<string>();
  @Output() selectedFinacialYear = new EventEmitter<string>();
  @Output() emitLoadingFnYear = new EventEmitter<boolean>();
  currentSelectedFinancialYear: string;
  financialYears: { uuid?: string; code: string; value: string }[];
  loadingFinancialYear: boolean = false;
  loadingCurrentFinancialYear: boolean = false;

  hasError: boolean = false;

  constructor(
    private apollo: GraphqlService,
    private storageService: StorageService,
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.fetchFinancialYear().then();
  }

  async fetchFinancialYear() {
    await this.getCurrentFinancialYear();
    if (this.useUuid) {
      await this.getFinancialYears();
    }
  }


  generateFinancialYears(
    currentFinancialYear: string,
    yearsBack: number,
    yearsForward: number
  ): string[] {
    // Split the current financial year to get the start and end years
    const [startYearStr, endYearStr] = currentFinancialYear.split('/');
    const startYear = parseInt(startYearStr);
    const endYear = parseInt(endYearStr);

    // Initialize the array to store financial years
    const financialYears: string[] = [];

    // Generate previous years
    for (let i = yearsBack; i > 0; i--) {
      const previousStart = startYear - i;
      const previousEnd = endYear - i;
      financialYears.push(`${previousStart}/${previousEnd}`);
    }

    // Add the current financial year
    financialYears.push(currentFinancialYear);

    // Generate future years
    for (let i = 1; i <= yearsForward; i++) {
      const nextStart = startYear + i;
      const nextEnd = endYear + i;
      financialYears.push(`${nextStart}/${nextEnd}`);
    }

    return financialYears;
  }


  async getCurrentFinancialYear() {
    this.loadingCurrentFinancialYear = true;
    this.emitLoadingFnYear.emit(true);
    const data = await firstValueFrom(
      this.http.get<any>(
        environment.AUTH_URL + `/nest-cache/currentFinancialYear/${this.storageService.getItem("institutionUuid")}`
      )
    );
    this.loadingCurrentFinancialYear = false;
    this.emitLoadingFnYear.emit(false);

    if (data && data.financialYearCode) {
      this.currentSelectedFinancialYear = data.financialYearCode;
      if (!this.useUuid) {
        this.financialYears = this.generateFinancialYears(
          this.currentSelectedFinancialYear, 2, 1).map(i => ({
            code: i,
            value: i
          }));
      }

      this.currentSelectedFinancialYear = this.currentSelectedFinancialYear ??
        this.getLocalCurrentFinancialYear();
      this.selectedFinacialYear.emit(this.currentSelectedFinancialYear);
      if (this.useUuid) {
        this.selectedFinancialYearUuid.emit(data.uuid);
      }
      this.hasError = false;
    } else {
      this.hasError = true;
    }
  }

  async getFinancialYears() {
    try {
      this.loadingFinancialYear = true;
      const finaResults: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: GET_THREE_RECENT_FINANCIAL_YEARS
      });

      this.financialYears = finaResults?.data?.getThreeRecentFinancialYears?.dataList;
      this.loadingFinancialYear = false;

    } catch (e) {
      console.error(e);
      this.loadingFinancialYear = false;
    }
  }

  selectFinancialYear(event: any) {
    this.currentSelectedFinancialYear = event.value;
    this.selectedFinacialYear.emit(this.currentSelectedFinancialYear);

    if (this.useUuid) {
      const financialYear
        = this.financialYears.find(yr => yr.code == event.value);
      this.selectedFinancialYearUuid.emit(financialYear.uuid);
    }
  }

  getLocalCurrentFinancialYear(): string {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let startYear: number;
    let endYear: number;

    // Financial year starts from July (month 6 in JavaScript's 0-indexed months)
    if (currentMonth >= 6) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    return `${startYear}/${endYear}`;
  }
}
