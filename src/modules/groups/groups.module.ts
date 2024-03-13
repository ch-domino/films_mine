import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { RouterModule } from '@angular/router';
import { routes } from './groups.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, GroupsListComponent, RouterModule.forChild(routes)],
})
export default class GroupsModule {} // if without default then in app.routes.ts we need to use the commented out code
