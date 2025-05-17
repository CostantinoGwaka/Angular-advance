import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, interval, map, take, takeWhile, timer } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ProgressCircularLoaderComponent } from '../../../modules/nest-tenderer/tender-submission/submission/progress-circular-loader/progress-circular-loader.component';

@Component({
    selector: 'app-loading-dialog',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, ProgressCircularLoaderComponent, MatButtonModule]
})
export class LoadingDialogComponent implements OnInit, OnDestroy {
  currentPercentage: number = 0;
  @Input() mainLoaderMessage = '';
  percentageSubscription = Subscription.EMPTY;

  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mainLoaderMessage: string;
    }) {
    dialogRef.disableClose = true;
    if (data.mainLoaderMessage) this.mainLoaderMessage = data.mainLoaderMessage
  }
  ngOnDestroy(): void {
    this.percentageSubscription.unsubscribe();
  }


  ngOnInit(): void {
    const durationMs = 50000; // 50 seconds
    const updateIntervalMs = 1000; // Update every 1000ms
    this.percentageSubscription = this.getPercentageObservable(durationMs, updateIntervalMs)
      .subscribe((percentage) => {
        this.currentPercentage = Math.min(percentage, 90);
      });

  }


  getPercentageObservable(durationMs: number, updateIntervalMs: number): Observable<number> {
    return timer(0, updateIntervalMs).pipe(
      take(Math.ceil(durationMs / updateIntervalMs) + 1),
      map((tick) => (tick * updateIntervalMs) / durationMs * 100)
    );
  }

  cancel() {
    this.dialogRef.close()
  }
}
