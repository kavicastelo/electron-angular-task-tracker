import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  tasks = signal([
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build an App', completed: true },
  ]);

  addTask(title: string, completed: boolean) {
    this.tasks.update((tasks) => [...tasks, { id: tasks.length + 1, title, completed: completed }]);
  }

  deleteTask(id: number) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  editTask(id: number, title: string, completed: boolean) {
    this.tasks.update((tasks) => tasks.map((task) => task.id === id ? { ...task, title, completed } : task));
  }

  completeTask(id: number) {
    this.tasks.update((tasks) => tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  }
}
