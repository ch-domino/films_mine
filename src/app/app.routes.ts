import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { RegisterComponent } from './register/register.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: 'users', component: UsersComponent },
  {
    path: 'extended-users',
    component: ExtendedUsersComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/edit/:id', component: EditUserComponent },
  { path: 'user/new', component: EditUserComponent },
  {
    path: 'groups',
    loadChildren: () => import('../modules/groups/groups.module'), //.then((mod) => mod.GroupsModule),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
