import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StudentWithCourse } from '../interfaces/student-with-course.interface';
import { Student } from '../interfaces/student.interface';
import { EnrollStudentDto } from '../interfaces/enroll-student-dto.interface';
import { StudentDto } from '../interfaces/student-dto.interface';
import { Payment } from '../interfaces/payment.interface';
import { Operation } from '../interfaces/operation.interface';
import { TransactionResponse } from '../../sales/interfaces/transaction-response.interface';
import { of } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) { }

  getStudent(id: number) {
    return this.http.get<Student>(`${apiUrl}/students/${id}`);
  }

  getStudents(params: HttpParams = new HttpParams()) {
    return this.http.get<Student[]>(`${apiUrl}/students`, { params });
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
    return this.http.post<TransactionResponse>(`${apiUrl}/students-enroll`, data);
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

  getStudentWithCourse(id: number) {
    return this.http.get<StudentWithCourse>(
      `${apiUrl}/students-with-course/${id}`
    );
  }

  getPayment(courseTurnStudentId: number) {
    return this.http.get<Payment>(
      `${apiUrl}/students/payment/course/${courseTurnStudentId}`
    );
  }

  getOperation(operation: string, bank_id: number) {
    return this.http.get<Operation[]>(
      `${apiUrl}/students/operation/${operation}/${bank_id}`
    );
  }

  deleteStudents(id: number) {
    return this.http.delete<any>(`${apiUrl}/students/${id}`);
  }

  getOperationIsTaken(operation: string) {
    return this.http.get<boolean>(
      `${apiUrl}/transactions/operation-is-taken/${operation}`
    );
  }

  getByRuc(ruc: string) {
    return fetch(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`);
  }
}
