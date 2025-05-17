import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { CalendarView } from '../../components/calender-view-form/calender-view-item/calender-view-item.component';


@Component({
    selector: 'app-date-viewer',
    templateUrl: './date-viewer.component.html',
    styleUrls: ['./date-viewer.component.scss'],
    standalone: true,
    imports: []
})
export class DateViewerComponent implements OnInit {
  @Input() label: string;
  @Input() nextDateLabel: string;
  @Input() date: string;
  @Input() nextDate: string;
  calenderItem: CalendarView;
  constructor() { }

  ngOnInit(): void {
    this.calenderItem = this.getCalendarView(this.date, this.label);
  }

  isCurrentStage(): boolean {
    const currentDate: Date = new Date();
    const stageDate: Date = new Date(this.date);

    return stageDate <= currentDate && currentDate < new Date(this.nextDate);
  }

  isStagePassed(): boolean {
    return new Date(this.date) < new Date();
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



  getCalendarView(date: string, label: string): CalendarView {
    return {
      stageUuid: "",
      calendarDay: this.getDayName(date),
      calendarDate: date.split('-')[2],
      calendarMonth: this.getMonthName(date),
      calendarYear: date.split('-')[0],
      stageName: label,
      daysToNextStage: this.getDaysUntilNextStage(),
      nextState: this.nextDateLabel,
      fullDate: date,
      editable: false
    }
  }

  getDaysUntilNextStage(): number {
    const currentDate: Date = new Date();
    const nextStageDate: Date = new Date(this.nextDate);

    if (nextStageDate) {
      const timeDifference: number = nextStageDate.getTime() - currentDate.getTime();
      return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }

    return null;
  }

}
