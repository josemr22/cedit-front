import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { Bank } from '../../../shared/interfaces/bank.interface';
import { Installment, Student } from '../../interfaces/installment.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TillService } from '../../services/till.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-pay-form',
  templateUrl: './pay-form.component.html',
  styles: [],
})
export class PayFormComponent implements OnInit {
  banks: Bank[] = [];
  installment!: Installment;
  student!: Student;
  date = new Date();

  form: FormGroup = this.fb.group({
    amount: [0, [Validators.required]],
    voucher_type: ['R', [Validators.required]],
    transaction: this.fb.group({
      bank_id: [null, [Validators.required]],
      operation: [null, []],
      user_id: [this.authService.getUser().id, []],
      name: [null, []],
      payment_date: [null, []],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private tillService: TillService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.tillService.getInstallment(id).subscribe(
        (i) => {
          this.installment = i;
          this.student = this.installment.payment.course_turn_student.student;
          this.form.get('amount')?.setValidators(Validators.max(this.installment.balance));
          this.form.get('amount')?.updateValueAndValidity();
        },
        (_) => this.router.navigateByUrl('/alumnos/lista')
      );
    });

    this.sharedService.getBanks().subscribe((b) => {
      this.banks = b;
      if (this.banks.length > 0) {
        this.form
          .get('transaction')!
          .get('bank_id')!
          .setValue(this.banks[0].id);
      }
    });
  }

  get tableData() {
    const cols = ['Description', 'Precio', 'Cantidad', 'Total'];

    let description = '';

    switch (this.installment.type) {
      case 'm':
        description = `Pago de matrícula en ${this.installment.payment.course_turn_student.course_turn.course.name}, Turno ${this.installment.payment.course_turn_student.course_turn.turn.name}`;
        break;
      case 'c':
        description = `Pago de Cuota ${this.installment.number}`;
        break;

      default:
        break;
    }

    const qty = 1;

    const values = [
      description,
      this.form.get('amount')?.value?.toFixed(2) ?? '0.00',
      // TODO: Check
      qty,
      (this.form.get('amount')?.value * qty)?.toFixed(2),
    ];

    return {
      cols,
      values,
    };
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

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.tillService
      .pay(this.installment.id, this.form.value)
      .subscribe((_) => {
        Swal.fire('Bien Hecho!', 'Pago realizado', 'success');
        this.router.navigateByUrl(
          '/alumnos/pagos/' + this.installment.payment.course_turn_student.id
        );
      });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
