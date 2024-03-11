import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { map, of, switchMap, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Group } from '../../entities/group';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  userId?: number;
  user = new User('', '');
  hide = true;
  allGroups: Group[] = [];
  editForm = new FormGroup({
    login: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      // asyncValidators: this.userConfictsValidator('login')
    }),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{2,}$'),
    ]), //, this.userConfictsValidator('email')),
    password: new FormControl(''),
    active: new FormControl(true),
    groups: new FormArray([]),
  });

  ngOnInit(): void {
    this.usersService
      .getGroups()
      .pipe(
        tap((groups) => {
          this.allGroups = groups;
          this.allGroups.forEach((group) => {
            this.groups.push(new FormControl(false));
          });
        }),
        switchMap((groups) => this.route.paramMap),
        map((params) => Number(params.get('id'))),
        tap((id) => (this.userId = id)),
        switchMap((id) =>
          id ? this.usersService.getUser(id) : of(new User('', ''))
        )
      )
      .subscribe((user) => {
        this.user = user;
        this.editForm.patchValue({
          login: user.name,
          email: user.email,
          password: '',
          active: user.active,
        });
        this.allGroups.forEach((group, i) => {
          const inGroup = user.groups.some(
            (userGroup) => userGroup.id === group.id
          );
          this.groups.at(i)?.setValue(inGroup);
        });
      });

    // this.userId = Number(this.route.snapshot.params['id']);
  }

  submit() {
    this.user.name = this.login.value.trim();
    this.user.email = this.email.value;
    this.user.password = this.password.value.trim();
    this.user.active = !!this.editForm.get('active')!.value;
    this.user.groups = this.allGroups.filter(
      (group, i) => this.groups.at(i).value
    );
    this.usersService.saveUser(this.user).subscribe();
  }

  get login(): FormControl<string> {
    return this.editForm.get('login') as FormControl<string>;
  }
  get email(): FormControl<string> {
    return this.editForm.get('email') as FormControl<string>;
  }
  get password(): FormControl<string> {
    return this.editForm.get('password') as FormControl<string>;
  }
  get groups(): FormArray {
    return this.editForm.get('groups') as FormArray;
  }
}
