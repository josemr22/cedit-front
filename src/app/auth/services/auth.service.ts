import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { LoginResponse, User } from '../interfaces/LoginResponse.interface';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

const apiUrl = environment.apiUrl;
const headers = new HttpHeaders().set("X-Requested-With", "XMLHttpRequest");

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _user: User | undefined;

  getUser() {
    return { ...this._user };
  }

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
      return of(false);
    }
    return this.http.get<User>(`${apiUrl}/user`, {
      headers: headers.set('Authorization', 'Bearer ' + localStorage.getItem('token')!)
    })
      .pipe(
        switchMap(u => {
          this._user = u;
          return of(true);
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
