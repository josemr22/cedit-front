import { Component, OnInit } from '@angular/core';
import { Course } from '../../interfaces/student.interface';
import { StudentsService } from '../../services/students.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../../courses/services/courses.service';
import { CourseTurn } from '../../../courses/interfaces/course-turn.interface';
import Swal from 'sweetalert2';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { SharedService } from '../../../shared/services/shared.service';
import { Payment } from '../../interfaces/payment.interface';
import {
  Student,
  StudentWithCourse,
} from '../../interfaces/student-with-course.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styles: [],
})
export class PaymentsComponent implements OnInit {
  selectedStudentWithCourse: StudentWithCourse | undefined;
  filteredStudents: StudentWithCourse[] = [];

  departments: Department[] = [];
  courses: Course[] = [];
  courseTurns: CourseTurn[] = [];
  noEdit: boolean | null = true;

  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    dni: [null, [Validators.required]],
    email: [null, [Validators.required]],
    department_id: [null, [Validators.required]],
    address: [null, [Validators.required]],
    phone: [null, []],
    cellphone: [null, [Validators.required]],
    date_of_birth: [null, [Validators.required]],
    course_id: [null, [Validators.required]],
    course_turn_id: [null, [Validators.required]],
    start_date: [null, [Validators.required]],
  });

  constructor(
    private studentService: StudentsService,
    private courseService: CoursesService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sharedService
      .getDepartments()
      .subscribe((d) => (this.departments = d));
    this.courseService.getCourses().subscribe((c) => (this.courses = c));

    this.activatedRoute.params.subscribe(({ id }) => {
      console.log(id);
      if (id == 'nuevo') {
        this.selectedStudentWithCourse = undefined;
        this.form.reset();
      }
      if (id && id != 'nuevo') {
        this.studentService.getStudentWithCourse(id).subscribe((swc) => {
          this.onSelectStudent(swc);
        });
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
    this.selectedStudentWithCourse = swc;
    this.courseService
      .getTurns(this.selectedStudentWithCourse.course_turn.course_id)
      .subscribe((ct) => (this.courseTurns = ct));
    this.form.reset({
      name: this.selectedStudentWithCourse.student.name,
      dni: this.selectedStudentWithCourse.student.dni,
      email: this.selectedStudentWithCourse.student.email,
      department_id: this.selectedStudentWithCourse.student.department_id,
      address: this.selectedStudentWithCourse.student.address,
      phone: this.selectedStudentWithCourse.student.phone,
      cellphone: this.selectedStudentWithCourse.student.cellphone,
      date_of_birth: this.selectedStudentWithCourse.student.date_of_birth,
      course_id: this.selectedStudentWithCourse.course_turn.course.id,
      course_turn_id: this.selectedStudentWithCourse.course_turn.id,
      start_date: this.selectedStudentWithCourse.start_date.split(' ')[0],
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.studentService
      .updateStudentAndCourseTurn(
        this.selectedStudentWithCourse!.id,
        this.form.value
      )
      .subscribe((swc) => {
        this.selectedStudentWithCourse = swc;
        Swal.fire('Bien Hecho!', 'Alumno actualizado correctamente', 'success');
      });
  }

  cancel() {
    this.noEdit = true;
    this.form.reset({
      name: this.selectedStudentWithCourse!.student.name,
      dni: this.selectedStudentWithCourse!.student.dni,
      email: this.selectedStudentWithCourse!.student.email,
      department_id: this.selectedStudentWithCourse!.student.department_id,
      address: this.selectedStudentWithCourse!.student.address,
      phone: this.selectedStudentWithCourse!.student.phone,
      cellphone: this.selectedStudentWithCourse!.student.cellphone,
      date_of_birth: this.selectedStudentWithCourse!.student.date_of_birth,
      course_id: this.selectedStudentWithCourse!.course_turn.course.id,
      course_turn_id: this.selectedStudentWithCourse!.course_turn.id,
      start_date: this.selectedStudentWithCourse!.start_date.split(' ')[0],
    });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
