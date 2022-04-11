import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loading = false;

  form: FormGroup = this.fb.group({
    user: ['Admin', [Validators.required]],
    password: ['password', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
    })
    Swal.showLoading();
    this.authService.login(this.form.value).subscribe({
      next: _ => {
        Swal.fire('Bien Hecho!', 'Bienvenido!', 'success');
        this.router.navigateByUrl("/dashboard");
      },
      error: () => {
        Swal.fire('Ocurrió un error', 'No se reconoce las credenciales introducidas', 'error');
      }
    });
  }

  isInvalid(field: string) {
    const control = this.form.get(field)!;
    return control.invalid && control.touched;
  }
}
