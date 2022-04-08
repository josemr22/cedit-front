import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Payment } from '../../interfaces/payment.interface';
import { StudentsService } from '../../services/students.service';

type DataPaymentTable = {
  concept: any;
  amount: any;
  balance: any;
  date_of_payment: any;
  observation: any;
  type: string;
  status: string;
  installment_id?: number;
};

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styles: [],
})
export class PaymentsTableComponent implements OnInit, OnChanges {
  @Input('studentWithCourseId') studentWithCourseId: number | null = null;
  payment!: Payment;

  cols!: any[];
  exportColumns!: any[];
  data: DataPaymentTable[] = [];

  constructor(private studentService: StudentsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes.studentWithCourseId.currentValue;
    this.studentService.getPayment(id).subscribe((p) => {
      this.payment = p;
      this.data = [];
      this.fillTable();
    });
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'concept', header: 'Concepto' },
      { field: 'amount', header: 'Monto' },
      { field: 'balance', header: 'Saldo' },
      { field: 'date_of_payment', header: 'Fecha del Pago' },
      { field: 'observation', header: 'Observacion' },
      { field: 'status', header: 'Estado' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  fillTable() {
    if (this.payment.type == 1) {
      this.data.push({
        concept: 'Costo Total',
        amount: this.payment.amount.toFixed(2),
        balance: 0,
        date_of_payment: this.payment.created_at,
        observation: 'Al Contado',
        status: 'Cancelado',
        type: 'h',
      });
      return;
    }

    let j = 0;
    this.payment.installments.forEach((i) => {
      j += i.balance;
    });

    this.data.push({
      concept: 'Costo Total',
      amount: this.payment.amount.toFixed(2),
      balance: '',
      date_of_payment: '',
      observation: 'Crédito',
      status: j ? 'Deuda' : 'Cancelado',
      type: 'h',
    });
    this.payment.installments.forEach((i) => {
      this.data.push({
        concept: i.type == 'm' ? 'Matrícula' : `Mensualidad ${i.number}`,
        amount: i.amount.toFixed(2),
        balance: i.balance.toFixed(2),
        date_of_payment: i.created_at,
        observation: i.observation || '---',
        status: i.balance != 0 ? 'Deuda' : 'Cancelado',
        type: 'i',
        installment_id: i.id,
      });
      i.dampings.forEach((d, idx) => {
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
    });
  }

  btnPayIsVisible(rowData: any) {
    return rowData.installment_id && rowData.balance != 0;
  }

  btnSeeVoucherIsVisible(rowData: any) {
    return rowData.type == 'd';
  }
}
