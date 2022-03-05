import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styles: [],
})
export class SelectCourseComponent implements OnInit {
  @Input() courses: Course[] = [];

  @Output() onSelectCourse = new EventEmitter<number | null>();

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.courseService
      .getCourses()
      .subscribe((courses) => (this.courses = courses));
  }

  selectCourse(event: Event) {
    const id = (event.target as HTMLSelectElement).value;

    if (!id) {
      this.onSelectCourse.emit(null);
      return;
    }

    this.onSelectCourse.emit(Number(id));
  }
}
