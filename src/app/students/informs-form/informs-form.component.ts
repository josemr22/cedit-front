import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseTurn } from 'src/app/courses/interfaces/course-turn.interface';
import { Course } from 'src/app/courses/interfaces/course.interface';
import { CoursesService } from 'src/app/courses/services/courses.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { StudentsService } from '../services/students.service';
import { SharedService } from '../../shared/services/shared.service';
import { Department } from 'src/app/shared/interfaces/department.interface';

@Component({
  selector: 'app-informs-form',
  templateUrl: './informs-form.component.html',
  styles: [
  ]
})
export class InformsFormComponent implements OnInit {

  courses: Course[] = [];
  courseTurns: CourseTurn[] = [];
  departments: Department[] = [];

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
    registered_by: [this.authService.getUser().id],
    observation: [null],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentsService,
    private courseService: CoursesService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.getDepartments().subscribe((d) => {
      this.departments = d;
      if (this.departments.length > 0) {
        this.form.get('department_id')!.setValue(this.departments[0].id);
      }
    });
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
  }

  isInvalid(field: string) {
    return this.form.get(field)!.touched && this.form.get(field)!.invalid;
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.studentService.storeStudent(this.form.value).subscribe((s) => {
      Swal.fire('Bien hecho!', 'Registrado correctamente', 'success');
      this.router.navigateByUrl('/alumnos/informes');
    });
  }

  onChangeCourse(event: Event) {
    const courseId = Number((event.target as HTMLSelectElement).value);
    this.courseService.getTurns(courseId).subscribe((ct) => {
      this.courseTurns = ct;
      // if (this.courseTurns.length) {
      //   this.form.get('course_turn_id')!.setValue(this.courseTurns[0].id);
      // }
    });
  }

}
