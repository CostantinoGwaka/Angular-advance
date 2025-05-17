import { Component, Input } from '@angular/core';
import { SingleLoaderItem } from '../multi-loader.service';

@Component({
  selector: 'app-single-loader',
  standalone: true,
  imports: [],
  templateUrl: './single-loader.component.html',
})
export class SingleLoaderComponent {
  @Input({ required: true }) singleLoaderItem: SingleLoaderItem;

  constructor() {}
}
