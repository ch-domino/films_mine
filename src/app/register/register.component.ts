import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  hide = true;

  submit() {
    console.log('submit');
  }
}
