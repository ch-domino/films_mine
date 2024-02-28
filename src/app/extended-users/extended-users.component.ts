import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-extended-users',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './extended-users.component.html',
  styleUrl: './extended-users.component.css',
})
export class ExtendedUsersComponent implements OnInit {
  usersService = inject(UsersService);
  users: User[] = [];
  columnsToDisplay = ['id', 'name', 'email', 'lastLogin', 'active', 'groups'];

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
