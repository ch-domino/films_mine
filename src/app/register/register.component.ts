import { Component, model } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  hide = true;
  passwordMessage = '';

  passwordValidator = (model: AbstractControl): ValidationErrors | null => {
    const result = zxcvbn(model.value);
    this.passwordMessage =
      'Password score: ' +
      result.score +
      ' of 4, ' +
      result.crackTimesDisplay.offlineSlowHashing1e4PerSecond +
      ' to crack';

    if (result.score > 2) {
      return null;
    }
    return {
      weakPassword: this.passwordMessage,
    };
  };

  samePasswordValidator = (model: AbstractControl): ValidationErrors | null => {
    const password = model.get('password')?.value;
    const password2model = model.get('password2');
    const password2 = password2model?.value;
    if (password === password2) {
      password2model?.setErrors(null);
      return null;
    }
    const err = {
      passwordMismatch: 'Passwords do not match',
    };
    password2model?.setErrors(err);
    return err;
  };

  registerForm = new FormGroup(
    {
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(
          '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{2,}$'
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        this.passwordValidator,
      ]),
      password2: new FormControl('', [Validators.required]),
    },
    this.samePasswordValidator
  );

  constructor() {
    const options = {
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    };

    zxcvbnOptions.setOptions(options);
  }

  submit() {
    console.log('submit');
  }

  printError(err: any) {
    return JSON.stringify(err);
  }

  get login(): FormControl<string> {
    return this.registerForm.get('login') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>;
  }
}
