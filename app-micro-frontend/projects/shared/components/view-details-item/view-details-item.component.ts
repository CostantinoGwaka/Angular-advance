import { Component, Input, OnInit , SimpleChanges} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-view-details-item',
    templateUrl: './view-details-item.component.html',
    styleUrls: ['./view-details-item.component.scss'],
    standalone: true,
    imports: [MatDividerModule, DecimalPipe, DatePipe]
})
export class ViewDetailsItemComponent implements OnInit {
  @Input() key: string;
  @Input() value: any;
  @Input() showBottomLine: boolean = true;
  @Input() valueType: string = 'string';

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const data = changes['value'].currentValue;
      if (this.valueType === 'number') {
        this.value = data
      } else if (this.valueType != 'date' && this.valueType != 'number') {
        try{
          this.value = data?.replace(/_/g, ' ')
        } catch (e){}
      }
    }
  }
}
