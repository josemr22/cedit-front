import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentWithCourse, } from '../../interfaces/student-with-course.interface';
import { CoursesService } from 'src/app/courses/services/courses.service';
import { CourseTurn } from 'src/app/courses/interfaces/course-turn.interface';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Course } from 'src/app/courses/interfaces/course.interface';


@Component({
  selector: 'app-student-with-course-form',
  templateUrl: './student-with-course-form.component.html',
  styles: [
  ]
})
export class StudentWithCourseFormComponent implements OnInit, OnChanges {

  @Input()
  student!: StudentWithCourse;

  @Output()
  onSubmitForm: EventEmitter<any> = new EventEmitter();

  @Input()
  noEdit: boolean | null = null;

  courseTurns: CourseTurn[] = [];
  departments: Department[] = [];
  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CoursesService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService
      .getDepartments()
      .subscribe((d) => (this.departments = d));
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.student = changes.student.currentValue;
    this.courseService
      .getTurns(this.student.course_turn.course_id)
      .subscribe((ct) => (this.courseTurns = ct));
    this.form.reset({
      name: this.student.student.name,
      dni: this.student.student.dni,
      email: this.student.student.email,
      department_id: this.student.student.department_id,
      address: this.student.student.address,
      phone: this.student.student.phone,
      cellphone: this.student.student.cellphone,
      date_of_birth: this.student.student.date_of_birth,
      course_id: this.student.course_turn.course.id,
      course_turn_id: this.student.course_turn.id,
      start_date: this.student.start_date.split(' ')[0],
    });
  }

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

  handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.onSubmitForm.emit(this.form.value);
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
