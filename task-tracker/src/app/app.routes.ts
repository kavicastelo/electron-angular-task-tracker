import { Routes } from '@angular/router';
import {TasksListComponent} from './components/tasks-list/tasks-list.component';
import {TaskDetailsComponent} from './components/task-details/task-details.component';

export const routes: Routes = [
  {path:'', component: TasksListComponent},
  {path:'task/:id', component: TaskDetailsComponent}
];
