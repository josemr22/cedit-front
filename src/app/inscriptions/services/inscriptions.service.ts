import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PreStudent } from '../interfaces/pre-student.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class InscriptionsService {
  constructor(private http: HttpClient) {}

  getPreStudents() {
    return this.http.get<PreStudent[]>(`${apiUrl}/pre-students`);
  }

  deletePreStudent(id: number) {
    return this.http.delete<any>(`${apiUrl}/pre-students/${id}`);
  }
}
