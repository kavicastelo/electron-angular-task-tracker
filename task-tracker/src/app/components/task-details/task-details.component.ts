import {Component, Input, signal} from '@angular/core';

@Component({
  selector: 'app-task-details',
  imports: [],
  standalone: true,
  template: `
    @if(task(); as currentTask;) {
        <div class="task-details">
            <h2>Task Details</h2>
            <p><strong>Title:</strong> {{ currentTask.title }}</p>
            <p><strong>Status:</strong> {{ currentTask.completed ? 'Completed' : 'Pending' }}</p>
            <button (click)="clearSelection()">Clear Selection</button>
        </div>
    }
    @else {
        <ng-template #noTask>
            <p>Select a task to view its details.</p>
        </ng-template>
    }
  `,
  styles: [
    `
      .task-details {
        border: 1px solid #ddd;
        padding: 1rem;
        border-radius: 4px;
        background-color: #f9f9f9;
      }
    `,
  ]
})
export class TaskDetailsComponent {
  @Input() task = signal<any>(null);

  clearSelection() {
    this.task.set(null);
  }
}
