import { Injectable, computed, effect, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { NestUtils } from '../../utils/nest.utils';

export interface GanttChartTask {
  id?: number;
  uuid?: string;
  number?: string;
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  startingDay?: number;
  progress?: number;
  days?: number;
  owner?: GanttChartTaskOwner;
  parentTaskId?: number;
  level?: number;
  parentTask?: GanttChartTask;
  group?: GanttChartTask;
  isGroup?: boolean;
}

export interface GanttChartTaskOwner {
  id?: number;
  uuid?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class GanttChartService {
  numberOfDays = signal<number>(365 * 1);
  tasks = signal<GanttChartTask[]>([]);
  dates = signal<Date[]>([]);
  startDate = signal<Date>(new Date());
  endDate = signal<Date>(new Date());
  chartStartDate = signal<Date>(new Date());
  chartEndDate = signal<Date>(new Date());
  weeks = signal<number[]>([]);
  useDates = signal<boolean>(true);

  initialEmptyTasksCount: number = 50;
  showProgress: boolean = true;
  showTaskOwner: boolean = true;

  totalInfoColumns = signal<number>(5);

  addNew = signal<boolean>(false);
  taskToEdit = signal<GanttChartTask | null>(null);

  savableTasks = computed(() => {
    return this.tasks().filter((t) => t.uuid != null);
  });

  constructor(private dialog: MatDialog) {
    effect(() => {

    });
  }

  init() {
    this.tasks.set([]);
    this.dates.set([]);
    this.weeks.set([]);
    this.totalInfoColumns.set(5);
    this.numberOfDays.set(365 * 1);

    if (this.showProgress) {
      this.totalInfoColumns.update((prev) => prev + 1);
    }
    if (this.showTaskOwner) {
      this.totalInfoColumns.update((prev) => prev + 1);
    }

    this.setDates();
    this.initiateEmptyTasks();
  }

  setDates() {
    this.startDate.set(new Date());
    this.endDate.update((prev) => {
      prev.setDate(this.startDate().getDate() + this.numberOfDays());
      return prev;
    });

    this.setChartStartDateToStartWithMonday(this.startDate());
    this.setChartEndDateToEndWithSunday(this.endDate());




    let dates = this.getDates(this.chartStartDate(), this.chartEndDate());
    let weeks = this.setWeeks(this.chartStartDate(), this.chartEndDate());
    this.dates.set(dates);
    this.weeks.set(weeks);
  }

  getDates(startDate: Date, stopDate: Date) {
    var dateArray = new Array();
    var currentDate = new Date(startDate);
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  setWeeks(startDate: Date, endDate: Date) {
    var weeks = [];
    var currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      weeks.push(
        this.getWeekNumber(currentDate) + ' - ' + currentDate.getFullYear()
      );
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return weeks;
  }

  getWeekNumber(date: Date) {
    var d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  getWeekNumberFromDate(date: Date) {
    return this.getWeekNumber(date);
  }

  setChartStartDateToStartWithMonday(currentDate: Date) {
    const dayOfWeek = currentDate.getDay();
    const difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const firstMonday = new Date(currentDate);
    firstMonday.setDate(currentDate.getDate() - difference);
    this.chartStartDate.set(firstMonday);
  }

  setChartEndDateToEndWithSunday(currentDate: Date) {
    const day = currentDate.getDay();
    const diff = day === 0 ? 0 : 7 - day;
    const nextSunday = new Date(
      currentDate.setDate(currentDate.getDate() + diff)
    );

    this.chartEndDate.set(nextSunday);
  }

  onAddTaskClick() {
    this.addNew.set(true);
    this.dialog.open(TaskManagerComponent, {
      width: '600px',
    });
  }

  saveTask = async (task: GanttChartTask) => {
    await new Promise((r) => setTimeout(r, 1500));
    if (this.addNew) {
      this.addNewTask(task);
    } else {
      this.updateExistingTask(task);
    }

    return await Promise.resolve({
      success: true,
      message: 'Task saved successfully',
    });
  };

  arrangeTasks() {
    let filledTasks = this.tasks().filter((t) => t.uuid != null);

    let taskGroups = filledTasks.filter((t) => t.isGroup);
    let tasks = filledTasks.filter((t) => !t.isGroup);
    let sortedTasksByStartDate = tasks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
    this.setTaskGroupDatesByChildren(taskGroups, sortedTasksByStartDate);
    let sortedTaskGroupsByStartDate = taskGroups.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    let finalGroupedTasks = this.setFinalGroupedTasks(
      sortedTaskGroupsByStartDate,
      sortedTasksByStartDate
    );

    this.tasks.set(finalGroupedTasks);
  }

  setFinalGroupedTasks(
    sortedTaskGroupsByStartDate: GanttChartTask[],
    sortedTasksByStartDate: GanttChartTask[]
  ): GanttChartTask[] {
    let finalGroupedTasks = [];
    sortedTaskGroupsByStartDate.forEach((group) => {
      finalGroupedTasks.push(group);
      let children = sortedTasksByStartDate.filter(
        (t) => t.group?.uuid === group.uuid
      );
      finalGroupedTasks.push(...children);
    });

    let tasksWithNoGroups = sortedTasksByStartDate.filter(
      (t) => t.group == null
    );

    finalGroupedTasks.push(...tasksWithNoGroups);

    return finalGroupedTasks;
  }

  setTaskGroupDatesByChildren(
    taskGroups: GanttChartTask[],
    tasks: GanttChartTask[]
  ) {
    taskGroups.forEach((group) => {
      let children = tasks.filter((t) => t.group?.uuid === group.uuid);
      if (children.length > 0) {
        let startDate = new Date(
          Math.min(...children.map((t) => t.startDate.getTime()))
        );
        group.startDate = startDate;
      }
    });
  }

  updateExistingTask(task: GanttChartTask) {
    this.tasks.update((prev) => {
      const index = prev.findIndex((t) => t.uuid === task.uuid);
      prev[index] = task;
      return prev;
    });
  }

  addNewTask(task: GanttChartTask) {
    this.tasks.update((prev) => {
      const index = prev.findIndex((t) => t.uuid === null);
      if (index !== -1) {
        prev[index] = task;
      } else {
        prev.push(task);
      }
      return prev;
    });
  }

  initiateEmptyTasks() {
    for (let i = 0; i < this.initialEmptyTasksCount; i++) {
      this.tasks.update((prev) => {
        if (i == 0) {
          prev.push({
            id: 1,
            number: '1',
            name: 'Task 1',
            uuid: this.generateLocalUuid(),
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            progress: null,
          });
        } else {
          prev.push({
            id: null,
            number: null,
            name: '',
            startDate: null,
            endDate: null,
            progress: null,
          });
        }

        return prev;
      });
    }
  }

  generateLocalUuid(): string {
    return 'local-' + NestUtils.generateUUID();
  }
}
