import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GraphqlService} from "../../../services/graphql.service";
import { JsonPipe, NgTemplateOutlet } from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FilterPipe} from "../../pipes/filter.pipe";
import {ItemComponent} from "./app-item-list/app-item.component";
import {
  GET_NEGOTIATION_AREA_CRITERIA_PAGINATED
} from "../../../modules/nest-tenderer-negotiation/store/negotiation-area-criteria/negotiation-area-criteria.graphql";
import {ApolloNamespace} from "../../../apollo.config";
import {LoaderComponent} from "../loader/loader.component";

@Component({
  selector: 'app-generic-nest-multi-select',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    FilterPipe,
    NgTemplateOutlet,
    ItemComponent,
    LoaderComponent
],
  templateUrl: './generic-nest-multi-select.component.html',
  styleUrl: './generic-nest-multi-select.component.scss'
})
export class GenericNestMultiSelectComponent {
  @Input() query;
  @Input() isPaginated: boolean = false;
  @Input() loading: boolean = false;

  currentPage: number = 1;
  defaultPageSize: number = 10;
  currentPageSize: number = this.defaultPageSize;

  @Input() criterias: any[] = [];
  @Input() selectedItems: any[] = [];
  @Input() availableItems: any[] = [];
  @Output() moveRight = new EventEmitter<any[]>();
  @Output() moveLeft = new EventEmitter<any[]>();
  searchItemAvailable: string;
  searchItemSelected: string;
  fetchingPaginated:boolean = false;

  constructor(private apollo: GraphqlService) {
    this.getPaginatedValues(this.query).then();
  }

  async getPaginatedValues(query: any) {
    this.availableItems = [];
    this.fetchingPaginated = true;
    while(true){
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.submission,
        query: GET_NEGOTIATION_AREA_CRITERIA_PAGINATED,
        variables: {
          input: {
            fields: [],
            mustHaveFilters: [],
            page: this.currentPage,
            pageSize: this.currentPageSize
          }
        }
      });


      let {rows, currentPage, totalPages} = response.data.items;
      try {
        const data: any[] = rows.filter(obj1 => !this.selectedItems.some(obj2 => obj1.uuid === obj2.uuid));
        const aobItems: any[] = data.filter((dataItem) => !dataItem.hasCriteria);
        const withCriteria: any[] = data.filter((dataItem) => dataItem.hasCriteria);
        const items: any[] = [];

        withCriteria.forEach((dataItem: any) => {
          if (this.criterias.find((criteria: any) => criteria?.evaluationCriteria?.uuid == dataItem?.evaluationCriteria?.uuid)) {
            items.push(dataItem);
          }
        });

        this.availableItems = [...this.availableItems,...items, ...aobItems];
      } catch (e) {
        console.log(e);
      }
      if(currentPage >=totalPages) {
        this.fetchingPaginated = false;
        break;
      }
      this.currentPage+=1;
    }

  }


  selectItem(item: any, section: string) {
    if (section === 'right') {
      const index = this.selectedItems.findIndex(selected => selected === item);
      if (index === -1) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(index, 1);
        this.availableItems.push(item);
      }
      this.moveRight.emit(this.selectedItems);
    }

    if (section == 'left') {
      const index = this.availableItems.findIndex(available => available === item);
      if (index !== -1) {
        this.availableItems.splice(index, 1);
        this.selectedItems.push(item);
      }
      this.moveLeft.emit(this.selectedItems);
      console.log(this.selectedItems);
    }
  }

  moveToRight() {
    console.log(this.selectedItems);
    this.moveRight.emit(this.selectedItems);
    this.selectedItems = [];
  }

  moveToLeft() {
    this.moveLeft.emit(this.selectedItems);
    this.selectedItems = [];
  }
}
