import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Installment } from '../interfaces/installment.interface';
import { UserProduction } from '../interfaces/user-production.interface';
import { BankReport } from '../interfaces/bank-report';
import { Voucher } from '../interfaces/voucher.interface';
import { Report } from '../interfaces/report.interface';
import { TransactionResponse } from '../../sales/interfaces/transaction-response.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class TillService {
  constructor(private http: HttpClient) { }

  getInstallment(id: number) {
    return this.http.get<Installment>(`${apiUrl}/installments/${id}`);
  }

  pay(installmentId: number, data: any) {
    return this.http.post<TransactionResponse>(
      `${apiUrl}/till/pay-installment/${installmentId}`,
      data
    );
  }

  getUserProductionList(params: HttpParams) {
    return this.http.get<UserProduction[]>(
      `${apiUrl}/till/production-by-user`,
      {
        params
      }
    );
  }

  getBankReportList(params: HttpParams) {
    return this.http.get<BankReport[]>(
      `${apiUrl}/till/bank-report`,
      {
        params
      }
    );
  }

  getVouchers(params: HttpParams) {
    return this.http.get<Voucher[]>(
      `${apiUrl}/till/vouchers`,
      {
        params
      }
    );
  }

  getReports(params: HttpParams) {
    return this.http.get<Report>(
      `${apiUrl}/till/reports`,
      {
        params
      }
    );
  }
}
