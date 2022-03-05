import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../interfaces/course.interface';
import { environment } from '../../../environments/environment';
import { CourseTurn } from '../interfaces/course-turn.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get<Course[]>(`${apiUrl}/courses`);
  }

  storeCourse(name: string, days: string) {
    return this.http.post<Course>(`${apiUrl}/courses`, { name, days });
  }

  updateCourses(id: number, name: string, days: string) {
    return this.http.put<Course>(`${apiUrl}/courses/${id}`, { name, days });
  }

  deleteCourse(id: number) {
    return this.http.delete<any>(`${apiUrl}/courses/${id}`);
  }

  getTurns(id: number) {
    return this.http.get<CourseTurn[]>(`${apiUrl}/course-turn/${id}`);
  }

  storeTurn(data: any) {
    return this.http.post<CourseTurn[]>(`${apiUrl}/course-turn`, data);
  }

  updateTurn(id: number, data: any) {
    return this.http.put<CourseTurn[]>(`${apiUrl}/course-turn/${id}`, data);
  }

  deleteTurn(id: number) {
    return this.http.delete<CourseTurn[]>(`${apiUrl}/course-turn/${id}`);
  }
}
