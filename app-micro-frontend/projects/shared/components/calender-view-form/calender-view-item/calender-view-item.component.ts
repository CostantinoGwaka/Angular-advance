import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  isASpecialDay
} from "../../../../modules/nest-app/app-tender-creation/components/tender-calendar-creation/tender-calendar-creation.component";
import { fadeIn } from "../../../animations/basic-animation";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


export interface CalendarView {
  stageUuid: string;
  calendarDay: string;
  calendarDate: string;
  calendarMonth: string;
  calendarYear: string;
  stageName: string;
  daysToNextStage: number;
  nextState: string;
  fullDate: string;
  editable: boolean;
}

export interface DateEvent {
  calenderItem: CalendarView,
  value: string
}
@Component({
  selector: 'app-calender-view-item',
  templateUrl: './calender-view-item.component.html',
  styleUrls: ['./calender-view-item.component.scss'],
  animations: [fadeIn],
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule]
})
export class CalenderViewItemComponent implements OnInit, OnChanges {
  @Input() calenderItem: CalendarView;
  @Input() calender: CalendarView[];
  @Input() dateFilters: any;
  @Output() valueChange: EventEmitter<DateEvent> = new EventEmitter();
  showEditForm: any = {};
  @Input() onSaving: any = {};
  changedDateValue: any;
  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.calenderItem.nextState = this.getNextStage(this.calenderItem)?.stageName;
    this.calenderItem.daysToNextStage = this.getDaysUntilNextStage(this.calenderItem);
  }

  onDateChange(event: any): void {
    this.changedDateValue = event.value;
  }

  onSave(): void {
    if (this.changedDateValue) {
      this.onSaving[this.calenderItem.stageUuid] = true;
      this.valueChange.emit({ value: this.changedDateValue, calenderItem: this.calenderItem });
      this.cd.detectChanges();
    }
  }

  editAttempt(calenderItem: CalendarView): void {
    let confirm: boolean = this.showEditForm[calenderItem.stageUuid];
    this.showEditForm[calenderItem.stageUuid] = !confirm;
  }

  calenderDisplayDateFilters = (d: Date): boolean => {
    const day: number = d ? d.getDay() : new Date().getDay();
    const date: Date = d ? d : new Date();
    return day !== 0 && day !== 6 && !isASpecialDay(date);
  }

  isStagePassed(calenderItem: CalendarView): boolean {
    return new Date(calenderItem.fullDate) < new Date();
  }

  isCurrentStage(stage): boolean {
    const currentDate: Date = new Date();
    const stageDate: Date = new Date(stage.fullDate);

    return stageDate <= currentDate && currentDate < this.getNextStageDate(stage);
  }

  getNextStageDate(stage): Date {
    const stageIndex: number = this.calender.findIndex((s: CalendarView): boolean => s.fullDate === stage.fullDate);

    if (stageIndex !== -1 && stageIndex < this.calender.length - 1) {
      return new Date(this.calender[stageIndex + 1].fullDate);
    }

    return null;
  }

  getNextStage(stage): CalendarView {
    const stageIndex: number = this.calender.findIndex((s: CalendarView): boolean => s.fullDate === stage.fullDate);

    if (stageIndex !== -1 && stageIndex < this.calender.length - 1) {
      return this.calender[stageIndex + 1];
    }

    return null;
  }

  getDaysUntilNextStage(stage): number {
    const currentDate: Date = new Date();
    const nextStageDate: Date = this.getNextStageDate(stage);

    if (nextStageDate) {
      const timeDifference: number = nextStageDate.getTime() - currentDate.getTime();
      return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }

    return null;
  }

}
