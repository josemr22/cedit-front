import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bank } from 'src/app/shared/interfaces/bank.interface';
import { StudentWithCourse } from 'src/app/students/interfaces/student-with-course.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { SharedService } from '../../../shared/services/shared.service';
import { StudentsService } from '../../../students/services/students.service';
import { Department } from '../../../shared/interfaces/department.interface';
import { SaleService } from '../../services/sale.service';
import Swal from 'sweetalert2';
import { saleTypes } from 'src/app/helpers/sale-types';
import { btnToggleControlTransactionIsVisible, controlTransactionIsActive, getOperationError, toggleControlTransaction, validateOperation } from 'src/app/helpers/validators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const voucherUrl = environment.voucherUrl;

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styles: [
  ]
})
export class SaleFormComponent implements OnInit {

  validateOperationFunction: AsyncValidatorFn = (control: AbstractControl) => validateOperation(control, this);

  loading = false;

  saleTypeLabel: string = '';

  filteredStudents: StudentWithCourse[] = [];
  selectedStudent: StudentWithCourse | null = null;

  departments: Department[] = [];

  saleType = '';
  banks: Bank[] = [];

  form: FormGroup = this.fb.group({
    type: [null],
    state: ['1'],
    course_turn_student_id: [null, Validators.required],
    payment: this.fb.group({
      observation: [""],
      amount: [0, [Validators.required, Validators.min(0)]],
      pay_amount: [0, [Validators.required, Validators.min(0)]]
    }),
    transaction: this.fb.group({
      voucher_type: ['R', [Validators.required]],
      ruc: [null],
      address: [null],
      email: [null],
      razon_social: [null],
      bank_id: [null, [Validators.required]],
      operation: [null, [], [this.validateOperationFunction]],
      user_id: [this.authService.getUser().id],
      name: [null, []],
      payment_date: [null, []],
    }),
    student: this.fb.group({
      name: [null],
      dni: [null],
      email: [null],
      department_id: [null],
      address: [null],
      phone: [null],
      cellphone: [null],
      date_of_birth: [null],
      course: [null],
      course_turn_id: [null],
      start_date: [null],
    })
  });

  studentForm: FormGroup = this.fb.group({
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private studentService: StudentsService,
    private saleService: SaleService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sharedService
      .getDepartments()
      .subscribe((d) => (this.departments = d));

    this.activatedRoute.params.subscribe(({ type }) => {
      const saleTypeObj = saleTypes.find(st => st.label == type);
      if (!saleTypeObj) {
        this.router.navigateByUrl('/ventas/uniformes');
        return;
      }
      this.saleTypeLabel = saleTypeObj.label;
      this.form.get('type')!.setValue(saleTypeObj!.code);
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

  filterStudent(event: any) {
    const query = event.query;
    this.studentService.getStudentsFilter(query).subscribe((students) => {
      this.filteredStudents = students;
      this.filteredStudents = this.filteredStudents.map((fe) => ({
        ...fe,
        label: `${fe.student.dni} - ${fe.student.name} - ${fe.course_turn.course.name}`,
      }));
    });
  }

  onSelectStudent(swc: StudentWithCourse) {
    this.form.get('course_turn_student_id')?.setValue(swc.id);
    this.selectedStudent = swc;
    // this.courseService
    //   .getTurns(this.selectedStudent.course_turn.course_id)
    //   .subscribe((ct) => (this.courseTurns = ct));
    this.form.get('student')!.reset({
      name: this.selectedStudent.student.name,
      dni: this.selectedStudent.student.dni,
      email: this.selectedStudent.student.email,
      department_id: this.selectedStudent.student.department_id,
      address: this.selectedStudent.student.address,
      phone: this.selectedStudent.student.phone,
      cellphone: this.selectedStudent.student.cellphone,
      date_of_birth: this.selectedStudent.student.date_of_birth,
      course: this.selectedStudent.course_turn.course.name,
      course_turn_id: this.selectedStudent.course_turn.id,
      start_date: this.selectedStudent.start_date.split(' ')[0],
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

  async save() {

    const swalDecision = await Swal.fire({
      title: 'Atención!',
      text: "¿Está seguro de los datos ingresados?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No, cancelar'
    });

    if(!(swalDecision.isConfirmed)){
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (this.form.get('payment.amount')!.value < this.form.get('payment.pay_amount')!.value) {
      Swal.fire('Ups!', 'El monto a pagar no puede ser mayor al monto', 'error');
      return;
    }

    if (this.form.get('transaction.voucher_type')?.value == 'F') {
      var myModal = new (window as any).bootstrap.Modal(document.getElementById('myModal'))

      myModal.show();

      return;
    } else {
      this.realizarVenta();
    }

  }

  realizarVenta() {
    this.loading = true;
    const data = { ...this.form.value };
    delete data.student;
    this.saleService.storeSale(data).subscribe({
      next: resp => {
        if (!resp.sunat_response) {
          Swal.fire({
            title: 'Bien Hecho!',
            text: "Pago Realizado",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Imprimir'
          }).then(r => {
            if(!(r.isConfirmed)){
              window.open( `${voucherUrl}/${resp.transaction.voucher}`, '_blank');
            }
            this.router.navigate(['ventas', this.saleTypeLabel]);
          });
        } else {
          Swal.fire({
            title: 'Venta Realizada!',
            text: `Estado del comprobante: ${resp.sunat_response.SUNAT_CODIGO_RESPUESTA}`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Imprimir'
          }).then(r => {
            if(!(r.isConfirmed)){
              window.open( `${voucherUrl}/${resp.transaction.voucher}`, '_blank');
            }
            this.router.navigate(['ventas', this.saleTypeLabel]);
          });
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        alert(`${error.error.exception}: ${error.error.message}`);
        this.router.navigate(['ventas', this.saleTypeLabel]);
        this.loading = false;
      }
    });
  }

  validateFactura() {
    this.form.get('transaction.email')!.setValue((document.querySelector("#email")! as HTMLInputElement).value);
    if (!(this.form.get('transaction.email')!.value)) {
      return;
    }
    if (!(this.form.get('transaction.razon_social')!.value)) {
      return;
    }
    if (!(this.form.get('transaction.address')!.value)) {
      return;
    }
    if (!(this.form.get('transaction.ruc')!.value)) {
      return;
    }
    this.realizarVenta();
  }

  async buscarPorRuc() {
    const ruc = (document.querySelector("#ruc")! as HTMLInputElement).value;
    const resp = await this.studentService.getByRuc(ruc).then(r => r.json());

    this.form.get('transaction.ruc')!.setValue(ruc);
    this.form.get('transaction.address')!.setValue(resp.direccion);
    (document.querySelector("#address")! as HTMLInputElement).value = resp.direccion;
    this.form.get('transaction.razon_social')!.setValue(resp.nombre);
    (document.querySelector("#razon_social")! as HTMLInputElement).value = resp.nombre;
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

}
