import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { btnToggleControlTransactionIsVisible, controlTransactionIsActive, getOperationError, toggleControlTransaction, validateOperation } from 'src/app/helpers/validators';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Bank } from '../../../shared/interfaces/bank.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TillService } from '../../services/till.service';
import { Transaction } from '../../../students/interfaces/payment.interface';
import Swal from 'sweetalert2';
import { StudentsService } from 'src/app/students/services/students.service';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styles: [
  ]
})
export class EditTransactionComponent implements OnInit {

  validateOperationFunction: AsyncValidatorFn = (control: AbstractControl) => validateOperation(control, this);

  banks: Bank[] = [];
  transaction!: Transaction;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private activatedRouted: ActivatedRoute,
    private router: Router,
    private tillService: TillService,
    private studentService: StudentsService
  ) { }

  form: FormGroup = this.fb.group({
    transaction: this.fb.group({
      bank_id: null,
      operation: [null, [], [this.validateOperationFunction]],
      user_id: this.authService.getUser().id,
      name: null,
      payment_date: null,
    })
  });

  ngOnInit(): void {

    this.activatedRouted.params.pipe(
      switchMap(({ id }) => this.tillService.getTransaction(id))
    ).subscribe({
      next: t => this.transaction = t,
      error: _ => this.router.navigateByUrl('/')
    });

    if (this.authService.getUser().roles![0].name !== 'Administrador') {
      this.form.get('transaction.operation')!.setAsyncValidators((control: AbstractControl) => validateOperation(control, this));
      this.form.get('transaction.operation')?.updateValueAndValidity();
    }
    this.sharedService.getBanks().subscribe((b) => {
      this.banks = b;
      if (this.banks.length > 0) {
        this.form
          .get('transaction.bank_id')!
          .setValue(this.transaction.bank_id);
        this.form
          .get('transaction.operation')!
          .setValue(this.transaction.operation);
        this.form
          .get('transaction.user_id')!
          .setValue(this.authService.getUser().id);
        this.form
          .get('transaction.name')!
          .setValue(this.transaction.name);
        this.form
          .get('transaction.payment_date')!
          .setValue(this.transaction.payment_date);
      }
    });
  }


  onChangeBank(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value != '1' && value != '6') {
      this.form
        .get('transaction.operation')
        ?.setValidators([Validators.required]);
    } else {
      this.form.get('transaction.operation')?.clearValidators();
      if (value == '6') {
        this.form.get('transaction.name')?.setValidators(Validators.required);
        this.form
          .get('transaction.payment_date')
          ?.setValidators(Validators.required);
      } else {
        this.form.get('transaction.name')?.clearValidators();
        this.form.get('transaction.payment_date')?.clearValidators();
      }
    }
    this.form.get('transaction.operation')?.updateValueAndValidity();
    this.form.get('transaction.name')?.updateValueAndValidity();
    this.form.get('transaction.payment_date')?.updateValueAndValidity();
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

  getOperationError() {
    return getOperationError(this);
  }

  btnToggleControlTransactionIsVisible(){
    return btnToggleControlTransactionIsVisible(this);
  }

  toggleControlTransaction(){
    toggleControlTransaction(this);
  }

  get controlTransactionIsActive(): boolean{
    return controlTransactionIsActive(this);
  }

  save() {
    this.tillService.editTransaction(this.transaction.id, this.form.get('transaction')!.value).subscribe({
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
