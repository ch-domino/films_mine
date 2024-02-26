import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION = 3000;
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration?: number) {
    this.snackBar.open(message, 'SUCCESS', { duration: duration || DURATION });
  }

  error(message: string, duration?: number) {
    this.snackBar.open(message, 'ERROR', { duration: duration || DURATION });
  }
}
