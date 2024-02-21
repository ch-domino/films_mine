import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  constructor(private http: HttpClient) {}

  getUsersSynchronous(): User[] {
    return this.users;
  }

  getLocalUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.url + 'users')
      .pipe(
        map((jsonUsers) => jsonUsers.map((jsonUser) => User.clone(jsonUser)))
      );
  }
}
