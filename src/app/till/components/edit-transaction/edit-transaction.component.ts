import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { validateOperation } from 'src/app/helpers/validators';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Bank } from '../../../shared/interfaces/bank.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TillService } from '../../services/till.service';
import { Transaction } from '../../../students/interfaces/payment.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styles: [
  ]
})
export class EditTransactionComponent implements OnInit {

  banks: Bank[] = [];
  transaction!: Transaction;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private activatedRouted: ActivatedRoute,
    private router: Router,
    private tillService: TillService,
  ) { }

  form: FormGroup = this.fb.group({
    bank_id: null,
    operation: null,
    user_id: this.authService.getUser().id,
    name: null,
    payment_date: null,
  });

  ngOnInit(): void {

    this.activatedRouted.params.pipe(
      switchMap(({ id }) => this.tillService.getTransaction(id))
    ).subscribe({
      next: t => this.transaction = t,
      error: _ => this.router.navigateByUrl('/')
    });

    if (this.authService.getUser().roles![0].name !== 'Administrador') {
      this.form.get('operation')!.setAsyncValidators((control: AbstractControl) => validateOperation(control, this));
      this.form.get('operation')?.updateValueAndValidity();
    }
    this.sharedService.getBanks().subscribe((b) => {
      this.banks = b;
      if (this.banks.length > 0) {
        this.form
          .get('bank_id')!
          .setValue(this.transaction.bank_id);
        this.form
          .get('operation')!
          .setValue(this.transaction.operation);
        this.form
          .get('user_id')!
          .setValue(this.authService.getUser().id);
        this.form
          .get('name')!
          .setValue(this.transaction.name);
        this.form
          .get('payment_date')!
          .setValue(this.transaction.payment_date);
      }
    });
  }


  onChangeBank(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value != '1' && value != '6') {
      this.form
        .get('operation')
        ?.setValidators([Validators.required]);
    } else {
      this.form.get('operation')?.clearValidators();
      if (value == '6') {
        this.form.get('name')?.setValidators(Validators.required);
        this.form
          .get('payment_date')
          ?.setValidators(Validators.required);
      } else {
        this.form.get('name')?.clearValidators();
        this.form.get('payment_date')?.clearValidators();
      }
    }
    this.form.get('operation')?.updateValueAndValidity();
    this.form.get('name')?.updateValueAndValidity();
    this.form.get('payment_date')?.updateValueAndValidity();
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

  getOperationError() {
    const control = this.form.get('operation')!;
    if (control.invalid && control.touched) {
      if (control.errors!.required) {
        return 'El campo es requerido';
      }
      return 'Ya existe el número de operación en la base de datos';
    }

    return null;
  }

  save() {
    this.tillService.editTransaction(this.transaction.id, this.form.value).subscribe({
      next: r => {
        Swal.fire('Bien Hecho!', 'Transacción editada', 'success');
        if (this.transaction.dampings![0].installment.payment.course_turn_student) {
          this.router.navigateByUrl(`/alumnos/pagos/${this.transaction.dampings![0].installment.payment.course_turn_student.id}`);
        } else {
          this.router.navigateByUrl(`/ventas/pagos/${this.transaction.dampings![0].installment.payment.sale!.id}`);
        }
      }
    });
  }

}
