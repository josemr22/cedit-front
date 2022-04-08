import { Component, OnInit } from '@angular/core';
import { Spending } from '../../interfaces/spending.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpendingService } from '../../services/spending.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-spending-form',
  templateUrl: './spending-form.component.html',
  styles: [
  ]
})
export class SpendingFormComponent implements OnInit {

  spending: Spending | null = null;

  form: FormGroup = this.fb.group({
    description: [null, Validators.required],
    amount: [null, Validators.required],
    user_id: [null, Validators.required],
    date: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private spendingService: SpendingService,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id === 'nuevo') {
        return;
      }
      this.spendingService.showSpending(id).subscribe({
        next: s => {
          this.spending = s;
          this.form.get('description')?.setValue(s.description);
          this.form.get('amount')?.setValue(s.amount);
          this.form.get('date')?.setValue(s.date.split(' ')[0]);
        },
        error: _ => this.router.navigateByUrl('/caja/gastos')
      });
    });
    this.form.get('user_id')?.setValue(this.authService.getUser().id);
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (!this.spending) {
      this.spendingService.storeSpending(this.form.value).subscribe({
        next: _ => {
          Swal.fire('Bien Hecho!', 'Gasto registrado correctamente');
          this.router.navigateByUrl('/caja/gastos');
        },
        error: () => alert('Ocurrió un error')
      });
    } else {
      this.spendingService.updateSpending(this.spending.id, this.form.value).subscribe({
        next: _ => {
          Swal.fire('Bien Hecho!', 'Gasto actualizado correctamente');
          this.router.navigateByUrl('/caja/gastos');
        },
        error: () => alert('Ocurrió un error')
      });
    }
  }

  isInvalid(field: string): boolean {
    return this.form.get(field)!.invalid && this.form.get(field)!.touched;
  }
}
