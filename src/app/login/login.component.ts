import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../entities/auth';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
})
export class LoginComponent {
  hide = true;
  auth = new Auth('Peter', 'sovy'); // Don't forget to remove when adding to server

  usersService = inject(UsersService);

  submit() {
    this.usersService.login(this.auth).subscribe((token) => {
      console.log('token: ', token);
    });
  }

  getAuth(): string {
    return JSON.stringify(this.auth);
  }

  setName(event: any) {
    this.auth.name = event.target.value;
  }
}
export class CardFancyExample {}
