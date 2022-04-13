import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { CourseTurn } from '../../../courses/interfaces/course-turn.interface';
import Swal from 'sweetalert2';
import { Department } from 'src/app/shared/interfaces/department.interface';
import {
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
  courseTurns: CourseTurn[] = [];
  noEdit: boolean | null = true;

  constructor(
    private studentService: StudentsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id == 'nuevo') {
        this.selectedStudentWithCourse = undefined;
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
  }

  handleSubmit(formValue: any) {
    this.studentService
      .updateStudentAndCourseTurn(
        this.selectedStudentWithCourse!.id,
        formValue
      )
      .subscribe((swc) => {
        this.selectedStudentWithCourse = swc;
        Swal.fire('Bien Hecho!', 'Alumno actualizado correctamente', 'success');
      });
  }

  editStudent() {
    this.noEdit = null;
    this.selectedStudentWithCourse = { ...this.selectedStudentWithCourse! };
  }

  cancel() {
    this.noEdit = true;
    this.selectedStudentWithCourse = { ...this.selectedStudentWithCourse! };
  }
}
