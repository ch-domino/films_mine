import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { MaterialModule } from '../../modules/material.module';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../services/confirm.service';
import { RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-extended-users',
  standalone: true,
  imports: [MaterialModule, DatePipe, GroupsToStringPipe, RouterLink],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css',
})
export class ExtendedUsersComponent implements OnInit, AfterViewInit {
  usersService = inject(UsersService);
  confirmService = inject(ConfirmService);
  users: User[] = [];
  usersDataSource = new MatTableDataSource<User>();
  columnsToDisplay = [
    'id',
    'name',
    'email',
    'active',
    'lastLogin',
    'groups',
    'permissions',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.usersDataSource.paginator = this.paginator;
      this.paginator.length = this.users.length;

      this.usersDataSource.sort = this.sort;
      const pipe = new GroupsToStringPipe();
      this.usersDataSource.sortingDataAccessor = (
        user: User,
        col: string
      ): string | number => {
        switch (col) {
          case 'name':
            return user.name;
          case 'email':
            return user.email;
          case 'lastLogin':
            return user.lastLogin?.toISOString() || '';
          case 'groups': {
            const str = pipe.transform(user.groups);
            return str ? ' ' + str : 'a';
          }
          case 'permissions': {
            const str = pipe.transform(user.groups, 'permissions');
            return str ? ' ' + str : 'a';
          }
          default:
            return '';
        }
      };
    }
  }

  onFilter(event: any) {
    this.usersDataSource.filter = event.target.value.trim();
  }

  loadUsers() {
    this.usersService.getExtendedUsers().subscribe((users) => {
      this.users = users;
      this.usersDataSource.data = users;
      if (this.paginator) this.paginator.length = users.length;
    });
  }

  onDelete(user: User): void {
    this.confirmService
      .confirm({
        title: 'Delete user',
        question: 'Are you sure you want to delete user ' + user.name + '?',
      })
      .subscribe((answer) => {
        if (answer) {
          this.usersService.deleteUser(user.id!).subscribe((success) => {
            this.loadUsers();
          });
        }
      });
  }
}
