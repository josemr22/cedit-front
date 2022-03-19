import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StudentWithCourse } from '../interfaces/student-with-course.interface';
import { Student } from '../interfaces/student.interface';
import { EnrollStudentDto } from '../interfaces/enroll-student-dto.interface';
import { StudentDto } from '../interfaces/student-dto.interface';
import { Payment } from '../interfaces/payment.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}

  getStudents() {
    return this.http.get<Student[]>(`${apiUrl}/students`);
  }

  storeStudent(data: StudentDto) {
    return this.http.post<Student>(`${apiUrl}/students`, data);
  }

  getStudentsWithCourse(params: HttpParams) {
    return this.http.get<StudentWithCourse[]>(
      `${apiUrl}/students-with-course`,
      {
        params,
      }
    );
  }

  enrollStudent(data: EnrollStudentDto) {
    return this.http.post<Student>(`${apiUrl}/students-enroll`, data);
  }

  updateStudentAndCourseTurn(id: number, data: StudentDto) {
    return this.http.put<StudentWithCourse>(
      `${apiUrl}/students/student-course-turn/${id}`,
      data
    );
  }

  getStudentsFilter(query: string) {
    return this.http.get<StudentWithCourse[]>(
      `${apiUrl}/students-filter?query=${query}`
    );
  }

  getPayment(courseTurnStudentId: number) {
    return this.http.get<Payment>(
      `${apiUrl}/students/payment/${courseTurnStudentId}`
    );
  }

  deleteStudents(id: number) {
    return this.http.delete<any>(`${apiUrl}/students/${id}`);
  }
}
