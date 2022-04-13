import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { StudentWithCourse } from '../../interfaces/student-with-course.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-student-with-course',
  templateUrl: './edit-student-with-course.component.html',
  styles: [
  ]
})
export class EditStudentWithCourseComponent implements OnInit {

  student!: StudentWithCourse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private studentService: StudentsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.studentService.getStudentWithCourse(id).subscribe({
          next: (swc) => {
            this.student = swc;
          },
          error: err => this.router.navigateByUrl('/alumnos/lista')
        });
      }
    });
  }

  handleSubmit(formValue: any) {
    this.studentService
      .updateStudentAndCourseTurn(
        this.student!.id,
        formValue
      )
      .subscribe((swc) => {
        Swal.fire('Bien Hecho!', 'Alumno actualizado correctamente', 'success');
        this.router.navigateByUrl('/alumnos/lista');
      });
  }

}
