import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { exportTable } from 'src/app/helpers/exports';
import { Voucher } from '../../interfaces/voucher.interface';
import { TillService } from '../../services/till.service';
import { voucherTypes } from '../../../helpers/voucher-types';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styles: [
  ]
})
export class VouchersListComponent implements OnInit {

  _vouchers: Voucher[] = [];

  cols!: any[];

  filters: FormGroup = this.fb.group({
    from: [null, Validators.required],
    to: [null, Validators.required],
    type: ['R', Validators.required],
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
      { field: 'state', header: 'Estado' },
    ];
  }

  get vouchers() {
    return this._vouchers.map((v) => ({
      voucher: v.voucher,
      student: v.student,
      date: v.date,
      total: v.total.toFixed(2),
      state: v.voucher_state,
      link: v.link,
    }));
  }

  search() {
    const params: HttpParams = new HttpParams({
      fromObject: this.filters.value,
    });
    this.isLoading = true;
    this.tillService
      .getVouchers(params)
      .subscribe((vouchers) => {
        this.isLoading = false;
        this._vouchers = vouchers;
      });
  }

  export(type: string) {
    exportTable(type, [...this.vouchers], [...this.cols], 'comprobantes');
  }

}
