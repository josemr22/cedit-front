import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { ActivatedRoute } from '@angular/router';
import { Installment, Payment } from 'src/app/students/interfaces/payment.interface';
import { saleTypes } from '../../../helpers/sale-types';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TillService } from '../../../till/services/till.service';
import { deleteTransaction } from 'src/app/helpers/transactions';

const voucherUrl = environment.voucherUrl;
@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styles: [
  ]
})
export class PaymentTableComponent implements OnInit {

  saleId!: number;
  payment!: Payment;
  typeString = '';
  installment!: Installment;

  cols!: any[];
  exportColumns!: any[];
  data: any[] = [];

  constructor(
    private saleService: SaleService,
    private activatedRoute: ActivatedRoute,
    private tillService: TillService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => {
      this.saleId = id;
      this.draw();
    });


    this.cols = [
      { field: 'concept', header: 'Concepto' },
      { field: 'amount', header: 'Monto' },
      { field: 'balance', header: 'Saldo' },
      { field: 'date_of_payment', header: 'Fecha del Pago' },
      { field: 'deuda', header: 'Estado' },
      { field: 'state', header: 'Entrega' },
      { field: 'observation', header: 'Observacion' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  draw(){
    this.saleService.getPayment(this.saleId).subscribe((p) => {
      this.payment = p;
      this.installment = this.payment.installments[0];
      const st = saleTypes.find(s => s.code == p.sale!.type);
      this.typeString = st!.label;
      this.fillTable();
    });
  }

  editInstallment(installmentId: number){

    Swal.fire({
      title: 'Editar Monto',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (amount) => {
        const data = {
          amount
        }
        return new Promise((resolve, reject) => {
          this.tillService.editInstallment(installmentId, data).subscribe(resp => {
            if(resp){
              this.draw();
              resolve(true);
            }
          });
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Bien Hecho`,
          text: 'Monto Actualizado',
          icon:'success',
        })
      }
    })
  }

  fillTable() {
    this.data=[];
    this.data.push({
      concept: 'Costo Total',
      amount: this.installment.amount.toFixed(2),
      balance: this.installment.balance.toFixed(2),
      date_of_payment: '',
      deuda: this.installment.balance == 0 ? 'Cancelado' : 'Deuda',
      state: this.payment.sale?.state ? 'Entregado' : 'No entregado',
      observation: '',
      type: 'i',
      installment_id: this.installment.id,
      mora: this.installment.mora
    });
    if (this.installment.mora > 0) {
      this.data.push({
        concept: 'Mora',
        amount: this.installment.mora.toFixed(2),
        type: 'mora'
      });
    }
    this.installment.dampings.forEach((d, idx) => {
      this.data.push({
        concept: `Pago ${idx + 1}`,
        amount: d.amount.toFixed(2),
        balance: '',
        date_of_payment: d.created_at,
        observation: `${d.transaction.bank.name} ${d.transaction.operation ? '- ' + d.transaction.operation : ''
          }`,
        status: '',
        type: d.state ? 'damping-active' : 'damping-inactive',
        transaction_id: d.transaction_id,
        voucher: `${voucherUrl}/${d.transaction.voucher}`,
      });
    });
  }

  auxDate: Date | null = null;

  getDateSum(i: Installment, qty: number): string {

    if (i.type === 'm') {
      return '';
    }

    if (i.number == 1) {
      this.auxDate = new Date(i.created_at);
    } else {
      const dateObj = this.auxDate ?? new Date(i.created_at);
      this.auxDate = new Date(dateObj.setDate(dateObj.getDate() + qty));
    }

    return `Debe pagar el ${this.auxDate.getDate().toString().padStart(2, '0')}/${(this.auxDate.getMonth() + 1).toString().padStart(2, '0')}/${this.auxDate.getFullYear()}`;
  }

  btnPayIsVisible(rowData: any) {
    return rowData.installment_id && rowData.balance != 0;
  }

  btnSeeVoucherIsVisible(rowData: any) {
    return rowData.type == 'damping-active' || rowData.type == 'damping-inactive' || rowData.type == 'h';
  }

  btnTransactionIsVisible(rowData: any) {
    return rowData.transaction_id && rowData.type == 'damping-active';
  }

  btnDeletePayIsVisible(rowData: any) {
    return rowData.type == 'damping-active';
  }

  getRowStyle(rowData: any) {
    let style = '';
    switch (rowData.type) {
      case 'damping-active':
        style = 'color: #0c1c2a;background-color: rgb(0 102 192 / 56%);'
        break;
      case 'damping-inactive':
        style = 'color: #0c1c2a;background-color: red;'
        break;
      case 'mora':
        style = 'color: red;background-color: #eee;'
        break;
      default:
        style = 'background-color: #0c1c2a;color: white;'
        break;
    }
    return style;
  }

  deleteTransaction(transactionId: number) {
    deleteTransaction(transactionId, this, () => {
      this.saleService.getPayment(this.saleId).subscribe((p) => {
        this.payment = p;
        this.installment = this.payment.installments[0];
        const st = saleTypes.find(s => s.code == p.sale!.type);
        this.typeString = st!.label;
        this.data = [];
        this.fillTable();
      });
    });
  }


}
