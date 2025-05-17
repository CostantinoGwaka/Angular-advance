import {Component, Input} from '@angular/core';
import {Advertisement} from "../../../../modules/nest-settings/store/advertisements/advertisements.model";

@Component({
  selector: 'app-tip-advertisement',
  standalone: true,
  imports: [],
  templateUrl: './tip-advertisement.component.html',
  styleUrl: './tip-advertisement.component.scss'
})
export class TipAdvertisementComponent {
  @Input()
  sampleAdvertisement: Advertisement;
  constructor() { }

  ngOnInit(): void {
  }
}
