import {Component, ViewChild} from '@angular/core';
import {TasksService} from '../../services/tasks.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-tasks-list',
  imports: [
    NgForOf
  ],
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class TasksListComponent {
  @ViewChild('taskInput') taskInput: any;
  tasks: any;
  currentTaskId: number | null = null;

  constructor(private tasksService: TasksService) {
    this.tasks = this.tasksService.tasks;
  }

  addOrUpdateTask(value: string) {
    if (this.currentTaskId !== null) {
      this.tasksService.editTask(this.currentTaskId, value, false);
      this.currentTaskId = null;
    } else {
      this.tasksService.addTask(value, false);
    }
    this.taskInput.nativeElement.value = '';
  }

  deleteTask(id: number) {
    this.tasksService.deleteTask(id);
  }

  editTask(taskId: number, title: string) {
    this.currentTaskId = taskId;
    this.taskInput.nativeElement.value = title;
    this.taskInput.nativeElement.focus();
  }

  completeTask(id: number) {
    this.tasksService.completeTask(id);
  }
}
