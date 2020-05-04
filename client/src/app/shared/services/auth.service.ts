import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IUser } from '../interfaces';

interface ILoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: string = null;

  constructor(private http: HttpClient) {}

  register(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('/api/auth/register', user);
  }

  login(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/api/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
          }
        )
      );
  }

  setToken(token: string): void {
    this._token = token;
  }

  getToken(): string {
    return this._token;
  }

  isAuthenticated(): boolean {
    return Boolean(this._token);
  }

  logout(): void {
    this.setToken(null);
    localStorage.clear();
  }
}
