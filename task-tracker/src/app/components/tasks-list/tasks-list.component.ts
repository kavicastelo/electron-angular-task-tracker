import {Component, signal, ViewChild} from '@angular/core';
import {TasksService} from '../../services/tasks.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {NgForOf} from '@angular/common';
import {TaskDetailsComponent} from '../task-details/task-details.component';

@Component({
  selector: 'app-tasks-list',
  imports: [
    NgForOf,
    TaskDetailsComponent
  ],
  standalone: true,
  template: `
    <div class="task-tracker">
      <h1>Task Tracker</h1>
      <input
        type="text"
        placeholder="New task"
        #taskInput
        (keydown.enter)="addOrUpdateTask(taskInput.value)"
      />
      <ul>
        <li *ngFor="let task of tasksService.tasks()" @fade>
      <span
        [class.completed]="task.completed"
        (click)="selectTask(task)"
        style="cursor: pointer;"
      >
        {{ task.title }}
      </span>
          <div>
            <button (click)="deleteTask(task.id)">Delete</button>
            <button (click)="completeTask(task.id)">
              {{ task.completed ? 'Undo' : 'Complete' }}
            </button>
            <button (click)="editTask(task.id, task.title)">Edit</button>
          </div>
        </li>
      </ul>

      <!-- Conditional Rendering with @if -->
      @if (selectedTask()) {
        <app-task-details [task]="selectedTask"></app-task-details>
      }
      @else {
        <p>No task selected. Click on a task to view details.</p>
      }
    </div>
  `,
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
  selectedTask = signal<any>(null);

  constructor(public tasksService: TasksService) {
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

  selectTask(task: any) {
    this.selectedTask.set(task);
  }

  deleteTask(id: number) {
    this.tasksService.deleteTask(id);
    this.selectedTask.set(null);
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
