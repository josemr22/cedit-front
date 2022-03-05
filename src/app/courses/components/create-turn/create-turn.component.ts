import { Component, OnInit } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { CoursesService } from '../../services/courses.service';
import { CourseTurn } from '../../interfaces/course-turn.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-turn',
  templateUrl: './create-turn.component.html',
  styles: [],
})
export class CreateTurnComponent implements OnInit {
  courseTurns: CourseTurn[] = [];

  form: FormGroup = this.fb.group({
    course_id: ['', Validators.required],
    days: [null, Validators.required],
    turn_id: ['1', Validators.required],
    start_hour: [null, Validators.required],
    end_hour: [null, Validators.required],
  });

  turns = [
    {
      id: 1,
      name: 'Mañana',
    },
    {
      id: 2,
      name: 'Tarde',
    },
    {
      id: 3,
      name: 'Noche',
    },
  ];

  constructor(private courseService: CoursesService, private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSelectCourse(id: number | null) {
    this.form.get('course_id')?.setValue(id || '');
    console.log(id);
    if (!id) {
      this.courseTurns = [];
      return;
    }
    this.courseService
      .getTurns(Number(id))
      .subscribe((ct) => (this.courseTurns = ct));
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.courseService.storeTurn(this.form.value).subscribe((turns) => {
      this.courseTurns = turns;
      this.form.reset({
        turn_id: '1',
        course_id: this.form.get('course_id')?.value,
      });
      alert('Turno creado correctamente');
    });
    console.log('guardando');
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }
}
