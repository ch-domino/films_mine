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
  usersDataSource = new MatTableDataSource();
  columnsToDisplay = [
    'id',
    'name',
    'email',
    'lastLogin',
    'active',
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
      this.usersDataSource.sort = this.sort;
      this.paginator.length = this.users.length;
    }
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
