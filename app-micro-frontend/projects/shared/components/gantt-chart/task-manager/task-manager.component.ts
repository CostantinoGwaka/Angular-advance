import {
  Component,
  Inject,
  OnInit,
  computed,
  signal,
  effect,
  model,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { GanttChartService, GanttChartTask } from '../gantt-chart.service';
import { SearchPipe } from '../../../pipes/search.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectSearchComponent } from '../../mat-select-search/mat-select-search.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderComponent } from '../../loader/loader.component';
import { DatePipe } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    CdkDrag,
    LoaderComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatSelectSearchComponent,
    MatDatepickerModule,
    MatButtonModule,
    SearchPipe,
    DatePipe
],
})
export class TaskManagerComponent implements OnInit {
  task: GanttChartTask;
  tasks = this.ganttChartService.tasks;
  useDates = this.ganttChartService.useDates;
  addNew = this.ganttChartService.addNew;
  minStartDate = this.ganttChartService.startDate;
  maxStartDate = this.ganttChartService.endDate;
  savableTasks = this.ganttChartService.savableTasks;
  editMode: boolean = false;
  taskType: string = '';
  selectedParentTaskId: string = null;
  taskSearch: string;
  saving: boolean = false;

  newTaskUuid = null;

  days = model<number>(1);
  startDate = signal<Date>(new Date());
  endDate = computed(() => {
    return new Date(
      this.startDate().getTime() + this.days() * 24 * 60 * 60 * 1000 - 1
    );
  });

  taskTypes = [
    {
      value: 'task-group',
      label: 'Task Group',
    },
    {
      value: 'task',
      label: 'Task',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private _dialogRef: MatDialogRef<TaskManagerComponent>,
    private ganttChartService: GanttChartService
  ) {
    effect(() => {
      if (this.task) {
        if (this.taskType === 'task-group') {
          this.task.isGroup = true;
          this.task.days = null;
          this.task.startDate = null;
          this.task.endDate = null;
          this.task.group = null;
        } else {
          this.task.isGroup = false;
          this.task.startDate = this.startDate();
          this.task.endDate = this.endDate();
          this.task.days = this.days();
          this.task.group =
            this.taskType === 'task-group'
              ? {
                  uuid: this.selectedParentTaskId,
                }
              : null;
        }
      }
    });
  }

  ngOnInit() {
    this.init();
  }

  init() {
    if (this.addNew()) {
      this.newTaskUuid = this.ganttChartService.generateLocalUuid();
      this.startDate.set(this.ganttChartService.startDate());
      this.days.set(1);
      this.task = {
        name: '',
        uuid: this.newTaskUuid,
        startDate: this.startDate(),
        days: this.days(),
      };
    } else {
      this.task = this.ganttChartService.taskToEdit();
    }
  }

  setDataOnKeyup(event: any) {}

  async save() {
    this.saving = true;
    await this.ganttChartService.saveTask(this.task);
    this.saving = false;
    if (this.addNew()) {
      this.init();
    } else {
      this.close();
    }
    this.ganttChartService.arrangeTasks();
  }

  close() {
    this._dialogRef.close();
  }

  onTaskSelected(task: any) {}
}
