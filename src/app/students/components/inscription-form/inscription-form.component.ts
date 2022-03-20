import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Department } from '../../../shared/interfaces/department.interface';
import {
  Course,
  Student,
} from '../../../students/interfaces/student.interface';
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
  student: Student | null = null;

  departments: Department[] = [];
  courses: Course[] = [];
  courseTurns: CourseTurn[] = [];
  banks: Bank[] = [];
  preStudentId: number | null = null;

  installmentsNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    email: ['', [Validators.required]],
    department_id: [null, [Validators.required]],
    address: ['', [Validators.required]],
    phone: [null],
    cellphone: [null, [Validators.required]],
    date_of_birth: [null, [Validators.required]],
    course_id: [null, [Validators.required]],
    course_turn_id: [null, [Validators.required]],
    start_date: [null, [Validators.required]],
    registered_by: [1],
    enrolled_by: [1],
    payment: this.fb.group({
      type: ['1', [Validators.required]],
      observation: [null],
      amount: [0, [Validators.required, Validators.min(0)]],
      enroll_amount: [0],
      pay_enroll_amount: [0],
      installments: this.fb.array([
        this.fb.group({
          amount: 0,
          pay: 0,
        }),
      ]),
    }),
    transaction: this.fb.group({
      bank_id: [null, [Validators.required]],
      operation: [null, []],
      user_id: [1, []],
      name: [null, []],
      payment_date: [null, []],
    }),
  });

  get installments(): FormArray {
    return this.form.get('payment.installments') as FormArray;
  }
  // form: FormGroup = this.fb.group({
  //   name: ['Jose', [Validators.required]],
  //   dni: ['12121212', [Validators.required]],
  //   email: ['josemr.22@gmail.com', [Validators.required]],
  //   department_id: [2, [Validators.required]],
  //   address: ['av cesar vallejo', [Validators.required]],
  //   phone: [null],
  //   cellphone: ['1212121212', [Validators.required]],
  //   date_of_birth: ['1999-03-03', [Validators.required]],
  //   course_id: [null, [Validators.required]],
  //   course_turn_id: [null, [Validators.required]],
  //   start_date: [null, [Validators.required]],
  //   registered_by: [1],
  //   enrolled_by: [1],
  //   payment: this.fb.group({
  //     type: ['1', [Validators.required]],
  //     observation: [null],
  //     amount: [0, [Validators.required, Validators.min(0)]],
  //     enroll_amount: [0],
  //     pay_enroll_amount: [0],
  //     installments: this.fb.array([
  //       this.fb.group({
  //         amount: 0,
  //         pay: 0,
  //       }),
  //     ]),
  //   }),
  //   transaction: this.fb.group({
  //     bank_id: [null, [Validators.required]],
  //     operation: [null, []],
  //     user_id: [1, []],
  //     name: [null, []],
  //     payment_date: [null, []],
  //   }),
  // });

  constructor(
    private studentsService: StudentsService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private courseService: CoursesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private studentService: StudentsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id == 'nuevo') {
        return;
      }
      this.studentService.getStudent(id).subscribe((s) => {
        this.student = s;
        this.form.reset({
          name: s.name,
          dni: s.dni,
          email: s.email,
          department_id: s.department_id,
          address: s.address,
          phone: s.phone,
          cellphone: s.cellphone,
          date_of_birth: s.date_of_birth,
          course_id: s.course_id,
          course_turn_id: s.course_turn_id,
          start_date: null,
          registered_by: 1,
          enrolled_by: 1,
          payment: {
            type: '1',
            observation: null,
            amount: 0,
            enroll_amount: 0,
            pay_enroll_amount: 0,
            installments: [
              {
                amount: 0,
                pay: 0,
              },
            ],
          },
          transaction: {
            bank_id: null,
            operation: null,
            user_id: 1,
            name: null,
            payment_date: null,
          },
        });
      });
    });

    this.sharedService.getDepartments().subscribe((d) => {
      this.departments = d;
      if (this.departments.length > 0 && !this.student) {
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

    this.form
      .get('payment.enroll_amount')
      ?.valueChanges.subscribe((changes) => {
        this.updateAmount();
      });
    this.form.get('payment.installments')?.valueChanges.subscribe((changes) => {
      this.updateAmount();
    });
  }

  updateAmount() {
    let amount = 0;
    amount += this.form.get('payment.enroll_amount')!.value ?? 0;
    this.installments.controls.forEach((element) => {
      amount += element.get('amount')?.value ?? 0;
      console.log('h');
    });
    this.form.get('payment.amount')!.setValue(amount);
  }

  onChangeNInstallments(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    while (value < this.installments.length) {
      this.installments.removeAt(this.installments.length - 1);
    }

    while (value > this.installments.length) {
      this.installments.push(
        this.fb.group({
          amount: [0, [Validators.required]],
        })
      );
    }
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

  onChangeCourse(event: Event) {
    const courseId = Number((event.target as HTMLSelectElement).value);
    this.courseService.getTurns(courseId).subscribe((ct) => {
      this.courseTurns = ct;
      if (this.courseTurns.length > 0 && !this.student) {
        this.form.get('course_turn_id')!.setValue(this.courseTurns[0].id);
      }
    });
  }

  onChangePaymentType(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value == '0') {
      this.form
        .get('payment.enroll_amount')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('payment.pay_enroll_amount')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.installments.controls[0]
        .get('amount')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.installments.controls[0]
        .get('pay')
        ?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.form.get('payment.enroll_amount')?.clearValidators();
      this.form.get('payment.pay_enroll_amount')?.clearValidators();
      this.installments.controls[0].get('amount')?.clearValidators();
      this.installments.controls[0].get('pay')?.clearValidators();
    }
    this.form.get('payment.enroll_amount')?.updateValueAndValidity();
    this.form.get('payment.pay_enroll_amount')?.updateValueAndValidity();
    this.installments.controls[0].get('amount')?.updateValueAndValidity();
    this.installments.controls[0].get('pay')?.updateValueAndValidity();
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    if (this.student) {
      const data = {
        ...this.form.value,
        student_id: this.student.id,
      };
    }
    this.studentService.enrollStudent(data).subscribe((s) => {
      Swal.fire('Bien hecho!', 'Estudiante inscrito correctamente', 'success');
      this.router.navigateByUrl('/alumnos/lista');
    });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

  isFormArrayInvalid(field: string, index: number) {
    const f = this.installments.controls[index].get(field)!;
    return f.invalid && f.touched;
  }
}
