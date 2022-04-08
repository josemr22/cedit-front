import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../courses/services/courses.service';
import { Course } from '../../../courses/interfaces/course.interface';
import { SharedService } from '../../../shared/services/shared.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StudentsService } from '../../services/students.service';
import { HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { StudentWithCourse } from '../../interfaces/student-with-course.interface';
import { exportTable } from 'src/app/helpers/exports';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styles: [],
})
export class StudentsListComponent implements OnInit {
  courses: Course[] = [];
  enrolledYears: number[] = [];
  _students: StudentWithCourse[] = [];

  cols!: any[];

  filters: FormGroup = this.fb.group({
    course_id: [''],
    anio: [''],
    start_date: [''],
  });

  isLoading: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private studentService: StudentsService
  ) { }

  ngOnInit(): void {
    this.coursesService
      .getCourses()
      .pipe(
        switchMap((c) => {
          this.courses = c;
          this.filters.get('course_id')?.setValue(this.courses[0].id);
          return this.sharedService.getEnrolledYears();
        })
      )
      .subscribe((y) => {
        for (let i = y.min_year; i <= y.max_year; i++) {
          this.enrolledYears.push(i);
        }
        this.filters.get('anio')?.setValue(this.enrolledYears[0]);
      });

    this.cols = [
      { field: 'dni', header: 'Identificación' },
      { field: 'name', header: 'Nombre' },
      { field: 'course', header: 'Curso' },
      { field: 'turn', header: 'Turno' },
      { field: 'hours', header: 'Horas' },
      { field: 'enrolled_date', header: 'Fecha de Matrícula' },
      { field: 'start_date', header: 'Fecha de Inicio' },
      { field: 'enrolled_by', header: 'Matriculado por' },
    ];
  }

  get students() {
    return this._students.map((swc) => ({
      id: swc.id,
      name: swc.student.name,
      dni: swc.student.dni,
      course: swc.course_turn.course.name,
      turn: `${swc.course_turn.days} - ${swc.course_turn.turn.name}`,
      hours: `${swc.course_turn.start_hour} - ${swc.course_turn.end_hour}`,
      enrolled_date: swc.created_at,
      start_date: swc.start_date,
      enrolled_by: swc.matriculator.name,
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.studentService
      .getStudentsWithCourse(params)
      .subscribe((students) => {
        this.isLoading = false;
        this._students = students;
      });
  }

  delete(id: number) {
    this.studentService.deleteStudents(id).subscribe((_) => {
      const idx = this._students.findIndex((s) => s.id == id);
      this._students.splice(idx, 1);
      Swal.fire('Bien Hecho!', 'Eliminado Correctamente', 'success');
    });
  }

  export(type: string) {
    exportTable(type, [...this.students], [...this.cols], 'alumnos');
  }
}
