import { Component, inject } from '@angular/core';
import { Auth } from '../../entities/auth';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [MaterialModule, FormsModule],
})
export class LoginComponent {
  hide = true;
  auth = new Auth('Peter', 'sovy'); // Don't forget to remove when adding to server

  usersService = inject(UsersService);
  router = inject(Router);

  submit() {
    this.usersService.login(this.auth).subscribe((success) => {
      if (success) {
        this.router.navigateByUrl('/extended-users');
        console.log('success: ', success);
      }
    });
  }

  getAuth(): string {
    return JSON.stringify(this.auth);
  }

  setName(event: any) {
    this.auth.name = event.target.value;
  }

  printError(err: any) {
    return JSON.stringify(err);
  }
}
export class CardFancyExample {}
