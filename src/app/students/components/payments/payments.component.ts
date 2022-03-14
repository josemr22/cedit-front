import { Component, OnInit } from '@angular/core';
import { Course, Student } from '../../interfaces/student.interface';
import { StudentsService } from '../../services/students.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../../courses/services/courses.service';
import { CourseTurn } from '../../../courses/interfaces/course-turn.interface';
import Swal from 'sweetalert2';
import { Department } from 'src/app/shared/interfaces/department.interface';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styles: [],
})
export class PaymentsComponent implements OnInit {
  selectedStudent: Student | undefined;
  filteredStudents: Student[] = [];

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
    course_id: [null, [Validators.required]],
    course_turn_id: [null, [Validators.required]],
    start_date: [null, [Validators.required]],
  });

  constructor(
    private studentService: StudentsService,
    private courseService: CoursesService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sharedService
      .getDepartments()
      .subscribe((d) => (this.departments = d));
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
  }

  filterStudent(event: any) {
    const query = event.query;
    this.studentService.getStudentsFilter(query).subscribe((students) => {
      this.filteredStudents = students;
    });
  }

  onSelectStudent(student: Student) {
    this.selectedStudent = student;
    this.courseService
      .getTurns(student.course_id)
      .subscribe((ct) => (this.courseTurns = ct));
    this.form.reset({
      name: this.selectedStudent.name,
      dni: this.selectedStudent.dni,
      email: this.selectedStudent.email,
      department_id: this.selectedStudent.department_id,
      address: this.selectedStudent.address,
      phone: this.selectedStudent.phone,
      cellphone: this.selectedStudent.cellphone,
      course_id: this.selectedStudent.course_id,
      course_turn_id: this.selectedStudent.course_turn_id,
      start_date: this.selectedStudent.start_date.split(' ')[0],
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.studentService
      .updateStudent(this.selectedStudent!.id, this.form.value)
      .subscribe((s) => {
        this.selectedStudent = s;
        Swal.fire('Bien Hecho!', 'Alumno actualizado correctamente', 'success');
      });
  }

  cancel() {
    this.noEdit = true;
    this.form.reset({
      name: this.selectedStudent!.name,
      dni: this.selectedStudent!.dni,
      email: this.selectedStudent!.email,
      department_id: this.selectedStudent!.department_id,
      address: this.selectedStudent!.address,
      phone: this.selectedStudent!.phone,
      cellphone: this.selectedStudent!.cellphone,
      course_id: this.selectedStudent!.course_id,
      course_turn_id: this.selectedStudent!.course_turn_id,
      start_date: this.selectedStudent!.start_date.split(' ')[0],
    });
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
