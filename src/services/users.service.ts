import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { EMPTY, Observable, catchError, map, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../entities/auth';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = 'http://localhost:8080/';
  private users: User[] = [
    new User('Peter Service', 'peter@upjs.sk', 2, new Date(), 'qwerty'),
    new User('Lois Service', 'lois@upjs.sk', 3),
    new User('Stewie Service', 'stewie@upjs.sk', 1),
    { name: 'Brian Service', email: 'brian@upjs.com', password: '' },
  ];
  private token = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getUsersSynchronous(): User[] {
    return this.users;
  }

  getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users').pipe(
      map((jsonUsers) => jsonUsers.map((jsonUser) => User.clone(jsonUser))),
      catchError((err) => this.processError(err))
    );
  }

  login(auth: Auth): Observable<boolean> {
    return this.http
      .post(this.url + 'login', auth, { responseType: 'text' })
      .pipe(
        map((token) => {
          this.token = token;
          this.messageService.success('Login successful');
          return true;
        }),
        catchError((err) => this.processError(err))
      );
  }

  processError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        this.messageService.error('Server is not available');
        return EMPTY;
      }
      if (err.status >= 400 && err.status < 500) {
        const message =
          err.error.errorMessage || JSON.parse(err.error).errorMessage;
        this.messageService.error(message);
        return EMPTY;
      }
      this.messageService.error('Server error, contact server administrator');
      console.error('Server error', err);
      return EMPTY;
    }
    console.error('Error', err);
    return EMPTY;
  }
}