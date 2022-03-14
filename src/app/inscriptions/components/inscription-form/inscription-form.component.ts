import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionsService } from '../../services/inscriptions.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Department } from '../../../shared/interfaces/department.interface';
import { Course } from '../../../students/interfaces/student.interface';
import { CoursesService } from '../../../courses/services/courses.service';
import { CourseTurn } from 'src/app/courses/interfaces/course-turn.interface';
import { Bank } from '../../../shared/interfaces/bank.interface';
import { StudentsService } from '../../../students/services/students.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscription-form',
  templateUrl: './inscription-form.component.html',
  styles: [],
})
export class InscriptionFormComponent implements OnInit {
  departments: Department[] = [];
  courses: Course[] = [];
  courseTurns: CourseTurn[] = [];
  banks: Bank[] = [];
  preStudentId: number | null = null;

  quotas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  form: FormGroup = this.fb.group({
    name: ['Jose', [Validators.required]],
    dni: ['12121212', [Validators.required]],
    email: ['josemr.22@gmail.com', [Validators.required]],
    department_id: [2, [Validators.required]],
    address: ['av cesar vallejo', [Validators.required]],
    phone: [null],
    cellphone: ['1212121212', [Validators.required]],
    course_id: [null, [Validators.required]],
    course_turn_id: [null, [Validators.required]],
    start_date: [null, [Validators.required]],
    registered_by: [1],
    enrolled_by: [1],
    transaction: this.fb.group({
      bank_id: [null, [Validators.required]],
      operation: [null, []],
    }),
    payment: this.fb.group({
      observation: [null],
      amount: [0, [Validators.required, Validators.min(0)]],
      payment_type: ['1', [Validators.required]],
      amount_enrollment: [0],
      amount_to_pay_enrollment: [0],
      quotas: [1],
      quote1: [0],
      pay_quote1: [0],
    }),
  });
  // form: FormGroup = this.fb.group({
  //   name: [null, [Validators.required]],
  //   dni: [null, [Validators.required]],
  //   email: [null, [Validators.required]],
  //   department_id: [null, [Validators.required]],
  //   address: [null, [Validators.required]],
  //   phone: [null],
  //   cellphone: [null, [Validators.required]],
  //   course_id: ['', [Validators.required]],
  //   course_turn_id: [null, [Validators.required]],
  //   start_date: [null, [Validators.required]],
  //   registered_by: [1],
  //   enrolled_by: [1],
  //   transaction: this.fb.group({
  //     bank_id: [null, [Validators.required]],
  //     operation: [null, []],
  //   }),
  //   payment: this.fb.group({
  //     observation: [null],
  //     amount: [0, [Validators.required, Validators.min(0)]],
  //     payment_type: ['1', [Validators.required]],
  //     amount_enrollment: [0],
  //     amount_to_pay_enrollment: [0],
  //     quotas: [1],
  //     quote1: [0],
  //     pay_quote1: [0],
  //   }),
  // });

  constructor(
    private inscriptionService: InscriptionsService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private courseService: CoursesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private studentService: StudentsService
  ) {}

  ngOnInit(): void {
    this.sharedService.getDepartments().subscribe((d) => {
      this.departments = d;
      if (this.departments.length > 0) {
        this.form.get('department_id')!.setValue(this.departments[0].id);
      }
    });
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
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

  onChangeCourse(event: Event) {
    const courseId = Number((event.target as HTMLSelectElement).value);
    this.courseService.getTurns(courseId).subscribe((ct) => {
      this.courseTurns = ct;
      if (this.courseTurns.length > 0) {
        this.form.get('course_turn_id')!.setValue(this.courseTurns[0].id);
      }
    });
  }

  onChangePaymentType(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value == '0') {
      console.log('seteando');
      this.form
        .get('payment')
        ?.get('amount_enrollment')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('amount_to_pay_enrollment')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('quotas')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('quote1')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('pay_quote1')
        ?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      console.log('removiendo');
      this.form
        .get('payment')
        ?.get('amount_enrollment')
        ?.removeValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('amount_to_pay_enrollment')
        ?.removeValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('quotas')
        ?.removeValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('quote1')
        ?.removeValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment')
        ?.get('pay_quote1')
        ?.removeValidators([Validators.required, Validators.min(0)]);
    }
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (this.form.get('payment.payment_type')?.value == '0') {
      const amount =
        this.form.get('payment')!.get('amount_enrollment')!.value +
        this.form.get('payment')!.get('quote1')!.value;
      console.log({ amount });
      this.form.get('payment')?.get('amount')?.setValue(amount);
    }
    this.studentService.storeStudent(this.form.value).subscribe((s) => {
      Swal.fire('Bien hecho!', 'Estudiante inscrito correctamente', 'success');
    });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
