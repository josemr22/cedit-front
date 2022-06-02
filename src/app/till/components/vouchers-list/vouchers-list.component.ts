import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { exportTable } from 'src/app/helpers/exports';
import { Voucher } from '../../interfaces/voucher.interface';
import { TillService } from '../../services/till.service';
import { voucherTypes } from '../../../helpers/voucher-types';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { from, of } from 'rxjs';
import { StudentsService } from '../../../students/services/students.service';

const voucherUrl = environment.voucherUrl;
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
    private tillService: TillService,
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
      voucher_link: `${voucherUrl}/${v.voucher}`,
      transaction_id: v.transaction_id!,
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

  //Payments table
  async deleteTransaction(transactionId: number) {

    this.tillService.checkDeleteTransaction(transactionId)
      .pipe(
        switchMap((r) => {
          console.log(r)
          if (r === true) {
            const swalPromise = Swal.fire({
              title: 'Atención!',
              text: "El pago que se desea eliminar pertenece a una transacción en donde se incluyó el pago de matrícula y mensualidad. Si sigue con el proceso se eliminará el comprobante que incluye ambos pagos. Desea continuar?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, eliminar matrícula y pago de mensualidad',
              cancelButtonText: 'No, cancelar'
            });

            return from(swalPromise);
          }
          return of(null);
        }),
        switchMap(
          result => {
            console.log({ result })
            if (result && !(result.isConfirmed)) {
              return of(null);
            }
            return this.tillService.deleteTransaction(transactionId);
          }
        )
      ).subscribe({
        next: resp => {
          console.log(resp);
          if (!resp) {
            return;
          }
          Swal.fire('Bien Hecho', resp.message, resp.ok ? 'success' : 'error');
          this.search();
        },
        error: _ => alert('Ocurrió un error, contácte con el administrador')
      });
  }

}
