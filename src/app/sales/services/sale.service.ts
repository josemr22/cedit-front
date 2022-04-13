import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from 'src/app/students/interfaces/payment.interface';
import { environment } from 'src/environments/environment';
import { Sale } from '../interfaces/sale.interface';
import { TransactionResponse } from '../interfaces/transaction-response.interface';
const apiUrl = environment.apiUrl;

export type SaleYear = {
  min_year: number;
  max_year: number;
};

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  getSales(params: HttpParams) {
    return this.http.get<Sale[]>(`${apiUrl}/sales`, { params });
  }

  getSaleYears() {
    return this.http.get<SaleYear>(`${apiUrl}/sale-years`);
  }

  storeSale(data: any) {
    return this.http.post<TransactionResponse>(`${apiUrl}/sales`, data);
  }

  getPayment(paymentId: number) {
    return this.http.get<Payment>(`${apiUrl}/students/payment/sale/${paymentId}`);
  }
}
