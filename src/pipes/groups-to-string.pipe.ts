import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../entities/group';

@Pipe({
  name: 'groupsToString',
  standalone: true,
})
export class GroupsToStringPipe implements PipeTransform {
  transform(groups: Group[], ...args: unknown[]): string {
    return groups.map((group) => group.name).join(', ');
  }
}
