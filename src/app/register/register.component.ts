import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  hide = true;

  registerForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{2,}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    password2: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  submit() {
    console.log('submit');
  }

  printError(err: any) {
    return JSON.stringify(err);
  }

  get login(): FormControl<string> {
    return this.registerForm.get('login') as FormControl<string>;
  }
}
