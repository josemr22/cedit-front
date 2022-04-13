import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styles: [
  ]
})
export class SaleFormComponent implements OnInit {

  saleTypeLabel: string = '';

  filteredStudents: StudentWithCourse[] = [];
  selectedStudent: StudentWithCourse | null = null;

  departments: Department[] = [];

  saleType = '';
  banks: Bank[] = [];

  form: FormGroup = this.fb.group({
    type: [null],
    state: ['1'],
    course_turn_student_id: [null],
    payment: this.fb.group({
      observation: [""],
      amount: [0, [Validators.required, Validators.min(0)]],
      pay_amount: [0, [Validators.required, Validators.min(0)]]
    }),
    transaction: this.fb.group({
      voucher_type: ['R', [Validators.required]],
      bank_id: [null, [Validators.required]],
      operation: [null, []],
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

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (this.form.get('payment.amount')!.value < this.form.get('payment.pay_amount')!.value) {
      Swal.fire('Ups!', 'El monto a pagar no puede ser mayor al monto', 'error');
      return;
    }
    const data = { ...this.form.value };
    delete data.student;
    this.saleService.storeSale(data).subscribe(resp => {
      if (!resp.sunat_response) {
        Swal.fire('Bien Hecho!', `Pago Realizado`, 'success');
      } else {
        Swal.fire('Venta Realizada!', `Estado del comprobante: ${resp.sunat_response.SUNAT_CODIGO_RESPUESTA}`, 'success');
      }
      this.router.navigate(['ventas', this.saleTypeLabel]);
    });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

}
