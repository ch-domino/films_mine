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

  getTokenHeader():
    | { headers?: { [header: string]: string }; params?: HttpParams }
    | undefined {
    if (!this.token) {
      return undefined;
    }
    return { headers: { 'X-Auth-Token': this.token } };
  }

  getFilms(
    orderBy?: string,
    descending?: boolean,
    indexFrom?: number,
    indexTo?: number,
    search?: string
  ): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = {
        ...(options || {}),
        params: new HttpParams()
          .set('orderBy', orderBy || '')
          .set('descending', descending ? 'true' : 'false')
          .set('indexFrom', indexFrom?.toString() || '')
          .set('indexTo', indexTo?.toString() || '')
          .set('search', search || ''),
      };
    }
    if (options && options.params) {
      if (orderBy) {
        options.params.append('orderBy', orderBy);
      }
      if (descending) {
        options.params.append('descending', descending);
      }
      if (indexFrom) {
        options.params.append('indexFrom', indexFrom);
      }
      if (indexTo) {
        options.params.append('indexTo', indexTo);
      }
      if (search) {
        options.params.append('search', search);
      }
    }
    return this.http.get<FilmsResponse>(this.url + 'films', options);
  }
}
