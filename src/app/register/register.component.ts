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
    email: new FormControl('', [Validators.required, Validators.email]),
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
}
