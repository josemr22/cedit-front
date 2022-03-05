import { CoursesService } from '../../services/courses.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import Swal from 'sweetalert2';

export type FormCourseData = {
  name: string;
  days: string;
};

@Component({
  selector: 'app-form-course',
  templateUrl: './form-course.component.html',
  styles: [],
})
export class FormCourseComponent implements OnInit {
  @ViewChild('name') nameInput!: ElementRef;
  @ViewChild('days') daysInput!: ElementRef;
  @Input() course: Course | null = null;
  @Output() onSubmit = new EventEmitter<FormCourseData>();

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.nameInput);
    }, 400);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!(this.nameInput && this.daysInput)) {
      return;
    }
    console.log('onchanges');
    const course: Course = changes['course'].currentValue;
    console.log(course);

    if (!course) {
      this.nameInput.nativeElement.value = '';
      this.daysInput.nativeElement.value = '';
      return;
    }

    this.nameInput.nativeElement.value = course.name;
    this.daysInput.nativeElement.value = course.days;
  }

  save() {
    const name = this.nameInput.nativeElement.value;
    const days = this.daysInput.nativeElement.value;

    if (!name) {
      Swal.fire('Bien Hecho!', `Ingrese la descripción`, 'error');
      return;
    }
    if (!days) {
      Swal.fire('Bien Hecho!', `Ingrese el número de días`, 'error');
      return;
    }

    this.onSubmit.emit({
      name,
      days,
    });
  }
}
