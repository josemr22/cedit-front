import { Component, OnInit } from '@angular/core';
import { CoursesService } from './services/courses.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {}
}
