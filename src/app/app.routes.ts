import { Routes } from '@angular/router';
import { authGuard, authMatchGuard } from '../guards/auth.guard';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent },
  {
    path: 'extended-users',
    component: ExtendedUsersComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(
        (com) => com.RegisterComponent
      ),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat.component').then((com) => com.ChatComponent),
  },
  { path: 'user/edit/:id', component: EditUserComponent },
  { path: 'user/new', component: EditUserComponent },
  {
    path: 'groups',
    loadChildren: () => import('../modules/groups/groups.module'), //.then((mod) => mod.GroupsModule),
    canActivate: [authGuard],
    canMatch: [authMatchGuard],
  },
  {
    path: 'films',
    loadComponent: () =>
      import('./films/films.component').then((mod) => mod.FilmsComponent),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
