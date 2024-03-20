import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Film } from '../entities/film';
import { UsersService } from './users.service';
import { environement } from '../app/environments/environment.development';

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  usersService = inject(UsersService);
  http = inject(HttpClient);
  url = environement.serverUrl;

  get token() {
    return this.usersService.token;
  }

  getTokenHeader(): { headers: { [header: string]: string } } | undefined {
    if (!this.token) {
      return undefined;
    }
    return { headers: { 'X-Auth-Token': this.token } };
  }

  getFilms(): Observable<FilmsResponse> {
    return this.http.get<FilmsResponse>(
      this.url + 'films',
      this.getTokenHeader()
    );
  }
}
