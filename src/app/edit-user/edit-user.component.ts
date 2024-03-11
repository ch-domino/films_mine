import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { map, switchMap, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  userId?: number;
  user = new User('', '');

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        tap((id) => (this.userId = id)),
        switchMap((id) => this.usersService.getUser(id))
      )
      .subscribe((user) => (this.user = user));

    // this.userId = Number(this.route.snapshot.params['id']);
  }
}
