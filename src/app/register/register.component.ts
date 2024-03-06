import { Component, model } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { UsersService } from '../../services/users.service';
import { User } from '../../entities/user';
import { Observable, map } from 'rxjs';

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

  userConflictsValidator(field: string): AsyncValidatorFn {
    return (model: AbstractControl): Observable<ValidationErrors | null> => {
      const name = field === 'login' ? model.value : '';
      const email = field === 'email' ? model.value : '';
      const user = new User(name, email);
      return this.usersService.userConflicts(user).pipe(
        map((conflicts) => {
          if (conflicts.length === 0) {
            return null;
          }
          return { serverConflict: field + ' already in use' };
        })
      );
    };
  }

  registerForm = new FormGroup(
    {
      login: new FormControl('', {
        validators: [Validators.required, Validators.minLength(4)],
        asyncValidators: this.userConflictsValidator('login'),
      }),
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{2,}$'
          ),
        ],
        this.userConflictsValidator('email')
      ),
      password: new FormControl('', [
        Validators.required,
        this.passwordValidator,
      ]),
      password2: new FormControl('', [Validators.required]),
    },
    this.samePasswordValidator
  );

  constructor(private usersService: UsersService) {
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
    const user = new User(
      this.login.value,
      this.email.value,
      undefined,
      undefined,
      this.password.value
    );
    this.usersService.register(user).subscribe();
  }

  printError(err: any) {
    return JSON.stringify(err);
  }

  get login(): FormControl<string> {
    return this.registerForm.get('login') as FormControl<string>;
  }

  get email(): FormControl<string> {
    return this.registerForm.get('email') as FormControl<string>;
  }

  get password(): FormControl<string> {
    return this.registerForm.get('password') as FormControl<string>;
  }
}
