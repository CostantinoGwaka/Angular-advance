import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fromEvent, Subscription, timer } from 'rxjs';
import { debounce, map } from 'rxjs/operators';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MinutesDirective } from './minutes.directive';
import { HoursDirective } from './hours.directive';
import { NgClass } from '@angular/common';

export interface Time {
  hour: string;
  minute: string;
}

@Component({
    selector: 'app-app-time-picker',
    templateUrl: './app-time-picker.component.html',
    styleUrls: ['./app-time-picker.component.scss'],
    standalone: true,
    imports: [NgClass, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, HoursDirective, MinutesDirective]
})
export class AppTimePickerComponent implements OnInit, AfterViewInit, OnDestroy {
  hours: string[] = [];
  minutes: string[] = [];
  selectedHour = '00';
  isDisable = true;
  selectedMinute = '00';
  @Input() pickTimeText = 'Select Time';
  @Output() pickedTime: EventEmitter<Time> = new EventEmitter<Time>();
  @ViewChild('hoursList') hoursList: ElementRef | undefined;
  @ViewChild('minutesList') minutesList?: ElementRef;
  @Input() date: Date | any;
  @Input() primaryColor = '#0E86D4';
  @Input() backgroundColor = 'white';
  @Input() textColor = 'black';
  @Input() inputControlBackgroundColor = 'white';
  @Input() enableAnimation = true;
  //set maximum hours
  @Input() maxHours = 24;
  @Input() minHours = 0;
  @Input() maxMinutes = 59;
  @Input() minMinutes = 0;
  @Input() manualInput = true;
  @Input() width = '230';
  @ViewChild('hoursInput') hoursInput!: ElementRef;
  @ViewChild('minutesInput') minutesInput!: ElementRef;
  hoursInputWidth = '3rem';
  private hoursInput$!: Subscription;
  private minutesInput$!: Subscription;
  private readonly KEY_UP_DELAY_TIME = 500;
  @ViewChild('hoursViewPort') hoursViewPort!: CdkVirtualScrollViewport;
  @ViewChild('minutesViewPort') minutesViewPort!: CdkVirtualScrollViewport;
  @Input() unitHeight = 40;

  constructor(
    private dialogRef: MatDialogRef<AppTimePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    //
    if (data) {
      const getTime = data.selectedTime.split(":");
      this.selectedHour = getTime[0];
      this.selectedMinute = getTime[1];

      this.maxHours = data.maxHours;
      this.minHours = data.minHours;
      this.maxMinutes = data.maxMinutes;
      this.minMinutes = data.minMinutes
      if (this.selectedHour && this.selectedMinute) {
        this.isDisable = false;
      }
    }
  }

  ngOnInit(): void {
    if (this.maxHours > 9) {
      this.hoursInputWidth = this.maxHours.toString().length + 1 + 'rem';
    }


    //set max hour and min hours
    for (let i = this.minHours; i < this.maxHours + 1; i++) {
      this.hours.push(i < 10 ? '0' + i + '' : i + '');
    }
    this.checkMinutes(parseInt(this.selectedHour));
  }

  checkMinutes(hour: number) {

    if (hour == this.maxHours) {
      this.setMinutesCount(0, this.maxMinutes);
    } else if (hour == this.minHours) {
      this.setMinutesCount(this.minMinutes, 59);
    } else {
      this.setMinutesCount(0, 59);
    }
  }


  setMinutesCount(min: number, max: number) {
    this.minutes = [];
    for (let i = min; i < max + 1; i++) {
      this.minutes.push(i < 10 ? '0' + i + '' : i + '');
    }
  }

  setHours(hour: string): void {
    this.checkMinutes(parseInt(hour));
    this.selectedHour = hour;
    this.isDisable = !(this.selectedHour && this.selectedMinute);
  }

  setMinutes(minute: string): void {
    this.isDisable = true;
    this.selectedMinute = minute;
    this.isDisable = !(this.selectedHour && this.selectedMinute);
  }

  ngAfterViewInit(): void {
    if (this.date) {
      setTimeout(() => {
        this.selectedHour = String(this.date.getHours() < 10 ? '0' + this.date.getHours() : this.date.getHours());
        this.scrollToActiveHour();
        this.selectedMinute = String(this.date.getMinutes() < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes());
        this.scrollToActiveMinute();
      }, 300);
    }

    if (this.manualInput) {
      this.hoursInput$ = fromEvent(this.hoursInput.nativeElement, 'keyup').pipe(map((x: any) => {
        return x.currentTarget.value;
      }), debounce(x => timer(this.KEY_UP_DELAY_TIME))
      ).subscribe(hours => this.setSelectedHour(hours));


      this.minutesInput$ = fromEvent(this.minutesInput.nativeElement, 'keyup').pipe(map((x: any) => {
        return x.currentTarget.value;
      }), debounce(x => timer(this.KEY_UP_DELAY_TIME))
      ).subscribe(minutes => this.setSelectedMinute(minutes));
    }
  }

  pickedTimeBtnClicked(): void {
    if (this.selectedMinute == undefined) {
      this.selectedMinute = '00';
    }

    this.dialogRef.close({ hour: this.selectedHour, minute: this.selectedMinute })
  }

  setSelectedHour(value: string): void {
    const valueWithoutZeros = value.replace(/^0+/, '');
    this.selectedHour = valueWithoutZeros.toString().length < 2 ? '0' + valueWithoutZeros : valueWithoutZeros;

    this.checkMinutes(+this.selectedHour);
    this.scrollToActiveHour();
  }

  private scrollToActiveHour(): void {
    this.hoursViewPort.scrollToIndex(this.hours.indexOf(this.selectedHour));
  }

  setSelectedMinute(value: string): void {
    this.selectedMinute = value;
    this.scrollToActiveMinute();
  }

  private scrollToActiveMinute(): void {
    this.minutesViewPort.scrollToIndex(this.minutes.indexOf(this.selectedMinute));
  }

  ngOnDestroy(): void {
    this.hoursInput$.unsubscribe();
    this.minutesInput$.unsubscribe();
  }

  resetDateInput() {
    this.selectedMinute = ""
    this.selectedHour = "";
    this.dialogRef.close({ hour: this.selectedHour, minute: this.selectedMinute })
  }
}

