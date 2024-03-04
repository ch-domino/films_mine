import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [
    new User('Peter', 'peter@upjs.sk', 2, new Date(), 'qwerty'),
    new User('Lois', 'lois@upjs.sk', 3),
    new User('Stewie', 'stewie@upjs.sk', 1),
    { name: 'Brian', email: 'brian@upjs.sk', id: 4, password: '', groups: [] },
  ];
  selectedUser?: User;
  errorMessage = '';
  columnsToDisplay = ['id', 'name', 'email'];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // Volame servisne metody
    this.usersService.getUsers().subscribe({
      next: (u) => (this.users = u),
      error: (error) => (
        (this.errorMessage = 'Error while communicating with the server.'),
        console.error('Error:', error)
      ),
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
