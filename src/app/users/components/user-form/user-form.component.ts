import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../interfaces/role.interface';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: [],
})
export class UserFormComponent implements OnInit {
  loading = false;

  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    user: [null, [Validators.required]],
    role_id: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  roles: Role[] = [];
  userId: number | null = null;

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userService.getRoles().subscribe((rs) => (this.roles = rs));
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id == 'nuevo') {
        return;
      }
      this.userId = id;
      this.userService.showUser(id).subscribe(
        (u) => {
          this.form
            .get('password')
            ?.removeValidators([Validators.required, Validators.minLength(6)]);
          this.form.reset({
            name: u.name,
            user: u.user,
            role_id: u.roles[0]?.name,
            password: '',
          });
        },
        (error) => this.router.navigateByUrl('/usuarios')
      );
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.loading=true;
    if (!this.userId) {
      this.userService.storeUser(this.form.value).subscribe((user) => {
        Swal.fire('Bien Hecho', 'Usuario Creado Correctamente', 'success');
        this.router.navigateByUrl('/usuarios');
      this.loading=false;
      });
    } else {
      this.userService
        .updateUser(this.userId, this.form.value)
        .subscribe((user) => {
          Swal.fire(
            'Bien Hecho',
            'Usuario Actualizado Correctamente',
            'success'
          );
          this.router.navigateByUrl('/usuarios');
        this.loading=false;
        });
    }
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
