import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup = this.fb.group({
    email: ['Admin', [Validators.required]],
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
    this.authService.login(this.form.value).subscribe({
      next: _ => {
        this.router.navigateByUrl("/dashboard")
      },
      error: () => {
        Swal.fire('Ocurrió un error', 'No se reconoces las credenciales introducidas', 'error')
      }
    });
  }

  isInvalid(field: string) {
    const control = this.form.get(field)!;
    return control.invalid && control.touched;
  }
}
