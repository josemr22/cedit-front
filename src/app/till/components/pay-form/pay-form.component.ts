import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { Bank } from '../../../shared/interfaces/bank.interface';
import { Installment, Student } from '../../interfaces/installment.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TillService } from '../../services/till.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';
import { validateOperation } from 'src/app/helpers/validators';

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
    transaction: this.fb.group({
      voucher_type: ['R', [Validators.required]],
      ruc: [null],
      address: [null],
      email: [null],
      razon_social: [null],
      bank_id: [null, [Validators.required]],
      operation: [null, []],
      user_id: [this.authService.getUser().id, []],
      name: [null, []],
      payment_date: [null, []],
    }),
  });

  onChangeVoucherType(value: string) {
    this.form.get('transaction.voucher_type')!.setValue(value);
  }

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
          console.log(this.installment)
          if (this.installment.payment.course_turn_student) {
            this.student = this.installment.payment.course_turn_student.student;
          } else {
            this.student = this.installment.payment.sale!.course_turn_student.student;
          }
          this.form.get('amount')?.setValidators(Validators.max(this.installment.balance));
          this.form.get('amount')?.updateValueAndValidity();
        },
        (_) => this.router.navigateByUrl('/alumnos/lista')
      );
    });

    if (this.authService.getUser().roles![0].name !== 'Administrador') {
      this.form.get('transaction.operation')!.setAsyncValidators((control: AbstractControl) => validateOperation(control, this));
      this.form.get('transaction.operation')?.updateValueAndValidity();
    }

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

  async save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    if (this.form.get('transaction.voucher_type')?.value == 'F') {
      const { value } = await Swal.fire({
        title: 'Ingrese RUC',
        html:
          '<input type="number" id="ruc" class="swal2-input" placeholder="RUC">' +
          '<input type="text" id="address" class="swal2-input" placeholder="DIRECCIÓN">' +
          '<input type="email" id="email" class="swal2-input" placeholder="EMAIL">' +
          '<input type="text" id="razon_social" class="swal2-input" placeholder="RAZÓN SOCIAL">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            (document.getElementById('ruc') as HTMLInputElement)!.value,
            (document.getElementById('address') as HTMLInputElement)!.value,
            (document.getElementById('email') as HTMLInputElement)!.value,
            (document.getElementById('razon_social') as HTMLInputElement)!.value,
          ]
        }
      })

      if (value) {
        const [ruc, address, email, razon_social] = value;
        this.form.get('transaction.ruc')!.setValue(ruc);
        this.form.get('transaction.address')!.setValue(address);
        this.form.get('transaction.email')!.setValue(email);
        this.form.get('transaction.razon_social')!.setValue(razon_social);
      } else {
        return;
      }
    }

    this.tillService
      .pay(this.installment.id, this.form.value)
      .subscribe({
        next: (resp) => {
          if (!resp.sunat_response) {
            Swal.fire('Bien Hecho!', `Pago Realizado`, 'success');
          } else {
            Swal.fire('Pago Registrado!', `Estado del comprobante: ${resp.sunat_response.SUNAT_CODIGO_RESPUESTA}`, 'success');
          }
          if (this.installment.payment.course_turn_student) {
            this.router.navigateByUrl(
              '/alumnos/pagos/' + this.installment.payment.course_turn_student.id
            );
          } else {
            this.router.navigateByUrl(
              '/ventas/pagos/' + this.installment.payment.sale!.id
            );
          }
        },
        error: error => {
          alert(`${error.error.exception}: ${error.error.message}`);
          if (this.installment.payment.course_turn_student) {
            this.router.navigateByUrl(
              '/alumnos/pagos/' + this.installment.payment.course_turn_student.id
            );
          } else {
            this.router.navigateByUrl(
              '/ventas/pagos/' + this.installment.payment.sale!.id
            );
          }
        }
      });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

  getOperationError() {
    const control = this.form.get('transaction.operation')!;
    if (control.invalid && control.touched) {
      if (control.errors!.required) {
        return 'El campo es requerido';
      }
      return 'Ya existe el número de operación en la base de datos';
    }

    return null;
  }
}
