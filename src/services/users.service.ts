import { Injectable, signal } from '@angular/core';
import { User } from '../entities/user';
import { EMPTY, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../entities/auth';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { Group } from '../entities/group';

export const DEFAULT_REDIRECT_AFTER_LOGIN = '/extended-users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = 'http://localhost:8080/';
  private users: User[] = [
    new User('Peter Service', 'peter@upjs.sk', 2, new Date(), 'qwerty'),
    new User('Lois Service', 'lois@upjs.sk', 3),
    new User('Stewie Service', 'stewie@upjs.sk', 1),
  ];
  public redirectAfterLogin = DEFAULT_REDIRECT_AFTER_LOGIN;

  loggedUserSignal = signal(this.userName);

  // private token = '';
  private get token(): string {
    return localStorage.getItem('filmsToken') || '';
  }

  private set token(value: string) {
    if (value) {
      localStorage.setItem('filmsToken', value);
    } else {
      localStorage.removeItem('filmsToken');
    }
  }

  private get userName(): string {
    return localStorage.getItem('filmsUserName') || '';
  }

  private set userName(value: string) {
    this.loggedUserSignal.set(value);
    if (value) {
      localStorage.setItem('filmsUserName', value);
    } else {
      localStorage.removeItem('filmsUserName');
    }
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
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

  getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'users/' + this.token).pipe(
      map((jsonUsers) => jsonUsers.map((jsonUser) => User.clone(jsonUser))),
      catchError((err) => this.processError(err))
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.url + 'user/' + id + '/' + this.token).pipe(
      map((jsonUser) => User.clone(jsonUser)),
      catchError((err) => this.processError(err))
    );
  }

  userConflicts(user: User): Observable<string> {
    return this.http
      .post<string>(this.url + 'user-conflicts', user)
      .pipe(catchError((err) => this.processError(err)));
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.url + 'groups').pipe(
      map((jsonGroups) =>
        jsonGroups.map((jsonGroup) => Group.clone(jsonGroup))
      ),
      catchError((err) => this.processError(err))
    );
  }

  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(this.url + 'group/' + id).pipe(
      map((jsonGroup) => Group.clone(jsonGroup)),
      catchError((err) => this.processError(err))
    );
  }

  saveGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.url + 'groups/' + this.token, group).pipe(
      map((jsonGroup) => Group.clone(jsonGroup)),
      catchError((err) => this.processError(err))
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.url + 'register', user).pipe(
      tap((user) => {
        this.messageService.success('Registration successful, please log in.');
        this.router.navigateByUrl('/login');
      }),
      catchError((err) => this.processError(err))
    );
  }

  saveUser(user: User): Observable<User> {
    return this.http.post<User>(this.url + 'users/' + this.token, user).pipe(
      map((jsonUser) => User.clone(jsonUser)),
      tap((user) =>
        this.messageService.success('User ' + user.name + ' saved')
      ),
      tap((user) => this.router.navigateByUrl('/extended-users')),
      catchError((err) => this.processError(err))
    );
  }

  deleteUser(id: number): Observable<Boolean> {
    return this.http
      .delete<User>(this.url + 'user/' + id + '/' + this.token)
      .pipe(
        map(() => {
          this.messageService.success('User deleted');
          return true;
        }),
        catchError((err) => this.processError(err))
      );
  }

  login(auth: Auth): Observable<boolean> {
    return this.http
      .post(this.url + 'login', auth, { responseType: 'text' })
      .pipe(
        map((token) => {
          this.token = token;
          this.userName = auth.name;
          this.messageService.success('Login successful');
          return true;
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status == 401) {
            this.messageService.error('Wrong name or password');
            return of(false);
          }
          return this.processError(err);
        })
      );
  }

  logout() {
    this.http
      .get(this.url + 'logout/' + this.token)
      .pipe(catchError((err) => this.processError(err)))
      .subscribe(() => {
        this.token = '';
        this.userName = '';
        this.router.navigateByUrl('/login');
        this.messageService.success('Logout successful');
      });
  }

  processError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        this.messageService.error('Server is not available');
        return EMPTY;
      }
      if (err.status === 401) {
        this.messageService.error('Token expired, login again');
        this.logout();
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

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
