import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { exportTable } from 'src/app/helpers/exports';
import { voucherTypes } from 'src/app/helpers/voucher-types';
import { Voucher } from '../../interfaces/voucher.interface';
import { TillService } from '../../services/till.service';
import { Totales } from '../../interfaces/report.interface';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styles: [
  ]
})
export class ReportsComponent implements OnInit {

  _vouchers: Voucher[] = [];
  _totales!: Totales;

  get totales() {
    if (!this._totales) {
      return [];
    }
    return Object.entries(this._totales).map(([label, amount]) => ({
      label,
      amount: (amount as number).toFixed(2)
    }));
  }

  cols!: any[];

  filters: FormGroup = this.fb.group({
    from: [null, Validators.required],
    to: [null, Validators.required],
  });

  isLoading: boolean = false;

  vtypes = voucherTypes;

  constructor(
    private fb: FormBuilder,
    private tillService: TillService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'voucher', header: 'Comprobante' },
      { field: 'student', header: 'Descripción' },
      { field: 'date', header: 'Fecha' },
      { field: 'total', header: 'Total' },
      { field: 'responsable', header: 'Usuario' },
      { field: 'state', header: 'Estado' },
    ];
  }

  get vouchers() {
    return this._vouchers.map((v) => ({
      voucher: v.voucher,
      student: v.student,
      date: v.date,
      total: v.total.toFixed(2),
      responsable: v.responsable,
      state: v.voucher_state,
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.tillService
      .getReports(params)
      .subscribe((report) => {
        this.isLoading = false;
        this._vouchers = report.vouchers;
        this._totales = report.totales;
      });
  }

  export(type: string) {
    exportTable(type, [...this.vouchers], [...this.cols], 'reportes');
  }


}
