import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${apiUrl}/users`);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${apiUrl}/users/${id}`);
  }
}
