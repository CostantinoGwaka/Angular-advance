import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceComponent implements OnChanges {
  @Input() counterObject = {counter: 0};

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
