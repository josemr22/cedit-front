import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Course } from '../../interfaces/course.interface';
import { CoursesService } from '../../services/courses.service';
import { FormCourseData } from '../form-course/form-course.component';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styles: [],
})
export class CreateCourseComponent implements OnInit {
  @ViewChild('name') nameInput!: ElementRef;
  @ViewChild('days') daysInput!: ElementRef;

  course: Course | null = null;

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {}

  save(data: FormCourseData) {
    const { name, days } = data;
    this.courseService.storeCourse(name, days).subscribe((c) => {
      this.course = {
        id: 0,
        days: '',
        name: '',
        created_at: '',
        updated_at: '',
      };
      Swal.fire('Bien Hecho!', 'Curso Creado!', 'success');
    });
  }
}
