import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bank } from '../interfaces/bank.interface';
import { Department } from '../interfaces/department.interface';

const apiUrl = environment.apiUrl;

export type EnrolledYear = {
  min_year: number;
  max_year: number;
};

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private http: HttpClient) {}

  getEnrolledYears() {
    return this.http.get<EnrolledYear>(`${apiUrl}/enrolled-years`);
  }

  getDepartments() {
    return this.http.get<Department[]>(`${apiUrl}/departments`);
  }

  getBanks() {
    return this.http.get<Bank[]>(`${apiUrl}/banks`);
  }
}
