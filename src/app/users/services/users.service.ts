import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';
import { Role } from '../interfaces/role.interface';

const apiUrl = environment.apiUrl;

export type UserForm = {
  name: string;
  user: string;
  password: string;
  role: string;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${apiUrl}/users`);
  }

  showUser(id: number) {
    return this.http.get<User>(`${apiUrl}/users/${id}`);
  }

  getRoles() {
    return this.http.get<Role[]>(`${apiUrl}/user-roles`);
  }

  storeUser(data: UserForm) {
    return this.http.post<User>(`${apiUrl}/users`, data);
  }

  updateUser(id: number, data: UserForm) {
    return this.http.put<User>(`${apiUrl}/users/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${apiUrl}/users/${id}`);
  }
}
