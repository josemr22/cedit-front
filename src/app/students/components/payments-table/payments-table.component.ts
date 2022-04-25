import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Payment } from '../../interfaces/payment.interface';
import { StudentsService } from '../../services/students.service';
import { environment } from '../../../../environments/environment';
import { Installment } from 'src/app/students/interfaces/payment.interface';
import { TillService } from '../../../till/services/till.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

export type DataPaymentTable = {
  concept: any;
  amount?: any;
  balance?: any;
  date_of_payment?: any;
  observation?: any;
  type?: string;
  status?: string;
  installment_id?: number;
  voucher?: string;
  mora?: number;
  transaction_id?: number;
};

const voucherUrl = environment.voucherUrl;

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

  constructor(
    private studentService: StudentsService,
    private tillService: TillService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes.studentWithCourseId.currentValue;
    this.studentService.getPayment(id).subscribe((p) => {
      this.payment = p;
      this.data = [];
      this.fillTable();
    });
    console.log('onchanges')
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
        voucher: `${voucherUrl}/${this.payment.installments[0].dampings[0].transaction.voucher}`,
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
        date_of_payment: this.getDateSum(i, Number(this.payment.course_turn_student!.course_turn.course.days)),
        observation: i.observation || '---',
        status: i.balance != 0 ? 'Deuda' : 'Cancelado',
        type: 'i',
        installment_id: i.id,
        mora: i.mora
      });
      if (i.mora > 0) {
        this.data.push({
          concept: 'Mora',
          amount: i.mora.toFixed(2),
          type: 'mora'
        });
      }
      i.dampings.forEach((d, idx) => {
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
            console.log('hola')
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
          this.studentService.getPayment(this.studentWithCourseId!).subscribe((p) => {
            this.payment = p;
            this.data = [];
            this.fillTable();
          });
        },
        error: _ => alert('Ocurrió un error, contácte con el administrador')
      });
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
}
