import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { MaterialModule } from '../../modules/material.module';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string.pipe';

@Component({
  selector: 'app-extended-users',
  standalone: true,
  imports: [MaterialModule, DatePipe, GroupsToStringPipe],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css',
})
export class ExtendedUsersComponent implements OnInit {
  usersService = inject(UsersService);
  users: User[] = [];
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

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe((users) => {
      this.users = users;
    });
  }

  loadUsers() {
    this.usersService.getExtendedUsers().subscribe((users) => {
      this.users = users;
    });
  }

  onDelete(user: User): void {
    this.usersService.deleteUser(user.id!).subscribe((success) => {
      this.loadUsers();
    });
  }
}
