import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GraphqlService } from "../../../services/graphql.service";
import { GET_FINANCIAL_YEARS } from "../../../modules/nest-tenderer-negotiation/negotiation/models/graphql";
import { GET_CURRENT_FINANCIAL_YEAR_SIMPLIFIED } from "../../../modules/nest-app/store/tender-creation/tender-creation.graphql";
import { JsonPipe, NgClass } from "@angular/common";
import { fadeIn } from "../../animations/basic-animation";
import { SearchPipe } from "../../pipes/search.pipe";
import { FormsModule } from "@angular/forms";
import { FilterPipe } from "../../pipes/filter.pipe";
import { StringSearchPipe } from "../../pipes/searc-string.pipe";
import { fadeOut } from "../../animations/router-animation";
import { StorageService } from "../../../services/storage.service";
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
  selector: 'app-financial-year-select',
  standalone: true,
  imports: [
    NgClass,
    SearchPipe,
    FormsModule,
    FilterPipe,
    StringSearchPipe,
    JsonPipe
  ],
  templateUrl: './financial-year-select.component.html',
  styleUrl: './financial-year-select.component.scss',
  animations: [fadeIn, fadeOut]
})
export class FinancialYearSelectComponent implements AfterViewInit, OnInit {
  @Output() onYearSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() allowFutureFinancialYears: boolean = false;
  @Input() currentFinancialYear: string;
  @Input() readOnly: boolean = false;
  financialYears: string[] = [];
  showOptionPane: boolean = false;
  searchString: string;
  selectedCurrentFinancialYear: string;

  @ViewChild('selectorPane') selectorPane!: ElementRef;
  @ViewChild('listPane') listPane!: ElementRef;

  ngAfterViewInit() {
    this.setWidth();
  }

  toggleOptionPane() {
    this.showOptionPane = !this.showOptionPane;
    if (this.showOptionPane) {
      this.setWidth();
    }
  }

  setWidth() {
    if (this.selectorPane && this.listPane) {
      const cdWidth = this.selectorPane.nativeElement.offsetWidth;
      this.listPane.nativeElement.style.width = `${cdWidth}px`;
    }
  }

  constructor(private apollo: GraphqlService, private storage: StorageService,) {
    this.getCurrentFinancialYear().then(async _ => {
      await this.getAllFinancialYears();
    });
  }

  ngOnInit(): void {
    this.selectedCurrentFinancialYear = this.currentFinancialYear;
  }

  selectFinancialYear(year: string) {
    this.selectedCurrentFinancialYear = year;
    this.showOptionPane = false;
    this.onYearSelected.emit(year);
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

  async getAllFinancialYears(): Promise<void> {
    var response: any = await this.apollo.fetchData({
      apolloNamespace: ApolloNamespace.app,
      query: GET_FINANCIAL_YEARS
    });

    try {
      this.financialYears = response.data.getFinancialYears.dataList.map((financialYear: any) => financialYear.code);
    } catch (e) {
      this.financialYears = [];
    }

    if (!this.allowFutureFinancialYears) {
      this.financialYears = this.removeFutureFinancialYears(this.financialYears, this.selectedCurrentFinancialYear);
    }

    this.sortedFinancialYears();
  }

  removeFutureFinancialYears(list: string[], compareItem: string) {
    // Convert compareItem to a number representing the starting year

    const compareYear: number = parseInt(compareItem.split('/')[0]);

    // Filter the list to keep items where the starting year is less than or equal to compareYear
    const filteredList: string[] = list.filter(item => {
      const itemYear: number = parseInt(item.split('/')[0]);
      return itemYear <= compareYear;
    });

    return filteredList;
  }

  sortedFinancialYears() {
    return this.financialYears.sort((a, b) => {
      const yearA = parseInt(a.split('/')[0]);
      const yearB = parseInt(b.split('/')[0]);
      return yearB - yearA;
    });
  }

  async getCurrentFinancialYear() {
    var response: any = await this.apollo.fetchData({
      query: GET_CURRENT_FINANCIAL_YEAR_SIMPLIFIED,
      apolloNamespace: ApolloNamespace.uaa,
      variables: {
        procuringEntityUuid: this.storage.getItem("institutionUuid")
      }
    });
    try {
      this.selectedCurrentFinancialYear = response.data.getCurrentFinancialYearSimplified.data.financialYearCode;
    } catch (e) {
      this.selectedCurrentFinancialYear = this.getLocalCurrentFinancialYear();
    }
    this.onYearSelected.emit(this.selectedCurrentFinancialYear);
  }

}
