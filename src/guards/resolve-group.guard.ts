import { ResolveFn } from '@angular/router';
import { Group } from '../entities/group';
import { EMPTY } from 'rxjs';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';

export const resolveGroupGuard: ResolveFn<Group> = (route, state) => {
  const Id = Number(route.paramMap.get('id'));
  if (!Id) {
    return EMPTY;
  }
  const userService = inject(UsersService);
  return userService.getGroup(Id);
};
