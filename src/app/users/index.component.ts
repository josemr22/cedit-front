import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from './interfaces/user.interface';
import { UsersService } from './services/users.service';
import { exportTable } from '../helpers/exports';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  @ViewChild('dt') dt!: ElementRef;

  _users: User[] = [];
  cols!: any[];

  isLoading: boolean = true;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this._users = users;
      this.isLoading = false;
    });

    this.cols = [
      { field: 'name', header: 'Nombre' },
      { field: 'user', header: 'Usuario' },
      { field: 'role', header: 'Rol' },
    ];
  }

  get users() {
    return this._users.map((user) => ({
      id: user.id,
      name: user.name,
      user: user.user,
      role: user.roles[0]?.name,
    }));
  }

  delete(id: number) {
    this.userService.deleteUser(id).subscribe((_) => {
      alert('Usuario Eliminado');
      const idx = this._users.findIndex((u) => u.id == id);
      this._users.splice(idx, 1);
    });
  }

  export(type: string) {
    exportTable(type, [...this.users], [...this.cols], 'usuarios');
  }
}
