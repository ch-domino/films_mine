import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterLinkActive, MatMenuModule],
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
