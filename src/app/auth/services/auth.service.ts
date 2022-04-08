import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { LoginResponse, User } from '../interfaces/LoginResponse.interface';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticateResponse, ItemMenu } from '../interfaces/AuthenticateResponse.interface';

const apiUrl = environment.apiUrl;
const headers = new HttpHeaders().set("X-Requested-With", "XMLHttpRequest");

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: User | undefined;
  private _menu: ItemMenu[] = [];

  getUser() {
    return { ...this._user };
  }

  getMenu() {
    return [...this._menu];
  }

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(route: string): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
      return of(false);
    }
    return this.http.get<AuthenticateResponse>(`${apiUrl}/user?route=${route}`, {
      headers: headers.set('Authorization', 'Bearer ' + localStorage.getItem('token')!)
    })
      .pipe(
        switchMap(ar => {
          this._user = ar.user;
          this._menu = ar.menu;
          return of(true);
        }),
        catchError(_ => {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
          return of(false);
        })
      );
  }

  login(data: any) {
    return this.http.post<LoginResponse>(`${apiUrl}/login`, data, {
      headers
    }).pipe(
      tap(lr => {
        localStorage.setItem('token', lr.token)
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
