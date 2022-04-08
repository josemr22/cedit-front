import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Spending } from '../interfaces/spending.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SpendingService {

  constructor(private http: HttpClient) { }

  getSpendings(params: HttpParams) {
    return this.http.get<Spending[]>(
      `${apiUrl}/spendings`,
      {
        params
      }
    );
  }

  showSpending(id: number) {
    return this.http.get<Spending>(
      `${apiUrl}/spendings/${id}`
    );
  }

  storeSpending(data: any) {
    return this.http.post<any>(
      `${apiUrl}/spendings`, data
    );
  }

  updateSpending(id: number, data: any) {
    return this.http.put<any>(
      `${apiUrl}/spendings/${id}`, data
    );
  }

  deleteSpending(id: number) {
    return this.http.delete<any>(
      `${apiUrl}/spendings/${id}`
    );
  }
}
