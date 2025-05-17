import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  SavedServiceItem
} from "../../../modules/nest-tenderer/tender-submission/submission/components/pricing/add-goods-spare-parts-itemization/goods-related-resvices-collection/goods-related-resvices-collection.component";
import { FormsModule } from '@angular/forms';
import { NgClass, CurrencyPipe } from '@angular/common';

export enum HeaderType {
  SEQUENCY = 'SEQUENCY',
  LABEL = 'LABEL',
  NUMBER = 'NUMBER',
  NUMBER_INPUT = 'NUMBER_INPUT',
  ACTION = 'ACTION'
}
export interface Header {
  id: string;
  name: string;
  label: string;
  type: HeaderType
}

export interface FormEntry {
  id: string;
  fieldName: string;
  fieldDescription: string;
  fieldType: HeaderType;
}
@Component({
    selector: 'app-custom-table-form',
    templateUrl: './custom-table-form.component.html',
    styleUrls: ['./custom-table-form.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, CurrencyPipe]
})
export class CustomTableFormComponent implements OnInit {
  headers: Header[] = [
    {
      id: "#",
      name: "#",
      label: "#",
      type: HeaderType.SEQUENCY
    },
    {
      id: "description",
      name: "Item Description",
      label: "Item Description",
      type: HeaderType.LABEL
    },
    {
      id: "quantity",
      name: "Quantity",
      label: "Quantity",
      type: HeaderType.NUMBER
    },
    {
      id: "unitPrice",
      name: "Unit Price",
      label: "Unit Price",
      type: HeaderType.NUMBER
    },
    {
      id: "totalPrice",
      name: "total",
      label: "Total",
      type: HeaderType.NUMBER
    },
    {
      id: "action",
      name: "",
      label: "shjkjg",
      type: HeaderType.ACTION
    }
  ];

  @Output() onItemSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: SavedServiceItem[] = [];
  @Input() isEvaluating: boolean = false;
  updateLoading: any = {};
  updateSuccess: any = {};
  updateError: any = {};
  constructor() { }

  ngOnInit(): void {
  }

  protected readonly HeaderType = HeaderType;

  onFieldChange(row: SavedServiceItem) {
    row.totalPrice = (+row.quantity * +row.unitPrice) + "";
    this.items.map((item: SavedServiceItem) => {
      if (item.serviceUuid == row.serviceUuid) {
        item = {
          ...item,
          ...row
        }
      }
      return item;
    });
  }

  saveItem(row: any) {
    this.updateLoading[row.uuid] = true;
    this.onItemSave.emit(row);
  }
}
