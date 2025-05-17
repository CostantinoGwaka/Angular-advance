import { Component, Input, WritableSignal, computed } from '@angular/core';
import { MultiLoaderService, SingleLoaderItem } from './multi-loader.service';
import { SingleLoaderComponent } from './single-loader/single-loader.component';

@Component({
  selector: 'app-multi-loader',
  standalone: true,
  imports: [SingleLoaderComponent],
  templateUrl: './multi-loader.component.html',
})
export class MultiLoaderComponent {
  @Input() trackedLoaderIds: string[] = [];

  constructor(public multiLoaderService: MultiLoaderService) {}
}
