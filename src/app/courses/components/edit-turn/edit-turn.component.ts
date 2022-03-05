import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { CourseTurn } from '../../interfaces/course-turn.interface';
import { Course } from '../../interfaces/course.interface';

@Component({
  selector: 'app-edit-turn',
  templateUrl: './edit-turn.component.html',
  styles: [],
})
export class EditTurnComponent implements OnInit {
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

  name = '';
  courseTurns: CourseTurn[] = [];
  courses: Course[] = [];
  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
  }

  onSelectCourse(id: number | null) {
    if (!id) {
      this.courseTurns = [];
      return;
    }
    this.courseService.getTurns(id).subscribe((ct) => (this.courseTurns = ct));
  }

  save(id: number) {
    const { turn_id, days, start_hour, end_hour } = this.courseTurns.find(
      (ct) => ct.id == id
    )!;
    this.courseService
      .updateTurn(id, { turn_id, days, start_hour, end_hour })
      .subscribe((ct) => {
        alert('Actualizado correctamente');
        this.courseTurns = ct;
      });
  }

  delete(id: number) {
    this.courseService.deleteTurn(id).subscribe((_) => {
      const idx = this.courseTurns.findIndex((c) => c.id == id);
      this.courseTurns.splice(idx, 1);
      alert('Eliimnado Correctamente');
    });
  }
}
