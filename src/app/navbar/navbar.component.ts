import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  usersService = inject(UsersService);
  router = inject(Router);
  userNameSignal = this.usersService.loggedUserSignal;

  logout() {
    this.usersService.logout();
  }
}
