import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Student } from '../interfaces/student.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}

  getStudents(params: HttpParams) {
    return this.http.get<Student[]>(`${apiUrl}/students`, {
      params,
    });
  }

  storeStudent(data: any) {
    return this.http.post<Student>(`${apiUrl}/students`, data);
  }

  updateStudent(id: number, data: any) {
    return this.http.put<Student>(`${apiUrl}/students/${id}`, data);
  }

  getStudentsFilter(query: string) {
    return this.http.get<Student[]>(`${apiUrl}/students-filter?query=${query}`);
  }

  deleteStudents(id: number) {
    return this.http.delete<any>(`${apiUrl}/students/${id}`);
  }
}
