import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { ActivatedRoute } from '@angular/router';
import { Installment, Payment } from 'src/app/students/interfaces/payment.interface';
import { saleTypes } from '../../../helpers/sale-types';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styles: [
  ]
})
export class PaymentTableComponent implements OnInit {

  payment!: Payment;
  typeString = '';
  installment!: Installment;

  cols!: any[];
  exportColumns!: any[];
  data: any[] = [];

  constructor(private saleService: SaleService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => {
      this.saleService.getPayment(id).subscribe((p) => {
        this.payment = p;
        this.installment = this.payment.installments[0];
        const st = saleTypes.find(s => s.code == p.sale!.type);
        this.typeString = st!.label;
        this.fillTable();
      });
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

  fillTable() {
    this.data.push({
      concept: 'Costo Total',
      amount: this.installment.amount.toFixed(2),
      balance: this.installment.balance.toFixed(2),
      date_of_payment: '',
      deuda: this.installment.balance == 0 ? 'Cancelado' : 'Deuda',
      state: this.payment.sale?.state ? 'Entregado' : 'No entregado',
      observation: '',
    });
    this.installment.dampings.forEach((d, idx) => {
      this.data.push({
        concept: `Pago ${idx + 1}`,
        amount: d.amount.toFixed(2),
        balance: '',
        date_of_payment: d.created_at,
        observation: `${d.transaction.bank.name} ${d.transaction.operation ? '- ' + d.transaction.operation : ''
          }`,
        status: '',
        type: 'd',
      });
    });
  }

  btnPayIsVisible(rowData: any) {
    return rowData.type != 'd' && this.installment.balance != 0;
  }

  btnSeeVoucherIsVisible(rowData: any) {
    return rowData.type == 'd';
  }

}
