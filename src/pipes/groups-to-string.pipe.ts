import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupsToString',
  standalone: true
})
export class GroupsToStringPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
