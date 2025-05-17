import { Component, OnInit } from '@angular/core';
import { GanttChartService, GanttChartTask } from './gantt-chart.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
})
export class GanttChartComponent implements OnInit {
  numberOfDays = this.ganttChartService.numberOfDays;
  tasks = this.ganttChartService.tasks;
  initialEmptyTasksCount = this.ganttChartService.initialEmptyTasksCount;

  showProgress = this.ganttChartService.showProgress;
  showTaskOwner = this.ganttChartService.showTaskOwner;
  totalInfoColumns = this.ganttChartService.totalInfoColumns;

  dates = this.ganttChartService.dates;
  startDate = this.ganttChartService.startDate;
  endDate = this.ganttChartService.endDate;
  chartStartDate = this.ganttChartService.chartStartDate;
  chartEndDate = this.ganttChartService.chartEndDate;
  weeks = this.ganttChartService.weeks;

  commonTDStyle = {
    border: '1px solid #E3E3E3',
    padding: '2px',
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  };

  commonTDStyleNumber = {
    ...this.commonTDStyle,
    'text-align': 'right',
  };

  textWrapperStyle = {
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  };

  infoColumnsTDStyle = {
    border: '1px solid #E3E3E3',
    padding: '2px',
    background: '#82D9FF',
  };

  daysTDStyle = {
    border: '1px solid #E3E3E3',
    padding: '2px',
    background: '#006793',
    'text-align': 'center',
    color: 'white',
    'font-weight': 'bold',
  };

  weeksTDStyle = {
    border: '1px solid #E3E3E3',
    padding: '2px',
    background: '#2592C1',
    'text-align': 'center',
    color: 'white',
    'font-weight': 'bold',
  };

  datesTDStyle = {
    border: '1px solid #E3E3E3',
    padding: '2px',
    background: '#F7F7F7',
    'text-align': 'center',
    color: '#484848',
    'vertical-align': 'bottom',
  };

  constructor(private ganttChartService: GanttChartService) {}

  ngOnInit(): void {
    this.ganttChartService.init();
  }

  getDayName(date: Date) {
    return date.toDateString().split(' ')[0][0];
  }

  onAddTaskClick() {
    this.ganttChartService.onAddTaskClick();
  }

  getTaskDayStyle(task: GanttChartTask, date: Date) {
    if (this.taskIsInDateRange(task, date)) {
      return {
        ...this.commonTDStyle,
        background: '#82D9FF',
      };
    }
    return this.commonTDStyle;
  }

  taskIsInDateRange(task: GanttChartTask, date: Date) {
    return task.startDate <= date && task.endDate >= date;
  }
}
