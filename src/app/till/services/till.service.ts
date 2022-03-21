import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Installment } from '../interfaces/installment.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class TillService {
  constructor(private http: HttpClient) {}

  getInstallment(id: number) {
    return this.http.get<Installment>(`${apiUrl}/installments/${id}`);
  }

  pay(installmentId: number, data: any) {
    return this.http.post<Installment>(
      `${apiUrl}/till/pay-installment/${installmentId}`,
      data
    );
  }
}
