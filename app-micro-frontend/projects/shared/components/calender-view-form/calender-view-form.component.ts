import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { CalendarView, CalenderViewItemComponent } from "./calender-view-item/calender-view-item.component";
import {
  isASpecialDay
} from "../../../modules/nest-app/app-tender-creation/components/tender-calendar-creation/tender-calendar-creation.component";
import {
  CalenderObject
} from "../../../modules/nest-app/app-tender-creation/components/calendar-display/calendar-display.component";
import { NgClass } from '@angular/common';
export interface CalenderItem {
  constraint: string;
  date: string;
  days: any;
  name: string;
  order: any;
  stageUuid: string;
  editable: boolean;
};
@Component({
  selector: 'app-calender-view-form',
  templateUrl: './calender-view-form.component.html',
  styleUrls: ['./calender-view-form.component.scss'],
  standalone: true,
  imports: [NgClass, CalenderViewItemComponent]
})
export class CalenderViewFormComponent implements OnInit, OnChanges {
  @Input() calendar: CalenderItem[] = [];
  calendarSorted: CalenderItem[] = [];
  calendarFormatted: CalendarView[] = [];
  @Output() onCloseForm: EventEmitter<any> = new EventEmitter();
  @Output() onChangeCalendarStage: EventEmitter<any> = new EventEmitter();
  @Input() loading: any;
  @Input() dateFilters: any;
  @Input() onSaving: any = {};
  @Input() saved: boolean = false;
  @Input() dateInvitationFilters: any;
  endDate: any;
  startDate: any;
  @Input() duration: number;
  @Input() showContainer: boolean = false;
  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes): void {


    this.calendarSorted = [...this.calendar].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // this.calendar.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.calendarFormatted = this.transformCalender(this.calendar);
    if (this.saved) {
      this.onSaving = {};
    }
  }

  transformCalender(calendar: CalenderItem[]): CalendarView[] {
    return calendar.map((cItem: CalenderItem): CalendarView => {
      return {
        stageUuid: cItem.stageUuid,
        calendarDay: this.getDayName(cItem.date),
        calendarDate: cItem.date.split('-')[2],
        calendarMonth: this.getMonthName(cItem.date),
        calendarYear: cItem.date.split('-')[0],
        stageName: cItem.name,
        daysToNextStage: this.getDaysToNextStage(cItem, calendar),
        nextState: this.getNextStage(cItem, calendar),
        fullDate: cItem.date,
        editable: cItem.editable
      }
    });
  }

  getDaysToNextStage(citem: CalenderItem, calendar: CalenderItem[]): number {
    return 0;
  }

  getNextStage(citem: CalenderItem, calendar: CalenderItem[]): string {
    return "";
  }

  private getDayName(dateString: string): string {
    const dateParts: string[] = dateString.split('-');
    const year: number = parseInt(dateParts[2]);
    const month: number = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day: number = parseInt(dateParts[0]);

    const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date: Date = new Date(dateString);
    const dayIndex: number = date.getDay();

    return daysOfWeek[dayIndex];
  }

  private getMonthName(dateString: string): string {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day = parseInt(dateParts[2]);

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date(year, month, day);
    const monthIndex = date.getMonth();

    return months[monthIndex];
  }


  onDateChange(event: any, calendarItem: any) {
    calendarItem = {
      ...calendarItem,
      date: this.toIsoString(event.value).substring(0, 10)
    };
    this.onSaving[calendarItem.stage] = true;
    this.onChangeCalendarStage.emit(calendarItem);
  }

  toIsoString(dateValue: any) {
    const date = new Date(dateValue);
    const offset = date.getTimezoneOffset()
    const offsetAbs = Math.abs(offset)
    const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString();
    return `${isoString.slice(0, -1)}${offset > 0 ? '-' : '+'}${String(Math.floor(offsetAbs / 60)).padStart(2, '0')}:${String(offsetAbs % 60).padStart(2, '0')}`

  }

}
