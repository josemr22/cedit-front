import { Component, OnInit } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { CoursesService } from '../../services/courses.service';
import { FormCourseData } from '../form-course/form-course.component';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styles: [],
})
export class EditCourseComponent implements OnInit {
  courses: Course[] = [];
  course: Course | null = null;
  courseId: number | null = null;

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.courseService
      .getCourses()
      .subscribe((courses) => (this.courses = courses));
  }

  save(formData: FormCourseData) {
    if (!this.course) {
      alert('Seleccione Curso');
      return;
    }
    const { id, name, days } = { ...formData, id: this.course!.id };
    this.courseService.updateCourses(id, name, days).subscribe((c) => {
      const idx = this.courses.findIndex((i) => i.id == c.id);
      this.courses[idx] = c;
      this.courses = [...this.courses];
      this.course = null;
      alert(`Se ha editado correctamente el curso: ${c.name}`);
    });
  }

  delete() {
    if (!this.course) {
      return;
    }
    this.courseService.deleteCourse(this.course!.id).subscribe((_) => {
      const idx = this.courses.findIndex((c) => c.id == this.course!.id);
      this.courses.splice(idx, 1);
      this.courses = [...this.courses];
      alert('Curso Eliminado Correctamente');
    });
  }

  onSelectCourse(id: number | null) {
    if (id) {
      this.course = this.courses.find((c) => c.id == id)!;
    } else {
      this.course = null;
    }
  }
}
