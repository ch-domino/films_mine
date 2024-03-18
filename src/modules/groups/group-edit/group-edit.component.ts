import { Component, OnInit, inject } from '@angular/core';
import { GroupEditChildComponent } from '../group-edit-child/group-edit-child.component';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { Group } from '../../../entities/group';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [GroupEditChildComponent],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css',
})
export class GroupEditComponent implements OnInit {
  usersService = inject(UsersService);
  route = inject(ActivatedRoute);
  group: Group = new Group('');

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
}
