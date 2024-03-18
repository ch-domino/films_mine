import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  if (usersService.isLoggedIn()) {
    return true;
  }
  usersService.redirectAfterLogin = state.url;
  router.navigateByUrl('/login');
  return false;
};
