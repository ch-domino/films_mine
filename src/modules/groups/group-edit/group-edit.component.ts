import { Component, OnInit, inject } from '@angular/core';
import { GroupEditChildComponent } from '../group-edit-child/group-edit-child.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { Group } from '../../../entities/group';
import { CanDeactivateComponent } from '../../../guards/can-deactivate.guard';
import { ConfirmService } from '../../../services/confirm.service';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [GroupEditChildComponent],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css',
})
export class GroupEditComponent implements OnInit, CanDeactivateComponent {
  usersService = inject(UsersService);
  confirmService = inject(ConfirmService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  group: Group = new Group('');
  saved = false;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        map((strId) => Number(strId) || 0),
        switchMap((id) =>
          id ? this.usersService.getGroup(id) : of(new Group(''))
        )
      )
      .subscribe((group) => (this.group = group));
  }

  groupSaved(group: Group) {
    this.router.navigateByUrl('/groups');
    this.saved = true;
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.saved) {
      return true;
    }
    return this.confirmService.confirm({
      title: 'Edit not saved',
      question: 'Group not saved, do you want to leave anyway?',
    });
  }
}
