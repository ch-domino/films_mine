import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../entities/group';

@Pipe({
  name: 'groupsToString',
  standalone: true,
})
export class GroupsToStringPipe implements PipeTransform {
  transform(groups: Group[], option?: string): string {
    if (option === 'permissions')
      return groups.map((group) => group.permissions).join(', ');
    return groups.map((group) => group.name).join(', ');
  }
}
