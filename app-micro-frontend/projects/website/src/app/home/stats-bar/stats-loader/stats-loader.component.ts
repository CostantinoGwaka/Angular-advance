import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';


@Component({
    selector: 'home-stats-loader',
    templateUrl: './stats-loader.component.html',
    styleUrls: ['./stats-loader.component.scss'],
    standalone: true,
    imports: [],
})
export class StatsLoaderComponent implements OnInit {
  @Output()
  onLoadingRetry: EventEmitter<void> = new EventEmitter();

  @Input()
  hasError: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  retryLoading(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.onLoadingRetry.emit();
  }
}
